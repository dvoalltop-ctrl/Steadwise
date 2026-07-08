import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { Card, ListItem, FAB, EmptyState, SectionHeader } from '@/components/ui';
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
      <Screen>
        <EmptyState
          icon="dollar-sign"
          title="Track your first expense"
          description="Keep tabs on feed, seeds, and sales with simple monthly summaries."
          actionLabel="Add expense"
          onAction={() => {}}
        />
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.section}>
          <Card>
            <Text style={styles.monthLabel}>This month</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>${totalIncome.toFixed(2)}</Text>
                <Text style={styles.summaryLabel}>Income</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>${totalExpenses.toFixed(2)}</Text>
                <Text style={styles.summaryLabel}>Expenses</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, net >= 0 ? styles.positive : styles.negative]}>
                  ${net.toFixed(2)}
                </Text>
                <Text style={styles.summaryLabel}>Net</Text>
              </View>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Recent transactions" />
          {transactions.map((tx) => (
            <ListItem
              key={tx.id}
              title={tx.title}
              subtitle={tx.date}
              icon={tx.type === 'income' ? 'trending-up' : 'trending-down'}
              rightText={`${tx.amount >= 0 ? '+' : ''}$${Math.abs(tx.amount).toFixed(2)}`}
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
  monthLabel: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: { alignItems: 'center', flex: 1 },
  summaryValue: {
    fontSize: typography.size.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  summaryLabel: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  positive: { color: colors.success },
  negative: { color: colors.danger },
});
