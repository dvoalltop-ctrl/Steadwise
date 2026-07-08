import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Screen } from '@/components/layout/Screen';
import { colors, radius, spacing, typography } from '@/theme';

const ACTIONS = [
  { label: 'Log harvest', icon: 'package' as const, href: '/(tabs)/grow' },
  { label: 'Log eggs', icon: 'sun' as const, href: '/(tabs)/animals' },
  { label: 'Add expense', icon: 'dollar-sign' as const, href: '/(tabs)/money' },
  { label: 'Add task', icon: 'check-square' as const, href: '/(tabs)/tasks' },
  { label: 'Add note', icon: 'edit-3' as const, href: '/(tabs)/today' },
];

export default function QuickAddScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Quick add</Text>
      <Text style={styles.subtitle}>Fast logging for life on the homestead.</Text>

      <View style={styles.grid}>
        {ACTIONS.map((action) => (
          <Pressable
            key={action.label}
            style={({ pressed }) => [styles.action, pressed && styles.pressed]}
            onPress={() => {
              router.back();
              router.push(action.href as never);
            }}
          >
            <Feather name={action.icon} size={24} color={colors.sage} />
            <Text style={styles.actionLabel}>{action.label}</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: typography.size.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  grid: { gap: spacing.sm },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  pressed: { backgroundColor: colors.gray50 },
  actionLabel: {
    fontSize: typography.size.lg,
    fontWeight: '500',
    color: colors.textPrimary,
  },
});
