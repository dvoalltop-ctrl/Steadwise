import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Button } from '@/components/ui';
import { useAppStore } from '@/stores/app-store';
import type { HomesteadType } from '@/types';
import { colors, radius, spacing, typography } from '@/theme';

const TEMPLATES = [
  {
    id: 'garden',
    title: 'Beginner Backyard Garden',
    description: '4 beds, 8 plantings, sample harvests',
    icon: 'feather' as const,
  },
  {
    id: 'chickens',
    title: 'Laying Hen Flock',
    description: '6-hen flock with egg production logs',
    icon: 'github' as const,
  },
  {
    id: 'pantry',
    title: 'Pantry Starter',
    description: 'Canned, frozen, and dry goods inventory',
    icon: 'archive' as const,
  },
  {
    id: 'chores',
    title: 'Weekly Chore Routines',
    description: 'Daily and weekly recurring tasks',
    icon: 'check-square' as const,
  },
];

export default function SeedTemplatesScreen() {
  const { name, types } = useLocalSearchParams<{ name: string; types: string }>();
  const [selected, setSelected] = useState<string[]>(['garden', 'chickens', 'pantry', 'chores']);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const setUseLocalDb = useAppStore((s) => s.setUseLocalDb);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const finish = () => {
    const homesteadTypes = (types?.split(',') ?? []) as HomesteadType[];
    completeOnboarding({
      homesteadName: name ?? 'My Homestead',
      homesteadTypes,
    });
    setUseLocalDb(true);
    router.replace('/(tabs)/today');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Seed sample data?</Text>
        <Text style={styles.subtitle}>
          Templates help you explore Steadwise. You can clear them anytime.
        </Text>

        <View style={styles.list}>
          {TEMPLATES.map((t) => {
            const isSelected = selected.includes(t.id);
            return (
              <Pressable
                key={t.id}
                onPress={() => toggle(t.id)}
                style={[styles.template, isSelected && styles.templateSelected]}
              >
                <Feather name={t.icon} size={22} color={colors.sage} />
                <View style={styles.templateText}>
                  <Text style={styles.templateTitle}>{t.title}</Text>
                  <Text style={styles.templateDesc}>{t.description}</Text>
                </View>
                <Feather
                  name={isSelected ? 'check-circle' : 'circle'}
                  size={22}
                  color={isSelected ? colors.sage : colors.gray300}
                />
              </Pressable>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Button title="Start homesteading" onPress={finish} />
          <Button title="Start empty" variant="ghost" onPress={finish} />
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
  },
  list: { gap: spacing.sm },
  template: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  templateSelected: { borderColor: colors.sage, backgroundColor: '#F5F8F5' },
  templateText: { flex: 1 },
  templateTitle: {
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  templateDesc: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  footer: { marginTop: 'auto', marginBottom: spacing.lg, gap: spacing.sm },
});
