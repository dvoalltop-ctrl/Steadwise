import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';
import { AppScreen, AppHeader, Button, FormInput } from '@/components/ui';
import { useAuth } from '@/providers/auth-provider';
import { colors, spacing, typography } from '@/theme';

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
    <AppScreen keyboardAvoiding edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.container}>
        <AppHeader
          title="Create account"
          subtitle="Start running your homestead with confidence."
          large
        />

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
          placeholder="At least 6 characters"
          hint="Use at least 6 characters"
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Button title="Create account" onPress={handleSignUp} fullWidth style={styles.button} />

        <Link href="/(auth)/sign-in" style={styles.link}>
          <Text style={styles.linkText}>Already have an account? Sign in</Text>
        </Link>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.xl, justifyContent: 'center' },
  error: { color: colors.danger, marginBottom: spacing.md, fontSize: typography.size.sm },
  button: { marginTop: spacing.md },
  link: { marginTop: spacing.lg, alignItems: 'center' },
  linkText: { color: colors.sage, fontSize: typography.size.md, fontWeight: '500' },
});
