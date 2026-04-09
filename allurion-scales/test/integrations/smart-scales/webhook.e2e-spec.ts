import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { SmartScalesModule } from '../../../src/integrations/smart-scales/smart-scales.module';
import { createHmac } from 'crypto';

describe('WebhookController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  const WEBHOOK_SECRET = 'test-secret-key-123';
  const VALID_PAYLOAD = {
    event_type: 'measurement.created' as const,
    timestamp: new Date().toISOString(),
    event_id: 'evt_test_001',
    data: {
      event_id: 'evt_test_001',
      user_id: 'usr_test_123',
      device_id: 'dev_test_456',
      measured_at: new Date().toISOString(),
      measurements: {
        weight_kg: 75.5,
        bmi: 24.2,
        body_fat_pct: 18.5,
      },
    },
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

    // Setup test device
    await prisma.device.create({
      data: {
        deviceId: 'dev_test_456',
        serialNumber: 'SN-TEST-001',
        vendor: 'WITHINGS',
        vendorUserId: 'usr_test_123',
        status: 'ACTIVE',
      },
    });
  });

  afterAll(async () => {
    await prisma.device.deleteMany({ where: { deviceId: 'dev_test_456' } });
    await prisma.measurementReading.deleteMany({ where: { externalEventId: 'evt_test_001' } });
    await prisma.vendorWebhookEvent.deleteMany({ where: { externalEventId: 'evt_test_001' } });
    await prisma.$disconnect();
    await app.close();
  });

  function createSignature(payload: any): string {
    const timestamp = Date.now().toString();
    const signedPayload = `${timestamp}.${JSON.stringify(payload)}`;
    const signature = createHmac('sha256', WEBHOOK_SECRET).update(signedPayload).digest('hex');
    return signature;
  }

  describe('POST /integrations/scales/webhooks/vendor', () => {
    it('should successfully process valid webhook', async () => {
      const signature = createSignature(VALID_PAYLOAD);
      const timestamp = Date.now().toString();

      return request(app.getHttpServer())
        .post('/integrations/scales/webhooks/vendor')
        .set('x-webhook-signature', signature)
        .set('x-webhook-timestamp', timestamp)
        .send(VALID_PAYLOAD)
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('received');
          expect(res.body.event_id).toBeDefined();
        });
    });

    it('should reject webhook with invalid signature', async () => {
      return request(app.getHttpServer())
        .post('/integrations/scales/webhooks/vendor')
        .set('x-webhook-signature', 'invalid-signature')
        .set('x-webhook-timestamp', Date.now().toString())
        .send(VALID_PAYLOAD)
        .expect(401);
    });

    it('should reject webhook with expired timestamp', async () => {
      const oldTimestamp = (Date.now() - 10 * 60 * 1000).toString(); // 10 minutes ago
      const signature = createSignature(VALID_PAYLOAD);

      return request(app.getHttpServer())
        .post('/integrations/scales/webhooks/vendor')
        .set('x-webhook-signature', signature)
        .set('x-webhook-timestamp', oldTimestamp)
        .send(VALID_PAYLOAD)
        .expect(401);
    });

    it('should handle duplicate webhook (idempotency)', async () => {
      const signature = createSignature(VALID_PAYLOAD);
      const timestamp = Date.now().toString();

      // First request
      await request(app.getHttpServer())
        .post('/integrations/scales/webhooks/vendor')
        .set('x-webhook-signature', signature)
        .set('x-webhook-timestamp', timestamp)
        .send(VALID_PAYLOAD)
        .expect(200);

      // Second request with same event_id
      return request(app.getHttpServer())
        .post('/integrations/scales/webhooks/vendor')
        .set('x-webhook-signature', signature)
        .set('x-webhook-timestamp', timestamp)
        .send(VALID_PAYLOAD)
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('duplicate');
        });
    });

    it('should reject webhook for unregistered device', async () => {
      const payloadWithUnknownDevice = {
        ...VALID_PAYLOAD,
        data: {
          ...VALID_PAYLOAD.data,
          device_id: 'dev_unknown_999',
        },
      };

      const signature = createSignature(payloadWithUnknownDevice);
      const timestamp = Date.now().toString();

      return request(app.getHttpServer())
        .post('/integrations/scales/webhooks/vendor')
        .set('x-webhook-signature', signature)
        .set('x-webhook-timestamp', timestamp)
        .send(payloadWithUnknownDevice)
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('rejected');
          expect(res.body.message).toContain('Device not registered');
        });
    });
  });
});
