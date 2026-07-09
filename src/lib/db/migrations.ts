import type { SQLiteDatabase } from 'expo-sqlite';
import { CREATE_TABLES_SQL, SCHEMA_VERSION } from './schema';
import { nowIso } from './utils';
import { seedDemoData } from './seed';

export interface Migration {
  version: number;
  name: string;
  up: (db: SQLiteDatabase) => Promise<void>;
}

/**
 * Versioned migrations for the local SQLite database.
 * Each migration runs once; version is stored in schema_migrations.
 */
export const MIGRATIONS: Migration[] = [
  {
    version: 1,
    name: 'initial_local_schema',
    up: async (db) => {
      await db.execAsync(CREATE_TABLES_SQL);
    },
  },
];

export async function getAppliedVersion(db: SQLiteDatabase): Promise<number> {
  const row = await db
    .getFirstAsync<{ version: number }>('SELECT MAX(version) as version FROM schema_migrations')
    .catch(() => null);
  return row?.version ?? 0;
}

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  const current = await getAppliedVersion(db);

  for (const migration of MIGRATIONS) {
    if (migration.version <= current) continue;

    await migration.up(db);
    await db.runAsync(
      'INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)',
      [migration.version, nowIso()]
    );
  }

  // Seed demo rows after schema is ready (idempotent).
  if (current < SCHEMA_VERSION) {
    await seedDemoData(db);
  }
}
