import { EmptyState, Screen } from '@/components';

export function GardenScreen() {
  return (
    <Screen title="Grow" subtitle="Beds, plantings & harvests">
      <EmptyState
        icon="sun"
        title="Your garden is empty"
        message="Track beds, plantings, and harvest logs once the garden module is ready."
        note="Mock data only — no plantings recorded yet."
      />
    </Screen>
  );
}
