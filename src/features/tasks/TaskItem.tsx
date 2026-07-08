import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Task } from '@/src/lib/db/types';
import { spacing } from '@/src/theme/spacing';
import { useThemeColors } from '@/src/theme/useThemeColors';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, done: boolean) => void;
  onDelete: (id: string) => void;
}

const priorityLabels: Record<Task['priority'], string> = {
  low: 'Low',
  normal: 'Normal',
  high: 'High',
};

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const theme = useThemeColors();
  const isDone = task.status === 'done';

  return (
    <View style={[styles.container, { backgroundColor: theme.white, borderColor: theme.border }]}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isDone }}
        onPress={() => onToggle(task.id, !isDone)}
        style={[
          styles.checkbox,
          {
            borderColor: theme.sage,
            backgroundColor: isDone ? theme.sage : 'transparent',
          },
        ]}>
        {isDone ? <Text style={styles.checkmark}>✓</Text> : null}
      </Pressable>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: theme.earth },
            isDone && styles.titleDone,
          ]}>
          {task.title}
        </Text>
        {task.notes ? (
          <Text style={[styles.notes, { color: theme.earthMuted }]} numberOfLines={2}>
            {task.notes}
          </Text>
        ) : null}
        <View style={styles.metaRow}>
          <Text style={[styles.meta, { color: theme.terracotta }]}>
            {priorityLabels[task.priority]}
          </Text>
          {task.due_date ? (
            <Text style={[styles.meta, { color: theme.earthMuted }]}>Due {task.due_date}</Text>
          ) : null}
        </View>
      </View>

      <Pressable
        accessibilityLabel={`Delete ${task.title}`}
        onPress={() => onDelete(task.id)}
        style={({ pressed }) => [styles.deleteButton, { opacity: pressed ? 0.6 : 1 }]}>
        <Text style={{ color: theme.error }}>Delete</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 14,
    borderWidth: 1,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkmark: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  titleDone: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  notes: {
    fontSize: 14,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  meta: {
    fontSize: 13,
    fontWeight: '500',
  },
  deleteButton: {
    padding: spacing.xs,
  },
});
