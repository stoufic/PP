import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
import { Role } from '@prisma/client';
import {
  CreateDeviceDto,
  AssignDeviceDto,
  UnassignDeviceDto,
  DeviceResponseDto,
  DeviceListResponseDto,
} from '../dto/device.dto';
import { DeviceService } from '../services/device.service';

@ApiTags('Devices')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('devices')
export class DeviceController {
  constructor(private deviceService: DeviceService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Register a new scale device' })
  @ApiResponse({ status: 201, description: 'Device registered', type: DeviceResponseDto })
  @ApiResponse({ status: 409, description: 'Device already exists' })
  async createDevice(
    @Body() dto: CreateDeviceDto,
    @Request() req: any,
  ): Promise<DeviceResponseDto> {
    const device = await this.deviceService.createDevice(dto, req.user?.id);
    return this.mapToDeviceResponse(device);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'List all devices (admin)' })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'ACTIVE', 'INACTIVE', 'MAINTENANCE'] })
  @ApiQuery({ name: 'vendor', required: false, example: 'WITHINGS' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of devices', type: DeviceListResponseDto })
  async listDevices(
    @Query('status') status?: string,
    @Query('vendor') vendor?: string,
    @Query('assignedPatientId') assignedPatientId?: string,
    @Query('limit') limit?: number,
    @Query('cursor') cursor?: string,
  ): Promise<DeviceListResponseDto> {
    const result = await this.deviceService.listDevices({
      status: status as any,
      vendor,
      assignedPatientId,
      limit: limit ? parseInt(limit.toString(), 10) : 50,
      cursor,
    });

    return {
      devices: result.devices.map((d) => this.mapToDeviceResponse(d)),
      total: result.devices.length,
      nextCursor: result.nextCursor,
    };
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.DOCTOR)
  @ApiOperation({ summary: 'Get device by ID' })
  @ApiResponse({ status: 200, description: 'Device details', type: DeviceResponseDto })
  @ApiResponse({ status: 404, description: 'Device not found' })
  async getDevice(@Param('id') id: string): Promise<DeviceResponseDto> {
    const device = await this.deviceService.getDevice(id);
    if (!device) {
      throw new Error('Device not found');
    }
    return this.mapToDeviceResponse(device);
  }

  @Post(':id/assign')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Assign device to a patient' })
  @ApiResponse({ status: 200, description: 'Device assigned', type: DeviceResponseDto })
  @ApiResponse({ status: 404, description: 'Device or patient not found' })
  @ApiResponse({ status: 409, description: 'Device already assigned' })
  async assignDevice(
    @Param('id') id: string,
    @Body() dto: AssignDeviceDto,
    @Request() req: any,
  ): Promise<DeviceResponseDto> {
    const device = await this.deviceService.assignDevice(id, dto, req.user?.id);
    return this.mapToDeviceResponse(device);
  }

  @Post(':id/unassign')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Unassign device from patient' })
  @ApiResponse({ status: 200, description: 'Device unassigned', type: DeviceResponseDto })
  @ApiResponse({ status: 404, description: 'Device not found' })
  @ApiResponse({ status: 400, description: 'Device not assigned' })
  async unassignDevice(
    @Param('id') id: string,
    @Body() dto: UnassignDeviceDto,
    @Request() req: any,
  ): Promise<DeviceResponseDto> {
    const device = await this.deviceService.unassignDevice(id, dto, req.user?.id);
    return this.mapToDeviceResponse(device);
  }

  @Get(':id/assignments')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get assignment history for a device' })
  @ApiResponse({ status: 200, description: 'Assignment history' })
  async getAssignmentHistory(@Param('id') id: string) {
    return this.deviceService.getAssignmentHistory(id);
  }

  private mapToDeviceResponse(device: any): DeviceResponseDto {
    return {
      id: device.id,
      deviceId: device.deviceId,
      serialNumber: device.serialNumber,
      vendor: device.vendor,
      vendorUserId: device.vendorUserId,
      firmwareVersion: device.firmwareVersion,
      status: device.status,
      assignedPatientId: device.assignedPatientId,
      assignedAt: device.assignedAt,
      unassignedAt: device.unassignedAt,
      lastSyncedAt: device.lastSyncedAt,
      createdAt: device.createdAt,
      updatedAt: device.updatedAt,
    };
  }
}
