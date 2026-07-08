import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SectionHeader, TaskRow, Card, EmptyState } from '@/components/ui';
import type { Task } from '@/types';
import { spacing } from '@/theme';

interface TodayTasksSectionProps {
  overdue: Task[];
  dueToday: Task[];
  onComplete: (id: string) => void;
}

export function TodayTasksSection({ overdue, dueToday, onComplete }: TodayTasksSectionProps) {
  const hasAny = overdue.length > 0 || dueToday.length > 0;

  if (!hasAny) {
    return (
      <View style={styles.section}>
        <SectionHeader title="Today's tasks" />
        <Card>
          <EmptyState
            icon="check-circle"
            title="You're all caught up"
            description="No overdue or due-today tasks. Enjoy the calm — or log something new below."
            actionLabel="Add a task"
            onAction={() => router.push('/(tabs)/tasks/new')}
          />
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      {overdue.length > 0 && (
        <>
          <SectionHeader
            title="Overdue"
            action={{ label: 'See all', onPress: () => router.push('/(tabs)/tasks') }}
          />
          <Card padded={false} style={styles.listCard}>
            {overdue.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={() => onComplete(task.id)}
                onPress={() => router.push(`/(tabs)/tasks/${task.id}`)}
              />
            ))}
          </Card>
        </>
      )}

      <SectionHeader
        title="Due today"
        action={{ label: 'See all', onPress: () => router.push('/(tabs)/tasks') }}
      />
      {dueToday.length === 0 ? (
        <Card>
          <EmptyState
            icon="sun"
            title="Nothing due today"
            description="Overdue items still need attention, but today's list is clear."
          />
        </Card>
      ) : (
        <Card padded={false} style={styles.listCard}>
          {dueToday.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={() => onComplete(task.id)}
              onPress={() => router.push(`/(tabs)/tasks/${task.id}`)}
            />
          ))}
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  listCard: {
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
});
