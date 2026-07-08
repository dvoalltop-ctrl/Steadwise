import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from './Card';
import { colors, spacing, typography } from '@/theme';

interface StatCardProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string | number;
  subtitle?: string;
  accent?: 'sage' | 'clay' | 'neutral';
}

export function StatCard({ icon, label, value, subtitle, accent = 'sage' }: StatCardProps) {
  const accentColor = accent === 'clay' ? colors.clay : accent === 'neutral' ? colors.soil : colors.sage;
  const iconBg = accent === 'clay' ? colors.clayMuted : accent === 'neutral' ? colors.gray100 : colors.sageMuted;

  return (
    <Card style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Feather name={icon} size={18} color={accentColor} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 100,
    gap: spacing.xs,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: typography.size.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  label: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
});
