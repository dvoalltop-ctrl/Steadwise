import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, shadows, spacing } from '@/theme';

interface FABProps {
  onPress: () => void;
  icon?: keyof typeof Feather.glyphMap;
  style?: ViewStyle;
}

export function FAB({ onPress, icon = 'plus', style }: FABProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.fab, pressed && styles.pressed, style]}
      accessibilityRole="button"
      accessibilityLabel="Quick add"
    >
      <Feather name={icon} size={24} color={colors.white} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.clay,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.96 }] },
});
