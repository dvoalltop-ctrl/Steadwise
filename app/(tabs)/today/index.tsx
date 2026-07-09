import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { WeatherCard } from '@/components/ui';
import { TodayTasksSection } from '@/features/today/components/TodayTasksSection';
import {
  QuickLogGrid,
  SnapshotGrid,
} from '@/features/today/components/DashboardSections';
import {
  useData,
  useTodayTasks,
  useDashboardStats,
} from '@/providers/data-provider';
import { DASHBOARD_SUBTITLE, getTimeGreeting } from '@/features/today/utils/greeting';
import { colors, spacing, typography } from '@/theme';

export default function TodayScreen() {
  const { ready, householdName, weather, completeTask } = useData();
  const { dueToday, overdue } = useTodayTasks();
  const {
    openTasksCount,
    harvestThisWeek,
    eggsThisWeek,
    lowStockCount,
    monthlySpend,
  } = useDashboardStats();

  if (!ready) {
    return (
      <Screen padded={false}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.sage} />
          <Text style={styles.loadingText}>Loading your homestead…</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.greeting}>
            {getTimeGreeting()}. {DASHBOARD_SUBTITLE}
          </Text>
          <Text style={styles.homestead}>{householdName}</Text>
        </View>

        <View style={styles.section}>
          <WeatherCard weather={weather} />
        </View>

        <SnapshotGrid
          openTasks={openTasksCount}
          harvestThisWeek={harvestThisWeek}
          eggsThisWeek={eggsThisWeek}
          lowStockCount={lowStockCount}
          monthlySpend={monthlySpend}
        />

        <TodayTasksSection
          overdue={overdue}
          dueToday={dueToday}
          onComplete={(id) => void completeTask(id)}
        />

        <QuickLogGrid />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: spacing.xxxl,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.xs,
  },
  greeting: {
    fontSize: typography.size.lg,
    color: colors.textSecondary,
    fontWeight: '500',
    lineHeight: typography.size.lg * typography.lineHeight.relaxed,
  },
  homestead: {
    fontSize: typography.size.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
});
