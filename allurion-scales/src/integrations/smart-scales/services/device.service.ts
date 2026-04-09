import { Injectable, Logger, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@nestjs/platform-express';
import { Device, DeviceStatus, DeviceAssignmentHistory, PatientProfile } from '@prisma/client';
import { CreateDeviceDto, AssignDeviceDto, UnassignDeviceDto } from '../dto/device.dto';

@Injectable()
export class DeviceService {
  private readonly logger = new Logger(DeviceService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Register a new device
   */
  async createDevice(dto: CreateDeviceDto, performedBy?: string): Promise<Device> {
    // Check for duplicates
    const existing = await this.prisma.device.findFirst({
      where: {
        OR: [
          { deviceId: dto.device_id },
          { serialNumber: dto.serial_number },
        ],
      },
    });

    if (existing) {
      throw new ConflictException(
        `Device already exists with device_id=${dto.device_id} or serial=${dto.serial_number}`,
      );
    }

    const device = await this.prisma.device.create({
      data: {
        deviceId: dto.device_id,
        serialNumber: dto.serial_number,
        vendor: dto.vendor || 'WITHINGS',
        vendorUserId: dto.vendor_user_id,
        firmwareVersion: dto.firmware_version,
        status: DeviceStatus.PENDING,
        metadata: dto.metadata as any,
      },
    });

    // Audit log
    await this.createAuditLog('DEVICE', device.id, 'CREATE', performedBy, {
      deviceId: device.deviceId,
      serialNumber: device.serialNumber,
      vendor: device.vendor,
    });

    this.logger.log(`Device registered: ${device.id} (${device.deviceId})`);
    return device;
  }

  /**
   * Assign a device to a patient
   */
  async assignDevice(
    deviceId: string,
    dto: AssignDeviceDto,
    performedBy?: string,
  ): Promise<Device> {
    const device = await this.prisma.device.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      throw new NotFoundException(`Device not found: ${deviceId}`);
    }

    if (device.status === DeviceStatus.ACTIVE && device.assignedPatientId) {
      throw new ConflictException('Device is already assigned to a patient');
    }

    // Verify patient exists
    const patient = await this.prisma.patientProfile.findUnique({
      where: { id: dto.patient_id },
    });

    if (!patient) {
      throw new NotFoundException(`Patient not found: ${dto.patient_id}`);
    }

    // If device was previously assigned, unassign it first
    if (device.assignedPatientId && device.assignedPatientId !== dto.patient_id) {
      await this.unassignDeviceInternal(deviceId, 'Reassignment', performedBy);
    }

    // Update device
    const updated = await this.prisma.device.update({
      where: { id: deviceId },
      data: {
        assignedPatientId: dto.patient_id,
        status: DeviceStatus.ACTIVE,
        assignedAt: new Date(),
        unassignedAt: null,
      },
    });

    // Create assignment history
    await this.prisma.deviceAssignmentHistory.create({
      data: {
        deviceId: deviceId,
        patientId: dto.patient_id,
        action: device.assignedPatientId ? 'REASSIGNED' : 'ASSIGNED',
        reason: dto.reason || 'Manual assignment',
        performedBy,
      },
    });

    // Audit log
    await this.createAuditLog('DEVICE', deviceId, 'ASSIGN', performedBy, {
      previousPatientId: device.assignedPatientId,
      newPatientId: dto.patient_id,
      reason: dto.reason,
    });

    this.logger.log(`Device ${deviceId} assigned to patient ${dto.patient_id}`);
    return updated;
  }

  /**
   * Unassign a device from a patient
   */
  async unassignDevice(
    deviceId: string,
    dto: UnassignDeviceDto,
    performedBy?: string,
  ): Promise<Device> {
    const device = await this.prisma.device.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      throw new NotFoundException(`Device not found: ${deviceId}`);
    }

    if (!device.assignedPatientId) {
      throw new BadRequestException('Device is not currently assigned');
    }

    return this.unassignDeviceInternal(deviceId, dto.reason, performedBy);
  }

  private async unassignDeviceInternal(
    deviceId: string,
    reason?: string,
    performedBy?: string,
  ): Promise<Device> {
    const device = await this.prisma.device.findUnique({
      where: { id: deviceId },
    });

    const updated = await this.prisma.device.update({
      where: { id: deviceId },
      data: {
        assignedPatientId: null,
        status: DeviceStatus.INACTIVE,
        unassignedAt: new Date(),
      },
    });

    // Create assignment history
    await this.prisma.deviceAssignmentHistory.create({
      data: {
        deviceId: deviceId,
        patientId: device.assignedPatientId,
        action: 'UNASSIGNED',
        reason: reason || 'Manual unassignment',
        performedBy,
      },
    });

    // Audit log
    await this.createAuditLog('DEVICE', deviceId, 'UNASSIGN', performedBy, {
      previousPatientId: device.assignedPatientId,
      reason,
    });

    this.logger.log(`Device ${deviceId} unassigned (reason: ${reason || 'N/A'})`);
    return updated;
  }

  /**
   * Get device by ID
   */
  async getDevice(deviceId: string): Promise<Device | null> {
    return this.prisma.device.findUnique({
      where: { id: deviceId },
      include: {
        assignedPatient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  /**
   * Get device by vendor device ID
   */
  async getDeviceByVendorId(vendorDeviceId: string): Promise<Device | null> {
    return this.prisma.device.findUnique({
      where: { deviceId: vendorDeviceId },
    });
  }

  /**
   * List devices with filtering
   */
  async listDevices(params: {
    status?: DeviceStatus;
    vendor?: string;
    assignedPatientId?: string;
    limit?: number;
    cursor?: string;
  }): Promise<{ devices: Device[]; nextCursor?: string }> {
    const { status, vendor, assignedPatientId, limit = 50, cursor } = params;

    const where: any = {};
    if (status) where.status = status;
    if (vendor) where.vendor = vendor;
    if (assignedPatientId) where.assignedPatientId = assignedPatientId;

    const devices = await this.prisma.device.findMany({
      where,
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        assignedPatient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    let nextCursor: string | undefined;
    if (devices.length > limit) {
      const nextEvent = devices.pop();
      nextCursor = nextEvent.id;
    }

    return { devices, nextCursor };
  }

  /**
   * Get assignment history for a device
   */
  async getAssignmentHistory(deviceId: string): Promise<DeviceAssignmentHistory[]> {
    return this.prisma.deviceAssignmentHistory.findMany({
      where: { deviceId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Update device last synced timestamp
   */
  async updateLastSyncedAt(deviceId: string): Promise<Device> {
    return this.prisma.device.update({
      where: { id: deviceId },
      data: { lastSyncedAt: new Date() },
    });
  }

  private async createAuditLog(
    entityType: string,
    entityId: string,
    action: string,
    userId?: string,
    changes?: any,
  ): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          entityType,
          entityId,
          action,
          userId,
          changes: changes as any,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create audit log: ${error.message}`);
    }
  }
}
