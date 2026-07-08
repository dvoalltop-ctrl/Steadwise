import type { BaseRecord } from './common';

export type HomesteadType =
  | 'garden'
  | 'chickens'
  | 'goats'
  | 'ducks'
  | 'bees'
  | 'pantry'
  | 'rabbits'
  | 'cattle'
  | 'other';

export interface Household extends BaseRecord {
  name: string;
  slug: string | null;
  timezone: string;
  latitude: number | null;
  longitude: number | null;
  homesteadTypes: HomesteadType[];
  settings: Record<string, unknown>;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface Membership extends BaseRecord {
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  acceptedAt: string | null;
}
