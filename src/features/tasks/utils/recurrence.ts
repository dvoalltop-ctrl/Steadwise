import type { Task } from '@/types';

/** Parse simplified RRULE-like strings for MVP recurrence. */
export function parseRecurrenceRule(rule: string | null): {
  frequency: 'daily' | 'weekly' | 'monthly' | null;
  byDay?: string[];
} {
  if (!rule) return { frequency: null };

  const parts = rule.split(';').reduce<Record<string, string>>((acc, part) => {
    const [key, value] = part.split('=');
    if (key && value) acc[key] = value;
    return acc;
  }, {});

  const freq = parts.FREQ?.toLowerCase();
  if (freq === 'daily') return { frequency: 'daily' };
  if (freq === 'weekly') {
    return {
      frequency: 'weekly',
      byDay: parts.BYDAY?.split(',') ?? [],
    };
  }
  if (freq === 'monthly') return { frequency: 'monthly' };
  return { frequency: null };
}

/** Expand recurring tasks into due instances for a date range. */
export function expandRecurringTasks(
  tasks: Task[],
  startDate: Date,
  endDate: Date
): Array<{ task: Task; occurrenceDate: string }> {
  const results: Array<{ task: Task; occurrenceDate: string }> = [];
  const fmt = (d: Date) => d.toISOString().split('T')[0];

  for (const task of tasks) {
    if (!task.recurrenceRule || task.deletedAt) continue;

    const { frequency, byDay } = parseRecurrenceRule(task.recurrenceRule);
    if (!frequency) continue;

    const cursor = new Date(startDate);
    while (cursor <= endDate) {
      const dateStr = fmt(cursor);
      let include = false;

      if (frequency === 'daily') {
        include = true;
      } else if (frequency === 'weekly') {
        const dayMap: Record<number, string> = {
          0: 'SU', 1: 'MO', 2: 'TU', 3: 'WE', 4: 'TH', 5: 'FR', 6: 'SA',
        };
        const dayCode = dayMap[cursor.getDay()];
        include = byDay?.length ? byDay.includes(dayCode) : cursor.getDay() === 1;
      } else if (frequency === 'monthly') {
        include = cursor.getDate() === (task.dueDate ? new Date(task.dueDate).getDate() : 1);
      }

      if (include) {
        results.push({ task, occurrenceDate: dateStr });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  return results;
}

export function isTaskDueToday(task: Task, today: string): boolean {
  return task.status === 'open' && task.dueDate === today;
}

export function isTaskOverdue(task: Task, today: string): boolean {
  return task.status === 'open' && !!task.dueDate && task.dueDate < today;
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}
