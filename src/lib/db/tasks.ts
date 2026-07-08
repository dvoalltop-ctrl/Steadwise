import type { SQLiteDatabase } from 'expo-sqlite';

import { generateId, nowIso } from '@/src/lib/uuid';

import type { Task } from './types';

type TaskRow = Task;

export async function listTasks(db: SQLiteDatabase): Promise<Task[]> {
  return db.getAllAsync<TaskRow>(
    `SELECT * FROM tasks
     WHERE deleted_at IS NULL
     ORDER BY
       CASE status WHEN 'pending' THEN 0 ELSE 1 END,
       CASE priority WHEN 'high' THEN 0 WHEN 'normal' THEN 1 ELSE 2 END,
       due_date IS NULL,
       due_date ASC,
       created_at DESC`
  );
}

export interface CreateTaskInput {
  title: string;
  notes?: string;
  due_date?: string;
  priority?: Task['priority'];
  category?: string;
}

export async function createTask(
  db: SQLiteDatabase,
  input: CreateTaskInput
): Promise<Task> {
  const timestamp = nowIso();
  const task: Task = {
    id: generateId(),
    title: input.title.trim(),
    notes: input.notes?.trim() ?? null,
    due_date: input.due_date ?? null,
    priority: input.priority ?? 'normal',
    status: 'pending',
    category: input.category?.trim() ?? null,
    created_at: timestamp,
    updated_at: timestamp,
    deleted_at: null,
    synced_at: null,
  };

  await db.runAsync(
    `INSERT INTO tasks (
      id, title, notes, due_date, priority, status, category,
      created_at, updated_at, deleted_at, synced_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    task.id,
    task.title,
    task.notes,
    task.due_date,
    task.priority,
    task.status,
    task.category,
    task.created_at,
    task.updated_at,
    task.deleted_at,
    task.synced_at
  );

  return task;
}

export async function updateTaskStatus(
  db: SQLiteDatabase,
  id: string,
  status: Task['status']
): Promise<void> {
  await db.runAsync(
    `UPDATE tasks
     SET status = ?, updated_at = ?, synced_at = NULL
     WHERE id = ? AND deleted_at IS NULL`,
    status,
    nowIso(),
    id
  );
}

export async function softDeleteTask(db: SQLiteDatabase, id: string): Promise<void> {
  const timestamp = nowIso();
  await db.runAsync(
    `UPDATE tasks
     SET deleted_at = ?, updated_at = ?, synced_at = NULL
     WHERE id = ?`,
    timestamp,
    timestamp,
    id
  );
}

export async function getUnsyncedTasks(db: SQLiteDatabase): Promise<Task[]> {
  return db.getAllAsync<TaskRow>(
    `SELECT * FROM tasks
     WHERE synced_at IS NULL OR updated_at > synced_at`
  );
}

export async function markTasksSynced(
  db: SQLiteDatabase,
  ids: string[],
  syncedAt: string
): Promise<void> {
  if (ids.length === 0) {
    return;
  }

  const placeholders = ids.map(() => '?').join(', ');
  await db.runAsync(
    `UPDATE tasks SET synced_at = ? WHERE id IN (${placeholders})`,
    syncedAt,
    ...ids
  );
}
