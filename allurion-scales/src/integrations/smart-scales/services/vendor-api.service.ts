import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VendorPayload, VendorAuthConfig, VendorSyncResponse } from '../interfaces/vendor-payload.interface';

/**
 * Vendor API Service
 * Handles communication with scale vendor's REST API for polling
 * Implements adapter pattern to support multiple vendors
 */
@Injectable()
export class VendorApiService {
  private readonly logger = new Logger(VendorApiService.name);
  private readonly config: VendorAuthConfig;
  private accessToken?: string;
  private tokenExpiresAt?: Date;

  constructor(private configService: ConfigService) {
    this.config = {
      clientId: this.configService.get<string>('VENDOR_CLIENT_ID')!,
      clientSecret: this.configService.get<string>('VENDOR_CLIENT_SECRET')!,
      tokenUrl: this.configService.get<string>('VENDOR_TOKEN_URL')!,
      baseUrl: this.configService.get<string>('VENDOR_API_BASE_URL')!,
      webhookSecret: this.configService.get<string>('VENDOR_WEBHOOK_SECRET')!,
    };
  }

  /**
   * Fetch new readings from vendor API since last sync
   * Supports pagination via cursor
   */
  async fetchReadings(
    userId: string,
    since?: Date,
    cursor?: string,
    limit: number = 100,
  ): Promise<VendorSyncResponse> {
    try {
      const token = await this.getAccessToken();

      const params = new URLSearchParams({
        user_id: userId,
        limit: limit.toString(),
      });

      if (since) {
        params.append('start_date', since.toISOString());
      }

      if (cursor) {
        params.append('cursor', cursor);
      }

      const url = `${this.config.baseUrl}/measurements?${params.toString()}`;

      this.logger.debug(`Fetching readings from: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Vendor API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      return {
        nextCursor: data.next_cursor,
        hasMore: data.has_more ?? false,
        readings: data.measurements || [],
      };
    } catch (error) {
      this.logger.error(`Failed to fetch readings: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get device info from vendor
   */
  async getDeviceInfo(deviceId: string): Promise<any> {
    try {
      const token = await this.getAccessToken();
      const url = `${this.config.baseUrl}/devices/${deviceId}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Vendor API error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      this.logger.error(`Failed to get device info: ${error.message}`);
      throw error;
    }
  }

  /**
   * List all devices for a user
   */
  async listUserDevices(userId: string): Promise<any[]> {
    try {
      const token = await this.getAccessToken();
      const url = `${this.config.baseUrl}/users/${userId}/devices`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Vendor API error: ${response.status}`);
      }

      const data = await response.json();
      return data.devices || [];
    } catch (error) {
      this.logger.error(`Failed to list devices: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get OAuth2 access token
   * Caches token until expiration
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && this.tokenExpiresAt && new Date() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    try {
      const response = await fetch(this.config.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token request failed: ${response.status}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;

      // Set expiration time (use expires_in or default to 1 hour)
      const expiresIn = data.expires_in || 3600;
      this.tokenExpiresAt = new Date(Date.now() + (expiresIn - 300) * 1000); // Refresh 5 min early

      this.logger.debug('Obtained new access token');
      return this.accessToken;
    } catch (error) {
      this.logger.error(`Failed to get access token: ${error.message}`);
      throw error;
    }
  }

  /**
   * Refresh access token (force)
   */
  async refreshAccessToken(): Promise<void> {
    this.accessToken = undefined;
    this.tokenExpiresAt = undefined;
    await this.getAccessToken();
  }
}
