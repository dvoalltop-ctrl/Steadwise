import type { SQLiteDatabase } from 'expo-sqlite';
import type { SupabaseClient } from '@supabase/supabase-js';
import * as Network from 'expo-network';

import { getUnsyncedTasks, markTasksSynced } from '@/src/lib/db/tasks';
import { countUnsyncedRecords, getSyncState, setSyncState } from '@/src/lib/db/sync-state';
import { nowIso } from '@/src/lib/uuid';

export type SyncStatus = 'idle' | 'offline' | 'skipped' | 'success' | 'error';

export interface SyncResult {
  status: SyncStatus;
  pushed: number;
  pulled: number;
  message?: string;
}

async function isOnline(): Promise<boolean> {
  const state = await Network.getNetworkStateAsync();
  return Boolean(state.isConnected && state.isInternetReachable !== false);
}

async function pushTasks(
  db: SQLiteDatabase,
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const unsynced = await getUnsyncedTasks(db);
  if (unsynced.length === 0) {
    return 0;
  }

  const payload = unsynced.map((task) => ({
    ...task,
    user_id: userId,
  }));

  const { error } = await supabase.from('tasks').upsert(payload, { onConflict: 'id' });
  if (error) {
    throw new Error(`Failed to push tasks: ${error.message}`);
  }

  const syncedAt = nowIso();
  await markTasksSynced(
    db,
    unsynced.map((task) => task.id),
    syncedAt
  );

  return unsynced.length;
}

async function pullTasks(
  db: SQLiteDatabase,
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const lastPulledAt = await getSyncState(db, 'tasks_last_pulled_at');
  let query = supabase.from('tasks').select('*').eq('user_id', userId);

  if (lastPulledAt) {
    query = query.gt('updated_at', lastPulledAt);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to pull tasks: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return 0;
  }

  for (const remoteTask of data) {
    await db.runAsync(
      `INSERT INTO tasks (
        id, title, notes, due_date, priority, status, category,
        created_at, updated_at, deleted_at, synced_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        notes = excluded.notes,
        due_date = excluded.due_date,
        priority = excluded.priority,
        status = excluded.status,
        category = excluded.category,
        updated_at = excluded.updated_at,
        deleted_at = excluded.deleted_at,
        synced_at = excluded.synced_at
      WHERE excluded.updated_at > tasks.updated_at`,
      remoteTask.id,
      remoteTask.title,
      remoteTask.notes,
      remoteTask.due_date,
      remoteTask.priority,
      remoteTask.status,
      remoteTask.category,
      remoteTask.created_at,
      remoteTask.updated_at,
      remoteTask.deleted_at,
      remoteTask.synced_at ?? nowIso()
    );
  }

  await setSyncState(db, 'tasks_last_pulled_at', nowIso());
  return data.length;
}

export async function syncAll(
  db: SQLiteDatabase,
  supabase: SupabaseClient,
  userId: string
): Promise<SyncResult> {
  if (!(await isOnline())) {
    return {
      status: 'offline',
      pushed: 0,
      pulled: 0,
      message: 'No internet connection. Your data is saved locally.',
    };
  }

  try {
    const pushed = await pushTasks(db, supabase, userId);
    const pulled = await pullTasks(db, supabase, userId);

    await setSyncState(db, 'last_sync_at', nowIso());

    return {
      status: 'success',
      pushed,
      pulled,
      message: `Synced ${pushed} local and ${pulled} remote changes.`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sync failed.';
    return {
      status: 'error',
      pushed: 0,
      pulled: 0,
      message,
    };
  }
}

export async function getPendingSyncCount(db: SQLiteDatabase): Promise<number> {
  return countUnsyncedRecords(db);
}
