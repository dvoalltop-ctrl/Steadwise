import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { AppScreen, AppHeader, QuickActionButton } from '@/components/ui';
import { spacing } from '@/theme';

const ACTIONS = [
  { label: 'Log harvest', icon: 'package' as const, href: '/(tabs)/grow', accent: 'sage' as const },
  { label: 'Log eggs', icon: 'sun' as const, href: '/(tabs)/animals', accent: 'clay' as const },
  { label: 'Add expense', icon: 'dollar-sign' as const, href: '/(tabs)/money', accent: 'wheat' as const },
  { label: 'Add task', icon: 'check-square' as const, href: '/(tabs)/tasks/new', accent: 'sage' as const },
  { label: 'Add note', icon: 'edit-3' as const, href: '/(tabs)/today', accent: 'wheat' as const },
];

export default function QuickAddScreen() {
  return (
    <AppScreen>
      <AppHeader
        title="Quick add"
        subtitle="Fast logging for life on the homestead."
        onBack={() => router.back()}
        large
      />

      <View style={styles.grid}>
        {ACTIONS.map((action) => (
          <QuickActionButton
            key={action.label}
            label={action.label}
            icon={action.icon}
            accent={action.accent}
            onPress={() => {
              router.back();
              router.push(action.href as never);
            }}
          />
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  grid: { gap: spacing.sm, marginTop: spacing.lg },
});
