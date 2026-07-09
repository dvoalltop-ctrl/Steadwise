import * as SQLite from 'expo-sqlite';
import { DATABASE_NAME } from './schema';
import { runMigrations } from './migrations';
import { hydrateSyncQueue } from './repositories/sync-queue.repository';

let dbInstance: SQLite.SQLiteDatabase | null = null;
let initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/**
 * Opens SQLite, runs migrations, and seeds demo data on first launch.
 *
 * Offline-first: callers should treat the returned database as the local
 * source of truth. Network sync is layered on later via sync_queue rows.
 */
export async function initializeDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await runMigrations(db);
    await hydrateSyncQueue(db);
    dbInstance = db;
    return db;
  })();

  try {
    return await initPromise;
  } catch (err) {
    initPromise = null;
    throw err;
  }
}

/** Alias used across the app — ensures DB is initialized before use. */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  return initializeDatabase();
}

/** Wipes the local database and re-runs migrations + seed (development helper). */
export async function resetDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) {
    await dbInstance.closeAsync();
    dbInstance = null;
  }
  initPromise = null;
  await SQLite.deleteDatabaseAsync(DATABASE_NAME);
  return initializeDatabase();
}

export function isDatabaseReady(): boolean {
  return dbInstance !== null;
}
