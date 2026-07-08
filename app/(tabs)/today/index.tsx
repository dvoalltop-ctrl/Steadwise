import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import {
  SectionHeader,
  StatCard,
  TaskRow,
  WeatherCard,
  FAB,
  Card,
  Badge,
} from '@/components/ui';
import { useData, useTodayTasks, useDashboardStats } from '@/providers/data-provider';
import { colors, spacing, typography } from '@/theme';

export default function TodayScreen() {
  const { householdName, weather, completeTask, harvests, animalLogs } = useData();
  const { dueToday, overdue } = useTodayTasks();
  const { eggsToday, harvestThisWeek, lowStockCount } = useDashboardStats();

  const greeting = getGreeting();

  const recentActivity = [
    ...harvests.slice(0, 2).map((h) => ({
      id: h.id,
      text: `Harvested ${h.quantity} ${h.unit}`,
      time: h.harvestedOn,
    })),
    ...animalLogs.slice(0, 2).map((l) => ({
      id: l.id,
      text: l.notes ?? `Logged ${l.quantity ?? ''} ${l.unit ?? l.logType}`,
      time: l.loggedAt.split('T')[0],
    })),
  ].slice(0, 4);

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.homestead}>{householdName}</Text>
        </View>

        <View style={styles.section}>
          <WeatherCard weather={weather} />
        </View>

        <View style={[styles.section, styles.statsRow]}>
          <StatCard icon="sun" label="Eggs today" value={eggsToday} />
          <StatCard icon="package" label="Harvest (wk)" value={`${harvestThisWeek} lbs`} />
          <StatCard icon="alert-circle" label="Low stock" value={lowStockCount} />
        </View>

        {overdue.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Overdue" />
            <Card padded={false} style={styles.listCard}>
              {overdue.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggle={() => completeTask(task.id)}
                />
              ))}
            </Card>
          </View>
        )}

        <View style={styles.section}>
          <SectionHeader
            title="Due today"
            action={{ label: 'See all', onPress: () => router.push('/(tabs)/tasks') }}
          />
          {dueToday.length === 0 ? (
            <Card>
              <Text style={styles.emptyText}>All caught up for today.</Text>
            </Card>
          ) : (
            <Card padded={false} style={styles.listCard}>
              {dueToday.slice(0, 5).map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggle={() => completeTask(task.id)}
                />
              ))}
            </Card>
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader title="Quick actions" />
          <View style={styles.quickGrid}>
            {QUICK_ACTIONS.map((action) => (
              <Card
                key={action.label}
                style={styles.quickCard}
                padded
              >
                <Text
                  style={styles.quickLabel}
                  onPress={() => router.push(action.href as never)}
                >
                  {action.label}
                </Text>
              </Card>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Recent activity" />
          <Card padded={false}>
            {recentActivity.length === 0 ? (
              <Text style={[styles.emptyText, styles.padded]}>No recent logs yet.</Text>
            ) : (
              recentActivity.map((item) => (
                <View key={item.id} style={styles.activityRow}>
                  <Text style={styles.activityText}>{item.text}</Text>
                  <Badge label={item.time} variant="default" />
                </View>
              ))
            )}
          </Card>
        </View>
      </ScrollView>

      <FAB onPress={() => router.push('/quick-add')} />
    </Screen>
  );
}

const QUICK_ACTIONS = [
  { label: 'Log harvest', href: '/(tabs)/grow' },
  { label: 'Log eggs', href: '/(tabs)/animals' },
  { label: 'Add expense', href: '/(tabs)/money' },
  { label: 'Add task', href: '/(tabs)/tasks' },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 100 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  greeting: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  homestead: {
    fontSize: typography.size.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  listCard: { overflow: 'hidden' },
  emptyText: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.lg,
  },
  padded: { padding: spacing.lg },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  quickCard: {
    width: '47%',
    minHeight: 56,
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: typography.size.md,
    fontWeight: '500',
    color: colors.sageDark,
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  activityText: {
    flex: 1,
    fontSize: typography.size.md,
    color: colors.textPrimary,
    marginRight: spacing.md,
  },
});
