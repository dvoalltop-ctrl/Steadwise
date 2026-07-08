import type { BaseRecord } from './common';

export interface WeatherSnapshot extends BaseRecord {
  propertyId: string | null;
  observedAt: string;
  tempF: number;
  tempC: number;
  conditions: string;
  forecastJson: string | null;
  provider: string;
}
