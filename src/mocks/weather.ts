import type { WeatherSnapshot } from '@/types';
import { DEMO_HOUSEHOLD_ID, DEMO_USER_ID } from './household';

export const mockWeather: WeatherSnapshot = {
  id: 'weather-001',
  householdId: DEMO_HOUSEHOLD_ID,
  propertyId: null,
  observedAt: new Date().toISOString(),
  tempF: 78,
  tempC: 26,
  conditions: 'Partly cloudy',
  forecastJson: JSON.stringify([
    { day: 'Today', high: 82, low: 64, conditions: 'Partly cloudy' },
    { day: 'Tomorrow', high: 85, low: 66, conditions: 'Sunny' },
    { day: 'Friday', high: 79, low: 62, conditions: 'Chance of rain' },
  ]),
  provider: 'mock',
  createdBy: DEMO_USER_ID,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  localSyncStatus: 'synced',
  lastSyncedAt: null,
};
