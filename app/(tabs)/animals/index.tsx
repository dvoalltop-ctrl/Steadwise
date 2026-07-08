import { ScrollView, View, StyleSheet } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { SectionHeader, ListItem, StatCard, FAB, EmptyState } from '@/components/ui';
import { useData, useDashboardStats } from '@/providers/data-provider';
import { spacing } from '@/theme';

const SPECIES_ICONS = {
  chicken: 'github' as const,
  goat: 'gitlab' as const,
  duck: 'twitter' as const,
  rabbit: 'heart' as const,
  bee: 'hexagon' as const,
  other: 'circle' as const,
};

export default function AnimalsScreen() {
  const { animalGroups, animalLogs } = useData();
  const { eggsToday } = useDashboardStats();

  if (animalGroups.length === 0) {
    return (
      <Screen>
        <EmptyState
          icon="github"
          title="Add your first flock or herd"
          description="Track feeding, health, and daily production like eggs or milk."
          actionLabel="Add group"
          onAction={() => {}}
        />
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.section}>
          <StatCard icon="sun" label="Eggs today" value={eggsToday} subtitle="laying flock" />
        </View>

        <View style={styles.section}>
          <SectionHeader title="Groups" />
          {animalGroups.map((group) => (
            <ListItem
              key={group.id}
              title={group.name}
              subtitle={`${group.count} ${group.species}${group.breed ? ` · ${group.breed}` : ''}`}
              icon={SPECIES_ICONS[group.species] ?? 'circle'}
              rightText={group.status}
            />
          ))}
        </View>

        <View style={styles.section}>
          <SectionHeader title="Recent logs" />
          {animalLogs.slice(0, 5).map((log) => (
            <ListItem
              key={log.id}
              title={log.notes ?? `${log.logType} log`}
              subtitle={log.loggedAt.split('T')[0]}
              icon="activity"
              rightText={log.quantity ? `${log.quantity} ${log.unit}` : undefined}
            />
          ))}
        </View>
      </ScrollView>
      <FAB onPress={() => {}} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 100 },
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
});
