import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Input } from '@/src/components/ui/Button';
import { LoadingState } from '@/src/components/ui/LoadingState';
import { ScreenHeader } from '@/src/components/ui/ScreenHeader';
import { getSupabaseClient } from '@/src/lib/supabase/client';
import { getPendingSyncCount, syncAll } from '@/src/lib/supabase/sync';
import { useAuth } from '@/src/providers/AuthProvider';
import { useDatabase } from '@/src/providers/DatabaseProvider';
import { spacing } from '@/src/theme/spacing';
import { useThemeColors } from '@/src/theme/useThemeColors';

export function MoreScreen() {
  const theme = useThemeColors();
  const { db, isReady } = useDatabase();
  const { user, isLoading, isConfigured, signIn, signUp, signOutUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const refreshPendingCount = useCallback(async () => {
    if (!db) {
      return;
    }
    const count = await getPendingSyncCount(db);
    setPendingCount(count);
  }, [db]);

  useEffect(() => {
    if (isReady && db) {
      void refreshPendingCount();
    }
  }, [isReady, db, refreshPendingCount]);

  const handleSignIn = async () => {
    setAuthError(null);
    const error = await signIn(email.trim(), password);
    if (error) {
      setAuthError(error);
    }
  };

  const handleSignUp = async () => {
    setAuthError(null);
    const error = await signUp(email.trim(), password);
    if (error) {
      setAuthError(error);
    } else {
      setAuthError('Check your email to confirm your account, then sign in.');
    }
  };

  const handleSignOut = async () => {
    setAuthError(null);
    const error = await signOutUser();
    if (error) {
      setAuthError(error);
    }
  };

  const handleSync = async () => {
    if (!db || !user) {
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      setSyncMessage('Supabase is not configured yet.');
      return;
    }

    setIsSyncing(true);
    setSyncMessage(null);

    const result = await syncAll(db, supabase, user.id);
    setSyncMessage(result.message ?? `Sync ${result.status}.`);
    await refreshPendingCount();
    setIsSyncing(false);
  };

  if (!isReady || isLoading) {
    return <LoadingState message="Loading account settings…" />;
  }

  return (
    <ScrollView style={[styles.screen, { backgroundColor: theme.cream }]}>
      <ScreenHeader title="More" subtitle="Account, sync, and settings." />

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.earth }]}>Cloud sync</Text>
        <Text style={[styles.body, { color: theme.earthMuted }]}>
          Steadwise works fully offline. Sign in to back up and sync when you are online.
        </Text>
        <Text style={[styles.meta, { color: theme.earth }]}>
          Pending local changes: {pendingCount}
        </Text>
        {syncMessage ? (
          <Text style={[styles.body, { color: theme.sage }]}>{syncMessage}</Text>
        ) : null}
        <Button
          label={isSyncing ? 'Syncing…' : 'Sync now'}
          onPress={() => void handleSync()}
          disabled={!user || isSyncing || !isConfigured}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.earth }]}>Account</Text>
        {!isConfigured ? (
          <Text style={[styles.body, { color: theme.earthMuted }]}>
            Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to enable cloud sync.
          </Text>
        ) : user ? (
          <>
            <Text style={[styles.body, { color: theme.earthMuted }]}>
              Signed in as {user.email}
            </Text>
            <Button label="Sign out" variant="secondary" onPress={() => void handleSignOut()} />
          </>
        ) : (
          <>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="At least 6 characters"
            />
            {authError ? (
              <Text style={[styles.body, { color: theme.error }]}>{authError}</Text>
            ) : null}
            <Button label="Sign in" onPress={() => void handleSignIn()} />
            <Button label="Create account" variant="secondary" onPress={() => void handleSignUp()} />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  section: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
  },
  meta: {
    fontSize: 15,
    fontWeight: '500',
  },
});
