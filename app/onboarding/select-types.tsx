import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AppScreen, AppHeader, Button, TagPill } from '@/components/ui';
import type { HomesteadType } from '@/types';
import { spacing } from '@/theme';

const HOMESTEAD_TYPES: { type: HomesteadType; label: string }[] = [
  { type: 'garden', label: 'Garden' },
  { type: 'chickens', label: 'Chickens' },
  { type: 'goats', label: 'Goats' },
  { type: 'ducks', label: 'Ducks' },
  { type: 'pantry', label: 'Pantry' },
  { type: 'bees', label: 'Bees' },
  { type: 'rabbits', label: 'Rabbits' },
];

export default function SelectTypesScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const [selected, setSelected] = useState<HomesteadType[]>(['garden']);

  const toggle = (type: HomesteadType) => {
    setSelected((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <AppScreen edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.container}>
        <AppHeader
          title="What do you tend?"
          subtitle="Select all that apply. We'll tailor templates for you."
          onBack={() => router.back()}
          large
        />

        <View style={styles.grid}>
          {HOMESTEAD_TYPES.map((item) => {
            const isSelected = selected.includes(item.type);
            return (
              <TagPill
                key={item.type}
                label={item.label}
                selected={isSelected}
                onPress={() => toggle(item.type)}
                size="md"
                style={styles.chip}
              />
            );
          })}
        </View>

        <View style={styles.footer}>
          <Button
            title="Continue"
            disabled={selected.length === 0}
            onPress={() =>
              router.push({
                pathname: '/onboarding/seed-templates',
                params: { name, types: selected.join(',') },
              })
            }
            fullWidth
          />
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.xl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg },
  chip: { marginBottom: spacing.xs },
  footer: { marginTop: 'auto', marginBottom: spacing.lg },
});
