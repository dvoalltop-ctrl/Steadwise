import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { Task, TaskPriority } from '@/types';
import { colors, radius, spacing, typography } from '@/theme';

interface TaskRowProps {
  task: Task;
  onToggle?: () => void;
  onPress?: () => void;
}

const priorityColors: Record<TaskPriority, string> = {
  low: colors.gray300,
  normal: colors.sageLight,
  high: colors.warning,
  urgent: colors.danger,
};

export function TaskRow({ task, onToggle, onPress }: TaskRowProps) {
  const isDone = task.status === 'done';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Pressable onPress={onToggle} style={styles.checkbox} hitSlop={8}>
        <View style={[styles.checkboxInner, isDone && styles.checkboxDone]}>
          {isDone && <Feather name="check" size={14} color={colors.white} />}
        </View>
      </Pressable>
      <View style={styles.content}>
        <Text style={[styles.title, isDone && styles.titleDone]} numberOfLines={2}>
          {task.title}
        </Text>
        {task.dueDate && (
          <Text style={styles.due}>{formatDueDate(task.dueDate, task.dueTime)}</Text>
        )}
      </View>
      <View style={[styles.priorityDot, { backgroundColor: priorityColors[task.priority] }]} />
    </Pressable>
  );
}

function formatDueDate(date: string, time: string | null): string {
  const today = new Date().toISOString().split('T')[0];
  const label = date === today ? 'Today' : date;
  return time ? `${label} · ${time}` : label;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  pressed: { backgroundColor: colors.gray50 },
  checkbox: { marginRight: spacing.md },
  checkboxInner: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: colors.sage,
    borderColor: colors.sage,
  },
  content: { flex: 1 },
  title: {
    fontSize: typography.size.md,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  due: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: spacing.sm,
  },
});
