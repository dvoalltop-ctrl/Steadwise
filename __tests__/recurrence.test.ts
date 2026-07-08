import { describe, it, expect } from 'vitest';
import { expandRecurringTasks, parseRecurrenceRule } from '@/features/tasks/utils/recurrence';
import type { Task } from '@/types';

const baseTask: Task = {
  id: 't1',
  householdId: 'hh1',
  title: 'Daily chore',
  description: null,
  status: 'open',
  priority: 'normal',
  dueDate: '2026-07-01',
  dueTime: null,
  assignedTo: null,
  routineId: null,
  areaId: null,
  tags: [],
  reminderAt: null,
  completedAt: null,
  recurrenceRule: 'FREQ=DAILY',
  season: null,
  createdBy: null,
  createdAt: '2026-07-01',
  updatedAt: '2026-07-01',
  deletedAt: null,
  localSyncStatus: 'synced',
  lastSyncedAt: null,
};

describe('parseRecurrenceRule', () => {
  it('parses daily frequency', () => {
    expect(parseRecurrenceRule('FREQ=DAILY')).toEqual({ frequency: 'daily' });
  });

  it('parses weekly with byday', () => {
    expect(parseRecurrenceRule('FREQ=WEEKLY;BYDAY=SA')).toEqual({
      frequency: 'weekly',
      byDay: ['SA'],
    });
  });

  it('returns null for empty rule', () => {
    expect(parseRecurrenceRule(null)).toEqual({ frequency: null });
  });
});

describe('expandRecurringTasks', () => {
  it('expands daily tasks across date range', () => {
    const start = new Date('2026-07-01');
    const end = new Date('2026-07-03');
    const result = expandRecurringTasks([baseTask], start, end);
    expect(result).toHaveLength(3);
    expect(result.map((r) => r.occurrenceDate)).toEqual([
      '2026-07-01',
      '2026-07-02',
      '2026-07-03',
    ]);
  });

  it('skips tasks without recurrence', () => {
    const task = { ...baseTask, recurrenceRule: null };
    const result = expandRecurringTasks(
      [task],
      new Date('2026-07-01'),
      new Date('2026-07-03')
    );
    expect(result).toHaveLength(0);
  });
});
