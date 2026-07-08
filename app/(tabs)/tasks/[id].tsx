import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { TaskForm } from '@/features/tasks/components/TaskForm';
import { TaskRow, Button } from '@/components/ui';
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
      <Screen>
        <ActivityIndicator color={colors.sage} />
      </Screen>
    );
  }

  if (!task) {
    return (
      <Screen>
        <Text style={styles.notFound}>Task not found</Text>
      </Screen>
    );
  }

  if (editing) {
    return (
      <Screen padded={false}>
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
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <TaskRow
        task={task}
        onToggle={() => completeTask(task.id)}
      />
      <View style={styles.actions}>
        <Button title="Edit" variant="secondary" onPress={() => setEditing(true)} />
        <Button title="Delete" variant="danger" onPress={handleDelete} />
      </View>
      {task.description && (
        <Text style={styles.description}>{task.description}</Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  notFound: { fontSize: typography.size.lg, color: colors.textSecondary },
  actions: { flexDirection: 'row', gap: spacing.md, padding: spacing.lg },
  description: {
    padding: spacing.lg,
    fontSize: typography.size.md,
    color: colors.textSecondary,
    lineHeight: typography.size.md * 1.5,
  },
});
