import type { AnimalGroup, AnimalLog } from '@/types';
import { DEMO_HOUSEHOLD_ID, DEMO_USER_ID } from './household';

const base = {
  householdId: DEMO_HOUSEHOLD_ID,
  createdBy: DEMO_USER_ID,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null as string | null,
  localSyncStatus: 'synced' as const,
  lastSyncedAt: null as string | null,
};

export const mockAnimalGroups: AnimalGroup[] = [
  {
    ...base,
    id: 'group-001',
    species: 'chicken',
    name: 'Laying Flock',
    areaId: null,
    count: 6,
    breed: 'Rhode Island Red mix',
    acquiredOn: '2025-03-10',
    status: 'active',
  },
];

const today = new Date().toISOString();

export const mockAnimalLogs: AnimalLog[] = [
  {
    ...base,
    id: 'alog-001',
    animalId: null,
    groupId: 'group-001',
    logType: 'production',
    loggedAt: today,
    quantity: 5,
    unit: 'eggs',
    notes: 'Morning collection',
    metadata: {},
  },
  {
    ...base,
    id: 'alog-002',
    animalId: null,
    groupId: 'group-001',
    logType: 'feeding',
    loggedAt: today,
    quantity: null,
    unit: null,
    notes: 'Layer pellets, 2 scoops',
    metadata: { feedType: 'layer-pellets' },
  },
  {
    ...base,
    id: 'alog-003',
    animalId: null,
    groupId: 'group-001',
    logType: 'production',
    loggedAt: new Date(Date.now() - 86400000).toISOString(),
    quantity: 4,
    unit: 'eggs',
    notes: null,
    metadata: {},
  },
];
