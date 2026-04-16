/**
 * Vendor Payload Interfaces
 * Defines the contract for scale vendor data formats
 * Adapter pattern allows swapping vendors without changing core logic
 */

export interface VendorPayload {
  /** Unique identifier for this reading event from vendor */
  event_id: string;
  /** Vendor's user identifier */
  user_id: string;
  /** Vendor's device identifier */
  device_id: string;
  /** Timestamp when measurement was taken (ISO 8601) */
  measured_at: string;
  /** Optional: when vendor processed this */
  processed_at?: string;
  /** Measurement data */
  measurements: VendorMeasurements;
  /** Raw vendor metadata */
  metadata?: Record<string, unknown>;
}

export interface VendorMeasurements {
  /** Weight in kilograms */
  weight_kg?: number;
  /** Weight in pounds (if vendor uses imperial) */
  weight_lb?: number;
  /** Body Mass Index */
  bmi?: number;
  /** Body fat percentage (0-100) */
  body_fat_pct?: number;
  /** Muscle mass in kilograms */
  muscle_mass_kg?: number;
  /** Water percentage (0-100) */
  water_pct?: number;
  /** Bone mass in kilograms */
  bone_mass_kg?: number;
  /** Visceral fat rating */
  visceral_fat?: number;
  /** Basal metabolic rate in kcal */
  bmr_kcal?: number;
  /** Metabolic age in years */
  metabolic_age?: number;
  /** Heart rate if available */
  heart_rate_bpm?: number;
  /** Additional vendor-specific metrics */
  custom?: Record<string, number | string>;
}

export interface VendorWebhookPayload {
  /** Webhook event type */
  event_type: 'measurement.created' | 'measurement.updated' | 'device.registered';
  /** Event timestamp */
  timestamp: string;
  /** Unique event ID for idempotency */
  event_id: string;
  /** The actual data */
  data: VendorPayload;
  /** Webhook signature for verification */
  signature?: string;
}

export interface VendorAuthConfig {
  /** OAuth2 client ID */
  clientId: string;
  /** OAuth2 client secret */
  clientSecret: string;
  /** OAuth2 token endpoint */
  tokenUrl: string;
  /** API base URL */
  baseUrl: string;
  /** Webhook secret for signature verification */
  webhookSecret: string;
}

export interface VendorSyncResponse {
  /** Cursor for pagination */
  nextCursor?: string;
  /** Whether more data exists */
  hasMore: boolean;
  /** Readings fetched */
  readings: VendorPayload[];
}
