# Allurion Smart Scale Integration

Production-ready backend feature for automated ingestion of smart scale measurements into the Allurion health platform.

## 🏗 Architecture Overview

```
┌─────────────────┐      ┌─────────────────────────────────────┐
│  Smart Scale    │      │       Allurion Backend (NestJS)     │
│  Vendor Cloud   │      │                                     │
│                 │      │  ┌──────────────┐  ┌─────────────┐  │
│  ┌───────────┐  │      │  │ WebhookCtrl  │  │ DeviceCtrl  │  │
│  │  Webhooks │──┼──────┼─▶│              │  │             │  │
│  └───────────┘  │      │  └──────────────┘  └─────────────┘  │
│                 │      │  ┌──────────────┐  ┌─────────────┐  │
│  ┌───────────┐  │      │  │ ReadingsCtrl │  │ SyncService │  │
│  │ REST API  │──┼──────┼─▶│              │  │ (Polling)   │  │
│  └───────────┘  │      │  └──────────────┘  └─────────────┘  │
└─────────────────┘      └─────────────────────────────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │   PostgreSQL    │
                         │  - Devices      │
                         │  - Readings     │
                         │  - WebhookEvents│
                         │  - AuditLogs    │
                         └─────────────────┘
```

### Key Features

- **Webhook-first ingestion** with signature verification
- **Polling fallback** for reliability (scheduled every 15 min)
- **Idempotency protection** against duplicate events
- **Source attribution**: DEVICE_VENDOR, MANUAL_PATIENT, MANUAL_DOCTOR
- **HIPAA-aware design**: audit logs, no PHI in logs, encrypted secrets
- **Role-based access**: Patient (self), Doctor (assigned patients), Admin (all)
- **Immutable readings**: Medical data is append-only
- **Multi-vendor ready**: Adapter pattern supports swapping vendors

---

## 📁 Project Structure

```
src/
├── integrations/
│   └── smart-scales/
│       ├── smart-scales.module.ts
│       ├── controllers/
│       │   ├── webhook.controller.ts    # Vendor webhook endpoint
│       │   ├── device.controller.ts     # Device management APIs
│       │   └── readings.controller.ts   # Reading query APIs
│       ├── services/
│       │   ├── webhook.service.ts       # Webhook processing logic
│       │   ├── device.service.ts        # Device CRUD + assignments
│       │   ├── readings.service.ts      # Reading queries + creation
│       │   ├── normalization.service.ts # Unit conversion + validation
│       │   ├── vendor-api.service.ts    # Vendor REST API client
│       │   └── sync.service.ts          # Scheduled polling job
│       ├── dto/
│       │   ├── webhook.dto.ts           # Webhook payload validation
│       │   ├── device.dto.ts            # Device operation DTOs
│       │   └── readings.dto.ts          # Reading query DTOs
│       ├── guards/
│       │   ├── webhook-signature.guard.ts # HMAC signature verification
│       │   └── roles.guard.ts           # Role-based access control
│       ├── adapters/
│       │   └── vendor.adapter.ts        # (Optional) Vendor abstraction
│       └── interfaces/
│           └── vendor-payload.interface.ts # Vendor data contracts
├── prisma/
│   └── schema.prisma                    # Database schema
└── common/
    ├── decorators/
    │   └── roles.decorator.ts
    ├── filters/
    └── interceptors/
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- NestJS CLI (`npm i -g @nestjs/cli`)
- Prisma CLI (`npm i -g prisma`)

### 1. Install Dependencies

```bash
cd allurion-scales
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your vendor credentials and database URL
```

### 3. Set Up Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init_smart_scales

# (Optional) Seed demo data
npx prisma db seed
```

### 4. Run Locally

```bash
# Development mode
npm run start:dev

# Or with Docker (if you have docker-compose setup)
docker-compose up -d postgres
npm run start:dev
```

### 5. Test the APIs

Open Swagger UI: `http://localhost:3000/api/docs`

---

## 🔌 API Endpoints

### Webhooks

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/integrations/scales/webhooks/vendor` | Receive scale measurements from vendor | Signature |

### Devices

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/devices` | Register new device | Admin |
| GET | `/devices` | List all devices | Admin |
| GET | `/devices/:id` | Get device details | Admin, Doctor |
| POST | `/devices/:id/assign` | Assign to patient | Admin |
| POST | `/devices/:id/unassign` | Unassign from patient | Admin |
| GET | `/devices/:id/assignments` | Assignment history | Admin |

### Readings

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/readings/me` | My readings (patient) | Patient |
| GET | `/readings/patients/:patientId` | Patient readings (doctor) | Doctor, Admin |
| GET | `/readings/admin/all` | All readings | Admin |
| POST | `/readings/manual` | Create manual reading | Patient, Doctor |
| GET | `/readings/trend` | Trend summary | Patient |
| GET | `/readings/:id` | Single reading | Patient, Doctor, Admin |

---

## 📊 Data Models

### Device

```prisma
model Device {
  id              String         @id @default(uuid())
  deviceId        String         @unique // Vendor's ID
  serialNumber    String         @unique
  vendor          String         @default("WITHINGS")
  vendorUserId    String?
  firmwareVersion String?
  status          DeviceStatus   @default(PENDING)
  assignedPatientId String?
  assignedAt      DateTime?
  unassignedAt    DateTime?
  lastSyncedAt    DateTime?
  metadata        Json?
}
```

### MeasurementReading

```prisma
model MeasurementReading {
  id              String       @id @default(uuid())
  patientId       String
  deviceId        String?
  source          ReadingSource // DEVICE_VENDOR, MANUAL_PATIENT, MANUAL_DOCTOR
  weightKg        Float?
  bmi             Float?
  bodyFatPct      Float?
  muscleMassKg    Float?
  waterPct        Float?
  boneMassKg      Float?
  visceralFat     Float?
  bmrKcal         Float?
  metabolicAge    Float?
  measuredAt      DateTime
  receivedAt      DateTime
  rawPayload      Json         // Full vendor payload
  externalEventId String?      // For idempotency
  isCorrected     Boolean      @default(false)
}
```

### VendorWebhookEvent

```prisma
model VendorWebhookEvent {
  id              String   @id @default(uuid())
  externalEventId String   @unique
  vendor          String
  eventType       String
  payload         Json
  signature       String
  receivedAt      DateTime
  processedAt     DateTime?
  status          String   // PENDING, PROCESSED, FAILED, DUPLICATE
}
```

---

## 🔒 Security & Compliance

### HIPAA Considerations

- ✅ **Audit logging**: All critical actions logged with user + timestamp
- ✅ **No PHI in logs**: Structured logging excludes sensitive data
- ✅ **Encrypted secrets**: All credentials via environment variables
- ✅ **Access control**: Role-based permissions enforced
- ✅ **Data immutability**: Readings cannot be deleted, only corrected via admin workflow
- ✅ **Raw payload storage**: Full traceability for compliance audits

### Webhook Security

1. Vendor signs payload with HMAC-SHA256
2. Signature sent in `x-webhook-signature` header
3. Timestamp in `x-webhook-timestamp` (5-minute window)
4. Guard verifies signature before processing

```typescript
// Example webhook headers
x-webhook-signature: sha256=abc123...
x-webhook-timestamp: 1712419200000
```

---

## 🔄 Sync & Polling

### Scheduled Sync

- Runs every **15 minutes** via cron
- Fetches new readings for all active devices
- Respects rate limits with pagination
- Updates `lastSyncedAt` on success

### Manual Backfill

```typescript
// Trigger backfill for a date range
await syncService.backfillReadings(
  'device-id',
  new Date('2026-01-01'),
  new Date('2026-04-06'),
);
```

### Error Handling

- Exponential backoff on failures
- Failed events marked in `VendorWebhookEvent` table
- Retry queue for manual intervention
- Alerts on consecutive failures (integrate with monitoring)

---

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
# Start test database
docker-compose up -d postgres-test

# Run migrations
npx prisma migrate deploy --schema=prisma/test-schema.prisma

# Run tests
npm run test:e2e
```

### Test Coverage

Key scenarios covered:

- ✅ Successful webhook ingestion
- ✅ Invalid signature rejection
- ✅ Duplicate webhook idempotency
- ✅ Device assignment rules
- ✅ Access control by role
- ✅ Patient/doctor query access
- ✅ Normalization logic
- ✅ Polling sync behavior
- ✅ Malformed payload handling

---

## 📝 Vendor Integration Guide

### Adding a New Vendor (e.g., Fitbit)

1. **Create adapter** in `adapters/fitbit.adapter.ts`:

```typescript
export class FitbitAdapter implements VendorAdapter {
  normalize(payload: any): NormalizedReading {
    // Map Fitbit fields to internal schema
  }
}
```

2. **Update interfaces** if needed in `interfaces/`

3. **Add vendor-specific env vars**:

```bash
FITBIT_CLIENT_ID="..."
FITBIT_CLIENT_SECRET="..."
FITBIT_WEBHOOK_SECRET="..."
```

4. **Register in module**:

```typescript
providers: [
  { provide: 'VENDOR_ADAPTER', useClass: FitbitAdapter },
]
```

---

## 🛠 Troubleshooting

### Webhooks Not Arriving

1. Check vendor dashboard for webhook configuration
2. Verify public URL is accessible (ngrok for local dev)
3. Check logs for signature verification failures
4. Ensure clock synchronization (timestamp window)

### Sync Job Not Running

1. Verify `SYNC_ENABLED=true` in `.env`
2. Check cron expression in `sync.service.ts`
3. Review logs for `Starting scheduled sync...`
4. Ensure database connection is healthy

### Device Not Assigned

1. Check device status is `ACTIVE`
2. Verify patient exists in `PatientProfile`
3. Review assignment history via `/devices/:id/assignments`
4. Check audit logs for assignment attempts

---

## 📈 Monitoring & Observability

### Key Metrics to Track

- Webhook events received/processed/failed
- Average processing time per webhook
- Sync job duration and success rate
- Readings ingested per day
- Active devices count
- API response times (p95, p99)

### Log Queries (CloudWatch example)

```sql
-- Failed webhooks in last 24h
fields @timestamp, message
| filter status == "FAILED"
| sort @timestamp desc
| limit 100

-- Sync job performance
fields @timestamp, duration
| filter operation == "scheduled_sync"
| stats avg(duration), max(duration) by bin(1h)
```

---

## 🚀 Deployment

### Environment Variables (Production)

Ensure these are set in your deployment environment:

- `DATABASE_URL` (use AWS RDS or managed Postgres)
- `VENDOR_*` credentials from your vendor dashboard
- `JWT_SECRET` (use secure random generation)
- `AWS_*` for S3/CloudWatch integration

### Migration Deployment

```bash
# Production migration
npx prisma migrate deploy

# Verify
npx prisma db pull
```

### Health Checks

Add these endpoints to your load balancer:

- `GET /health` - Basic health check
- `GET /health/db` - Database connectivity
- `GET /health/vendor` - Vendor API connectivity

---

## 📋 Checklist for Go-Live

- [ ] Vendor OAuth credentials configured
- [ ] Webhook endpoint publicly accessible
- [ ] Webhook secret exchanged with vendor
- [ ] Database migrations applied
- [ ] Initial device registration completed
- [ ] Sync job enabled and verified
- [ ] Monitoring/alerting configured
- [ ] Backup strategy in place
- [ ] Rollback plan documented
- [ ] Team trained on admin workflows

---

## 🤝 Support

For issues or questions:

- Check existing issues in the repository
- Review vendor API documentation
- Contact the platform team

---

**Built with ❤️ for Allurion** | Version 1.0.0 | April 2026
