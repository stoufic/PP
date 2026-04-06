import { IsString, IsOptional, IsEnum, IsDateString, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DeviceStatus } from '@prisma/client';

export class CreateDeviceDto {
  @ApiProperty({ description: 'Vendor device ID', example: 'dev_abc123' })
  @IsString()
  device_id: string;

  @ApiProperty({ description: 'Device serial number', example: 'SN-2026-001234' })
  @IsString()
  serial_number: string;

  @ApiPropertyOptional({ description: 'Vendor name', example: 'WITHINGS', default: 'WITHINGS' })
  @IsString()
  @IsOptional()
  vendor?: string;

  @ApiPropertyOptional({ description: 'Vendor user ID', example: 'usr_789' })
  @IsString()
  @IsOptional()
  vendor_user_id?: string;

  @ApiPropertyOptional({ description: 'Firmware version', example: '2.1.4' })
  @IsString()
  @IsOptional()
  firmware_version?: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class AssignDeviceDto {
  @ApiProperty({ description: 'Patient ID to assign device to', example: 'pat_xyz789' })
  @IsString()
  patient_id: string;

  @ApiPropertyOptional({ description: 'Reason for assignment', example: 'New patient onboarding' })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class UnassignDeviceDto {
  @ApiPropertyOptional({ description: 'Reason for unassignment', example: 'Device returned' })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class DeviceResponseDto {
  @ApiProperty({ description: 'Device ID', example: 'dev_abc123' })
  id: string;

  @ApiProperty({ description: 'Vendor device ID', example: 'dev_abc123' })
  deviceId: string;

  @ApiProperty({ description: 'Serial number', example: 'SN-2026-001234' })
  serialNumber: string;

  @ApiProperty({ description: 'Vendor name', example: 'WITHINGS' })
  vendor: string;

  @ApiPropertyOptional({ description: 'Vendor user ID' })
  vendorUserId?: string;

  @ApiPropertyOptional({ description: 'Firmware version' })
  firmwareVersion?: string;

  @ApiProperty({ description: 'Device status', enum: DeviceStatus })
  status: DeviceStatus;

  @ApiPropertyOptional({ description: 'Assigned patient ID' })
  assignedPatientId?: string;

  @ApiPropertyOptional({ description: 'Assignment timestamp' })
  assignedAt?: Date;

  @ApiPropertyOptional({ description: 'Unassignment timestamp' })
  unassignedAt?: Date;

  @ApiPropertyOptional({ description: 'Last sync timestamp' })
  lastSyncedAt?: Date;

  @ApiProperty({ description: 'Created at', example: '2026-04-06T08:00:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', example: '2026-04-06T08:00:00Z' })
  updatedAt: Date;
}

export class DeviceListResponseDto {
  @ApiProperty({ description: 'List of devices', type: [DeviceResponseDto] })
  devices: DeviceResponseDto[];

  @ApiProperty({ description: 'Total count', example: 50 })
  total: number;

  @ApiPropertyOptional({ description: 'Next cursor for pagination' })
  nextCursor?: string;
}
