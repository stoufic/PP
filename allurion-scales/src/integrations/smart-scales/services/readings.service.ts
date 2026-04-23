import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@nestjs/platform-express';
import { MeasurementReading, ReadingSource } from '@prisma/client';
import { NormalizedReading } from './normalization.service';
import { VendorPayload } from '../interfaces/vendor-payload.interface';

export interface ReadingsQueryParams {
  patientId?: string;
  startDate?: Date;
  endDate?: Date;
  source?: ReadingSource;
  deviceId?: string;
  limit?: number;
  cursor?: string;
}

@Injectable()
export class ReadingsService {
  private readonly logger = new Logger(ReadingsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create a reading from device vendor (automated ingestion)
   */
  async createDeviceReading(
    patientId: string,
    deviceId: string,
    normalized: NormalizedReading,
    rawPayload: VendorPayload,
    externalEventId?: string,
  ): Promise<MeasurementReading> {
    const reading = await this.prisma.measurementReading.create({
      data: {
        patientId,
        deviceId,
        source: ReadingSource.DEVICE_VENDOR,
        weightKg: normalized.weightKg,
        bmi: normalized.bmi,
        bodyFatPct: normalized.bodyFatPct,
        muscleMassKg: normalized.muscleMassKg,
        waterPct: normalized.waterPct,
        boneMassKg: normalized.boneMassKg,
        visceralFat: normalized.visceralFat,
        bmrKcal: normalized.bmrKcal,
        metabolicAge: normalized.metabolicAge,
        measuredAt: normalized.measuredAt,
        receivedAt: normalized.receivedAt,
        rawPayload: rawPayload as any,
        externalEventId,
      },
    });

    this.logger.debug(`Created device reading: ${reading.id} for patient ${patientId}`);
    return reading;
  }

  /**
   * Create a manual reading (patient or doctor entry)
   */
  async createManualReading(
    patientId: string,
    data: {
      weightKg: number;
      bmi?: number;
      bodyFatPct?: number;
      muscleMassKg?: number;
      waterPct?: number;
      boneMassKg?: number;
      visceralFat?: number;
      bmrKcal?: number;
      metabolicAge?: number;
      measuredAt: Date;
      deviceId?: string;
    },
    source: ReadingSource.MANUAL_PATIENT | ReadingSource.MANUAL_DOCTOR,
    performedBy?: string,
  ): Promise<MeasurementReading> {
    const reading = await this.prisma.measurementReading.create({
      data: {
        patientId,
        deviceId: data.deviceId,
        source,
        weightKg: data.weightKg,
        bmi: data.bmi,
        bodyFatPct: data.bodyFatPct,
        muscleMassKg: data.muscleMassKg,
        waterPct: data.waterPct,
        boneMassKg: data.boneMassKg,
        visceralFat: data.visceralFat,
        bmrKcal: data.bmrKcal,
        metabolicAge: data.metabolicAge,
        measuredAt: data.measuredAt,
        rawPayload: {
          source: 'manual',
          performedBy,
          ...data,
        } as any,
      },
    });

    this.logger.log(`Created manual reading (${source}): ${reading.id} for patient ${patientId}`);
    return reading;
  }

  /**
   * Get readings for a patient (patient access - own data only)
   */
  async getPatientReadings(
    patientId: string,
    params: Omit<ReadingsQueryParams, 'patientId'>,
  ): Promise<{ readings: MeasurementReading[]; nextCursor?: string }> {
    return this.queryReadings({ ...params, patientId });
  }

  /**
   * Get readings for a patient (doctor access - must be assigned)
   */
  async getReadingsForPatient(
    patientId: string,
    doctorUserId: string,
    params: Omit<ReadingsQueryParams, 'patientId'>,
  ): Promise<{ readings: MeasurementReading[]; nextCursor?: string }> {
    // Verify doctor is assigned to this patient
    const assignment = await this.prisma.doctorPatientAssignment.findFirst({
      where: {
        patientId,
        doctor: {
          userId: doctorUserId,
        },
      },
    });

    if (!assignment) {
      throw new ForbiddenException('Doctor not assigned to this patient');
    }

    return this.queryReadings({ ...params, patientId });
  }

  /**
   * Get readings for admin (broad access)
   */
  async getAllReadings(
    params: ReadingsQueryParams,
  ): Promise<{ readings: MeasurementReading[]; nextCursor?: string }> {
    return this.queryReadings(params);
  }

  /**
   * Core query logic with filtering and pagination
   */
  private async queryReadings(
    params: ReadingsQueryParams,
  ): Promise<{ readings: MeasurementReading[]; nextCursor?: string }> {
    const {
      patientId,
      startDate,
      endDate,
      source,
      deviceId,
      limit = 50,
      cursor,
    } = params;

    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (source) where.source = source;
    if (deviceId) where.deviceId = deviceId;

    if (startDate || endDate) {
      where.measuredAt = {};
      if (startDate) where.measuredAt.gte = startDate;
      if (endDate) where.measuredAt.lte = endDate;
    }

    const readings = await this.prisma.measurementReading.findMany({
      where,
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { measuredAt: 'desc' },
      include: {
        device: {
          select: {
            id: true,
            deviceId: true,
            vendor: true,
          },
        },
      },
    });

    let nextCursor: string | undefined;
    if (readings.length > limit) {
      const nextReading = readings.pop();
      nextCursor = nextReading.id;
    }

    return { readings, nextCursor };
  }

  /**
   * Get reading trend summary for a patient
   */
  async getReadingTrend(
    patientId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{
    avgWeightKg?: number;
    weightChangeKg?: number;
    avgBmi?: number;
    avgBodyFatPct?: number;
    readingCount: number;
  }> {
    const readings = await this.prisma.measurementReading.findMany({
      where: {
        patientId,
        measuredAt: {
          gte: startDate,
          lte: endDate,
        },
        weightKg: { not: null },
      },
      select: {
        weightKg: true,
        bmi: true,
        bodyFatPct: true,
        measuredAt: true,
      },
      orderBy: { measuredAt: 'asc' },
    });

    if (readings.length === 0) {
      return { readingCount: 0 };
    }

    const validWeights = readings.filter((r) => r.weightKg !== null);
    const avgWeightKg =
      validWeights.reduce((sum, r) => sum + (r.weightKg || 0), 0) / validWeights.length;

    const weightChangeKg =
      validWeights.length > 1
        ? validWeights[validWeights.length - 1].weightKg! - validWeights[0].weightKg!
        : undefined;

    const validBmis = readings.filter((r) => r.bmi !== null);
    const avgBmi =
      validBmis.length > 0
        ? validBmis.reduce((sum, r) => sum + (r.bmi || 0), 0) / validBmis.length
        : undefined;

    const validBodyFats = readings.filter((r) => r.bodyFatPct !== null);
    const avgBodyFatPct =
      validBodyFats.length > 0
        ? validBodyFats.reduce((sum, r) => sum + (r.bodyFatPct || 0), 0) / validBodyFats.length
        : undefined;

    return {
      avgWeightKg,
      weightChangeKg,
      avgBmi,
      avgBodyFatPct,
      readingCount: readings.length,
    };
  }

  /**
   * Get a single reading by ID
   */
  async getReading(readingId: string): Promise<MeasurementReading | null> {
    return this.prisma.measurementReading.findUnique({
      where: { id: readingId },
      include: {
        device: {
          select: {
            id: true,
            deviceId: true,
            vendor: true,
          },
        },
      },
    });
  }

  /**
   * Get latest reading for a patient
   */
  async getLatestReading(patientId: string): Promise<MeasurementReading | null> {
    return this.prisma.measurementReading.findFirst({
      where: { patientId },
      orderBy: { measuredAt: 'desc' },
    });
  }

  /**
   * Count readings for a patient
   */
  async countReadings(patientId: string, params?: Partial<ReadingsQueryParams>): Promise<number> {
    const where: any = { patientId };

    if (params?.source) where.source = params.source;
    if (params?.deviceId) where.deviceId = params.deviceId;

    if (params?.startDate || params?.endDate) {
      where.measuredAt = {};
      if (params.startDate) where.measuredAt.gte = params.startDate;
      if (params.endDate) where.measuredAt.lte = params.endDate;
    }

    return this.prisma.measurementReading.count({ where });
  }
  
}
