import type { SQLiteDatabase } from 'expo-sqlite';
import type { SyncOperation } from '@/sync/sync-queue';
import { syncQueueRepository } from '@/lib/db/repositories/sync-queue.repository';
import { toBaseRecordFields } from '@/lib/db/utils';

export { nowIso } from '@/lib/db/utils';

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
  void db;
  await syncQueueRepository.enqueue(params);
}

export async function loadSyncQueueFromDb(db: SQLiteDatabase): Promise<void> {
  void db;
  await syncQueueRepository.loadIntoMemory();
}

export async function removeSyncQueueItem(db: SQLiteDatabase, id: string): Promise<void> {
  void db;
  await syncQueueRepository.remove(id);
}

/** Maps SQLite row → domain BaseRecord fields (reads sync_status column). */
export function mapBaseRecord(row: Record<string, unknown>) {
  return toBaseRecordFields(row);
}
