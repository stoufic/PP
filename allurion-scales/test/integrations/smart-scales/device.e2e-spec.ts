import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaClient, Role } from '@prisma/client';
import { SmartScalesModule } from '../../../src/integrations/smart-scales/smart-scales.module';

describe('DeviceController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let authToken: string;

  const testUser = {
    id: 'user_admin_001',
    email: 'admin@allurion.test',
    role: Role.ADMIN,
  };

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SmartScalesModule],
    })
      .overrideProvider('PrismaService')
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();

    // Create test user and patient profile
    await prisma.user.upsert({
      where: { id: testUser.id },
      update: {},
      create: testUser as any,
    });

    await prisma.patientProfile.upsert({
      where: { userId: testUser.id },
      update: {},
      create: {
        id: 'patient_001',
        userId: testUser.id,
        firstName: 'Test',
        lastName: 'Patient',
      },
    });

    // Mock auth token (in real tests, use your auth strategy)
    authToken = 'Bearer mock-admin-token';
  });

  afterAll(async () => {
    await prisma.deviceAssignmentHistory.deleteMany({});
    await prisma.device.deleteMany({});
    await prisma.patientProfile.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
    await app.close();
  });

  describe('POST /devices', () => {
    it('should successfully register a new device', async () => {
      const newDevice = {
        device_id: 'dev_e2e_001',
        serial_number: 'SN-E2E-001',
        vendor: 'WITHINGS',
        firmware_version: '2.1.0',
      };

      return request(app.getHttpServer())
        .post('/devices')
        .set('Authorization', authToken)
        .send(newDevice)
        .expect(201)
        .expect((res) => {
          expect(res.body.deviceId).toBe('dev_e2e_001');
          expect(res.body.serialNumber).toBe('SN-E2E-001');
          expect(res.body.status).toBe('PENDING');
          expect(res.body.vendor).toBe('WITHINGS');
        });
    });

    it('should reject duplicate device registration', async () => {
      const duplicateDevice = {
        device_id: 'dev_e2e_001',
        serial_number: 'SN-DUPLICATE',
      };

      return request(app.getHttpServer())
        .post('/devices')
        .set('Authorization', authToken)
        .send(duplicateDevice)
        .expect(409);
    });
  });

  describe('POST /devices/:id/assign', () => {
    let deviceId: string;

    beforeAll(async () => {
      // Create a device for assignment tests
      const device = await prisma.device.create({
        data: {
          deviceId: 'dev_assign_test',
          serialNumber: 'SN-ASSIGN-001',
          vendor: 'WITHINGS',
        },
      });
      deviceId = device.id;
    });

    it('should assign device to patient', async () => {
      const assignData = {
        patient_id: 'patient_001',
        reason: 'E2E test assignment',
      };

      return request(app.getHttpServer())
        .post(`/devices/${deviceId}/assign`)
        .set('Authorization', authToken)
        .send(assignData)
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ACTIVE');
          expect(res.body.assignedPatientId).toBe('patient_001');
          expect(res.body.assignedAt).toBeDefined();
        });
    });

    it('should reject assigning already assigned device', async () => {
      const assignData = {
        patient_id: 'patient_001',
        reason: 'Duplicate assignment',
      };

      return request(app.getHttpServer())
        .post(`/devices/${deviceId}/assign`)
        .set('Authorization', authToken)
        .send(assignData)
        .expect(409);
    });

    it('should reject assignment to non-existent patient', async () => {
      const assignData = {
        patient_id: 'patient_nonexistent',
        reason: 'Invalid patient',
      };

      return request(app.getHttpServer())
        .post(`/devices/${deviceId}/assign`)
        .set('Authorization', authToken)
        .send(assignData)
        .expect(404);
    });
  });

  describe('POST /devices/:id/unassign', () => {
    let deviceId: string;

    beforeAll(async () => {
      // Create and assign a device for unassign tests
      const device = await prisma.device.create({
        data: {
          deviceId: 'dev_unassign_test',
          serialNumber: 'SN-UNASSIGN-001',
          vendor: 'WITHINGS',
          status: 'ACTIVE',
          assignedPatientId: 'patient_001',
          assignedAt: new Date(),
        },
      });
      deviceId = device.id;
    });

    it('should unassign device from patient', async () => {
      const unassignData = {
        reason: 'E2E test unassignment',
      };

      return request(app.getHttpServer())
        .post(`/devices/${deviceId}/unassign`)
        .set('Authorization', authToken)
        .send(unassignData)
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('INACTIVE');
          expect(res.body.assignedPatientId).toBeNull();
          expect(res.body.unassignedAt).toBeDefined();
        });
    });

    it('should reject unassigning already unassigned device', async () => {
      const unassignData = {
        reason: 'Already unassigned',
      };

      return request(app.getHttpServer())
        .post(`/devices/${deviceId}/unassign`)
        .set('Authorization', authToken)
        .send(unassignData)
        .expect(400);
    });
  });

  describe('GET /devices', () => {
    it('should list devices with pagination', async () => {
      return request(app.getHttpServer())
        .get('/devices')
        .set('Authorization', authToken)
        .query({ limit: 10 })
        .expect(200)
        .expect((res) => {
          expect(res.body.devices).toBeDefined();
          expect(Array.isArray(res.body.devices)).toBe(true);
          expect(res.body.total).toBeDefined();
        });
    });

    it('should filter devices by status', async () => {
      return request(app.getHttpServer())
        .get('/devices?status=ACTIVE')
        .set('Authorization', authToken)
        .expect(200)
        .expect((res) => {
          res.body.devices.forEach((device: any) => {
            expect(device.status).toBe('ACTIVE');
          });
        });
    });
  });

  describe('GET /devices/:id/assignments', () => {
    it('should get assignment history for a device', async () => {
      // Find a device that was assigned/unassigned
      const device = await prisma.device.findFirst({
        where: { deviceId: { startsWith: 'dev_' } },
      });

      if (!device) return;

      return request(app.getHttpServer())
        .get(`/devices/${device.id}/assignments`)
        .set('Authorization', authToken)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });
});
