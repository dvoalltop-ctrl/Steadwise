import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import {
  AppScreen,
  AppHeader,
  ListItem,
  Card,
  Button,
  StatusBadge,
  ListGroup,
} from '@/components/ui';
import { useAppStore } from '@/stores/app-store';
import { useData } from '@/providers/data-provider';
import { useAuth } from '@/providers/auth-provider';
import { useSyncStore } from '@/sync/sync-state';
import { isSupabaseConfigured } from '@/lib/supabase';
import { colors, spacing, typography } from '@/theme';

export default function SettingsScreen() {
  const resetOnboarding = useAppStore((s) => s.resetOnboarding);
  const useLocalDb = useAppStore((s) => s.useLocalDb);
  const setUseLocalDb = useAppStore((s) => s.setUseLocalDb);
  const { householdName, syncNow } = useData();
  const { signOut, isDemoMode } = useAuth();
  const pendingCount = useSyncStore((s) => s.pendingCount);

  return (
    <AppScreen scrollable scrollProps={{ contentContainerStyle: styles.scroll }}>
      <AppHeader title="Settings" subtitle="Homestead preferences and sync" />

      <Card style={styles.card}>
        <Text style={styles.sectionLabel}>Homestead</Text>
        <Text style={styles.value}>{householdName}</Text>
        <StatusBadge label={isDemoMode ? 'Offline demo' : 'Connected'} tone={isDemoMode ? 'clay' : 'success'} dot />
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

      <ListGroup style={styles.listGroup}>
        <ListItem
          title="Sync diagnostics"
          subtitle={pendingCount > 0 ? `${pendingCount} pending` : 'All synced'}
          icon="refresh-cw"
          onPress={() => router.push('/settings/sync-diagnostics')}
        />
        <ListItem title="Household members" subtitle="Coming soon" icon="users" showChevron={false} />
        <ListItem title="About Steadwise" subtitle="v0.2.0" icon="info" showChevron={false} />
      </ListGroup>

      {!isDemoMode && isSupabaseConfigured && (
        <Button title="Sync now" variant="secondary" onPress={syncNow} fullWidth style={styles.syncBtn} />
      )}

      <Button
        title="Sign out"
        variant="ghost"
        onPress={async () => {
          await signOut();
          router.replace('/(auth)/sign-in');
        }}
        fullWidth
        style={styles.syncBtn}
      />

      <Pressable
        style={styles.reset}
        onPress={() => {
          resetOnboarding();
          router.replace('/onboarding/welcome');
        }}
      >
        <Text style={styles.resetText}>Reset onboarding</Text>
      </Pressable>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xxxl },
  card: { marginBottom: spacing.lg, gap: spacing.sm },
  sectionLabel: {
    fontSize: typography.size.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: typography.size.xl,
    fontWeight: '700',
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
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: colors.sage,
    borderColor: colors.sage,
  },
  toggleText: { color: colors.textSecondary, fontWeight: '600' },
  toggleTextActive: { color: colors.white },
  listGroup: { marginBottom: spacing.lg },
  reset: { marginTop: spacing.xl, alignItems: 'center', padding: spacing.lg },
  resetText: { color: colors.danger, fontSize: typography.size.md, fontWeight: '500' },
  syncBtn: { marginTop: spacing.md },
});
