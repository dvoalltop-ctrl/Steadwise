/**
 * Shared domain types. These describe the shapes used across feature modules.
 * No persistence logic lives here yet — data is mocked during this phase.
 */

export type ID = string;

export type TaskStatus = 'open' | 'done';

export interface Task {
  id: ID;
  title: string;
  dueDate?: string;
  status: TaskStatus;
}

export interface Planting {
  id: ID;
  name: string;
  bed: string;
  stage: 'seedling' | 'growing' | 'harvest';
}

export interface AnimalGroup {
  id: ID;
  name: string;
  species: string;
  count: number;
}

export interface PantryItem {
  id: ID;
  name: string;
  quantity: number;
  unit: string;
  lowStockThreshold?: number;
}

export type MoneyKind = 'expense' | 'income';

export interface MoneyEntry {
  id: ID;
  label: string;
  amount: number;
  kind: MoneyKind;
  date: string;
}

export interface Weather {
  tempF: number;
  condition: string;
  high: number;
  low: number;
}
