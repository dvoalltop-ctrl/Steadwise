import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/theme';
import type { Task } from '@/types';

interface TaskRowProps {
  task: Task;
  onToggle?: (id: string) => void;
}

/** Single task line with a check toggle. */
export function TaskRow({ task, onToggle }: TaskRowProps) {
  const done = task.status === 'done';

  return (
    <Pressable style={styles.row} onPress={() => onToggle?.(task.id)}>
      <Feather
        name={done ? 'check-circle' : 'circle'}
        size={22}
        color={done ? colors.sage : colors.textMuted}
      />
      <Text style={[styles.title, done && styles.doneTitle]}>{task.title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  title: {
    flex: 1,
    fontSize: typography.size.md,
    color: colors.textPrimary,
  },
  doneTitle: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
});
