import { View, Text, StyleSheet } from 'react-native';
import { AppScreen, Card, ListItem, FAB, EmptyState, SectionHeader, ListGroup } from '@/components/ui';
import { useData } from '@/providers/data-provider';
import { colors, spacing, typography } from '@/theme';

export default function MoneyScreen() {
  const { expenses, incomes } = useData();

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const net = totalIncome - totalExpenses;

  const transactions = [
    ...expenses.map((e) => ({
      id: e.id,
      title: e.description ?? e.vendor ?? 'Expense',
      amount: -e.amount,
      date: e.expenseDate,
      type: 'expense' as const,
    })),
    ...incomes.map((i) => ({
      id: i.id,
      title: i.description ?? i.source ?? 'Income',
      amount: i.amount,
      date: i.incomeDate,
      type: 'income' as const,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  if (expenses.length === 0 && incomes.length === 0) {
    return (
      <AppScreen>
        <EmptyState
          icon="dollar-sign"
          title="Track your first expense"
          description="Keep tabs on feed, seeds, and sales with simple monthly summaries."
          actionLabel="Add expense"
          onAction={() => {}}
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen padded={false} scrollable scrollProps={{ contentContainerStyle: styles.scroll }}>
      <View style={styles.section}>
        <Card variant="elevated">
          <Text style={styles.monthLabel}>This month</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, styles.positive]}>${totalIncome.toFixed(0)}</Text>
              <Text style={styles.summaryLabel}>Income</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>${totalExpenses.toFixed(0)}</Text>
              <Text style={styles.summaryLabel}>Expenses</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, net >= 0 ? styles.positive : styles.negative]}>
                ${net.toFixed(0)}
              </Text>
              <Text style={styles.summaryLabel}>Net</Text>
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Recent transactions" />
        <ListGroup>
          {transactions.map((tx) => (
            <ListItem
              key={tx.id}
              title={tx.title}
              subtitle={tx.date}
              icon={tx.type === 'income' ? 'trending-up' : 'trending-down'}
              rightText={`${tx.amount >= 0 ? '+' : ''}$${Math.abs(tx.amount).toFixed(2)}`}
              showChevron={false}
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
  monthLabel: {
    fontSize: typography.size.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: { alignItems: 'center', flex: 1 },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.borderLight,
  },
  summaryValue: {
    fontSize: typography.size.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  summaryLabel: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  positive: { color: colors.success },
  negative: { color: colors.danger },
});
