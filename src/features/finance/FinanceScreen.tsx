import { EmptyState, Screen } from '@/components';

export function FinanceScreen() {
  return (
    <Screen title="Money" subtitle="Expenses & income">
      <EmptyState
        icon="dollar-sign"
        title="No entries yet"
        message="Record homestead expenses and income to see where things stand."
        note="Mock data only — no transactions recorded yet."
      />
    </Screen>
  );
}
