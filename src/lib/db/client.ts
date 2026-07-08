import * as SQLite from 'expo-sqlite';

import { MIGRATIONS } from './migrations';

const DATABASE_NAME = 'steadwise.db';

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function getCurrentVersion(db: SQLite.SQLiteDatabase): Promise<number> {
  try {
    const row = await db.getFirstAsync<{ version: number }>(
      'SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1'
    );
    return row?.version ?? 0;
  } catch {
    return 0;
  }
}

async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  const currentVersion = await getCurrentVersion(db);

  for (const migration of MIGRATIONS) {
    if (migration.version <= currentVersion) {
      continue;
    }

    await db.execAsync(migration.sql);
    await db.runAsync(
      'INSERT OR REPLACE INTO schema_migrations (version) VALUES (?)',
      migration.version
    );
  }
}

export async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      await runMigrations(db);
      return db;
    })();
  }

  return databasePromise;
}

export async function resetDatabase(): Promise<void> {
  if (databasePromise) {
    const db = await databasePromise;
    await db.closeAsync();
  }

  databasePromise = null;
  await SQLite.deleteDatabaseAsync(DATABASE_NAME);
}
