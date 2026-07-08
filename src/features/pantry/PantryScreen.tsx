import { EmptyState, Screen } from '@/components';

export function PantryScreen() {
  return (
    <Screen title="Pantry" subtitle="Preserves & stored goods">
      <EmptyState
        icon="package"
        title="Pantry is bare"
        message="Keep tabs on preserves, staples, and low-stock alerts here."
        note="Mock data only — no pantry items recorded yet."
      />
    </Screen>
  );
}
