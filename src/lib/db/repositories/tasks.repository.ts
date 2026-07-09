import type { Task } from '@/types';
import { getDatabase } from '../client';
import { TABLES } from '../schema';
import { toBaseRecordFields, nowIso } from '../utils';

function rowToTask(row: Record<string, unknown>): Task {
  return {
    ...toBaseRecordFields(row),
    title: row.title as string,
    description: (row.description as string) ?? null,
    status: row.status as Task['status'],
    priority: row.priority as Task['priority'],
    dueDate: (row.due_date as string) ?? null,
    dueTime: (row.due_time as string) ?? null,
    assignedTo: (row.assigned_to as string) ?? null,
    routineId: (row.routine_id as string) ?? null,
    areaId: (row.area_id as string) ?? null,
    tags: JSON.parse((row.tags as string) || '[]'),
    reminderAt: (row.reminder_at as string) ?? null,
    completedAt: (row.completed_at as string) ?? null,
    recurrenceRule: (row.recurrence_rule as string) ?? null,
    season: (row.season as Task['season']) ?? null,
  };
}

export const tasksRepository = {
  async list(householdId: string): Promise<Task[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM ${TABLES.tasks} WHERE household_id = ? AND deleted_at IS NULL ORDER BY due_date ASC`,
      [householdId]
    );
    return rows.map(rowToTask);
  },

  async getById(id: string): Promise<Task | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<Record<string, unknown>>(
      `SELECT * FROM ${TABLES.tasks} WHERE id = ? AND deleted_at IS NULL`,
      [id]
    );
    return row ? rowToTask(row) : null;
  },

  async create(task: Task): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO ${TABLES.tasks}
        (id, household_id, title, description, status, priority, due_date, due_time,
         assigned_to, routine_id, area_id, tags, reminder_at, completed_at, recurrence_rule,
         season, created_by, created_at, updated_at, sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        task.id, task.householdId, task.title, task.description, task.status, task.priority,
        task.dueDate, task.dueTime, task.assignedTo, task.routineId, task.areaId,
        JSON.stringify(task.tags), task.reminderAt, task.completedAt, task.recurrenceRule,
        task.season, task.createdBy, task.createdAt, task.updatedAt,
      ]
    );
  },

  async update(task: Task): Promise<void> {
    const db = await getDatabase();
    const at = nowIso();
    await db.runAsync(
      `UPDATE ${TABLES.tasks}
       SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, due_time = ?,
           area_id = ?, tags = ?, recurrence_rule = ?, season = ?, completed_at = ?,
           updated_at = ?, sync_status = 'pending'
       WHERE id = ?`,
      [
        task.title, task.description, task.status, task.priority, task.dueDate, task.dueTime,
        task.areaId, JSON.stringify(task.tags), task.recurrenceRule, task.season, task.completedAt,
        at, task.id,
      ]
    );
  },

  async complete(id: string): Promise<void> {
    const db = await getDatabase();
    const at = nowIso();
    await db.runAsync(
      `UPDATE ${TABLES.tasks}
       SET status = 'done', completed_at = ?, updated_at = ?, sync_status = 'pending'
       WHERE id = ?`,
      [at, at, id]
    );
  },

  async softDelete(id: string): Promise<void> {
    const db = await getDatabase();
    const at = nowIso();
    await db.runAsync(
      `UPDATE ${TABLES.tasks}
       SET deleted_at = ?, updated_at = ?, sync_status = 'pending'
       WHERE id = ?`,
      [at, at, id]
    );
  },
};
