import type { SQLiteDatabase } from 'expo-sqlite';
import type { PantryItem } from '@/types';
import { getDatabase } from '@/db/client';
import { enqueueSync, mapBaseRecord, nowIso } from '@/lib/repositories/sync-helper';
import { isLowStock } from '@/features/pantry/utils/inventory';

function rowToPantryItem(row: Record<string, unknown>): PantryItem {
  return {
    ...mapBaseRecord(row),
    name: row.name as string,
    category: row.category as PantryItem['category'],
    quantity: row.quantity as number,
    unit: row.unit as string,
    lowStockThreshold: (row.low_stock_threshold as number) ?? null,
    expirationDate: (row.expiration_date as string) ?? null,
    locationLabel: (row.location_label as string) ?? null,
    harvestId: (row.harvest_id as string) ?? null,
    batchId: (row.batch_id as string) ?? null,
  };
}

export class PantryRepository {
  constructor(private db: SQLiteDatabase) {}

  static async create(): Promise<PantryRepository> {
    return new PantryRepository(await getDatabase());
  }

  async getAll(householdId: string): Promise<PantryItem[]> {
    const rows = await this.db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM pantry_items WHERE household_id = ? AND deleted_at IS NULL ORDER BY name`,
      [householdId]
    );
    return rows.map(rowToPantryItem);
  }

  async getLowStock(householdId: string): Promise<PantryItem[]> {
    const items = await this.getAll(householdId);
    return items.filter((p) => isLowStock(p.quantity, p.lowStockThreshold));
  }

  async create(item: PantryItem): Promise<void> {
    await this.db.runAsync(
      `INSERT INTO pantry_items (id, household_id, name, category, quantity, unit,
        low_stock_threshold, expiration_date, location_label, harvest_id, batch_id,
        created_by, created_at, updated_at, local_sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        item.id, item.householdId, item.name, item.category, item.quantity, item.unit,
        item.lowStockThreshold, item.expirationDate, item.locationLabel,
        item.harvestId, item.batchId, item.createdBy, item.createdAt, item.updatedAt,
      ]
    );
    await enqueueSync(this.db, {
      householdId: item.householdId,
      entityType: 'pantry_items',
      entityId: item.id,
      operation: 'insert',
      payload: item as unknown as Record<string, unknown>,
    });
  }

  async updateQuantity(id: string, householdId: string, quantity: number): Promise<void> {
    const now = nowIso();
    await this.db.runAsync(
      `UPDATE pantry_items SET quantity = ?, updated_at = ?, local_sync_status = 'pending' WHERE id = ?`,
      [quantity, now, id]
    );
    await enqueueSync(this.db, {
      householdId,
      entityType: 'pantry_items',
      entityId: id,
      operation: 'update',
      payload: { quantity, updatedAt: now },
    });
  }
}
