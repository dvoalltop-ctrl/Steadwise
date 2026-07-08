import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius } from '@/theme';

type IconButtonVariant = 'filled' | 'soft' | 'ghost';
type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps {
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
  color?: string;
}

const SIZE_MAP = { sm: 36, md: 44, lg: 52 } as const;
const ICON_MAP = { sm: 18, md: 22, lg: 26 } as const;

export function IconButton({
  icon,
  onPress,
  variant = 'soft',
  size = 'md',
  disabled = false,
  style,
  accessibilityLabel,
  color,
}: IconButtonProps) {
  const dim = SIZE_MAP[size];
  const iconColor =
    color ?? (variant === 'filled' ? colors.white : variant === 'ghost' ? colors.soil : colors.sage);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? icon}
      style={({ pressed }) => [
        styles.base,
        { width: dim, height: dim, borderRadius: dim / 2 },
        variantStyles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Feather name={icon} size={ICON_MAP[size]} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.8, transform: [{ scale: 0.96 }] },
  disabled: { opacity: 0.4 },
});

const variantStyles = StyleSheet.create({
  filled: { backgroundColor: colors.sage },
  soft: { backgroundColor: colors.sageMuted },
  ghost: { backgroundColor: 'transparent' },
});
