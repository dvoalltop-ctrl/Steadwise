import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui';
import { useAuth } from '@/providers/auth-provider';
import { colors, radius, spacing, typography } from '@/theme';

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
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to sync your homestead across devices.</Text>

        {isDemoMode && (
          <View style={styles.demoBanner}>
            <Text style={styles.demoText}>
              Demo mode — Supabase not configured. Continue offline.
            </Text>
            <Button title="Continue offline" variant="secondary" onPress={skipAuth} />
          </View>
        )}

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@example.com"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor={colors.textMuted}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Button title="Sign in" onPress={handleSignIn} style={styles.button} />

        <Link href="/(auth)/sign-up" style={styles.link}>
          <Text style={styles.linkText}>Create an account</Text>
        </Link>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.xl, justifyContent: 'center' },
  title: { fontSize: typography.size.xxl, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: typography.size.md, color: colors.textSecondary, marginTop: spacing.sm, marginBottom: spacing.xl },
  demoBanner: { backgroundColor: colors.wheat, padding: spacing.lg, borderRadius: radius.lg, marginBottom: spacing.lg, gap: spacing.sm },
  demoText: { fontSize: typography.size.sm, color: colors.textSecondary },
  label: { fontSize: typography.size.sm, fontWeight: '600', color: colors.textSecondary, marginBottom: spacing.xs },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: typography.size.md,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  error: { color: colors.danger, marginBottom: spacing.md },
  button: { marginTop: spacing.md },
  link: { marginTop: spacing.lg, alignItems: 'center' },
  linkText: { color: colors.sage, fontSize: typography.size.md },
});
