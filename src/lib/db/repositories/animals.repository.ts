import type { AnimalGroup, AnimalLog } from '@/types';
import { getDatabase } from '../client';
import { TABLES } from '../schema';
import { toBaseRecordFields } from '../utils';

function rowToGroup(row: Record<string, unknown>): AnimalGroup {
  return {
    ...toBaseRecordFields(row),
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
    ...toBaseRecordFields(row),
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

export const animalsRepository = {
  async listGroups(householdId: string): Promise<AnimalGroup[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM ${TABLES.animalGroups} WHERE household_id = ? AND deleted_at IS NULL`,
      [householdId]
    );
    return rows.map(rowToGroup);
  },

  async listLogs(householdId: string): Promise<AnimalLog[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM ${TABLES.animalLogs} WHERE household_id = ? AND deleted_at IS NULL ORDER BY logged_at DESC`,
      [householdId]
    );
    return rows.map(rowToLog);
  },
};
