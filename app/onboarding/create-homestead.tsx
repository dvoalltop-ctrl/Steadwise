import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui';
import { colors, radius, spacing, typography } from '@/theme';

export default function CreateHomesteadScreen() {
  const [name, setName] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Name your homestead</Text>
        <Text style={styles.subtitle}>
          This is your household workspace. You can invite family members later.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. Oak Creek Homestead"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
          autoFocus
        />

        <View style={styles.footer}>
          <Button
            title="Continue"
            disabled={name.trim().length < 2}
            onPress={() =>
              router.push({ pathname: '/onboarding/select-types', params: { name } })
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.xl },
  title: {
    fontSize: typography.size.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.xxl,
  },
  subtitle: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    lineHeight: typography.size.md * 1.5,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    fontSize: typography.size.lg,
    color: colors.textPrimary,
  },
  footer: { marginTop: 'auto', marginBottom: spacing.lg },
});
