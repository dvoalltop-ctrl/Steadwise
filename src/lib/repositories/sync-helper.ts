import type { SQLiteDatabase } from 'expo-sqlite';
import type { SyncOperation } from '@/sync/sync-queue';
import { syncQueue } from '@/sync/sync-queue';

export function nowIso(): string {
  return new Date().toISOString();
}

export async function enqueueSync(
  db: SQLiteDatabase,
  params: {
    householdId: string;
    entityType: string;
    entityId: string;
    operation: SyncOperation;
    payload: Record<string, unknown>;
  }
): Promise<void> {
  const createdAt = nowIso();
  const id = `sync-${params.entityType}-${params.entityId}-${createdAt}`;

  const item = {
    id,
    householdId: params.householdId,
    entityType: params.entityType,
    entityId: params.entityId,
    operation: params.operation,
    payload: JSON.stringify(params.payload),
    createdAt,
  };

  syncQueue.enqueue(item);

  await db.runAsync(
    `INSERT OR REPLACE INTO sync_queue
      (id, household_id, entity_type, entity_id, operation, payload, created_at, retry_count, last_error)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0, NULL)`,
    [
      item.id,
      item.householdId,
      item.entityType,
      item.entityId,
      item.operation,
      item.payload,
      item.createdAt,
    ]
  );
}

export async function loadSyncQueueFromDb(db: SQLiteDatabase): Promise<void> {
  const rows = await db.getAllAsync<{
    id: string;
    household_id: string;
    entity_type: string;
    entity_id: string;
    operation: SyncOperation;
    payload: string;
    created_at: string;
    retry_count: number;
    last_error: string | null;
  }>(`SELECT * FROM sync_queue ORDER BY created_at ASC`);

  syncQueue.clear();
  for (const row of rows) {
    syncQueue.enqueue({
      id: row.id,
      householdId: row.household_id,
      entityType: row.entity_type,
      entityId: row.entity_id,
      operation: row.operation,
      payload: row.payload,
      createdAt: row.created_at,
    });
    if (row.retry_count > 0) {
      syncQueue.markFailed(row.id, row.last_error ?? 'Unknown error');
    }
  }
}

export async function removeSyncQueueItem(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync(`DELETE FROM sync_queue WHERE id = ?`, [id]);
}

export function mapBaseRecord(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    householdId: row.household_id as string,
    createdBy: (row.created_by as string) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    deletedAt: (row.deleted_at as string) ?? null,
    localSyncStatus: row.local_sync_status as 'synced' | 'pending' | 'conflict' | 'error',
    lastSyncedAt: (row.last_synced_at as string) ?? null,
  };
}
