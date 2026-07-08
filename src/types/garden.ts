import type { BaseRecord } from './common';
import type { Season } from './task';

export type AreaType = 'bed' | 'plot' | 'paddock' | 'coop' | 'barn' | 'greenhouse' | 'other';
export type CropType = 'vegetable' | 'fruit' | 'herb' | 'flower' | 'grain' | 'other';
export type PlantingStatus = 'planned' | 'active' | 'harvesting' | 'finished' | 'failed';
export type HarvestDestination = 'pantry' | 'preserved' | 'sold' | 'fed' | 'compost';

export interface Area extends BaseRecord {
  propertyId: string | null;
  name: string;
  areaType: AreaType;
  description: string | null;
  sortOrder: number;
  metadata: Record<string, unknown>;
}

export interface CropVariety extends BaseRecord {
  commonName: string;
  varietyName: string;
  cropType: CropType;
  daysToMaturity: number | null;
  spacingNotes: string | null;
}

export interface Planting extends BaseRecord {
  areaId: string;
  varietyId: string;
  plantedOn: string;
  expectedHarvestStart: string | null;
  status: PlantingStatus;
  quantity: number;
  successionGroup: string | null;
  notes: string | null;
}

export interface Harvest extends BaseRecord {
  plantingId: string | null;
  varietyId: string;
  harvestedOn: string;
  quantity: number;
  unit: string;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  destination: HarvestDestination;
  notes: string | null;
}

export interface CropRotationEntry extends BaseRecord {
  areaId: string;
  varietyId: string;
  seasonYear: number;
  season: Season;
}
