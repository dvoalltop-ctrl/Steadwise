import type { GeoLocation } from '@/types';
import type { WeatherSnapshot } from '@/types';

export interface WeatherForecast {
  day: string;
  high: number;
  low: number;
  conditions: string;
}

export interface WeatherProvider {
  getCurrent(location: GeoLocation): Promise<WeatherSnapshot>;
  getForecast(location: GeoLocation, days: number): Promise<WeatherForecast[]>;
}

/** NWS provider stub — implement in Phase E. */
export class NWSWeatherProvider implements WeatherProvider {
  async getCurrent(_location: GeoLocation): Promise<WeatherSnapshot> {
    throw new Error('NWS weather integration not yet implemented');
  }

  async getForecast(_location: GeoLocation, _days: number): Promise<WeatherForecast[]> {
    throw new Error('NWS weather integration not yet implemented');
  }
}
