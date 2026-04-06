import { Injectable, Logger } from '@nestjs/common';
import { VendorPayload, VendorMeasurements } from '../interfaces/vendor-payload.interface';

export interface NormalizedReading {
  weightKg?: number;
  bmi?: number;
  bodyFatPct?: number;
  muscleMassKg?: number;
  waterPct?: number;
  boneMassKg?: number;
  visceralFat?: number;
  bmrKcal?: number;
  metabolicAge?: number;
  measuredAt: Date;
  receivedAt: Date;
}

@Injectable()
export class NormalizationService {
  private readonly logger = new Logger(NormalizationService.name);

  /**
   * Normalize vendor payload into internal schema
   * Handles unit conversions and validates ranges
   */
  normalize(payload: VendorPayload): NormalizedReading {
    const measurements = payload.measurements;
    const now = new Date();

    // Convert weight to kg if needed
    let weightKg = measurements.weight_kg;
    if (!weightKg && measurements.weight_lb) {
      weightKg = this.lbToKg(measurements.weight_lb);
      this.logger.debug(`Converted ${measurements.weight_lb} lb to ${weightKg} kg`);
    }

    // Validate and clamp values to safe ranges
    const normalized: NormalizedReading = {
      weightKg: this.clamp(weightKg, 20, 300),
      bmi: this.clamp(measurements.bmi, 10, 60),
      bodyFatPct: this.clamp(measurements.body_fat_pct, 0, 100),
      muscleMassKg: this.clamp(measurements.muscle_mass_kg, 0, 200),
      waterPct: this.clamp(measurements.water_pct, 0, 100),
      boneMassKg: this.clamp(measurements.bone_mass_kg, 0, 20),
      visceralFat: this.clamp(measurements.visceral_fat, 0, 30),
      bmrKcal: this.clamp(measurements.bmr_kcal, 500, 5000),
      metabolicAge: this.clamp(measurements.metabolic_age, 0, 120),
      measuredAt: this.parseTimestamp(payload.measured_at),
      receivedAt: now,
    };

    this.logger.debug(`Normalized reading: weight=${normalized.weightKg}kg, bmi=${normalized.bmi}`);

    return normalized;
  }

  /**
   * Convert pounds to kilograms
   */
  lbToKg(lb: number): number {
    return lb * 0.45359237;
  }

  /**
   * Convert kilograms to pounds
   */
  kgToLb(kg: number): number {
    return kg * 2.20462;
  }

  /**
   * Parse ISO 8601 timestamp safely
   */
  private parseTimestamp(timestamp: string): Date {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid timestamp: ${timestamp}`);
    }
    return date;
  }

  /**
   * Clamp value to min/max range, return null if input is null/undefined
   */
  private clamp(value: number | undefined, min: number, max: number): number | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    if (isNaN(value)) {
      return undefined;
    }

    return Math.min(Math.max(value, min), max);
  }

  /**
   * Validate that a reading has at least weight (minimum viable data)
   */
  isValidReading(normalized: NormalizedReading): boolean {
    return normalized.weightKg !== undefined && normalized.weightKg > 0;
  }
}
