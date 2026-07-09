import type { Household } from '@/types';
import { getDatabase } from '../client';
import { TABLES } from '../schema';
import { generateId, freshSyncMetadata } from '../utils';

function rowToHousehold(row: Record<string, unknown>): Household {
  return {
    id: row.id as string,
    householdId: row.id as string,
    name: row.name as string,
    slug: (row.slug as string) ?? null,
    timezone: row.timezone as string,
    latitude: (row.latitude as number) ?? null,
    longitude: (row.longitude as number) ?? null,
    homesteadTypes: JSON.parse((row.homestead_types as string) || '[]'),
    settings: JSON.parse((row.settings as string) || '{}'),
    createdBy: null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    deletedAt: (row.deleted_at as string) ?? null,
    localSyncStatus: row.sync_status as Household['localSyncStatus'],
    lastSyncedAt: (row.last_synced_at as string) ?? null,
  };
}

export const householdsRepository = {
  async list(): Promise<Household[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM ${TABLES.households} WHERE deleted_at IS NULL ORDER BY name`
    );
    return rows.map(rowToHousehold);
  },

  async getById(id: string): Promise<Household | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<Record<string, unknown>>(
      `SELECT * FROM ${TABLES.households} WHERE id = ? AND deleted_at IS NULL`,
      [id]
    );
    return row ? rowToHousehold(row) : null;
  },

  async create(input: {
    name: string;
    slug?: string | null;
    timezone?: string;
    homesteadTypes?: string[];
  }): Promise<Household> {
    const db = await getDatabase();
    const meta = freshSyncMetadata();
    const id = generateId();
    const homestead: Household = {
      id,
      householdId: id,
      name: input.name,
      slug: input.slug ?? null,
      timezone: input.timezone ?? 'America/Chicago',
      latitude: null,
      longitude: null,
      homesteadTypes: (input.homesteadTypes ?? []) as Household['homesteadTypes'],
      settings: {},
      createdBy: null,
      createdAt: meta.createdAt,
      updatedAt: meta.updatedAt,
      deletedAt: null,
      localSyncStatus: 'pending',
      lastSyncedAt: null,
    };

    await db.runAsync(
      `INSERT INTO ${TABLES.households}
        (id, name, slug, timezone, homestead_types, settings, created_at, updated_at, sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        id, homestead.name, homestead.slug, homestead.timezone,
        JSON.stringify(homestead.homesteadTypes), JSON.stringify(homestead.settings),
        meta.createdAt, meta.updatedAt,
      ]
    );
    return homestead;
  },

  async update(id: string, patch: Partial<Pick<Household, 'name' | 'slug' | 'timezone' | 'homesteadTypes' | 'settings'>>): Promise<void> {
    const db = await getDatabase();
    const at = new Date().toISOString();
    const fields: string[] = [];
    const values: (string | null)[] = [];

    if (patch.name !== undefined) { fields.push('name = ?'); values.push(patch.name); }
    if (patch.slug !== undefined) { fields.push('slug = ?'); values.push(patch.slug); }
    if (patch.timezone !== undefined) { fields.push('timezone = ?'); values.push(patch.timezone); }
    if (patch.homesteadTypes !== undefined) {
      fields.push('homestead_types = ?');
      values.push(JSON.stringify(patch.homesteadTypes));
    }
    if (patch.settings !== undefined) {
      fields.push('settings = ?');
      values.push(JSON.stringify(patch.settings));
    }

    if (fields.length === 0) return;

    await db.runAsync(
      `UPDATE ${TABLES.households} SET ${fields.join(', ')}, updated_at = ?, sync_status = 'pending' WHERE id = ?`,
      [...values, at, id]
    );
  },

  async softDelete(id: string): Promise<void> {
    const db = await getDatabase();
    const at = new Date().toISOString();
    await db.runAsync(
      `UPDATE ${TABLES.households} SET deleted_at = ?, updated_at = ?, sync_status = 'pending' WHERE id = ?`,
      [at, at, id]
    );
  },
};

export interface LocalUser {
  id: string;
  householdId: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export const usersLocalRepository = {
  async getByHousehold(householdId: string): Promise<LocalUser[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM ${TABLES.usersLocal} WHERE household_id = ? AND deleted_at IS NULL`,
      [householdId]
    );
    return rows.map((row) => ({
      id: row.id as string,
      householdId: row.household_id as string,
      email: (row.email as string) ?? null,
      displayName: (row.display_name as string) ?? null,
      avatarUrl: (row.avatar_url as string) ?? null,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    }));
  },

  async upsert(user: LocalUser): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT OR REPLACE INTO ${TABLES.usersLocal}
        (id, household_id, email, display_name, avatar_url, created_at, updated_at, sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [user.id, user.householdId, user.email, user.displayName, user.avatarUrl, user.createdAt, user.updatedAt]
    );
  },
};
