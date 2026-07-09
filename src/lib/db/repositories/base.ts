import type { SQLiteDatabase } from 'expo-sqlite';
import { TABLES } from '../schema';
import { freshSyncMetadata, generateId, nowIso } from '../utils';

export interface BaseEntityInput {
  id?: string;
  householdId: string;
  createdBy?: string | null;
}

/**
 * Shared CRUD helpers for offline-first tables.
 * All writes mark sync_status = 'pending' for a future sync worker.
 */
export abstract class BaseRepository<T extends { id: string }> {
  constructor(protected db: SQLiteDatabase) {}

  protected abstract table: string;
  protected abstract columns: string[];
  protected abstract rowToEntity(row: Record<string, unknown>): T;
  protected abstract entityToValues(entity: T): unknown[];

  protected notDeletedClause(alias = ''): string {
    const prefix = alias ? `${alias}.` : '';
    return `${prefix}deleted_at IS NULL`;
  }

  async findById(id: string): Promise<T | null> {
    const row = await this.db.getFirstAsync<Record<string, unknown>>(
      `SELECT * FROM ${this.table} WHERE id = ? AND ${this.notDeletedClause()}`,
      [id]
    );
    return row ? this.rowToEntity(row) : null;
  }

  async findByHousehold(householdId: string, orderBy = 'updated_at DESC'): Promise<T[]> {
    const rows = await this.db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM ${this.table}
       WHERE household_id = ? AND ${this.notDeletedClause()}
       ORDER BY ${orderBy}`,
      [householdId]
    );
    return rows.map((row) => this.rowToEntity(row));
  }

  async insert(entity: T): Promise<void> {
    const placeholders = this.columns.map(() => '?').join(', ');
    await this.db.runAsync(
      `INSERT INTO ${this.table} (${this.columns.join(', ')}) VALUES (${placeholders})`,
      this.entityToValues(entity) as (string | number | null)[]
    );
  }

  async update(id: string, patch: Record<string, unknown>): Promise<void> {
    const keys = Object.keys(patch);
    if (keys.length === 0) return;

    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    const values = keys.map((k) => patch[k] as string | number | null);

    await this.db.runAsync(
      `UPDATE ${this.table}
       SET ${setClause}, updated_at = ?, sync_status = 'pending'
       WHERE id = ?`,
      [...values, nowIso(), id]
    );
  }

  async softDelete(id: string): Promise<void> {
    const at = nowIso();
    await this.db.runAsync(
      `UPDATE ${this.table}
       SET deleted_at = ?, updated_at = ?, sync_status = 'pending'
       WHERE id = ?`,
      [at, at, id]
    );
  }

  protected newBase(input: BaseEntityInput) {
    const meta = freshSyncMetadata();
    return {
      id: input.id ?? generateId(),
      householdId: input.householdId,
      createdBy: input.createdBy ?? null,
      ...meta,
    };
  }
}

export { TABLES };
