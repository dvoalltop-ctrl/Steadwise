import { View, Text, StyleSheet } from 'react-native';
import { AppScreen, ListItem, FAB, EmptyState, StatusBadge, Card, ListGroup } from '@/components/ui';
import { useData } from '@/providers/data-provider';
import { isLowStock } from '@/features/pantry/utils/inventory';
import { colors, spacing, typography } from '@/theme';

export default function PantryScreen() {
  const { pantryItems } = useData();

  const lowStock = pantryItems.filter((p) =>
    isLowStock(p.quantity, p.lowStockThreshold)
  );

  if (pantryItems.length === 0) {
    return (
      <AppScreen>
        <EmptyState
          icon="archive"
          title="Stock your pantry"
          description="Track canned goods, freezer items, and dry storage with low-stock alerts."
          actionLabel="Add item"
          onAction={() => {}}
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen padded={false} scrollable scrollProps={{ contentContainerStyle: styles.scroll }}>
      {lowStock.length > 0 && (
        <View style={styles.section}>
          <Card variant="warm" style={styles.alert}>
            <StatusBadge label={`${lowStock.length} items running low`} tone="warning" dot />
            <Text style={styles.alertText}>Restock before the next harvest season.</Text>
          </Card>
        </View>
      )}

      <View style={styles.section}>
        <ListGroup>
          {pantryItems.map((item) => (
              <ListItem
                key={item.id}
                title={item.name}
                subtitle={`${item.locationLabel ?? item.category}${item.expirationDate ? ` · exp ${item.expirationDate}` : ''}`}
                icon="archive"
                rightText={`${item.quantity} ${item.unit}`}
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
  alert: { gap: spacing.sm },
  alertText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
