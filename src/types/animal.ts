import type { BaseRecord } from './common';

export type AnimalSpecies = 'chicken' | 'goat' | 'duck' | 'rabbit' | 'bee' | 'other';
export type AnimalStatus = 'active' | 'sold' | 'deceased' | 'archived';
export type AnimalLogType = 'health' | 'feeding' | 'production' | 'breeding' | 'weight' | 'note';

export interface AnimalGroup extends BaseRecord {
  species: AnimalSpecies;
  name: string;
  areaId: string | null;
  count: number;
  breed: string | null;
  acquiredOn: string | null;
  status: AnimalStatus;
}

export interface Animal extends BaseRecord {
  groupId: string | null;
  name: string | null;
  tagId: string | null;
  sex: 'male' | 'female' | 'unknown';
  birthDate: string | null;
  status: AnimalStatus;
}

export interface AnimalLog extends BaseRecord {
  animalId: string | null;
  groupId: string | null;
  logType: AnimalLogType;
  loggedAt: string;
  quantity: number | null;
  unit: string | null;
  notes: string | null;
  metadata: Record<string, unknown>;
}
