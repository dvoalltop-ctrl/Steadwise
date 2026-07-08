import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { SectionHeader, ListItem, StatCard, FAB, EmptyState } from '@/components/ui';
import { useData } from '@/providers/data-provider';
import { colors, spacing, typography } from '@/theme';

export default function GrowScreen() {
  const { areas, plantings, varieties, harvests } = useData();

  const activePlantings = plantings.filter((p) => p.status === 'active' || p.status === 'harvesting');
  const harvestsThisWeek = harvests.length;

  if (areas.length === 0) {
    return (
      <Screen>
        <EmptyState
          icon="feather"
          title="Plan your first bed"
          description="Add garden areas, track plantings, and log harvests as the season unfolds."
          actionLabel="Add area"
          onAction={() => {}}
        />
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.section}>
          <View style={styles.statsRow}>
            <StatCard icon="feather" label="Active plantings" value={activePlantings.length} />
            <StatCard icon="package" label="Harvests" value={harvestsThisWeek} subtitle="recent" />
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Garden areas" />
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
        </View>

        <View style={styles.section}>
          <SectionHeader title="Active plantings" />
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
        </View>
      </ScrollView>
      <FAB onPress={() => {}} icon="plus" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 100 },
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  statsRow: { flexDirection: 'row', gap: spacing.sm },
});
