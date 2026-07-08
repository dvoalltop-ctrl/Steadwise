import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';
import { AppScreen, AppHeader, Button, FormInput, Card } from '@/components/ui';
import { useAuth } from '@/providers/auth-provider';
import { colors, spacing, typography } from '@/theme';

export default function SignInScreen() {
  const { signIn, isDemoMode } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setError(null);
    const result = await signIn(email, password);
    if (result.error) {
      setError(result.error);
    } else {
      router.replace('/');
    }
  };

  const skipAuth = () => router.replace('/');

  return (
    <AppScreen keyboardAvoiding edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.container}>
        <AppHeader
          title="Welcome back"
          subtitle="Sign in to sync your homestead across devices."
          large
        />

        {isDemoMode && (
          <Card variant="warm" style={styles.demoBanner}>
            <Text style={styles.demoText}>
              Demo mode — Supabase not configured. Continue offline with sample data.
            </Text>
            <Button title="Continue offline" variant="secondary" onPress={skipAuth} fullWidth />
          </Card>
        )}

        <FormInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@example.com"
        />

        <FormInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Button title="Sign in" onPress={handleSignIn} fullWidth style={styles.button} />

        <Link href="/(auth)/sign-up" style={styles.link}>
          <Text style={styles.linkText}>Create an account</Text>
        </Link>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.xl, justifyContent: 'center' },
  demoBanner: { marginBottom: spacing.xl, gap: spacing.md },
  demoText: { fontSize: typography.size.sm, color: colors.textSecondary, lineHeight: 20 },
  error: { color: colors.danger, marginBottom: spacing.md, fontSize: typography.size.sm },
  button: { marginTop: spacing.md },
  link: { marginTop: spacing.lg, alignItems: 'center' },
  linkText: { color: colors.sage, fontSize: typography.size.md, fontWeight: '500' },
});
