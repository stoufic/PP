import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'crypto';
import { Request } from 'express';

@Injectable()
export class WebhookSignatureGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const signature = request.headers['x-webhook-signature'] as string;
    const timestamp = request.headers['x-webhook-timestamp'] as string;

    if (!signature || !timestamp) {
      throw new UnauthorizedException('Missing webhook signature or timestamp');
    }

    // Check timestamp freshness (5 minute window)
    const now = Date.now();
    const webhookTime = parseInt(timestamp, 10);
    const maxAge = 5 * 60 * 1000; // 5 minutes

    if (isNaN(webhookTime) || Math.abs(now - webhookTime) > maxAge) {
      throw new UnauthorizedException('Webhook timestamp expired or invalid');
    }

    // Verify signature
    const secret = this.configService.get<string>('VENDOR_WEBHOOK_SECRET');
    if (!secret) {
      throw new UnauthorizedException('Webhook secret not configured');
    }

    const payload = JSON.stringify(request.body);
    const expectedSignature = this.createSignature(payload, timestamp, secret);

    if (!this.verifySignature(signature, expectedSignature)) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    return true;
  }

  private createSignature(payload: string, timestamp: string, secret: string): string {
    const signedPayload = `${timestamp}.${payload}`;
    return createHmac('sha256', secret).update(signedPayload).digest('hex');
  }

  private verifySignature(provided: string, expected: string): boolean {
    // Use timing-safe comparison to prevent timing attacks
    const providedBuf = Buffer.from(provided, 'hex');
    const expectedBuf = Buffer.from(expected, 'hex');

    if (providedBuf.length !== expectedBuf.length) {
      return false;
    }

    return timingSafeEqual(providedBuf, expectedBuf);
  }
}
