import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { mockData } from '@/mocks';
import { DEMO_HOUSEHOLD_ID } from '@/mocks/household';
import { TaskRepository } from '@/features/tasks/repository';
import { GardenRepository } from '@/features/garden/repository';
import { AnimalsRepository } from '@/features/animals/repository';
import { PantryRepository } from '@/features/pantry/repository';
import { FinanceRepository } from '@/features/finance/repository';
import { initializeDatabase } from '@/lib/db/client';
import { runSyncCycle } from '@/sync/sync-worker';
import { useSyncStore } from '@/sync/sync-state';
import { isSupabaseConfigured } from '@/lib/supabase';
import type {
  Task, Area, CropVariety, Planting, Harvest,
  AnimalGroup, AnimalLog, PantryItem, Expense, Income, WeatherSnapshot,
} from '@/types';
import { getTodayDateString } from '@/features/tasks/utils/recurrence';
import { useAppStore } from '@/stores/app-store';

interface DataContextValue {
  ready: boolean;
  householdId: string;
  householdName: string;
  tasks: Task[];
  areas: Area[];
  plantings: Planting[];
  varieties: CropVariety[];
  harvests: Harvest[];
  animalGroups: AnimalGroup[];
  animalLogs: AnimalLog[];
  pantryItems: PantryItem[];
  expenses: Expense[];
  incomes: Income[];
  weather: WeatherSnapshot;
  refreshAll: () => Promise<void>;
  refreshTasks: () => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  syncNow: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [plantings, setPlantings] = useState<Planting[]>([]);
  const [varieties, setVarieties] = useState<CropVariety[]>([]);
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [animalGroups, setAnimalGroups] = useState<AnimalGroup[]>([]);
  const [animalLogs, setAnimalLogs] = useState<AnimalLog[]>([]);
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);

  const useLocalDb = useAppStore((s) => s.useLocalDb);
  const homesteadName = useAppStore((s) => s.homesteadName);
  const householdId = DEMO_HOUSEHOLD_ID;
  const householdName = homesteadName || mockData.household.name;

  const loadFromDb = useCallback(async () => {
    const taskRepo = await TaskRepository.create();
    const gardenRepo = await GardenRepository.create();
    const animalsRepo = await AnimalsRepository.create();
    const pantryRepo = await PantryRepository.create();
    const financeRepo = await FinanceRepository.create();

    const [
      allTasks, allAreas, allPlantings, allVarieties, allHarvests,
      allGroups, allLogs, allPantry, allExpenses, allIncomes,
    ] = await Promise.all([
      taskRepo.getAll(householdId),
      gardenRepo.getAreas(householdId),
      gardenRepo.getPlantings(householdId),
      gardenRepo.getVarieties(householdId),
      gardenRepo.getHarvests(householdId),
      animalsRepo.getGroups(householdId),
      animalsRepo.getLogs(householdId),
      pantryRepo.getAll(householdId),
      financeRepo.getExpenses(householdId),
      financeRepo.getIncomes(householdId),
    ]);

    setTasks(allTasks);
    setAreas(allAreas);
    setPlantings(allPlantings);
    setVarieties(allVarieties);
    setHarvests(allHarvests);
    setAnimalGroups(allGroups);
    setAnimalLogs(allLogs);
    setPantryItems(allPantry);
    setExpenses(allExpenses);
    setIncomes(allIncomes);
    useSyncStore.getState().refreshPendingCount();
  }, [householdId]);

  const loadFromMocks = useCallback(() => {
    setTasks(mockData.tasks);
    setAreas(mockData.areas);
    setPlantings(mockData.plantings);
    setVarieties(mockData.varieties);
    setHarvests(mockData.harvests);
    setAnimalGroups(mockData.animalGroups);
    setAnimalLogs(mockData.animalLogs);
    setPantryItems(mockData.pantryItems);
    setExpenses(mockData.expenses);
    setIncomes(mockData.incomes);
  }, []);

  const refreshAll = useCallback(async () => {
    if (useLocalDb) {
      await loadFromDb();
    } else {
      loadFromMocks();
    }
  }, [useLocalDb, loadFromDb, loadFromMocks]);

  const refreshTasks = refreshAll;

  const completeTask = useCallback(
    async (id: string) => {
      if (useLocalDb) {
        const repo = await TaskRepository.create();
        await repo.completeTask(id, householdId);
        await refreshAll();
        if (isSupabaseConfigured) await runSyncCycle(householdId);
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
    [useLocalDb, householdId, refreshAll]
  );

  const syncNow = useCallback(async () => {
    if (!useLocalDb || !isSupabaseConfigured) return;
    await runSyncCycle(householdId);
    await refreshAll();
  }, [useLocalDb, householdId, refreshAll]);

  useEffect(() => {
    async function init() {
      if (useLocalDb) {
        await initializeDatabase();
      }
      await refreshAll();
      setReady(true);
    }
    init();
  }, [useLocalDb, refreshAll]);

  const value: DataContextValue = {
    ready,
    householdId,
    householdName,
    tasks,
    areas,
    plantings,
    varieties,
    harvests,
    animalGroups,
    animalLogs,
    pantryItems,
    expenses,
    incomes,
    weather: mockData.weather,
    refreshAll,
    refreshTasks,
    completeTask,
    syncNow,
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
