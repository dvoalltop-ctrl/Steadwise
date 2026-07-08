import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Button } from '@/components/ui';
import type { HomesteadType } from '@/types';
import { colors, radius, spacing, typography } from '@/theme';

const HOMESTEAD_TYPES: { type: HomesteadType; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { type: 'garden', label: 'Garden', icon: 'feather' },
  { type: 'chickens', label: 'Chickens', icon: 'github' },
  { type: 'goats', label: 'Goats', icon: 'gitlab' },
  { type: 'ducks', label: 'Ducks', icon: 'twitter' },
  { type: 'pantry', label: 'Pantry', icon: 'archive' },
  { type: 'bees', label: 'Bees', icon: 'hexagon' },
  { type: 'rabbits', label: 'Rabbits', icon: 'heart' },
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
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>What do you tend?</Text>
        <Text style={styles.subtitle}>Select all that apply. We'll tailor templates for you.</Text>

        <View style={styles.grid}>
          {HOMESTEAD_TYPES.map((item) => {
            const isSelected = selected.includes(item.type);
            return (
              <Pressable
                key={item.type}
                onPress={() => toggle(item.type)}
                style={[styles.chip, isSelected && styles.chipSelected]}
              >
                <Feather name={item.icon} size={18} color={isSelected ? colors.white : colors.sage} />
                <Text style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}>
                  {item.label}
                </Text>
              </Pressable>
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
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.sage,
    backgroundColor: colors.surface,
  },
  chipSelected: { backgroundColor: colors.sage, borderColor: colors.sage },
  chipLabel: { fontSize: typography.size.md, color: colors.sage, fontWeight: '500' },
  chipLabelSelected: { color: colors.white },
  footer: { marginTop: 'auto', marginBottom: spacing.lg },
});
