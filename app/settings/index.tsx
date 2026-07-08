import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { ListItem, Card } from '@/components/ui';
import { useAppStore } from '@/stores/app-store';
import { useData } from '@/providers/data-provider';
import { colors, spacing, typography } from '@/theme';

export default function SettingsScreen() {
  const resetOnboarding = useAppStore((s) => s.resetOnboarding);
  const useLocalDb = useAppStore((s) => s.useLocalDb);
  const setUseLocalDb = useAppStore((s) => s.setUseLocalDb);
  const { householdName } = useData();

  return (
    <Screen>
      <ScrollView>
        <Text style={styles.title}>Settings</Text>

        <Card style={styles.card}>
          <Text style={styles.sectionLabel}>Homestead</Text>
          <Text style={styles.value}>{householdName}</Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionLabel}>Data source</Text>
          <View style={styles.toggleRow}>
            <Pressable
              style={[styles.toggle, !useLocalDb && styles.toggleActive]}
              onPress={() => setUseLocalDb(false)}
            >
              <Text style={[styles.toggleText, !useLocalDb && styles.toggleTextActive]}>Mock</Text>
            </Pressable>
            <Pressable
              style={[styles.toggle, useLocalDb && styles.toggleActive]}
              onPress={() => setUseLocalDb(true)}
            >
              <Text style={[styles.toggleText, useLocalDb && styles.toggleTextActive]}>Local DB</Text>
            </Pressable>
          </View>
        </Card>

        <ListItem title="Sync diagnostics" subtitle="Coming in Phase D" icon="refresh-cw" />
        <ListItem title="Household members" subtitle="Coming in Phase D" icon="users" />
        <ListItem title="About Steadwise" subtitle="v0.1.0 MVP" icon="info" />

        <Pressable
          style={styles.reset}
          onPress={() => {
            resetOnboarding();
            router.replace('/onboarding/welcome');
          }}
        >
          <Text style={styles.resetText}>Reset onboarding</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: typography.size.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  card: { marginBottom: spacing.lg },
  sectionLabel: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: typography.size.lg,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  toggle: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: colors.sage,
    borderColor: colors.sage,
  },
  toggleText: { color: colors.textSecondary, fontWeight: '500' },
  toggleTextActive: { color: colors.white },
  reset: { marginTop: spacing.xxl, alignItems: 'center', padding: spacing.lg },
  resetText: { color: colors.danger, fontSize: typography.size.md },
});
