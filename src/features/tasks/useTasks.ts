import { useCallback, useEffect, useState } from 'react';

import {
  createTask,
  listTasks,
  softDeleteTask,
  updateTaskStatus,
  type CreateTaskInput,
} from '@/src/lib/db/tasks';
import type { Task } from '@/src/lib/db/types';
import { useDatabase } from '@/src/providers/DatabaseProvider';

interface UseTasksResult {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addTask: (input: CreateTaskInput) => Promise<void>;
  toggleTask: (id: string, done: boolean) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
}

export function useTasks(): UseTasksResult {
  const { db, isReady } = useDatabase();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!db) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const nextTasks = await listTasks(db);
      setTasks(nextTasks);
    } catch (refreshError) {
      const message =
        refreshError instanceof Error ? refreshError.message : 'Could not load tasks.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [db]);

  useEffect(() => {
    if (isReady && db) {
      void refresh();
    }
  }, [isReady, db, refresh]);

  const addTask = useCallback(
    async (input: CreateTaskInput) => {
      if (!db) {
        throw new Error('Database is not ready.');
      }

      await createTask(db, input);
      await refresh();
    },
    [db, refresh]
  );

  const toggleTask = useCallback(
    async (id: string, done: boolean) => {
      if (!db) {
        return;
      }

      await updateTaskStatus(db, id, done ? 'done' : 'pending');
      await refresh();
    },
    [db, refresh]
  );

  const removeTask = useCallback(
    async (id: string) => {
      if (!db) {
        return;
      }

      await softDeleteTask(db, id);
      await refresh();
    },
    [db, refresh]
  );

  return {
    tasks,
    isLoading,
    error,
    refresh,
    addTask,
    toggleTask,
    removeTask,
  };
}
