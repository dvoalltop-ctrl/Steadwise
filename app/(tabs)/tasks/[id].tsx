import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  AppScreen,
  TaskRow,
  Button,
  LoadingState,
  ErrorState,
  ListGroup,
  StatusBadge,
} from '@/components/ui';
import { TaskForm } from '@/features/tasks/components/TaskForm';
import type { TaskFormValues } from '@/features/tasks/schemas';
import { TaskRepository } from '@/features/tasks/repository';
import { useData } from '@/providers/data-provider';
import type { Task } from '@/types';
import { colors, spacing, typography } from '@/theme';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { householdId, refreshTasks, completeTask } = useData();
  const [task, setTask] = useState<Task | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const repo = await TaskRepository.create();
      const found = await repo.getById(id);
      setTask(found);
      setLoading(false);
    }
    load();
  }, [id]);

  const handleUpdate = async (values: TaskFormValues) => {
    if (!task) return;
    const updated: Task = {
      ...task,
      title: values.title,
      description: values.description ?? null,
      priority: values.priority,
      dueDate: values.dueDate ?? null,
      dueTime: values.dueTime ?? null,
      areaId: values.areaId ?? null,
      recurrenceRule: values.recurrenceRule ?? null,
      season: values.season ?? null,
      updatedAt: new Date().toISOString(),
    };
    const repo = await TaskRepository.create();
    await repo.update(updated);
    setTask(updated);
    setEditing(false);
    await refreshTasks();
  };

  const handleDelete = async () => {
    if (!task) return;
    const repo = await TaskRepository.create();
    await repo.softDelete(task.id, householdId);
    await refreshTasks();
    router.back();
  };

  if (loading) {
    return (
      <AppScreen padded={false}>
        <LoadingState message="Loading task…" />
      </AppScreen>
    );
  }

  if (!task) {
    return (
      <AppScreen>
        <ErrorState
          title="Task not found"
          message="This task may have been deleted or moved."
          onRetry={() => router.back()}
          retryLabel="Go back"
          icon="search"
        />
      </AppScreen>
    );
  }

  if (editing) {
    return (
      <AppScreen padded={false}>
        <TaskForm
          defaultValues={{
            title: task.title,
            description: task.description,
            priority: task.priority,
            dueDate: task.dueDate,
            dueTime: task.dueTime,
            areaId: task.areaId,
            recurrenceRule: task.recurrenceRule,
            season: task.season,
          }}
          onSubmit={handleUpdate}
          submitLabel="Update task"
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen padded={false} scrollable>
      <ListGroup style={styles.listGroup}>
        <TaskRow task={task} onToggle={() => completeTask(task.id)} />
      </ListGroup>

      <View style={styles.meta}>
        <StatusBadge label={task.status} tone={task.status === 'done' ? 'success' : 'neutral'} dot />
        <StatusBadge label={task.priority} tone={task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : 'clay'} />
      </View>

      {task.description && (
        <View style={styles.descriptionWrap}>
          <Text style={styles.descriptionLabel}>Notes</Text>
          <Text style={styles.description}>{task.description}</Text>
        </View>
      )}

      <View style={styles.actions}>
        <Button title="Edit" variant="secondary" onPress={() => setEditing(true)} style={styles.actionBtn} />
        <Button title="Delete" variant="danger" onPress={handleDelete} style={styles.actionBtn} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  listGroup: { margin: spacing.lg },
  meta: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  descriptionWrap: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  descriptionLabel: {
    fontSize: typography.size.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: typography.size.md,
    color: colors.textPrimary,
    lineHeight: typography.size.md * 1.5,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
  },
  actionBtn: { flex: 1 },
});
