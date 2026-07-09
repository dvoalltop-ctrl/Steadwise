import { v4 as uuidv4 } from 'uuid';
import type { SyncStatus } from '@/types';

/** Client-generated stable IDs (UUID v4). */
export function generateId(): string {
  return uuidv4();
}

export function nowIso(): string {
  return new Date().toISOString();
}

export type SyncMetadata = {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  syncStatus: SyncStatus;
  lastSyncedAt: string | null;
};

export function freshSyncMetadata(at = nowIso()): SyncMetadata {
  return {
    createdAt: at,
    updatedAt: at,
    deletedAt: null,
    syncStatus: 'pending',
    lastSyncedAt: null,
  };
}

/**
 * Maps snake_case SQLite columns to app sync metadata.
 * Supports legacy `local_sync_status` during transition.
 */
export function mapSyncMetadata(row: Record<string, unknown>): SyncMetadata & { id: string; householdId?: string } {
  const syncStatus =
    (row.sync_status as SyncStatus | undefined) ??
    (row.local_sync_status as SyncStatus | undefined) ??
    'pending';

  return {
    id: row.id as string,
    householdId: row.household_id as string | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    deletedAt: (row.deleted_at as string) ?? null,
    syncStatus,
    lastSyncedAt: (row.last_synced_at as string) ?? null,
  };
}

/** Maps sync metadata to BaseRecord.localSyncStatus for existing domain types. */
export function toBaseRecordFields(
  row: Record<string, unknown>,
  householdId?: string
) {
  const meta = mapSyncMetadata(row);
  return {
    id: meta.id,
    householdId: householdId ?? meta.householdId ?? '',
    createdBy: (row.created_by as string) ?? null,
    createdAt: meta.createdAt,
    updatedAt: meta.updatedAt,
    deletedAt: meta.deletedAt,
    localSyncStatus: meta.syncStatus,
    lastSyncedAt: meta.lastSyncedAt,
  };
}
