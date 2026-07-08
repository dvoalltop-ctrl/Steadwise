import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';

export type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'clay';

interface StatusBadgeProps {
  label: string;
  tone?: StatusTone;
  dot?: boolean;
}

export function StatusBadge({ label, tone = 'neutral', dot = false }: StatusBadgeProps) {
  return (
    <View style={[styles.badge, toneStyles[tone]]}>
      {dot && <View style={[styles.dot, dotToneStyles[tone]]} />}
      <Text style={[styles.text, textToneStyles[tone]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: typography.size.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

const toneStyles = StyleSheet.create({
  neutral: { backgroundColor: colors.gray100 },
  success: { backgroundColor: colors.successMuted },
  warning: { backgroundColor: colors.warningMuted },
  danger: { backgroundColor: colors.dangerMuted },
  info: { backgroundColor: colors.infoMuted },
  clay: { backgroundColor: colors.clayMuted },
});

const textToneStyles = {
  neutral: { color: colors.textSecondary },
  success: { color: colors.sageDark },
  warning: { color: '#8B6914' },
  danger: { color: colors.danger },
  info: { color: colors.info },
  clay: { color: colors.clay },
};

const dotToneStyles = {
  neutral: { backgroundColor: colors.textMuted },
  success: { backgroundColor: colors.success },
  warning: { backgroundColor: colors.warning },
  danger: { backgroundColor: colors.danger },
  info: { backgroundColor: colors.info },
  clay: { backgroundColor: colors.clay },
};
