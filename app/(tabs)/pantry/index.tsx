import { ScrollView, View, StyleSheet } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { ListItem, FAB, EmptyState, Badge, Card } from '@/components/ui';
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
      <Screen>
        <EmptyState
          icon="archive"
          title="Stock your pantry"
          description="Track canned goods, freezer items, and dry storage with low-stock alerts."
          actionLabel="Add item"
          onAction={() => {}}
        />
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {lowStock.length > 0 && (
          <View style={styles.section}>
            <Card style={styles.alert}>
              <Badge label={`${lowStock.length} items low`} variant="warning" />
            </Card>
          </View>
        )}

        <View style={styles.section}>
          {pantryItems.map((item) => {
            const low = isLowStock(item.quantity, item.lowStockThreshold);
            return (
              <ListItem
                key={item.id}
                title={item.name}
                subtitle={`${item.locationLabel ?? item.category}${item.expirationDate ? ` · exp ${item.expirationDate}` : ''}`}
                icon="archive"
                rightText={`${item.quantity} ${item.unit}`}
              />
            );
          })}
        </View>
      </ScrollView>
      <FAB onPress={() => {}} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 100 },
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  alert: { backgroundColor: '#FDF6E3' },
});
