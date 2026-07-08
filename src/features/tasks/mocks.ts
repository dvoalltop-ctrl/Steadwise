import type { Task } from '@/types';
import { todayISO } from '@/lib/utils';

const today = todayISO();

export const mockTasks: Task[] = [
  { id: 'task_1', title: 'Water tomato beds', dueDate: today, status: 'open' },
  { id: 'task_2', title: 'Collect eggs', dueDate: today, status: 'open' },
  { id: 'task_3', title: 'Refill chicken waterers', dueDate: today, status: 'open' },
  { id: 'task_4', title: 'Turn compost pile', dueDate: today, status: 'done' },
];
