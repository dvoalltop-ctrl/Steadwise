import * as SQLite from 'expo-sqlite';
import { MIGRATION_001 } from './migrations/001_initial';
import { MIGRATION_002 } from './migrations/002_auth_categories';
import { seedDatabase } from './seed';
import { loadSyncQueueFromDb } from '@/lib/repositories/sync-helper';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return dbInstance;

  dbInstance = await SQLite.openDatabaseAsync('steadwise.db');
  await runMigrations(dbInstance);
  await loadSyncQueueFromDb(dbInstance);
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

  if (currentVersion < 2) {
    await db.execAsync(MIGRATION_002);
    await db.runAsync(
      'INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)',
      [2, new Date().toISOString()]
    );
    await seedCategories(db);
  }
}

async function seedCategories(db: SQLite.SQLiteDatabase): Promise<void> {
  const count = await db.getFirstAsync<{ c: number }>(
    'SELECT COUNT(*) as c FROM expense_categories'
  );
  if (count && count.c > 0) return;

  const { mockData } = await import('@/mocks');
  for (const cat of mockData.expenseCategories) {
    await db.runAsync(
      `INSERT INTO expense_categories (id, household_id, name, icon, sort_order,
        created_by, created_at, updated_at, local_sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cat.id, cat.householdId, cat.name, cat.icon, cat.sortOrder,
        cat.createdBy, cat.createdAt, cat.updatedAt, cat.localSyncStatus,
      ]
    );
  }
  for (const cat of mockData.incomeCategories) {
    await db.runAsync(
      `INSERT INTO income_categories (id, household_id, name, icon, sort_order,
        created_by, created_at, updated_at, local_sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cat.id, cat.householdId, cat.name, cat.icon, cat.sortOrder,
        cat.createdBy, cat.createdAt, cat.updatedAt, cat.localSyncStatus,
      ]
    );
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
