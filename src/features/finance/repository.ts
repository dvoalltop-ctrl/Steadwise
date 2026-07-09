import type { Expense, Income, ExpenseCategory, IncomeCategory } from '@/types';
import { financeRepository } from '@/lib/db/repositories/finance.repository';
import { syncQueueRepository } from '@/lib/db/repositories/sync-queue.repository';
import { mockData } from '@/mocks';

export interface MonthlySummary {
  totalIncome: number;
  totalExpenses: number;
  net: number;
}

export class FinanceRepository {
  static async create(): Promise<FinanceRepository> {
    return new FinanceRepository();
  }

  async getExpenses(householdId: string): Promise<Expense[]> {
    return financeRepository.listExpenses(householdId);
  }

  async getIncomes(householdId: string): Promise<Income[]> {
    return financeRepository.listIncomes(householdId);
  }

  /** Categories remain mock-only until a categories table is added. */
  async getExpenseCategories(householdId: string): Promise<ExpenseCategory[]> {
    void householdId;
    return mockData.expenseCategories;
  }

  async getIncomeCategories(householdId: string): Promise<IncomeCategory[]> {
    void householdId;
    return mockData.incomeCategories;
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
    const cat = mockData.expenseCategories.find((c) => c.id === expense.categoryId);
    await financeRepository.createExpense(expense, cat?.name);
    await syncQueueRepository.enqueue({
      householdId: expense.householdId,
      entityType: 'finance_transactions',
      entityId: expense.id,
      operation: 'insert',
      payload: expense as unknown as Record<string, unknown>,
    });
  }

  async createIncome(income: Income): Promise<void> {
    const cat = mockData.incomeCategories.find((c) => c.id === income.categoryId);
    await financeRepository.createIncome(income, cat?.name);
    await syncQueueRepository.enqueue({
      householdId: income.householdId,
      entityType: 'finance_transactions',
      entityId: income.id,
      operation: 'insert',
      payload: income as unknown as Record<string, unknown>,
    });
  }
}
