import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { AppScreen, AppHeader, Button, Card } from '@/components/ui';
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
    icon: 'sun' as const,
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
    <AppScreen edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.container}>
        <AppHeader
          title="Seed sample data?"
          subtitle="Templates help you explore Steadwise. You can clear them anytime."
          onBack={() => router.back()}
          large
        />

        <View style={styles.list}>
          {TEMPLATES.map((t) => {
            const isSelected = selected.includes(t.id);
            return (
              <Pressable
                key={t.id}
                onPress={() => toggle(t.id)}
                style={({ pressed }) => [pressed && styles.pressed]}
              >
                <Card
                  variant={isSelected ? 'warm' : 'default'}
                  style={isSelected ? [styles.template, styles.templateSelected] : styles.template}
                >
                  <View style={styles.iconWrap}>
                    <Feather name={t.icon} size={22} color={colors.sage} />
                  </View>
                  <View style={styles.templateText}>
                    <Text style={styles.templateTitle}>{t.title}</Text>
                    <Text style={styles.templateDesc}>{t.description}</Text>
                  </View>
                  <Feather
                    name={isSelected ? 'check-circle' : 'circle'}
                    size={22}
                    color={isSelected ? colors.sage : colors.gray300}
                  />
                </Card>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Button title="Start homesteading" onPress={finish} fullWidth />
          <Button title="Start empty" variant="ghost" onPress={finish} fullWidth />
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.xl },
  list: { gap: spacing.sm, marginTop: spacing.lg },
  pressed: { opacity: 0.9 },
  template: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: 0,
  },
  templateSelected: { borderColor: colors.sage },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.sageMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
