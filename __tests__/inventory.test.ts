import { describe, it, expect } from 'vitest';
import {
  computeInventoryBalance,
  isLowStock,
  applyTransactionDelta,
} from '@/features/pantry/utils/inventory';
import type { InventoryTransaction } from '@/types';

const tx = (
  id: string,
  delta: number,
  deletedAt: string | null = null
): InventoryTransaction => ({
  id,
  householdId: 'hh1',
  pantryItemId: 'p1',
  transactionType: delta > 0 ? 'add' : 'use',
  quantityDelta: delta,
  unit: 'jars',
  reason: null,
  referenceId: null,
  referenceType: null,
  transactedAt: '2026-07-01',
  createdBy: null,
  createdAt: '2026-07-01',
  updatedAt: '2026-07-01',
  deletedAt,
  localSyncStatus: 'synced',
  lastSyncedAt: null,
});

describe('computeInventoryBalance', () => {
  it('sums transaction deltas', () => {
    const balance = computeInventoryBalance([
      tx('1', 10),
      tx('2', -3),
      tx('3', 2),
    ]);
    expect(balance).toBe(9);
  });

  it('ignores soft-deleted transactions', () => {
    const balance = computeInventoryBalance([
      tx('1', 10),
      tx('2', -5, '2026-07-02'),
    ]);
    expect(balance).toBe(10);
  });
});

describe('isLowStock', () => {
  it('returns true when at or below threshold', () => {
    expect(isLowStock(3, 5)).toBe(true);
    expect(isLowStock(5, 5)).toBe(true);
  });

  it('returns false when above threshold', () => {
    expect(isLowStock(6, 5)).toBe(false);
  });

  it('returns false when no threshold set', () => {
    expect(isLowStock(0, null)).toBe(false);
  });
});

describe('applyTransactionDelta', () => {
  it('applies positive delta', () => {
    expect(applyTransactionDelta(5, 3)).toBe(8);
  });

  it('throws on negative balance', () => {
    expect(() => applyTransactionDelta(2, -5)).toThrow('cannot go negative');
  });
});
