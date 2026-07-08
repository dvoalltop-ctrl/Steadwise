import { Pressable, Text, StyleSheet, type ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';

type TagPillVariant = 'default' | 'sage' | 'clay' | 'outline';
type TagPillSize = 'sm' | 'md';

interface TagPillProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  variant?: TagPillVariant;
  size?: TagPillSize;
  style?: ViewStyle;
}

export function TagPill({
  label,
  selected = false,
  onPress,
  variant = 'outline',
  size = 'md',
  style,
}: TagPillProps) {
  const isInteractive = Boolean(onPress);

  return (
    <Pressable
      onPress={onPress}
      disabled={!isInteractive}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        selected ? styles.selected : variantStyles[variant],
        pressed && isInteractive && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          size === 'sm' && styles.textSm,
          selected ? styles.textSelected : textVariantStyles[variant],
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  selected: {
    backgroundColor: colors.sage,
    borderColor: colors.sage,
    borderWidth: 1,
  },
  pressed: { opacity: 0.85 },
  text: {
    fontSize: typography.size.sm,
    fontWeight: '600',
  },
  textSm: {
    fontSize: typography.size.xs,
  },
  textSelected: {
    color: colors.white,
  },
});

const sizeStyles = StyleSheet.create({
  sm: { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm },
  md: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
});

const variantStyles = StyleSheet.create({
  default: { backgroundColor: colors.gray100, borderWidth: 0 },
  sage: { backgroundColor: colors.sageMuted, borderWidth: 0 },
  clay: { backgroundColor: colors.clayMuted, borderWidth: 0 },
  outline: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
});

const textVariantStyles = {
  default: { color: colors.textSecondary },
  sage: { color: colors.sageDark },
  clay: { color: colors.clay },
  outline: { color: colors.textSecondary },
};
