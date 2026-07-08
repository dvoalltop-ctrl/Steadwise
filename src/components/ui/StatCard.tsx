import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from './Card';
import { colors, spacing, typography } from '@/theme';

interface StatCardProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string | number;
  subtitle?: string;
}

export function StatCard({ icon, label, value, subtitle }: StatCardProps) {
  return (
    <Card style={styles.card}>
      <Feather name={icon} size={18} color={colors.sage} />
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
  value: {
    fontSize: typography.size.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  label: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
  },
});
