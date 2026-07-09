import type { Task } from '@/types';
import { tasksRepository } from '@/lib/db/repositories/tasks.repository';
import { taskLogsRepository } from '@/lib/db/repositories/task-logs.repository';
import { syncQueueRepository } from '@/lib/db/repositories/sync-queue.repository';

export class TaskRepository {
  static async create(): Promise<TaskRepository> {
    return new TaskRepository();
  }

  async getAll(householdId: string): Promise<Task[]> {
    return tasksRepository.list(householdId);
  }

  async getById(id: string): Promise<Task | null> {
    return tasksRepository.getById(id);
  }

  async getDueToday(householdId: string, today: string): Promise<Task[]> {
    const all = await tasksRepository.list(householdId);
    return all.filter((t) => t.status === 'open' && t.dueDate === today);
  }

  async getOverdue(householdId: string, today: string): Promise<Task[]> {
    const all = await tasksRepository.list(householdId);
    return all.filter((t) => t.status === 'open' && t.dueDate && t.dueDate < today);
  }

  async create(task: Task): Promise<void> {
    await tasksRepository.create(task);
    await syncQueueRepository.enqueue({
      householdId: task.householdId,
      entityType: 'tasks',
      entityId: task.id,
      operation: 'insert',
      payload: task as unknown as Record<string, unknown>,
    });
  }

  async update(task: Task): Promise<void> {
    await tasksRepository.update(task);
    await syncQueueRepository.enqueue({
      householdId: task.householdId,
      entityType: 'tasks',
      entityId: task.id,
      operation: 'update',
      payload: task as unknown as Record<string, unknown>,
    });
  }

  async completeTask(id: string, householdId: string): Promise<void> {
    await tasksRepository.complete(id);
    await taskLogsRepository.create({
      householdId,
      taskId: id,
      action: 'completed',
    });
    await syncQueueRepository.enqueue({
      householdId,
      entityType: 'tasks',
      entityId: id,
      operation: 'update',
      payload: { status: 'done' },
    });
  }

  async softDelete(id: string, householdId: string): Promise<void> {
    await tasksRepository.softDelete(id);
    await syncQueueRepository.enqueue({
      householdId,
      entityType: 'tasks',
      entityId: id,
      operation: 'delete',
      payload: { id },
    });
  }
}
