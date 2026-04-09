import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@nestjs/platform-express';
import { Device, DeviceStatus } from '@prisma/client';
import { VendorApiService } from './vendor-api.service';
import { NormalizationService } from './normalization.service';
import { ReadingsService } from './readings.service';
import { DeviceService } from './device.service';

/**
 * Sync Service
 * Scheduled polling service to fetch readings from vendor API
 * Acts as fallback when webhooks fail or for initial backfill
 */
@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  private isSyncing = false;

  constructor(
    private prisma: PrismaService,
    private vendorApi: VendorApiService,
    private normalizationService: NormalizationService,
    private readingsService: ReadingsService,
    private deviceService: DeviceService,
  ) {}

  /**
   * Scheduled sync job - runs every 15 minutes
   * Fetches new readings for all active devices
   */
  @Cron(CronExpression.EVERY_15_MINUTES)
  async performScheduledSync(): Promise<void> {
    if (this.isSyncing) {
      this.logger.warn('Sync already in progress, skipping scheduled run');
      return;
    }

    try {
      this.isSyncing = true;
      this.logger.log('Starting scheduled sync...');

      // Get all active devices that need syncing
      const devices = await this.prisma.device.findMany({
        where: {
          status: DeviceStatus.ACTIVE,
          assignedPatientId: { not: null },
        },
        include: {
          assignedPatient: true,
        },
      });

      this.logger.log(`Syncing ${devices.length} active devices`);

      let totalReadings = 0;
      let errors = 0;

      for (const device of devices) {
        try {
          const readingsCount = await this.syncDevice(device);
          totalReadings += readingsCount;
        } catch (error) {
          errors++;
          this.logger.error(
            `Failed to sync device ${device.id}: ${error.message}`,
            error.stack,
          );
        }
      }

      this.logger.log(
        `Sync completed: ${totalReadings} readings fetched, ${errors} errors`,
      );
    } catch (error) {
      this.logger.error(`Sync job failed: ${error.message}`, error.stack);
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Manual sync trigger for a specific device
   */
  async syncDevice(device: Device): Promise<number> {
    const patient = device.assignedPatient;
    if (!patient || !device.vendorUserId) {
      this.logger.debug(`Skipping device ${device.id}: no patient or vendor user ID`);
      return 0;
    }

    // Get last sync time for this device
    const since = device.lastSyncedAt || undefined;

    this.logger.debug(
      `Syncing device ${device.deviceId} for patient ${patient.id} since ${since?.toISOString() || 'beginning'}`,
    );

    let cursor: string | undefined;
    let totalReadings = 0;
    let hasMore = true;
    let iterations = 0;
    const maxIterations = 10; // Prevent infinite loops

    while (hasMore && iterations < maxIterations) {
      iterations++;

      // Fetch batch from vendor API
      const response = await this.vendorApi.fetchReadings(
        device.vendorUserId,
        since,
        cursor,
        100,
      );

      this.logger.debug(
        `Fetched ${response.readings.length} readings (cursor: ${cursor || 'start'}, hasMore: ${response.hasMore})`,
      );

      // Process each reading
      for (const payload of response.readings) {
        try {
          // Check for duplicate via external_event_id
          const existing = await this.prisma.measurementReading.findFirst({
            where: {
              externalEventId: payload.event_id,
              deviceId: device.id,
            },
          });

          if (existing) {
            this.logger.debug(`Skipping duplicate reading: ${payload.event_id}`);
            continue;
          }

          // Normalize and store
          const normalized = this.normalizationService.normalize(payload);

          if (!this.normalizationService.isValidReading(normalized)) {
            this.logger.warn(`Invalid reading data, skipping: ${payload.event_id}`);
            continue;
          }

          await this.readingsService.createDeviceReading(
            patient.id,
            device.id,
            normalized,
            payload,
            payload.event_id,
          );

          totalReadings++;
        } catch (error) {
          this.logger.error(
            `Failed to process reading ${payload.event_id}: ${error.message}`,
          );
        }
      }

      // Update cursor for next batch
      cursor = response.nextCursor;
      hasMore = response.hasMore;
    }

    // Update device last synced timestamp
    await this.deviceService.updateLastSyncedAt(device.id);

    this.logger.log(
      `Device ${device.deviceId} synced: ${totalReadings} new readings`,
    );

    return totalReadings;
  }

  /**
   * Backfill readings for a date range
   * Useful for initial setup or catching up after outage
   */
  async backfillReadings(
    deviceId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const device = await this.deviceService.getDevice(deviceId);
    if (!device || !device.vendorUserId) {
      throw new Error('Device not found or missing vendor user ID');
    }

    this.logger.log(
      `Starting backfill for device ${deviceId} from ${startDate.toISOString()} to ${endDate.toISOString()}`,
    );

    let cursor: string | undefined;
    let totalReadings = 0;
    let hasMore = true;
    let iterations = 0;
    const maxIterations = 50; // Allow more iterations for backfill

    while (hasMore && iterations < maxIterations) {
      iterations++;

      const response = await this.vendorApi.fetchReadings(
        device.vendorUserId,
        startDate,
        cursor,
        100,
      );

      // Filter to end date
      const filteredReadings = response.readings.filter(
        (r) => new Date(r.measured_at) <= endDate,
      );

      for (const payload of filteredReadings) {
        try {
          const existing = await this.prisma.measurementReading.findFirst({
            where: {
              externalEventId: payload.event_id,
              deviceId: device.id,
            },
          });

          if (existing) continue;

          const normalized = this.normalizationService.normalize(payload);
          if (!this.normalizationService.isValidReading(normalized)) continue;

          await this.readingsService.createDeviceReading(
            device.assignedPatientId!,
            device.id,
            normalized,
            payload,
            payload.event_id,
          );

          totalReadings++;
        } catch (error) {
          this.logger.error(`Backfill error: ${error.message}`);
        }
      }

      cursor = response.nextCursor;
      hasMore = response.hasMore && filteredReadings.length > 0;

      // Stop if we've passed the end date
      if (
        filteredReadings.length > 0 &&
        new Date(filteredReadings[filteredReadings.length - 1].measured_at) > endDate
      ) {
        break;
      }
    }

    this.logger.log(`Backfill completed: ${totalReadings} readings imported`);
    return totalReadings;
  }
}
