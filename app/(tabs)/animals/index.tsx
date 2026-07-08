import { View, StyleSheet } from 'react-native';
import { AppScreen, SectionHeader, ListItem, StatCard, FAB, EmptyState, ListGroup } from '@/components/ui';
import { useData, useDashboardStats } from '@/providers/data-provider';
import { spacing } from '@/theme';

const SPECIES_ICONS = {
  chicken: 'sun' as const,
  goat: 'triangle' as const,
  duck: 'droplet' as const,
  rabbit: 'heart' as const,
  bee: 'hexagon' as const,
  other: 'circle' as const,
};

export default function AnimalsScreen() {
  const { animalGroups, animalLogs } = useData();
  const { eggsToday } = useDashboardStats();

  if (animalGroups.length === 0) {
    return (
      <AppScreen>
        <EmptyState
          icon="heart"
          title="Add your first flock or herd"
          description="Track feeding, health, and daily production like eggs or milk."
          actionLabel="Add group"
          onAction={() => {}}
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen padded={false} scrollable scrollProps={{ contentContainerStyle: styles.scroll }}>
      <View style={styles.section}>
        <StatCard icon="sun" label="Eggs today" value={eggsToday} subtitle="laying flock" accent="clay" />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Groups" subtitle="Flocks, herds, and hives" />
        <ListGroup>
          {animalGroups.map((group) => (
            <ListItem
              key={group.id}
              title={group.name}
              subtitle={`${group.count} ${group.species}${group.breed ? ` · ${group.breed}` : ''}`}
              icon={SPECIES_ICONS[group.species] ?? 'circle'}
              rightText={group.status}
            />
          ))}
        </ListGroup>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Recent logs" subtitle="Production and care notes" />
        <ListGroup>
          {animalLogs.slice(0, 5).map((log) => (
            <ListItem
              key={log.id}
              title={log.notes ?? `${log.logType} log`}
              subtitle={log.loggedAt.split('T')[0]}
              icon="activity"
              rightText={log.quantity ? `${log.quantity} ${log.unit}` : undefined}
            />
          ))}
        </ListGroup>
      </View>

      <FAB onPress={() => {}} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 100 },
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
});
