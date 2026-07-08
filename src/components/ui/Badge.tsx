import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export function Badge({ label, variant = 'default' }: BadgeProps) {
  return (
    <View style={[styles.badge, variantStyles[variant]]}>
      <Text style={[styles.text, textVariantStyles[variant]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: typography.size.xs,
    fontWeight: '600',
  },
});

const variantStyles = StyleSheet.create({
  default: { backgroundColor: colors.gray100 },
  success: { backgroundColor: '#E8F0E8' },
  warning: { backgroundColor: '#FDF6E3' },
  danger: { backgroundColor: '#FCEAE7' },
  info: { backgroundColor: '#E8F2F6' },
});

const textVariantStyles = {
  default: { color: colors.textSecondary },
  success: { color: colors.sageDark },
  warning: { color: '#8B6914' },
  danger: { color: colors.danger },
  info: { color: colors.info },
};
