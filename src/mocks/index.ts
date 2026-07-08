export * from './household';
export * from './tasks';
export * from './garden';
export * from './animals';
export * from './pantry';
export * from './finance';
export * from './weather';

import { mockHousehold, mockUser } from './household';
import { mockTasks, mockRoutines } from './tasks';
import { mockAreas, mockVarieties, mockPlantings, mockHarvests } from './garden';
import { mockAnimalGroups, mockAnimalLogs } from './animals';
import { mockPantryItems } from './pantry';
import { mockExpenses, mockIncomes, mockExpenseCategories, mockIncomeCategories } from './finance';
import { mockWeather } from './weather';

export const mockData = {
  user: mockUser,
  household: mockHousehold,
  tasks: mockTasks,
  routines: mockRoutines,
  areas: mockAreas,
  varieties: mockVarieties,
  plantings: mockPlantings,
  harvests: mockHarvests,
  animalGroups: mockAnimalGroups,
  animalLogs: mockAnimalLogs,
  pantryItems: mockPantryItems,
  expenses: mockExpenses,
  incomes: mockIncomes,
  expenseCategories: mockExpenseCategories,
  incomeCategories: mockIncomeCategories,
  weather: mockWeather,
};
