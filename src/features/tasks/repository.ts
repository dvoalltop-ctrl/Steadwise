import type { SQLiteDatabase } from 'expo-sqlite';
import type { Task, TaskStatus } from '@/types';
import { getDatabase } from '@/db/client';
import { syncQueue } from '@/sync/sync-queue';

function rowToTask(row: Record<string, unknown>): Task {
  return {
    id: row.id as string,
    householdId: row.household_id as string,
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
    createdBy: (row.created_by as string) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    deletedAt: (row.deleted_at as string) ?? null,
    localSyncStatus: row.local_sync_status as Task['localSyncStatus'],
    lastSyncedAt: (row.last_synced_at as string) ?? null,
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

  async completeTask(id: string): Promise<void> {
    const now = new Date().toISOString();
    await this.db.runAsync(
      `UPDATE tasks SET status = 'done', completed_at = ?, updated_at = ?,
       local_sync_status = 'pending' WHERE id = ?`,
      [now, now, id]
    );
    syncQueue.enqueue({
      id: `sync-${id}-${now}`,
      householdId: '',
      entityType: 'tasks',
      entityId: id,
      operation: 'update',
      payload: JSON.stringify({ status: 'done', completedAt: now }),
      createdAt: now,
    });
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
        task.createdBy, task.createdAt, task.updatedAt, task.localSyncStatus,
      ]
    );
  }
}
