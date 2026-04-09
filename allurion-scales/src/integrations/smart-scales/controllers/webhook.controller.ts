import {
  Controller,
  Post,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { WebhookEventDto, WebhookResponseDto } from '../dto/webhook.dto';
import { WebhookService } from '../services/webhook.service';
import { WebhookSignatureGuard } from '../guards/webhook-signature.guard';

@ApiTags('Integrations - Smart Scales')
@Controller('integrations/scales/webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private webhookService: WebhookService) {}

  @Post('/vendor')
  @UseGuards(WebhookSignatureGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Receive scale measurement webhooks from vendor',
    description: 'Endpoint for scale vendor to send measurement updates. Requires valid signature.',
  })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'x-webhook-signature',
    required: true,
    description: 'HMAC-SHA256 signature of the payload',
  })
  @ApiHeader({
    name: 'x-webhook-timestamp',
    required: true,
    description: 'Unix timestamp in milliseconds',
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook received and processed',
    type: WebhookResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid or missing signature' })
  @ApiResponse({ status: 400, description: 'Invalid payload' })
  async handleWebhook(
    @Body() webhookData: WebhookEventDto,
    @Headers('x-webhook-signature') signature: string,
  ): Promise<WebhookResponseDto> {
    this.logger.log(`Received webhook event: ${webhookData.event_id} (${webhookData.event_type})`);

    try {
      const result = await this.webhookService.processWebhook(
        webhookData.data,
        signature,
        'WITHINGS',
      );

      if (result.status === 'duplicate') {
        return {
          status: 'duplicate',
          event_id: result.eventId,
          message: result.message,
        };
      }

      if (result.status === 'rejected') {
        return {
          status: 'rejected',
          message: result.message,
        };
      }

      return {
        status: 'received',
        event_id: result.eventId,
      };
    } catch (error) {
      this.logger.error(`Webhook processing failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}
