import type { SQLiteDatabase } from 'expo-sqlite';
import { getDatabase } from '@/lib/db/client';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { removeSyncQueueItem } from '@/lib/repositories/sync-helper';
import { syncQueue } from '@/sync/sync-queue';
import { shouldSkipPush } from '@/sync/conflict-resolver';
import { useSyncStore } from '@/sync/sync-state';

const SYNCABLE_TABLES = [
  'tasks', 'garden_areas', 'plantings', 'harvests',
  'animal_groups', 'animal_logs', 'pantry_items', 'finance_transactions',
  'households', 'notes',
] as const;

export class SyncWorker {
  constructor(private db: SQLiteDatabase) {}

  static async create(): Promise<SyncWorker> {
    return new SyncWorker(await getDatabase());
  }

  async pushAll(): Promise<{ pushed: number; failed: number }> {
    if (!isSupabaseConfigured) {
      useSyncStore.getState().setStatus('offline');
      return { pushed: 0, failed: 0 };
    }

    const supabase = getSupabase();
    if (!supabase) return { pushed: 0, failed: 0 };

    useSyncStore.getState().setStatus('syncing');
    let pushed = 0;
    let failed = 0;

    while (syncQueue.size() > 0) {
      const item = syncQueue.peek();
      if (!item || shouldSkipPush(item)) {
        failed++;
        break;
      }

      const table = item.entityType;
      if (!SYNCABLE_TABLES.includes(table as typeof SYNCABLE_TABLES[number])) {
        syncQueue.dequeue();
        await removeSyncQueueItem(this.db, item.id);
        continue;
      }

      try {
        const payload = JSON.parse(item.payload);

        if (item.operation === 'delete') {
          const { error } = await supabase
            .from(table)
            .update({ deleted_at: payload.deletedAt ?? new Date().toISOString() })
            .eq('id', item.entityId);
          if (error) throw error;
        } else if (item.operation === 'insert') {
          const row = camelToSnake(payload);
          const { error } = await supabase.from(table).upsert(row);
          if (error) throw error;
        } else {
          const row = camelToSnake(payload);
          const { error } = await supabase.from(table).update(row).eq('id', item.entityId);
          if (error) throw error;
        }

        await this.db.runAsync(
          `UPDATE ${table} SET sync_status = 'synced', last_synced_at = ? WHERE id = ?`,
          [new Date().toISOString(), item.entityId]
        ).catch(() => {});

        syncQueue.dequeue();
        await removeSyncQueueItem(this.db, item.id);
        pushed++;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Sync failed';
        syncQueue.markFailed(item.id, message);
        await this.db.runAsync(
          `UPDATE sync_queue SET retry_count = retry_count + 1, last_error = ? WHERE id = ?`,
          [message, item.id]
        );
        useSyncStore.getState().setLastError(message);
        failed++;
        break;
      }
    }

    const now = new Date().toISOString();
    if (pushed > 0) {
      useSyncStore.getState().setLastPushAt(now);
      await this.db.runAsync(
        `INSERT OR REPLACE INTO sync_state (household_id, last_push_at) VALUES (?, ?)`,
        [syncQueue.peek()?.householdId ?? 'default', now]
      );
    }

    useSyncStore.getState().refreshPendingCount();
    useSyncStore.getState().setStatus(failed > 0 ? 'error' : 'idle');
    return { pushed, failed };
  }
}

export class PullService {
  constructor(private db: SQLiteDatabase) {}

  static async create(): Promise<PullService> {
    return new PullService(await getDatabase());
  }

  async pull(householdId: string): Promise<number> {
    if (!isSupabaseConfigured) return 0;

    const supabase = getSupabase();
    if (!supabase) return 0;

    const state = await this.db.getFirstAsync<{ last_pull_at: string | null }>(
      `SELECT last_pull_at FROM sync_state WHERE household_id = ?`,
      [householdId]
    );
    const since = state?.last_pull_at ?? '1970-01-01T00:00:00Z';
    let pulled = 0;

    for (const table of SYNCABLE_TABLES) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('household_id', householdId)
        .gt('updated_at', since);

      if (error || !data) continue;

      for (const row of data) {
        await upsertLocalRow(this.db, table, row as Record<string, unknown>);
        pulled++;
      }
    }

    const now = new Date().toISOString();
    await this.db.runAsync(
      `INSERT OR REPLACE INTO sync_state (household_id, last_pull_at) VALUES (?, ?)`,
      [householdId, now]
    );
    useSyncStore.getState().setLastPullAt(now);
    return pulled;
  }
}

function camelToSnake(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const snake = key.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`);
    result[snake] = value;
  }
  return result;
}

async function upsertLocalRow(
  db: SQLiteDatabase,
  table: string,
  row: Record<string, unknown>
): Promise<void> {
  const columns = Object.keys(row);
  const placeholders = columns.map(() => '?').join(', ');
  const updates = columns.map((c) => `${c} = excluded.${c}`).join(', ');
  await db.runAsync(
    `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})
     ON CONFLICT(id) DO UPDATE SET ${updates}`,
    columns.map((c) => {
      const val = row[c];
      return typeof val === 'object' && val !== null ? JSON.stringify(val) : val;
    }) as (string | number | null)[]
  );
}

export async function runSyncCycle(householdId: string): Promise<void> {
  const worker = await SyncWorker.create();
  const puller = await PullService.create();
  await worker.pushAll();
  await puller.pull(householdId);
  useSyncStore.getState().refreshPendingCount();
}
