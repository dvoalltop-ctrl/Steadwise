import { EmptyState, Screen } from '@/components';

export function AnimalsScreen() {
  return (
    <Screen title="Animals" subtitle="Flocks, herds & production">
      <EmptyState
        icon="feather"
        title="No animals yet"
        message="Add flocks and herds to log feed, health, and egg or milk production."
        note="Mock data only — no animal groups recorded yet."
      />
    </Screen>
  );
}
