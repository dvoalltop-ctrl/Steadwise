import type { SQLiteDatabase } from 'expo-sqlite';

import type { SyncableTable } from './types';

const SYNCABLE_TABLES: SyncableTable[] = [
  'tasks',
  'gardens',
  'garden_beds',
  'plantings',
  'animals',
  'pantry_items',
  'transactions',
  'notes',
  'photos',
  'weather_logs',
];

export async function getSyncState(
  db: SQLiteDatabase,
  key: string
): Promise<string | null> {
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM sync_state WHERE key = ?',
    key
  );
  return row?.value ?? null;
}

export async function setSyncState(
  db: SQLiteDatabase,
  key: string,
  value: string
): Promise<void> {
  await db.runAsync(
    'INSERT OR REPLACE INTO sync_state (key, value) VALUES (?, ?)',
    key,
    value
  );
}

export async function countUnsyncedRecords(db: SQLiteDatabase): Promise<number> {
  let total = 0;

  for (const table of SYNCABLE_TABLES) {
    const row = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM ${table}
       WHERE synced_at IS NULL OR updated_at > synced_at`
    );
    total += row?.count ?? 0;
  }

  return total;
}
