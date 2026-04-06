import { IsString, IsObject, IsOptional, IsDateString, IsNumber, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WebhookMeasurementsDto {
  @ApiPropertyOptional({ description: 'Weight in kilograms', example: 75.5 })
  @IsNumber()
  @IsOptional()
  weight_kg?: number;

  @ApiPropertyOptional({ description: 'Weight in pounds', example: 166.4 })
  @IsNumber()
  @IsOptional()
  weight_lb?: number;

  @ApiPropertyOptional({ description: 'Body Mass Index', example: 24.2 })
  @IsNumber()
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
  @IsOptional()
  bone_mass_kg?: number;

  @ApiPropertyOptional({ description: 'Visceral fat rating', example: 8 })
  @IsNumber()
  @IsOptional()
  visceral_fat?: number;

  @ApiPropertyOptional({ description: 'Basal metabolic rate in kcal', example: 1650 })
  @IsNumber()
  @IsOptional()
  bmr_kcal?: number;

  @ApiPropertyOptional({ description: 'Metabolic age in years', example: 35 })
  @IsNumber()
  @IsOptional()
  metabolic_age?: number;
}

export class WebhookPayloadDto {
  @ApiProperty({ description: 'Unique event ID from vendor', example: 'evt_123456' })
  @IsString()
  event_id: string;

  @ApiProperty({ description: 'Vendor user ID', example: 'usr_789' })
  @IsString()
  user_id: string;

  @ApiProperty({ description: 'Vendor device ID', example: 'dev_abc123' })
  @IsString()
  device_id: string;

  @ApiProperty({ description: 'Measurement timestamp (ISO 8601)', example: '2026-04-06T08:30:00Z' })
  @IsDateString()
  measured_at: string;

  @ApiProperty({ description: 'Measurement data', type: WebhookMeasurementsDto })
  @IsObject()
  @ValidateNested()
  @Type(() => WebhookMeasurementsDto)
  measurements: WebhookMeasurementsDto;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class WebhookEventDto {
  @ApiProperty({
    description: 'Event type',
    enum: ['measurement.created', 'measurement.updated', 'device.registered'],
    example: 'measurement.created',
  })
  @IsString()
  event_type: 'measurement.created' | 'measurement.updated' | 'device.registered';

  @ApiProperty({ description: 'Event timestamp (ISO 8601)', example: '2026-04-06T08:30:05Z' })
  @IsDateString()
  timestamp: string;

  @ApiProperty({ description: 'Unique event ID for idempotency', example: 'evt_123456' })
  @IsString()
  event_id: string;

  @ApiProperty({ description: 'Payload data', type: WebhookPayloadDto })
  @IsObject()
  @ValidateNested()
  @Type(() => WebhookPayloadDto)
  data: WebhookPayloadDto;

  @ApiPropertyOptional({ description: 'Webhook signature for verification' })
  @IsString()
  @IsOptional()
  signature?: string;
}

export class WebhookResponseDto {
  @ApiProperty({ description: 'Acknowledgment status', example: 'received' })
  status: 'received' | 'rejected' | 'duplicate';

  @ApiPropertyOptional({ description: 'Event ID if processed', example: 'evt_123456' })
  event_id?: string;

  @ApiPropertyOptional({ description: 'Error message if rejected' })
  message?: string;
}
