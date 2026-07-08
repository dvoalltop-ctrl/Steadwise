import { Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { AppScreen, AppHeader, Button, Card, StatusBadge } from '@/components/ui';
import { useData } from '@/providers/data-provider';
import { useSyncStore } from '@/sync/sync-state';
import { isSupabaseConfigured } from '@/lib/supabase';
import { colors, spacing, typography } from '@/theme';

export default function SyncDiagnosticsScreen() {
  const { syncNow } = useData();
  const { status, pendingCount, lastPushAt, lastPullAt, lastError } = useSyncStore();

  const statusTone =
    status === 'idle' ? 'success' : status === 'error' ? 'danger' : status === 'syncing' ? 'info' : 'neutral';

  return (
    <AppScreen scrollable scrollProps={{ contentContainerStyle: styles.scroll }}>
      <AppHeader
        title="Sync diagnostics"
        subtitle="Monitor offline queue and cloud sync"
        onBack={() => router.back()}
      />

      <Card style={styles.card}>
        <Text style={styles.label}>Supabase</Text>
        <StatusBadge
          label={isSupabaseConfigured ? 'Configured' : 'Not configured'}
          tone={isSupabaseConfigured ? 'success' : 'warning'}
          dot
        />
      </Card>

      <Card style={styles.card}>
        <Text style={styles.label}>Sync status</Text>
        <StatusBadge label={status} tone={statusTone} dot />
      </Card>

      <Card style={styles.card}>
        <Text style={styles.label}>Pending mutations</Text>
        <Text style={styles.value}>{pendingCount}</Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.label}>Last push</Text>
        <Text style={styles.value}>{lastPushAt ?? 'Never'}</Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.label}>Last pull</Text>
        <Text style={styles.value}>{lastPullAt ?? 'Never'}</Text>
      </Card>

      {lastError && (
        <Card variant="warm" style={styles.errorCard}>
          <Text style={styles.label}>Last error</Text>
          <Text style={styles.errorText}>{lastError}</Text>
        </Card>
      )}

      <Button
        title="Sync now"
        onPress={syncNow}
        disabled={!isSupabaseConfigured}
        fullWidth
        style={styles.button}
      />

      <Button title="Back" variant="ghost" onPress={() => router.back()} fullWidth />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xxxl },
  card: { marginBottom: spacing.md, gap: spacing.sm },
  label: { fontSize: typography.size.sm, color: colors.textSecondary, fontWeight: '600' },
  value: { fontSize: typography.size.md, fontWeight: '600', color: colors.textPrimary },
  errorCard: { marginBottom: spacing.md },
  errorText: { fontSize: typography.size.sm, color: colors.danger, lineHeight: 20 },
  button: { marginBottom: spacing.md, marginTop: spacing.lg },
});
