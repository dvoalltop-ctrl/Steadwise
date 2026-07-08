export type SyncStatus = 'synced' | 'pending' | 'conflict' | 'error';

export type MembershipRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface BaseRecord {
  id: string;
  householdId: string;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  localSyncStatus: SyncStatus;
  lastSyncedAt: string | null;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}
