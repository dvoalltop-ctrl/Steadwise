import type { WeatherSnapshot } from '@/types';
import { DEMO_HOUSEHOLD_ID, DEMO_USER_ID } from './household';

export const mockWeather: WeatherSnapshot = {
  id: 'weather-001',
  householdId: DEMO_HOUSEHOLD_ID,
  propertyId: null,
  observedAt: new Date().toISOString(),
  tempF: 62,
  tempC: 17,
  conditions: 'Partly cloudy',
  forecastJson: JSON.stringify([
    { day: 'Today', high: 68, low: 52, conditions: 'Partly cloudy' },
    { day: 'Tomorrow', high: 88, low: 64, conditions: 'Sunny' },
    { day: 'Friday', high: 71, low: 38, conditions: 'Chance of frost overnight' },
  ]),
  provider: 'mock',
  createdBy: DEMO_USER_ID,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  localSyncStatus: 'synced',
  lastSyncedAt: null,
  alerts: [
    {
      type: 'rain',
      message: '40% chance of rain this afternoon — good day to skip watering.',
      severity: 'info',
    },
    {
      type: 'heat',
      message: 'Heat advisory tomorrow (88°F) — check animal waterers.',
      severity: 'warning',
    },
    {
      type: 'frost',
      message: 'Possible frost Friday night — cover tender crops.',
      severity: 'warning',
    },
  ],
};
