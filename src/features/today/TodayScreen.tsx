import { View, Text, StyleSheet } from 'react-native';
import { Card, Screen, SectionHeader, StatCard } from '@/components';
import { WeatherCard } from '@/features/weather/WeatherCard';
import { mockWeather } from '@/features/weather/mocks';
import { mockTasks } from '@/features/tasks/mocks';
import { TaskRow } from '@/features/tasks/TaskRow';
import { mockTodayStats } from './mocks';
import { greeting } from '@/lib/utils';
import { colors, spacing, typography } from '@/theme';

export function TodayScreen() {
  const dueToday = mockTasks.filter((t) => t.status === 'open');

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting()}</Text>
        <Text style={styles.homestead}>Oak Creek Homestead</Text>
      </View>

      <WeatherCard weather={mockWeather} />

      <View style={styles.stats}>
        <StatCard icon="sun" label="Eggs today" value={mockTodayStats.eggsToday} />
        <StatCard
          icon="package"
          label="Harvest (wk)"
          value={`${mockTodayStats.harvestWeekLbs} lb`}
        />
        <StatCard icon="alert-circle" label="Low stock" value={mockTodayStats.lowStock} />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Due today" />
        {dueToday.length === 0 ? (
          <Card>
            <Text style={styles.caughtUp}>All caught up for today.</Text>
          </Card>
        ) : (
          <Card padded={false}>
            {dueToday.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </Card>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.md },
  greeting: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    fontWeight: typography.weight.medium,
  },
  homestead: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  section: { marginTop: spacing.xl },
  caughtUp: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
