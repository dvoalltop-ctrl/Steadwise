import type { PantryItem, InventoryTransaction } from '@/types';
import { getDatabase } from '../client';
import { TABLES } from '../schema';
import { toBaseRecordFields, generateId, nowIso } from '../utils';

function rowToItem(row: Record<string, unknown>): PantryItem {
  return {
    ...toBaseRecordFields(row),
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

function rowToTransaction(row: Record<string, unknown>): InventoryTransaction {
  return {
    ...toBaseRecordFields(row),
    pantryItemId: row.pantry_item_id as string,
    transactionType: row.transaction_type as InventoryTransaction['transactionType'],
    quantityDelta: row.quantity_delta as number,
    unit: row.unit as string,
    reason: (row.reason as string) ?? null,
    referenceId: (row.reference_id as string) ?? null,
    referenceType: (row.reference_type as string) ?? null,
    transactedAt: row.transacted_at as string,
  };
}

export const pantryRepository = {
  async listItems(householdId: string): Promise<PantryItem[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM ${TABLES.pantryItems} WHERE household_id = ? AND deleted_at IS NULL ORDER BY name`,
      [householdId]
    );
    return rows.map(rowToItem);
  },

  async listTransactions(householdId: string, pantryItemId?: string): Promise<InventoryTransaction[]> {
    const db = await getDatabase();
    const sql = pantryItemId
      ? `SELECT * FROM ${TABLES.inventoryTransactions}
         WHERE household_id = ? AND pantry_item_id = ? AND deleted_at IS NULL
         ORDER BY transacted_at DESC`
      : `SELECT * FROM ${TABLES.inventoryTransactions}
         WHERE household_id = ? AND deleted_at IS NULL ORDER BY transacted_at DESC`;
    const rows = await db.getAllAsync<Record<string, unknown>>(
      sql,
      pantryItemId ? [householdId, pantryItemId] : [householdId]
    );
    return rows.map(rowToTransaction);
  },

  async recordTransaction(input: {
    householdId: string;
    pantryItemId: string;
    transactionType: InventoryTransaction['transactionType'];
    quantityDelta: number;
    unit: string;
    reason?: string | null;
    createdBy?: string | null;
  }): Promise<void> {
    const db = await getDatabase();
    const at = nowIso();
    await db.runAsync(
      `INSERT INTO ${TABLES.inventoryTransactions}
        (id, household_id, pantry_item_id, transaction_type, quantity_delta, unit, reason,
         transacted_at, created_by, created_at, updated_at, sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        generateId(), input.householdId, input.pantryItemId, input.transactionType,
        input.quantityDelta, input.unit, input.reason ?? null, at,
        input.createdBy ?? null, at, at,
      ]
    );
    await db.runAsync(
      `UPDATE ${TABLES.pantryItems}
       SET quantity = quantity + ?, updated_at = ?, sync_status = 'pending'
       WHERE id = ?`,
      [input.quantityDelta, at, input.pantryItemId]
    );
  },
};
