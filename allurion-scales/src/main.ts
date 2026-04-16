import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { SmartScalesModule } from './integrations/smart-scales/smart-scales.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const app = await NestFactory.create(SmartScalesModule);
  
  const configService = app.get(ConfigService);
  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // CORS for mobile app
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGINS')?.split(',') || '*',
    credentials: true,
  });

  // Swagger/OpenAPI docs
  const config = new DocumentBuilder()
    .setTitle('Allurion Smart Scale Integration')
    .setDescription('Production API for automated scale data ingestion')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Integrations - Smart Scales', 'Vendor webhook endpoints')
    .addTag('Devices', 'Device management APIs')
    .addTag('Readings', 'Measurement reading queries')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  
  logger.log(`🚀 Application running on port ${port}`);
  logger.log(`📖 Swagger UI: http://localhost:${port}/api/docs`);
}

bootstrap();
