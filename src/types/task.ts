import type { BaseRecord } from './common';

export type TaskStatus = 'open' | 'done' | 'skipped' | 'cancelled';
export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';
export type Season = 'spring' | 'summer' | 'fall' | 'winter';

export interface Task extends BaseRecord {
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  dueTime: string | null;
  assignedTo: string | null;
  routineId: string | null;
  areaId: string | null;
  tags: string[];
  reminderAt: string | null;
  completedAt: string | null;
  recurrenceRule: string | null;
  season: Season | null;
}

export interface Routine extends BaseRecord {
  name: string;
  description: string | null;
  recurrenceRule: string;
  defaultAssignee: string | null;
  checklistTemplate: string[];
  isActive: boolean;
}

export interface TaskLog extends BaseRecord {
  taskId: string;
  action: 'completed' | 'skipped' | 'reopened';
  notes: string | null;
  loggedAt: string;
  loggedBy: string;
}
