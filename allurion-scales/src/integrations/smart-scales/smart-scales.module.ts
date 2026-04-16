import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../../prisma/prisma.module'; // Adjust path as needed
import { WebhookController } from './controllers/webhook.controller';
import { DeviceController } from './controllers/device.controller';
import { ReadingsController } from './controllers/readings.controller';
import { WebhookService } from './services/webhook.service';
import { DeviceService } from './services/device.service';
import { ReadingsService } from './services/readings.service';
import { NormalizationService } from './services/normalization.service';
import { VendorApiService } from './services/vendor-api.service';
import { SyncService } from './services/sync.service';

@Module({
  imports: [
    HttpModule,
    PrismaModule, // Your existing Prisma module
  ],
  controllers: [
    WebhookController,
    DeviceController,
    ReadingsController,
  ],
  providers: [
    WebhookService,
    DeviceService,
    ReadingsService,
    NormalizationService,
    VendorApiService,
    SyncService,
  ],
  exports: [
    WebhookService,
    DeviceService,
    ReadingsService,
    NormalizationService,
    VendorApiService,
    SyncService,
  ],
})
export class SmartScalesModule {}
