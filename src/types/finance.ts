import type { BaseRecord } from './common';

export type Enterprise = 'garden' | 'chickens' | 'goats' | 'pantry' | 'general';

export interface ExpenseCategory extends BaseRecord {
  name: string;
  icon: string | null;
  sortOrder: number;
}

export interface IncomeCategory extends BaseRecord {
  name: string;
  icon: string | null;
  sortOrder: number;
}

export interface Expense extends BaseRecord {
  categoryId: string;
  amount: number;
  currency: string;
  expenseDate: string;
  vendor: string | null;
  description: string | null;
  enterprise: Enterprise;
}

export interface Income extends BaseRecord {
  categoryId: string;
  amount: number;
  currency: string;
  incomeDate: string;
  source: string | null;
  description: string | null;
  enterprise: Enterprise;
}
