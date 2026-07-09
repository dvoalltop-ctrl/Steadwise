import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, shadows, spacing, typography } from '@/theme';

interface QuickLogButtonProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}

export function QuickLogButton({ icon, label, onPress }: QuickLogButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <View style={styles.iconWrap}>
        <Feather name={icon} size={20} color={colors.sage} />
      </View>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '31%',
    flexGrow: 1,
    minWidth: 100,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.sm,
  },
  pressed: {
    backgroundColor: colors.gray50,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.wheat,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
