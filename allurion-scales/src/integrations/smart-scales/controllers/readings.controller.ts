import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Role, ReadingSource } from '@prisma/client';
import {
  ReadingQueryDto,
  CreateManualReadingDto,
  ReadingResponseDto,
  ReadingListResponseDto,
  ReadingTrendDto,
} from '../dto/readings.dto';
import { ReadingsService } from '../services/readings.service';

@ApiTags('Readings')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('readings')
export class ReadingsController {
  constructor(private readingsService: ReadingsService) {}

  @Get('/me')
  @Roles(Role.PATIENT)
  @ApiOperation({ summary: 'Get my own readings (patient)' })
  @ApiQuery({ name: 'startDate', required: false, example: '2026-01-01T00:00:00Z' })
  @ApiQuery({ name: 'endDate', required: false, example: '2026-04-06T23:59:59Z' })
  @ApiQuery({ name: 'source', required: false, enum: ReadingSource })
  @ApiQuery({ name: 'deviceId', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({ status: 200, description: 'List of readings', type: ReadingListResponseDto })
  async getMyReadings(
    @Request() req: any,
    @Query() query: ReadingQueryDto,
  ): Promise<ReadingListResponseDto> {
    const patientId = req.user.patientProfile?.id;
    if (!patientId) {
      throw new Error('Patient profile not found');
    }

    const result = await this.readingsService.getPatientReadings(patientId, {
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      source: query.source,
      deviceId: query.deviceId,
      limit: query.limit || 20,
      cursor: undefined, // Implement cursor pagination if needed
    });

    return {
      readings: result.readings.map((r) => this.mapToReadingResponse(r)),
      total: result.readings.length,
      nextCursor: result.nextCursor,
    };
  }

  @Get('/patients/:patientId')
  @Roles(Role.DOCTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Get readings for a patient (doctor/admin)' })
  @ApiResponse({ status: 200, description: 'List of readings', type: ReadingListResponseDto })
  @ApiResponse({ status: 403, description: 'Doctor not assigned to patient' })
  async getPatientReadings(
    @Param('patientId') patientId: string,
    @Request() req: any,
    @Query() query: ReadingQueryDto,
  ): Promise<ReadingListResponseDto> {
    const doctorUserId = req.user.id;

    const result = await this.readingsService.getReadingsForPatient(
      patientId,
      doctorUserId,
      {
        startDate: query.startDate ? new Date(query.startDate) : undefined,
        endDate: query.endDate ? new Date(query.endDate) : undefined,
        source: query.source,
        deviceId: query.deviceId,
        limit: query.limit || 20,
      },
    );

    return {
      readings: result.readings.map((r) => this.mapToReadingResponse(r)),
      total: result.readings.length,
      nextCursor: result.nextCursor,
    };
  }

  @Get('/admin/all')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all readings (admin only)' })
  @ApiResponse({ status: 200, description: 'List of all readings' })
  async getAllReadings(@Query() query: ReadingQueryDto): Promise<ReadingListResponseDto> {
    const result = await this.readingsService.getAllReadings({
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      source: query.source,
      deviceId: query.deviceId,
      limit: query.limit || 50,
    });

    return {
      readings: result.readings.map((r) => this.mapToReadingResponse(r)),
      total: result.readings.length,
      nextCursor: result.nextCursor,
    };
  }

  @Post('/manual')
  @Roles(Role.PATIENT, Role.DOCTOR)
  @ApiOperation({ summary: 'Create a manual reading' })
  @ApiResponse({ status: 201, description: 'Reading created', type: ReadingResponseDto })
  async createManualReading(
    @Body() dto: CreateManualReadingDto,
    @Request() req: any,
  ): Promise<ReadingResponseDto> {
    const user = req.user;
    let patientId: string;
    let source: ReadingSource;

    if (user.role === Role.PATIENT) {
      patientId = user.patientProfile?.id;
      source = ReadingSource.MANUAL_PATIENT;
    } else if (user.role === Role.DOCTOR) {
      // Doctor creating on behalf of patient - patientId should be in DTO or context
      patientId = dto.deviceId ? await this.getPatientIdForDevice(dto.deviceId) : user.patientProfile?.id;
      source = ReadingSource.MANUAL_DOCTOR;
    } else {
      throw new Error('Unauthorized');
    }

    if (!patientId) {
      throw new Error('Patient ID not found');
    }

    const reading = await this.readingsService.createManualReading(
      patientId,
      {
        weightKg: dto.weight_kg,
        bmi: dto.bmi,
        bodyFatPct: dto.body_fat_pct,
        muscleMassKg: dto.muscle_mass_kg,
        waterPct: dto.water_pct,
        boneMassKg: dto.bone_mass_kg,
        visceralFat: dto.visceral_fat,
        bmrKcal: dto.bmr_kcal,
        metabolicAge: dto.metabolic_age,
        measuredAt: new Date(dto.measured_at),
        deviceId: dto.deviceId,
      },
      source,
      user.id,
    );

    return this.mapToReadingResponse(reading);
  }

  @Get('/trend')
  @Roles(Role.PATIENT)
  @ApiOperation({ summary: 'Get reading trends for current patient' })
  @ApiQuery({ name: 'startDate', required: true, example: '2026-04-01T00:00:00Z' })
  @ApiQuery({ name: 'endDate', required: true, example: '2026-04-06T23:59:59Z' })
  @ApiResponse({ status: 200, description: 'Trend summary', type: ReadingTrendDto })
  async getTrend(
    @Request() req: any,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<ReadingTrendDto> {
    const patientId = req.user.patientProfile?.id;
    if (!patientId) {
      throw new Error('Patient profile not found');
    }

    const trend = await this.readingsService.getReadingTrend(
      patientId,
      new Date(startDate),
      new Date(endDate),
    );

    return {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      ...trend,
    };
  }

  @Get(':id')
  @Roles(Role.PATIENT, Role.DOCTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Get a specific reading by ID' })
  @ApiResponse({ status: 200, description: 'Reading details', type: ReadingResponseDto })
  async getReading(@Param('id') id: string): Promise<ReadingResponseDto> {
    const reading = await this.readingsService.getReading(id);
    if (!reading) {
      throw new Error('Reading not found');
    }
    return this.mapToReadingResponse(reading);
  }

  private mapToReadingResponse(reading: any): ReadingResponseDto {
    return {
      id: reading.id,
      patientId: reading.patientId,
      deviceId: reading.deviceId,
      source: reading.source,
      weightKg: reading.weightKg,
      bmi: reading.bmi,
      bodyFatPct: reading.bodyFatPct,
      muscleMassKg: reading.muscleMassKg,
      waterPct: reading.waterPct,
      boneMassKg: reading.boneMassKg,
      visceralFat: reading.visceralFat,
      bmrKcal: reading.bmrKcal,
      metabolicAge: reading.metabolicAge,
      measuredAt: reading.measuredAt,
      receivedAt: reading.receivedAt,
      isCorrected: reading.isCorrected,
      correctionNote: reading.correctionNote,
      createdAt: reading.createdAt,
    };
  }

  private async getPatientIdForDevice(deviceId: string): Promise<string> {
    // Helper to get patient ID from device (implement based on your needs)
    throw new Error('Not implemented - add device lookup logic');
  }
}
