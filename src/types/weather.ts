import type { BaseRecord } from './common';

export type WeatherAlertType = 'frost' | 'heat' | 'rain';

export interface WeatherAlert {
  type: WeatherAlertType;
  message: string;
  severity: 'info' | 'warning';
}

export interface WeatherSnapshot extends BaseRecord {
  propertyId: string | null;
  observedAt: string;
  tempF: number;
  tempC: number;
  conditions: string;
  forecastJson: string | null;
  provider: string;
  alerts?: WeatherAlert[];
}
