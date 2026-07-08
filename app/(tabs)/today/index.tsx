import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import {
  AppScreen,
  AppHeader,
  SectionHeader,
  StatCard,
  TaskRow,
  WeatherCard,
  FAB,
  Card,
  StatusBadge,
  QuickActionButton,
  ListGroup,
} from '@/components/ui';
import { useData, useTodayTasks, useDashboardStats } from '@/providers/data-provider';
import { colors, spacing } from '@/theme';

export default function TodayScreen() {
  const { householdName, weather, completeTask, harvests, animalLogs } = useData();
  const { dueToday, overdue } = useTodayTasks();
  const { eggsToday, harvestThisWeek, lowStockCount } = useDashboardStats();

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
    <AppScreen padded={false} scrollable scrollProps={{ contentContainerStyle: styles.scroll }}>
      <View style={styles.header}>
        <AppHeader
          greeting={getGreeting()}
          title={householdName}
          large
        />
      </View>

      <View style={styles.section}>
        <WeatherCard weather={weather} />
      </View>

      <View style={[styles.section, styles.statsRow]}>
        <StatCard icon="sun" label="Eggs today" value={eggsToday} accent="clay" />
        <StatCard icon="package" label="Harvest (wk)" value={`${harvestThisWeek}`} subtitle="lbs" />
        <StatCard icon="alert-circle" label="Low stock" value={lowStockCount} accent="neutral" />
      </View>

      {overdue.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Overdue" subtitle="Needs attention soon" />
          <ListGroup>
            {overdue.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={() => completeTask(task.id)}
              />
            ))}
          </ListGroup>
        </View>
      )}

      <View style={styles.section}>
        <SectionHeader
          title="Due today"
          action={{ label: 'See all', onPress: () => router.push('/(tabs)/tasks') }}
        />
        {dueToday.length === 0 ? (
          <Card variant="warm">
            <StatusBadge label="All caught up" tone="success" dot />
          </Card>
        ) : (
          <ListGroup>
            {dueToday.slice(0, 5).map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={() => completeTask(task.id)}
              />
            ))}
          </ListGroup>
        )}
      </View>

      <View style={styles.section}>
        <SectionHeader title="Quick actions" subtitle="Log something in a tap" />
        <View style={styles.quickList}>
          {QUICK_ACTIONS.map((action) => (
            <QuickActionButton
              key={action.label}
              label={action.label}
              icon={action.icon}
              accent={action.accent}
              onPress={() => router.push(action.href as never)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Recent activity" />
        <Card padded={false}>
          {recentActivity.length === 0 ? (
            <View style={styles.emptyActivity}>
              <StatusBadge label="No logs yet" tone="neutral" />
            </View>
          ) : (
            recentActivity.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.activityRow,
                  index === recentActivity.length - 1 && styles.activityRowLast,
                ]}
              >
                <View style={styles.activityTextWrap}>
                  <View style={styles.activityDot} />
                  <Text style={styles.activityText}>{item.text}</Text>
                </View>
                <StatusBadge label={item.time} tone="clay" />
              </View>
            ))
          )}
        </Card>
      </View>

      <FAB onPress={() => router.push('/quick-add')} />
    </AppScreen>
  );
}

const QUICK_ACTIONS = [
  { label: 'Log harvest', icon: 'package' as const, href: '/(tabs)/grow', accent: 'sage' as const },
  { label: 'Log eggs', icon: 'sun' as const, href: '/(tabs)/animals', accent: 'clay' as const },
  { label: 'Add expense', icon: 'dollar-sign' as const, href: '/(tabs)/money', accent: 'wheat' as const },
  { label: 'Add task', icon: 'check-square' as const, href: '/(tabs)/tasks/new', accent: 'sage' as const },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 100 },
  header: { paddingHorizontal: spacing.lg },
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  statsRow: { flexDirection: 'row', gap: spacing.sm },
  quickList: { gap: spacing.sm },
  emptyActivity: { padding: spacing.xl, alignItems: 'center' },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  activityRowLast: { borderBottomWidth: 0 },
  activityTextWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
    gap: spacing.md,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.sage,
  },
  activityText: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
  },
});
