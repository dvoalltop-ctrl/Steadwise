import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from './Card';
import { colors, spacing, typography } from '@/theme';

interface SnapshotCardProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string | number;
  onPress?: () => void;
}

export function SnapshotCard({ icon, label, value, onPress }: SnapshotCardProps) {
  const content = (
    <>
      <View style={styles.iconWrap}>
        <Feather name={icon} size={16} color={colors.sage} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
        <Card style={styles.card}>{content}</Card>
      </Pressable>
    );
  }

  return <Card style={styles.card}>{content}</Card>;
}

const styles = StyleSheet.create({
  card: {
    width: 132,
    minHeight: 108,
    gap: spacing.xs,
  },
  pressed: {
    opacity: 0.9,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.wheat,
    alignItems: 'center',
    justifyContent: 'center',
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
    lineHeight: typography.size.xs * typography.lineHeight.normal,
  },
});
