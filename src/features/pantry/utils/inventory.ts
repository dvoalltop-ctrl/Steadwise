import type { InventoryTransaction } from '@/types';

/** Compute current balance from append-only inventory transactions. */
export function computeInventoryBalance(transactions: InventoryTransaction[]): number {
  return transactions
    .filter((t) => !t.deletedAt)
    .reduce((sum, t) => sum + t.quantityDelta, 0);
}

/** Check if pantry item is below low stock threshold. */
export function isLowStock(quantity: number, threshold: number | null): boolean {
  if (threshold === null) return false;
  return quantity <= threshold;
}

/** Apply a transaction delta to current quantity (for validation). */
export function applyTransactionDelta(currentQty: number, delta: number): number {
  const next = currentQty + delta;
  if (next < 0) {
    throw new Error('Inventory quantity cannot go negative');
  }
  return next;
}
