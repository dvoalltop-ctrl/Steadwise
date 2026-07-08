import type { SQLiteDatabase } from 'expo-sqlite';
import type { Task, TaskStatus } from '@/types';
import { getDatabase } from '@/db/client';
import { enqueueSync, mapBaseRecord, nowIso } from '@/lib/repositories/sync-helper';

function rowToTask(row: Record<string, unknown>): Task {
  return {
    ...mapBaseRecord(row),
    title: row.title as string,
    description: (row.description as string) ?? null,
    status: row.status as TaskStatus,
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

export class TaskRepository {
  constructor(private db: SQLiteDatabase) {}

  static async create(): Promise<TaskRepository> {
    const db = await getDatabase();
    return new TaskRepository(db);
  }

  async getAll(householdId: string): Promise<Task[]> {
    const rows = await this.db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM tasks WHERE household_id = ? AND deleted_at IS NULL ORDER BY due_date ASC`,
      [householdId]
    );
    return rows.map(rowToTask);
  }

  async getById(id: string): Promise<Task | null> {
    const row = await this.db.getFirstAsync<Record<string, unknown>>(
      `SELECT * FROM tasks WHERE id = ? AND deleted_at IS NULL`,
      [id]
    );
    return row ? rowToTask(row) : null;
  }

  async getDueToday(householdId: string, today: string): Promise<Task[]> {
    const rows = await this.db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM tasks WHERE household_id = ? AND deleted_at IS NULL
       AND status = 'open' AND due_date = ? ORDER BY priority DESC`,
      [householdId, today]
    );
    return rows.map(rowToTask);
  }

  async getOverdue(householdId: string, today: string): Promise<Task[]> {
    const rows = await this.db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM tasks WHERE household_id = ? AND deleted_at IS NULL
       AND status = 'open' AND due_date < ? ORDER BY due_date ASC`,
      [householdId, today]
    );
    return rows.map(rowToTask);
  }

  async create(task: Task): Promise<void> {
    await this.db.runAsync(
      `INSERT INTO tasks (id, household_id, title, description, status, priority, due_date,
        due_time, assigned_to, routine_id, area_id, tags, recurrence_rule, season,
        created_by, created_at, updated_at, local_sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        task.id, task.householdId, task.title, task.description, task.status, task.priority,
        task.dueDate, task.dueTime, task.assignedTo, task.routineId, task.areaId,
        JSON.stringify(task.tags), task.recurrenceRule, task.season,
        task.createdBy, task.createdAt, task.updatedAt, 'pending',
      ]
    );
    await enqueueSync(this.db, {
      householdId: task.householdId,
      entityType: 'tasks',
      entityId: task.id,
      operation: 'insert',
      payload: task as unknown as Record<string, unknown>,
    });
  }

  async update(task: Task): Promise<void> {
    const now = nowIso();
    await this.db.runAsync(
      `UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?,
        due_date = ?, due_time = ?, area_id = ?, recurrence_rule = ?, season = ?,
        updated_at = ?, local_sync_status = 'pending' WHERE id = ?`,
      [
        task.title, task.description, task.status, task.priority,
        task.dueDate, task.dueTime, task.areaId, task.recurrenceRule, task.season,
        now, task.id,
      ]
    );
    await enqueueSync(this.db, {
      householdId: task.householdId,
      entityType: 'tasks',
      entityId: task.id,
      operation: 'update',
      payload: { ...task, updatedAt: now },
    });
  }

  async completeTask(id: string, householdId: string): Promise<void> {
    const now = nowIso();
    await this.db.runAsync(
      `UPDATE tasks SET status = 'done', completed_at = ?, updated_at = ?,
       local_sync_status = 'pending' WHERE id = ?`,
      [now, now, id]
    );
    await enqueueSync(this.db, {
      householdId,
      entityType: 'tasks',
      entityId: id,
      operation: 'update',
      payload: { status: 'done', completedAt: now, updatedAt: now },
    });
  }

  async softDelete(id: string, householdId: string): Promise<void> {
    const now = nowIso();
    await this.db.runAsync(
      `UPDATE tasks SET deleted_at = ?, updated_at = ?, local_sync_status = 'pending' WHERE id = ?`,
      [now, now, id]
    );
    await enqueueSync(this.db, {
      householdId,
      entityType: 'tasks',
      entityId: id,
      operation: 'delete',
      payload: { deletedAt: now },
    });
  }
}
