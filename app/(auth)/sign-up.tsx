import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui';
import { useAuth } from '@/providers/auth-provider';
import { colors, radius, spacing, typography } from '@/theme';

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    const result = await signUp(email, password);
    if (result.error) {
      setError(result.error);
    } else {
      router.replace('/onboarding/welcome');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Start running your homestead with confidence.</Text>

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
          placeholder="At least 6 characters"
          placeholderTextColor={colors.textMuted}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Button title="Create account" onPress={handleSignUp} style={styles.button} />

        <Link href="/(auth)/sign-in" style={styles.link}>
          <Text style={styles.linkText}>Already have an account? Sign in</Text>
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
