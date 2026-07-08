import type { SQLiteDatabase } from 'expo-sqlite';
import type { Expense, Income, ExpenseCategory, IncomeCategory } from '@/types';
import { getDatabase } from '@/db/client';
import { enqueueSync, mapBaseRecord, nowIso } from '@/lib/repositories/sync-helper';

function rowToExpense(row: Record<string, unknown>): Expense {
  return {
    ...mapBaseRecord(row),
    categoryId: row.category_id as string,
    amount: row.amount as number,
    currency: row.currency as string,
    expenseDate: row.expense_date as string,
    vendor: (row.vendor as string) ?? null,
    description: (row.description as string) ?? null,
    enterprise: row.enterprise as Expense['enterprise'],
  };
}

function rowToIncome(row: Record<string, unknown>): Income {
  return {
    ...mapBaseRecord(row),
    categoryId: row.category_id as string,
    amount: row.amount as number,
    currency: row.currency as string,
    incomeDate: row.income_date as string,
    source: (row.source as string) ?? null,
    description: (row.description as string) ?? null,
    enterprise: row.enterprise as Income['enterprise'],
  };
}

function rowToExpenseCategory(row: Record<string, unknown>): ExpenseCategory {
  return {
    ...mapBaseRecord(row),
    name: row.name as string,
    icon: (row.icon as string) ?? null,
    sortOrder: row.sort_order as number,
  };
}

function rowToIncomeCategory(row: Record<string, unknown>): IncomeCategory {
  return {
    ...mapBaseRecord(row),
    name: row.name as string,
    icon: (row.icon as string) ?? null,
    sortOrder: row.sort_order as number,
  };
}

export interface MonthlySummary {
  totalIncome: number;
  totalExpenses: number;
  net: number;
}

export class FinanceRepository {
  constructor(private db: SQLiteDatabase) {}

  static async create(): Promise<FinanceRepository> {
    return new FinanceRepository(await getDatabase());
  }

  async getExpenses(householdId: string): Promise<Expense[]> {
    const rows = await this.db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM expenses WHERE household_id = ? AND deleted_at IS NULL ORDER BY expense_date DESC`,
      [householdId]
    );
    return rows.map(rowToExpense);
  }

  async getIncomes(householdId: string): Promise<Income[]> {
    const rows = await this.db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM incomes WHERE household_id = ? AND deleted_at IS NULL ORDER BY income_date DESC`,
      [householdId]
    );
    return rows.map(rowToIncome);
  }

  async getExpenseCategories(householdId: string): Promise<ExpenseCategory[]> {
    const rows = await this.db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM expense_categories WHERE household_id = ? AND deleted_at IS NULL ORDER BY sort_order`,
      [householdId]
    );
    return rows.map(rowToExpenseCategory);
  }

  async getIncomeCategories(householdId: string): Promise<IncomeCategory[]> {
    const rows = await this.db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM income_categories WHERE household_id = ? AND deleted_at IS NULL ORDER BY sort_order`,
      [householdId]
    );
    return rows.map(rowToIncomeCategory);
  }

  async getMonthlySummary(householdId: string, yearMonth: string): Promise<MonthlySummary> {
    const expenses = await this.getExpenses(householdId);
    const incomes = await this.getIncomes(householdId);
    const monthExpenses = expenses.filter((e) => e.expenseDate.startsWith(yearMonth));
    const monthIncomes = incomes.filter((i) => i.incomeDate.startsWith(yearMonth));
    const totalExpenses = monthExpenses.reduce((s, e) => s + e.amount, 0);
    const totalIncome = monthIncomes.reduce((s, i) => s + i.amount, 0);
    return { totalIncome, totalExpenses, net: totalIncome - totalExpenses };
  }

  async createExpense(expense: Expense): Promise<void> {
    await this.db.runAsync(
      `INSERT INTO expenses (id, household_id, category_id, amount, currency, expense_date,
        vendor, description, enterprise, created_by, created_at, updated_at, local_sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        expense.id, expense.householdId, expense.categoryId, expense.amount, expense.currency,
        expense.expenseDate, expense.vendor, expense.description, expense.enterprise,
        expense.createdBy, expense.createdAt, expense.updatedAt,
      ]
    );
    await enqueueSync(this.db, {
      householdId: expense.householdId,
      entityType: 'expenses',
      entityId: expense.id,
      operation: 'insert',
      payload: expense as unknown as Record<string, unknown>,
    });
  }

  async createIncome(income: Income): Promise<void> {
    await this.db.runAsync(
      `INSERT INTO incomes (id, household_id, category_id, amount, currency, income_date,
        source, description, enterprise, created_by, created_at, updated_at, local_sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        income.id, income.householdId, income.categoryId, income.amount, income.currency,
        income.incomeDate, income.source, income.description, income.enterprise,
        income.createdBy, income.createdAt, income.updatedAt,
      ]
    );
    await enqueueSync(this.db, {
      householdId: income.householdId,
      entityType: 'incomes',
      entityId: income.id,
      operation: 'insert',
      payload: income as unknown as Record<string, unknown>,
    });
  }
}
