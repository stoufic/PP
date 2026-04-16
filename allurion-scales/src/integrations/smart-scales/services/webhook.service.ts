import { Injectable, Logger, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@nestjs/platform-express';
import { VendorWebhookEvent, Device, MeasurementReading } from '@prisma/client';
import { VendorPayload } from '../interfaces/vendor-payload.interface';
import { NormalizationService, NormalizedReading } from './normalization.service';
import { ReadingsService } from './readings.service';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private prisma: PrismaService,
    private normalizationService: NormalizationService,
    private readingsService: ReadingsService,
  ) {}

  /**
   * Process incoming webhook event from scale vendor
   * Handles idempotency, validation, and storage
   */
  async processWebhook(
    payload: VendorPayload,
    signature: string,
    vendor: string = 'WITHINGS',
  ): Promise<{ status: 'processed' | 'duplicate' | 'rejected'; eventId?: string; message?: string }> {
    const eventId = payload.event_id;

    // Check for duplicate event (idempotency)
    const existingEvent = await this.prisma.vendorWebhookEvent.findUnique({
      where: { externalEventId: eventId },
    });

    if (existingEvent) {
      this.logger.warn(`Duplicate webhook event received: ${eventId}`);
      await this.prisma.vendorWebhookEvent.update({
        where: { id: existingEvent.id },
        data: { status: 'DUPLICATE', retryCount: { increment: 1 } },
      });
      return { status: 'duplicate', eventId, message: 'Event already processed' };
    }

    // Store webhook event for audit trail
    const webhookEvent = await this.prisma.vendorWebhookEvent.create({
      data: {
        externalEventId: eventId,
        vendor,
        eventType: 'measurement.created',
        payload: payload as any,
        signature,
        status: 'PROCESSING',
      },
    });

    try {
      // Find device by vendor device ID
      const device = await this.prisma.device.findUnique({
        where: { deviceId: payload.device_id },
        include: { assignedPatient: true },
      });

      if (!device) {
        this.logger.warn(`Device not found: ${payload.device_id}`);
        await this.prisma.vendorWebhookEvent.update({
          where: { id: webhookEvent.id },
          data: { status: 'FAILED', errorMessage: 'Device not registered' },
        });
        return { status: 'rejected', message: 'Device not registered' };
      }

      if (!device.assignedPatientId || device.status !== 'ACTIVE') {
        this.logger.warn(`Device not active or assigned: ${payload.device_id}`);
        await this.prisma.vendorWebhookEvent.update({
          where: { id: webhookEvent.id },
          data: { status: 'FAILED', errorMessage: 'Device not assigned to patient' },
        });
        return { status: 'rejected', message: 'Device not assigned to patient' };
      }

      // Normalize the reading
      const normalized = this.normalizationService.normalize(payload);

      if (!this.normalizationService.isValidReading(normalized)) {
        this.logger.warn('Invalid reading data (no weight)');
        await this.prisma.vendorWebhookEvent.update({
          where: { id: webhookEvent.id },
          data: { status: 'FAILED', errorMessage: 'Invalid reading data' },
        });
        return { status: 'rejected', message: 'Invalid reading data' };
      }

      // Store the reading
      const reading = await this.readingsService.createDeviceReading(
        device.assignedPatientId,
        device.id,
        normalized,
        payload,
        eventId,
      );

      // Update webhook event as processed
      await this.prisma.vendorWebhookEvent.update({
        where: { id: webhookEvent.id },
        data: {
          status: 'PROCESSED',
          processedAt: new Date(),
        },
      });

      this.logger.log(`Successfully processed webhook: ${eventId} -> reading ${reading.id}`);
      return { status: 'processed', eventId: reading.id };
    } catch (error) {
      this.logger.error(`Failed to process webhook ${eventId}: ${error.message}`, error.stack);
      await this.prisma.vendorWebhookEvent.update({
        where: { id: webhookEvent.id },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
        },
      });
      throw error;
    }
  }

  /**
   * Get webhook event by ID
   */
  async getWebhookEvent(eventId: string): Promise<VendorWebhookEvent | null> {
    return this.prisma.vendorWebhookEvent.findUnique({
      where: { externalEventId: eventId },
    });
  }

  /**
   * List webhook events with filtering
   */
  async listWebhookEvents(params: {
    vendor?: string;
    status?: string;
    limit?: number;
    cursor?: string;
  }): Promise<{ events: VendorWebhookEvent[]; nextCursor?: string }> {
    const { vendor, status, limit = 50, cursor } = params;

    const where: any = {};
    if (vendor) where.vendor = vendor;
    if (status) where.status = status;

    const events = await this.prisma.vendorWebhookEvent.findMany({
      where,
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { receivedAt: 'desc' },
    });

    let nextCursor: string | undefined;
    if (events.length > limit) {
      const nextEvent = events.pop();
      nextCursor = nextEvent.id;
    }

    return { events, nextCursor };
  }
}
