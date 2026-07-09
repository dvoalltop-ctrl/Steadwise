import type { Expense, Income } from '@/types';
import { getDatabase } from '../client';
import { TABLES } from '../schema';
import { toBaseRecordFields } from '../utils';

function rowToExpense(row: Record<string, unknown>): Expense {
  return {
    ...toBaseRecordFields(row),
    categoryId: row.category_id as string,
    amount: row.amount as number,
    currency: row.currency as string,
    expenseDate: row.transaction_date as string,
    vendor: (row.counterparty as string) ?? null,
    description: (row.description as string) ?? null,
    enterprise: row.enterprise as Expense['enterprise'],
  };
}

function rowToIncome(row: Record<string, unknown>): Income {
  return {
    ...toBaseRecordFields(row),
    categoryId: row.category_id as string,
    amount: row.amount as number,
    currency: row.currency as string,
    incomeDate: row.transaction_date as string,
    source: (row.counterparty as string) ?? null,
    description: (row.description as string) ?? null,
    enterprise: row.enterprise as Income['enterprise'],
  };
}

export const financeRepository = {
  async listExpenses(householdId: string): Promise<Expense[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM ${TABLES.financeTransactions}
       WHERE household_id = ? AND type = 'expense' AND deleted_at IS NULL
       ORDER BY transaction_date DESC`,
      [householdId]
    );
    return rows.map(rowToExpense);
  },

  async listIncomes(householdId: string): Promise<Income[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM ${TABLES.financeTransactions}
       WHERE household_id = ? AND type = 'income' AND deleted_at IS NULL
       ORDER BY transaction_date DESC`,
      [householdId]
    );
    return rows.map(rowToIncome);
  },

  async createExpense(expense: Expense, categoryName?: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO ${TABLES.financeTransactions}
        (id, household_id, type, category_id, category_name, amount, currency, transaction_date,
         counterparty, description, enterprise, created_by, created_at, updated_at, sync_status)
       VALUES (?, ?, 'expense', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        expense.id, expense.householdId, expense.categoryId, categoryName ?? null,
        expense.amount, expense.currency, expense.expenseDate, expense.vendor,
        expense.description, expense.enterprise, expense.createdBy,
        expense.createdAt, expense.updatedAt,
      ]
    );
  },

  async createIncome(income: Income, categoryName?: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO ${TABLES.financeTransactions}
        (id, household_id, type, category_id, category_name, amount, currency, transaction_date,
         counterparty, description, enterprise, created_by, created_at, updated_at, sync_status)
       VALUES (?, ?, 'income', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        income.id, income.householdId, income.categoryId, categoryName ?? null,
        income.amount, income.currency, income.incomeDate, income.source,
        income.description, income.enterprise, income.createdBy,
        income.createdAt, income.updatedAt,
      ]
    );
  },
};
