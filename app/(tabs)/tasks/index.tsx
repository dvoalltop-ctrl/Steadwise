import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { AppScreen, TaskRow, FAB, EmptyState, TagPill, ListGroup } from '@/components/ui';
import { useData } from '@/providers/data-provider';
import { getTodayDateString } from '@/features/tasks/utils/recurrence';
import { spacing } from '@/theme';

type Filter = 'today' | 'overdue' | 'upcoming' | 'all';

export default function TasksScreen() {
  const { tasks, completeTask } = useData();
  const [filter, setFilter] = useState<Filter>('today');
  const today = getTodayDateString();

  const filtered = tasks.filter((t) => {
    if (t.status === 'done' && filter !== 'all') return false;
    switch (filter) {
      case 'today':
        return t.dueDate === today;
      case 'overdue':
        return t.dueDate && t.dueDate < today && t.status === 'open';
      case 'upcoming':
        return t.dueDate && t.dueDate > today;
      default:
        return true;
    }
  });

  return (
    <AppScreen padded={false}>
      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <TagPill
            key={f.key}
            label={f.label}
            selected={filter === f.key}
            onPress={() => setFilter(f.key)}
          />
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon="check-square"
            title="No tasks here"
            description="Add your first chore or routine to stay on top of homestead life."
            actionLabel="Add task"
            onAction={() => router.push('/(tabs)/tasks/new')}
          />
        ) : (
          <View style={styles.listWrap}>
            <ListGroup>
              {filtered.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggle={() => completeTask(task.id)}
                  onPress={() => router.push(`/(tabs)/tasks/${task.id}`)}
                />
              ))}
            </ListGroup>
          </View>
        )}
      </ScrollView>

      <FAB onPress={() => router.push('/(tabs)/tasks/new')} />
    </AppScreen>
  );
}

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'all', label: 'All' },
];

const styles = StyleSheet.create({
  filters: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.lg,
    flexWrap: 'wrap',
  },
  scroll: { paddingBottom: 100, flexGrow: 1 },
  listWrap: { paddingHorizontal: spacing.lg },
});
