import type { BaseRecord } from './common';

export type PantryCategory = 'pantry' | 'freezer' | 'canned' | 'dehydrated' | 'fermented' | 'other';
export type PreservationMethod = 'canning' | 'freezing' | 'dehydrating' | 'fermenting' | 'other';
export type InventoryTransactionType = 'add' | 'use' | 'adjust' | 'waste' | 'transfer';

export interface PantryItem extends BaseRecord {
  name: string;
  category: PantryCategory;
  quantity: number;
  unit: string;
  lowStockThreshold: number | null;
  expirationDate: string | null;
  locationLabel: string | null;
  harvestId: string | null;
  batchId: string | null;
}

export interface PreservedBatch extends BaseRecord {
  name: string;
  method: PreservationMethod;
  startedOn: string;
  finishedOn: string | null;
  quantityProduced: number;
  unit: string;
  harvestId: string | null;
  recipeNotes: string | null;
}

export interface InventoryTransaction extends BaseRecord {
  pantryItemId: string;
  transactionType: InventoryTransactionType;
  quantityDelta: number;
  unit: string;
  reason: string | null;
  referenceId: string | null;
  referenceType: string | null;
  transactedAt: string;
}
