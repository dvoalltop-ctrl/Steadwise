import { getDatabase } from '../client';
import { TABLES } from '../schema';
import { generateId, nowIso, toBaseRecordFields } from '../utils';
import type { TaskLog } from '@/types';

function rowToTaskLog(row: Record<string, unknown>): TaskLog {
  return {
    ...toBaseRecordFields(row),
    taskId: row.task_id as string,
    action: row.action as TaskLog['action'],
    notes: (row.notes as string) ?? null,
    loggedAt: row.logged_at as string,
    loggedBy: (row.logged_by as string) ?? '',
  };
}

export const taskLogsRepository = {
  async list(householdId: string, taskId?: string): Promise<TaskLog[]> {
    const db = await getDatabase();
    const sql = taskId
      ? `SELECT * FROM ${TABLES.taskLogs} WHERE household_id = ? AND task_id = ? AND deleted_at IS NULL ORDER BY logged_at DESC`
      : `SELECT * FROM ${TABLES.taskLogs} WHERE household_id = ? AND deleted_at IS NULL ORDER BY logged_at DESC`;
    const rows = await db.getAllAsync<Record<string, unknown>>(
      sql,
      taskId ? [householdId, taskId] : [householdId]
    );
    return rows.map(rowToTaskLog);
  },

  async create(input: {
    householdId: string;
    taskId: string;
    action: TaskLog['action'];
    notes?: string | null;
    loggedBy?: string | null;
  }): Promise<TaskLog> {
    const db = await getDatabase();
    const at = nowIso();
    const id = generateId();
    await db.runAsync(
      `INSERT INTO ${TABLES.taskLogs}
        (id, household_id, task_id, action, notes, logged_at, logged_by,
         created_at, updated_at, sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [id, input.householdId, input.taskId, input.action, input.notes ?? null, at, input.loggedBy ?? null, at, at]
    );
    const row = await db.getFirstAsync<Record<string, unknown>>(
      `SELECT * FROM ${TABLES.taskLogs} WHERE id = ?`,
      [id]
    );
    return rowToTaskLog(row!);
  },
};
