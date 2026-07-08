import { View, StyleSheet } from 'react-native';
import { AppScreen, SectionHeader, ListItem, StatCard, FAB, EmptyState, ListGroup } from '@/components/ui';
import { useData } from '@/providers/data-provider';
import { spacing } from '@/theme';

export default function GrowScreen() {
  const { areas, plantings, varieties, harvests } = useData();

  const activePlantings = plantings.filter((p) => p.status === 'active' || p.status === 'harvesting');
  const harvestsThisWeek = harvests.length;

  if (areas.length === 0) {
    return (
      <AppScreen>
        <EmptyState
          icon="feather"
          title="Plan your first bed"
          description="Add garden areas, track plantings, and log harvests as the season unfolds."
          actionLabel="Add area"
          onAction={() => {}}
          secondaryLabel="Browse templates"
          onSecondary={() => {}}
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen padded={false} scrollable scrollProps={{ contentContainerStyle: styles.scroll }}>
      <View style={styles.section}>
        <View style={styles.statsRow}>
          <StatCard icon="feather" label="Active plantings" value={activePlantings.length} />
          <StatCard icon="package" label="Harvests" value={harvestsThisWeek} subtitle="recent" accent="clay" />
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Garden areas" subtitle="Beds, plots, and greenhouses" />
        <ListGroup>
          {areas.map((area) => {
            const count = plantings.filter((p) => p.areaId === area.id).length;
            return (
              <ListItem
                key={area.id}
                title={area.name}
                subtitle={area.description ?? area.areaType}
                icon="map-pin"
                rightText={`${count} plantings`}
              />
            );
          })}
        </ListGroup>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Active plantings" subtitle="In the ground now" />
        <ListGroup>
          {activePlantings.map((p) => {
            const variety = varieties.find((v) => v.id === p.varietyId);
            const area = areas.find((a) => a.id === p.areaId);
            return (
              <ListItem
                key={p.id}
                title={variety ? `${variety.commonName} · ${variety.varietyName}` : 'Planting'}
                subtitle={`${area?.name ?? 'Unknown'} · planted ${p.plantedOn}`}
                icon="feather"
                rightText={p.status}
              />
            );
          })}
        </ListGroup>
      </View>

      <FAB onPress={() => {}} icon="plus" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 100 },
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  statsRow: { flexDirection: 'row', gap: spacing.sm },
});
