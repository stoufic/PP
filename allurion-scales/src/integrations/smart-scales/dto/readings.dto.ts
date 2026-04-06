import { IsString, IsOptional, IsEnum, IsDateString, IsNumber, Min, Max, IsObject, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReadingSource } from '@prisma/client';

export class ReadingQueryDto {
  @ApiPropertyOptional({ description: 'Start date (ISO 8601)', example: '2026-01-01T00:00:00Z' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date (ISO 8601)', example: '2026-04-06T23:59:59Z' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Filter by source', enum: ReadingSource })
  @IsEnum(ReadingSource)
  @IsOptional()
  source?: ReadingSource;

  @ApiPropertyOptional({ description: 'Filter by device ID', example: 'dev_abc123' })
  @IsString()
  @IsOptional()
  deviceId?: string;

  @ApiPropertyOptional({ description: 'Page number', example: 1, default: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', example: 20, default: 20 })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;
}

export class ManualReadingDto {
  @ApiProperty({ description: 'Weight in kilograms', example: 75.5 })
  @IsNumber()
  @Min(20)
  @Max(300)
  weight_kg: number;

  @ApiPropertyOptional({ description: 'Body Mass Index', example: 24.2 })
  @IsNumber()
  @Min(10)
  @Max(60)
  @IsOptional()
  bmi?: number;

  @ApiPropertyOptional({ description: 'Body fat percentage', example: 18.5 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  body_fat_pct?: number;

  @ApiPropertyOptional({ description: 'Muscle mass in kilograms', example: 32.1 })
  @IsNumber()
  @Min(0)
  @Max(200)
  @IsOptional()
  muscle_mass_kg?: number;

  @ApiPropertyOptional({ description: 'Water percentage', example: 55.2 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  water_pct?: number;

  @ApiPropertyOptional({ description: 'Bone mass in kilograms', example: 2.8 })
  @IsNumber()
  @Min(0)
  @Max(20)
  @IsOptional()
  bone_mass_kg?: number;

  @ApiPropertyOptional({ description: 'Visceral fat rating', example: 8 })
  @IsNumber()
  @Min(0)
  @Max(30)
  @IsOptional()
  visceral_fat?: number;

  @ApiPropertyOptional({ description: 'Basal metabolic rate in kcal', example: 1650 })
  @IsNumber()
  @Min(500)
  @Max(5000)
  @IsOptional()
  bmr_kcal?: number;

  @ApiPropertyOptional({ description: 'Metabolic age in years', example: 35 })
  @IsNumber()
  @Min(0)
  @Max(120)
  @IsOptional()
  metabolic_age?: number;

  @ApiProperty({ description: 'Measurement timestamp (ISO 8601)', example: '2026-04-06T08:30:00Z' })
  @IsDateString()
  measured_at: string;
}

export class CreateManualReadingDto extends ManualReadingDto {
  @ApiPropertyOptional({ description: 'Device ID if associated with a device', example: 'dev_abc123' })
  @IsString()
  @IsOptional()
  deviceId?: string;
}

export class ReadingResponseDto {
  @ApiProperty({ description: 'Reading ID', example: 'rdg_xyz123' })
  id: string;

  @ApiProperty({ description: 'Patient ID', example: 'pat_xyz789' })
  patientId: string;

  @ApiPropertyOptional({ description: 'Device ID' })
  deviceId?: string;

  @ApiProperty({ description: 'Reading source', enum: ReadingSource })
  source: ReadingSource;

  @ApiPropertyOptional({ description: 'Weight in kilograms', example: 75.5 })
  weightKg?: number;

  @ApiPropertyOptional({ description: 'BMI', example: 24.2 })
  bmi?: number;

  @ApiPropertyOptional({ description: 'Body fat percentage', example: 18.5 })
  bodyFatPct?: number;

  @ApiPropertyOptional({ description: 'Muscle mass in kilograms', example: 32.1 })
  muscleMassKg?: number;

  @ApiPropertyOptional({ description: 'Water percentage', example: 55.2 })
  waterPct?: number;

  @ApiPropertyOptional({ description: 'Bone mass in kilograms', example: 2.8 })
  boneMassKg?: number;

  @ApiPropertyOptional({ description: 'Visceral fat rating', example: 8 })
  visceralFat?: number;

  @ApiPropertyOptional({ description: 'Basal metabolic rate in kcal', example: 1650 })
  bmrKcal?: number;

  @ApiPropertyOptional({ description: 'Metabolic age in years', example: 35 })
  metabolicAge?: number;

  @ApiProperty({ description: 'Measurement timestamp', example: '2026-04-06T08:30:00Z' })
  measuredAt: Date;

  @ApiProperty({ description: 'Received at timestamp', example: '2026-04-06T08:30:05Z' })
  receivedAt: Date;

  @ApiProperty({ description: 'Whether this reading was corrected', example: false })
  isCorrected: boolean;

  @ApiPropertyOptional({ description: 'Correction note if applicable' })
  correctionNote?: string;

  @ApiProperty({ description: 'Created at', example: '2026-04-06T08:30:05Z' })
  createdAt: Date;
}

export class ReadingListResponseDto {
  @ApiProperty({ description: 'List of readings', type: [ReadingResponseDto] })
  readings: ReadingResponseDto[];

  @ApiProperty({ description: 'Total count', example: 150 })
  total: number;

  @ApiPropertyOptional({ description: 'Next cursor for pagination' })
  nextCursor?: string;
}

export class ReadingTrendDto {
  @ApiProperty({ description: 'Start date', example: '2026-04-01T00:00:00Z' })
  startDate: Date;

  @ApiProperty({ description: 'End date', example: '2026-04-06T23:59:59Z' })
  endDate: Date;

  @ApiPropertyOptional({ description: 'Average weight', example: 76.2 })
  avgWeightKg?: number;

  @ApiPropertyOptional({ description: 'Weight change', example: -1.3 })
  weightChangeKg?: number;

  @ApiPropertyOptional({ description: 'Average BMI', example: 24.5 })
  avgBmi?: number;

  @ApiPropertyOptional({ description: 'Average body fat', example: 18.8 })
  avgBodyFatPct?: number;

  @ApiProperty({ description: 'Reading count', example: 12 })
  readingCount: number;
}
