import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FormInput } from './FormInput';
import { colors, spacing } from '@/theme';

interface DateFieldProps {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
}

export function DateField({
  label = 'Date',
  value,
  onChangeText,
  error,
  hint,
  placeholder = 'YYYY-MM-DD',
}: DateFieldProps) {
  return (
    <View style={styles.wrapper}>
      <FormInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        error={error}
        hint={hint ?? 'Use YYYY-MM-DD format'}
        keyboardType="numbers-and-punctuation"
        autoCapitalize="none"
      />
      <View style={styles.icon} pointerEvents="none">
        <Feather name="calendar" size={18} color={colors.textMuted} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    right: spacing.lg,
    top: 38,
  },
});
