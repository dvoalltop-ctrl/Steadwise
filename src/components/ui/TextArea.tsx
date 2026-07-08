import { TextInput, type TextInputProps } from 'react-native';
import { FormInput } from './FormInput';
import { spacing } from '@/theme';

interface TextAreaProps extends Omit<TextInputProps, 'multiline'> {
  label?: string;
  error?: string;
  hint?: string;
  rows?: number;
}

export function TextArea({ rows = 4, style, label, error, hint, ...props }: TextAreaProps) {
  const minHeight = rows * 22 + spacing.lg * 2;

  return (
    <FormInput
      {...props}
      label={label}
      error={error}
      hint={hint}
      multiline
      textAlignVertical="top"
      style={[{ minHeight }, style]}
    />
  );
}
