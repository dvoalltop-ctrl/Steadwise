import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { mockData } from '@/mocks';
import { DEMO_HOUSEHOLD_ID } from '@/mocks/household';
import { TaskRepository } from '@/features/tasks/repository';
import { getDatabase } from '@/db/client';
import type { Task } from '@/types';
import { getTodayDateString } from '@/features/tasks/utils/recurrence';
import { useAppStore } from '@/stores/app-store';

interface DataContextValue {
  ready: boolean;
  householdId: string;
  householdName: string;
  tasks: Task[];
  refreshTasks: () => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  // Mock-backed data (Phase C will add repositories)
  areas: typeof mockData.areas;
  plantings: typeof mockData.plantings;
  varieties: typeof mockData.varieties;
  harvests: typeof mockData.harvests;
  animalGroups: typeof mockData.animalGroups;
  animalLogs: typeof mockData.animalLogs;
  pantryItems: typeof mockData.pantryItems;
  expenses: typeof mockData.expenses;
  incomes: typeof mockData.incomes;
  weather: typeof mockData.weather;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const useLocalDb = useAppStore((s) => s.useLocalDb);
  const homesteadName = useAppStore((s) => s.homesteadName);

  const householdName = homesteadName || mockData.household.name;

  const refreshTasks = useCallback(async () => {
    if (useLocalDb) {
      const repo = await TaskRepository.create();
      const all = await repo.getAll(DEMO_HOUSEHOLD_ID);
      setTasks(all);
    } else {
      setTasks(mockData.tasks);
    }
  }, [useLocalDb]);

  const completeTask = useCallback(
    async (id: string) => {
      if (useLocalDb) {
        const repo = await TaskRepository.create();
        await repo.completeTask(id);
        await refreshTasks();
      } else {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === id
              ? { ...t, status: 'done' as const, completedAt: new Date().toISOString() }
              : t
          )
        );
      }
    },
    [useLocalDb, refreshTasks]
  );

  useEffect(() => {
    async function init() {
      if (useLocalDb) {
        await getDatabase();
      }
      await refreshTasks();
      setReady(true);
    }
    init();
  }, [useLocalDb, refreshTasks]);

  const value: DataContextValue = {
    ready,
    householdId: DEMO_HOUSEHOLD_ID,
    householdName,
    tasks,
    refreshTasks,
    completeTask,
    areas: mockData.areas,
    plantings: mockData.plantings,
    varieties: mockData.varieties,
    harvests: mockData.harvests,
    animalGroups: mockData.animalGroups,
    animalLogs: mockData.animalLogs,
    pantryItems: mockData.pantryItems,
    expenses: mockData.expenses,
    incomes: mockData.incomes,
    weather: mockData.weather,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

export function useTodayTasks() {
  const { tasks } = useData();
  const today = getTodayDateString();
  const dueToday = tasks.filter((t) => t.status === 'open' && t.dueDate === today);
  const overdue = tasks.filter((t) => t.status === 'open' && t.dueDate && t.dueDate < today);
  return { dueToday, overdue, today };
}

export function useDashboardStats() {
  const { harvests, animalLogs, pantryItems } = useData();
  const today = getTodayDateString();
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

  const eggsToday = animalLogs
    .filter((l) => l.logType === 'production' && l.unit === 'eggs' && l.loggedAt.startsWith(today))
    .reduce((sum, l) => sum + (l.quantity ?? 0), 0);

  const harvestThisWeek = harvests
    .filter((h) => h.harvestedOn >= weekAgo)
    .reduce((sum, h) => sum + h.quantity, 0);

  const lowStockCount = pantryItems.filter(
    (p) => p.lowStockThreshold !== null && p.quantity <= p.lowStockThreshold
  ).length;

  return { eggsToday, harvestThisWeek, lowStockCount };
}
