import * as SQLite from 'expo-sqlite';
import { MIGRATION_001 } from './migrations/001_initial';
import { seedDatabase } from './seed';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return dbInstance;

  dbInstance = await SQLite.openDatabaseAsync('steadwise.db');
  await runMigrations(dbInstance);
  return dbInstance;
}

async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ version: number }>(
    'SELECT MAX(version) as version FROM schema_migrations'
  ).catch(() => null);

  const currentVersion = row?.version ?? 0;

  if (currentVersion < 1) {
    await db.execAsync(MIGRATION_001);
    await db.runAsync(
      'INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)',
      [1, new Date().toISOString()]
    );
    await seedDatabase(db);
  }
}

export async function resetDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.closeAsync();
    dbInstance = null;
  }
  await SQLite.deleteDatabaseAsync('steadwise.db');
  await getDatabase();
}
