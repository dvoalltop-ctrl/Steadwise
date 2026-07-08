import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/theme';

interface ListItemProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Feather.glyphMap;
  rightText?: string;
  onPress?: () => void;
}

export function ListItem({ title, subtitle, icon, rightText, onPress }: ListItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      {icon && (
        <View style={styles.iconWrap}>
          <Feather name={icon} size={18} color={colors.sage} />
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
      </View>
      {rightText && <Text style={styles.right}>{rightText}</Text>}
      {onPress && <Feather name="chevron-right" size={18} color={colors.gray300} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  pressed: { backgroundColor: colors.gray50 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.wheat,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  content: { flex: 1 },
  title: {
    fontSize: typography.size.md,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  right: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
    marginRight: spacing.sm,
  },
});
