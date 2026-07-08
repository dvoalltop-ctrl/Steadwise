import type { SQLiteDatabase } from 'expo-sqlite';
import type { AnimalGroup, AnimalLog } from '@/types';
import { getDatabase } from '@/db/client';
import { enqueueSync, mapBaseRecord, nowIso } from '@/lib/repositories/sync-helper';

function rowToGroup(row: Record<string, unknown>): AnimalGroup {
  return {
    ...mapBaseRecord(row),
    species: row.species as AnimalGroup['species'],
    name: row.name as string,
    areaId: (row.area_id as string) ?? null,
    count: row.count as number,
    breed: (row.breed as string) ?? null,
    acquiredOn: (row.acquired_on as string) ?? null,
    status: row.status as AnimalGroup['status'],
  };
}

function rowToLog(row: Record<string, unknown>): AnimalLog {
  return {
    ...mapBaseRecord(row),
    animalId: (row.animal_id as string) ?? null,
    groupId: (row.group_id as string) ?? null,
    logType: row.log_type as AnimalLog['logType'],
    loggedAt: row.logged_at as string,
    quantity: (row.quantity as number) ?? null,
    unit: (row.unit as string) ?? null,
    notes: (row.notes as string) ?? null,
    metadata: JSON.parse((row.metadata as string) || '{}'),
  };
}

export class AnimalsRepository {
  constructor(private db: SQLiteDatabase) {}

  static async create(): Promise<AnimalsRepository> {
    return new AnimalsRepository(await getDatabase());
  }

  async getGroups(householdId: string): Promise<AnimalGroup[]> {
    const rows = await this.db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM animal_groups WHERE household_id = ? AND deleted_at IS NULL`,
      [householdId]
    );
    return rows.map(rowToGroup);
  }

  async getLogs(householdId: string): Promise<AnimalLog[]> {
    const rows = await this.db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM animal_logs WHERE household_id = ? AND deleted_at IS NULL ORDER BY logged_at DESC`,
      [householdId]
    );
    return rows.map(rowToLog);
  }

  async getLogsSince(householdId: string, sinceIso: string): Promise<AnimalLog[]> {
    const rows = await this.db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM animal_logs WHERE household_id = ? AND deleted_at IS NULL AND logged_at >= ?`,
      [householdId, sinceIso]
    );
    return rows.map(rowToLog);
  }

  async createLog(log: AnimalLog): Promise<void> {
    await this.db.runAsync(
      `INSERT INTO animal_logs (id, household_id, animal_id, group_id, log_type, logged_at,
        quantity, unit, notes, metadata, created_by, created_at, updated_at, local_sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        log.id, log.householdId, log.animalId, log.groupId, log.logType, log.loggedAt,
        log.quantity, log.unit, log.notes, JSON.stringify(log.metadata),
        log.createdBy, log.createdAt, log.updatedAt,
      ]
    );
    await enqueueSync(this.db, {
      householdId: log.householdId,
      entityType: 'animal_logs',
      entityId: log.id,
      operation: 'insert',
      payload: log as unknown as Record<string, unknown>,
    });
  }

  async logProduction(
    householdId: string,
    groupId: string,
    quantity: number,
    unit: string,
    createdBy: string | null
  ): Promise<AnimalLog> {
    const now = nowIso();
    const log: AnimalLog = {
      id: `alog-${Date.now()}`,
      householdId,
      animalId: null,
      groupId,
      logType: 'production',
      loggedAt: now,
      quantity,
      unit,
      notes: null,
      metadata: {},
      createdBy,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      localSyncStatus: 'pending',
      lastSyncedAt: null,
    };
    await this.createLog(log);
    return log;
  }
}
