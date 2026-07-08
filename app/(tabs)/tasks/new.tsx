import { router } from 'expo-router';
import { v4 as uuidv4 } from 'uuid';
import { Screen } from '@/components/layout/Screen';
import { TaskForm } from '@/features/tasks/components/TaskForm';
import type { TaskFormValues } from '@/features/tasks/schemas';
import { TaskRepository } from '@/features/tasks/repository';
import { useData } from '@/providers/data-provider';
import { DEMO_USER_ID } from '@/mocks/household';
import type { Task } from '@/types';

export default function NewTaskScreen() {
  const { householdId, refreshTasks } = useData();

  const handleSubmit = async (values: TaskFormValues) => {
    const now = new Date().toISOString();
    const task: Task = {
      id: uuidv4(),
      householdId,
      title: values.title,
      description: values.description ?? null,
      status: 'open',
      priority: values.priority,
      dueDate: values.dueDate ?? null,
      dueTime: values.dueTime ?? null,
      assignedTo: DEMO_USER_ID,
      routineId: null,
      areaId: values.areaId ?? null,
      tags: [],
      reminderAt: null,
      completedAt: null,
      recurrenceRule: values.recurrenceRule ?? null,
      season: values.season ?? null,
      createdBy: DEMO_USER_ID,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      localSyncStatus: 'pending',
      lastSyncedAt: null,
    };

    const repo = await TaskRepository.create();
    await repo.create(task);
    await refreshTasks();
    router.back();
  };

  return (
    <Screen padded={false}>
      <TaskForm onSubmit={handleSubmit} submitLabel="Create task" />
    </Screen>
  );
}
