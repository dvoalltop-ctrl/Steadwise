import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { Button, Card } from '@/components/ui';
import { useData } from '@/providers/data-provider';
import { useSyncStore } from '@/sync/sync-state';
import { isSupabaseConfigured } from '@/lib/supabase';
import { colors, spacing, typography } from '@/theme';

export default function SyncDiagnosticsScreen() {
  const { syncNow } = useData();
  const { status, pendingCount, lastPushAt, lastPullAt, lastError } = useSyncStore();

  return (
    <Screen>
      <ScrollView>
        <Card style={styles.card}>
          <Text style={styles.label}>Supabase</Text>
          <Text style={styles.value}>
            {isSupabaseConfigured ? 'Configured' : 'Not configured (offline demo)'}
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.label}>Sync status</Text>
          <Text style={styles.value}>{status}</Text>
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
          <Card style={styles.errorCard}>
            <Text style={styles.label}>Last error</Text>
            <Text style={styles.errorText}>{lastError}</Text>
          </Card>
        )}

        <Button
          title="Sync now"
          onPress={syncNow}
          disabled={!isSupabaseConfigured}
          style={styles.button}
        />

        <Button title="Back" variant="ghost" onPress={() => router.back()} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
  label: { fontSize: typography.size.sm, color: colors.textSecondary, marginBottom: spacing.xs },
  value: { fontSize: typography.size.md, fontWeight: '600', color: colors.textPrimary },
  errorCard: { marginBottom: spacing.md, backgroundColor: '#FCEAE7' },
  errorText: { fontSize: typography.size.sm, color: colors.danger },
  button: { marginBottom: spacing.md },
});
