import type { Expense, Income, ExpenseCategory, IncomeCategory } from '@/types';
import { DEMO_HOUSEHOLD_ID, DEMO_USER_ID } from './household';

const base = {
  householdId: DEMO_HOUSEHOLD_ID,
  createdBy: DEMO_USER_ID,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null as string | null,
  localSyncStatus: 'synced' as const,
  lastSyncedAt: null as string | null,
};

export const mockExpenseCategories: ExpenseCategory[] = [
  { ...base, id: 'ecat-001', name: 'Feed & supplies', icon: 'package', sortOrder: 1 },
  { ...base, id: 'ecat-002', name: 'Seeds & plants', icon: 'sprout', sortOrder: 2 },
  { ...base, id: 'ecat-003', name: 'Equipment', icon: 'tool', sortOrder: 3 },
];

export const mockIncomeCategories: IncomeCategory[] = [
  { ...base, id: 'icat-001', name: 'Egg sales', icon: 'egg', sortOrder: 1 },
  { ...base, id: 'icat-002', name: 'Produce sales', icon: 'shopping-bag', sortOrder: 2 },
];

const month = new Date().toISOString().slice(0, 7);

export const mockExpenses: Expense[] = [
  {
    ...base,
    id: 'exp-001',
    categoryId: 'ecat-001',
    amount: 24.5,
    currency: 'USD',
    expenseDate: `${month}-03`,
    vendor: 'Farm Supply Co',
    description: 'Layer pellets, 50lb bag',
    enterprise: 'chickens',
  },
  {
    ...base,
    id: 'exp-002',
    categoryId: 'ecat-002',
    amount: 18.0,
    currency: 'USD',
    expenseDate: `${month}-01`,
    vendor: 'Seed Savers',
    description: 'Fall kale seeds',
    enterprise: 'garden',
  },
];

export const mockIncomes: Income[] = [
  {
    ...base,
    id: 'inc-001',
    categoryId: 'icat-001',
    amount: 15.0,
    currency: 'USD',
    incomeDate: `${month}-05`,
    source: 'Neighbor',
    description: '2 dozen eggs',
    enterprise: 'chickens',
  },
];
