import type { SQLiteDatabase } from 'expo-sqlite';
import type { SyncOperation } from '@/sync/sync-queue';
import { syncQueue } from '@/sync/sync-queue';
import { getDatabase } from '../client';
import { TABLES } from '../schema';
import { generateId, nowIso } from '../utils';

export interface SyncQueueRow {
  id: string;
  householdId: string;
  entityType: string;
  entityId: string;
  operation: SyncOperation;
  payload: string;
  createdAt: string;
  retryCount: number;
  lastError: string | null;
}

/**
 * Persists outbound mutations for a future sync worker.
 * Not connected to Supabase — queue rows are local-only until sync is enabled.
 */
export const syncQueueRepository = {
  async enqueue(params: {
    householdId: string;
    entityType: string;
    entityId: string;
    operation: SyncOperation;
    payload: Record<string, unknown>;
  }): Promise<string> {
    const db = await getDatabase();
    const createdAt = nowIso();
    const id = generateId();

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
      `INSERT OR REPLACE INTO ${TABLES.syncQueue}
        (id, household_id, entity_type, entity_id, operation, payload, created_at, retry_count, last_error)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, NULL)`,
      [item.id, item.householdId, item.entityType, item.entityId, item.operation, item.payload, item.createdAt]
    );

    return id;
  },

  async loadIntoMemory(): Promise<void> {
    const db = await getDatabase();
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
    }>(`SELECT * FROM ${TABLES.syncQueue} ORDER BY created_at ASC`);

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
  },

  async remove(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(`DELETE FROM ${TABLES.syncQueue} WHERE id = ?`, [id]);
  },

  async markFailed(id: string, error: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE ${TABLES.syncQueue} SET retry_count = retry_count + 1, last_error = ? WHERE id = ?`,
      [error, id]
    );
  },

  async listAll(): Promise<SyncQueueRow[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM ${TABLES.syncQueue} ORDER BY created_at ASC`
    );
    return rows.map((row) => ({
      id: row.id as string,
      householdId: row.household_id as string,
      entityType: row.entity_type as string,
      entityId: row.entity_id as string,
      operation: row.operation as SyncOperation,
      payload: row.payload as string,
      createdAt: row.created_at as string,
      retryCount: row.retry_count as number,
      lastError: (row.last_error as string) ?? null,
    }));
  },
};

/** Hydrate in-memory sync queue after database init. */
export async function hydrateSyncQueue(db: SQLiteDatabase): Promise<void> {
  void db;
  await syncQueueRepository.loadIntoMemory();
}
