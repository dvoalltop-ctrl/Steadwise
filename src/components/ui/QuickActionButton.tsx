import { Pressable, Text, StyleSheet, View, type ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, shadows, spacing, typography } from '@/theme';

interface QuickActionButtonProps {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  style?: ViewStyle;
  accent?: 'sage' | 'clay' | 'wheat';
}

export function QuickActionButton({
  label,
  icon,
  onPress,
  style,
  accent = 'wheat',
}: QuickActionButtonProps) {
  const accentStyle = accentStyles[accent];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.base, accentStyle.bg, pressed && styles.pressed, style]}
    >
      <View style={[styles.iconWrap, accentStyle.icon]}>
        <Feather name={icon} size={20} color={accentStyle.iconColor} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Feather name="chevron-right" size={16} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
    minHeight: 64,
    ...shadows.sm,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});

const accentStyles = {
  sage: {
    bg: { backgroundColor: colors.surface },
    icon: { backgroundColor: colors.sageMuted },
    iconColor: colors.sage,
  },
  clay: {
    bg: { backgroundColor: colors.surface },
    icon: { backgroundColor: colors.clayMuted },
    iconColor: colors.clay,
  },
  wheat: {
    bg: { backgroundColor: colors.surface },
    icon: { backgroundColor: colors.wheat },
    iconColor: colors.sageDark,
  },
};
