import type { Area, CropVariety, Planting, Harvest } from '@/types';
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

export const mockAreas: Area[] = [
  {
    ...base,
    id: 'area-001',
    propertyId: null,
    name: 'North Tomato Bed',
    areaType: 'bed',
    description: '8×4 raised bed, full sun',
    sortOrder: 1,
    metadata: { widthFt: 8, lengthFt: 4 },
  },
  {
    ...base,
    id: 'area-002',
    propertyId: null,
    name: 'Herb Spiral',
    areaType: 'bed',
    description: 'Perennial herbs',
    sortOrder: 2,
    metadata: {},
  },
  {
    ...base,
    id: 'area-003',
    propertyId: null,
    name: 'Back Plot',
    areaType: 'plot',
    description: 'Squash and corn',
    sortOrder: 3,
    metadata: {},
  },
];

export const mockVarieties: CropVariety[] = [
  {
    ...base,
    id: 'var-001',
    commonName: 'Tomato',
    varietyName: 'Cherokee Purple',
    cropType: 'vegetable',
    daysToMaturity: 80,
    spacingNotes: '24" apart',
  },
  {
    ...base,
    id: 'var-002',
    commonName: 'Basil',
    varietyName: 'Genovese',
    cropType: 'herb',
    daysToMaturity: 60,
    spacingNotes: '12" apart',
  },
  {
    ...base,
    id: 'var-003',
    commonName: 'Zucchini',
    varietyName: 'Black Beauty',
    cropType: 'vegetable',
    daysToMaturity: 50,
    spacingNotes: '36" apart',
  },
];

export const mockPlantings: Planting[] = [
  {
    ...base,
    id: 'plant-001',
    areaId: 'area-001',
    varietyId: 'var-001',
    plantedOn: '2026-05-15',
    expectedHarvestStart: '2026-07-20',
    status: 'harvesting',
    quantity: 6,
    successionGroup: null,
    notes: 'Staked with cattle panels',
  },
  {
    ...base,
    id: 'plant-002',
    areaId: 'area-002',
    varietyId: 'var-002',
    plantedOn: '2026-05-01',
    expectedHarvestStart: '2026-06-15',
    status: 'active',
    quantity: 4,
    successionGroup: null,
    notes: null,
  },
  {
    ...base,
    id: 'plant-003',
    areaId: 'area-003',
    varietyId: 'var-003',
    plantedOn: '2026-06-01',
    expectedHarvestStart: '2026-07-15',
    status: 'active',
    quantity: 3,
    successionGroup: 'summer-squash-1',
    notes: null,
  },
];

export const mockHarvests: Harvest[] = [
  {
    ...base,
    id: 'harv-001',
    plantingId: 'plant-001',
    varietyId: 'var-001',
    harvestedOn: new Date().toISOString().split('T')[0],
    quantity: 4.5,
    unit: 'lbs',
    quality: 'excellent',
    destination: 'pantry',
    notes: 'First big harvest of the week',
  },
  {
    ...base,
    id: 'harv-002',
    plantingId: 'plant-002',
    varietyId: 'var-002',
    harvestedOn: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    quantity: 2,
    unit: 'bunches',
    quality: 'good',
    destination: 'pantry',
    notes: null,
  },
];
