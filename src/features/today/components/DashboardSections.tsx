import { ScrollView, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SectionHeader, SnapshotCard, QuickLogButton } from '@/components/ui';
import { spacing } from '@/theme';

interface SnapshotGridProps {
  openTasks: number;
  harvestThisWeek: number;
  eggsThisWeek: number;
  lowStockCount: number;
  monthlySpend: number;
}

export function SnapshotGrid({
  openTasks,
  harvestThisWeek,
  eggsThisWeek,
  lowStockCount,
  monthlySpend,
}: SnapshotGridProps) {
  return (
    <View style={styles.section}>
      <SectionHeader title="Homestead snapshot" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.snapshots}>
        <SnapshotCard
          icon="check-square"
          label="Open tasks"
          value={openTasks}
          onPress={() => router.push('/(tabs)/tasks')}
        />
        <SnapshotCard
          icon="package"
          label="Harvest this week"
          value={`${harvestThisWeek.toFixed(1)}`}
          onPress={() => router.push('/(tabs)/grow')}
        />
        <SnapshotCard
          icon="sun"
          label="Eggs this week"
          value={eggsThisWeek}
          onPress={() => router.push('/(tabs)/animals')}
        />
        <SnapshotCard
          icon="alert-circle"
          label="Pantry low stock"
          value={lowStockCount}
          onPress={() => router.push('/(tabs)/pantry')}
        />
        <SnapshotCard
          icon="dollar-sign"
          label="Monthly spend"
          value={`$${monthlySpend.toFixed(0)}`}
          onPress={() => router.push('/(tabs)/money')}
        />
      </ScrollView>
    </View>
  );
}

const QUICK_LOG_ACTIONS = [
  { label: 'Add task', icon: 'plus-square' as const, href: '/(tabs)/tasks/new' },
  { label: 'Log harvest', icon: 'package' as const, href: '/(tabs)/grow' },
  { label: 'Log eggs', icon: 'sun' as const, href: '/(tabs)/animals' },
  { label: 'Add pantry item', icon: 'archive' as const, href: '/(tabs)/pantry' },
  { label: 'Add expense', icon: 'dollar-sign' as const, href: '/(tabs)/money' },
  { label: 'Add note', icon: 'edit-3' as const, href: '/quick-add' },
];

export function QuickLogGrid() {
  return (
    <View style={styles.section}>
      <SectionHeader title="Quick log" />
      <View style={styles.quickGrid}>
        {QUICK_LOG_ACTIONS.map((action) => (
          <QuickLogButton
            key={action.label}
            icon={action.icon}
            label={action.label}
            onPress={() => router.push(action.href as never)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  snapshots: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
