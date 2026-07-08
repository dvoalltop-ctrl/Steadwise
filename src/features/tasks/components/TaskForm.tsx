import { View, Text, TextInput, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui';
import { taskFormSchema, type TaskFormValues } from '@/features/tasks/schemas';
import { colors, radius, spacing, typography } from '@/theme';

const PRIORITIES = ['low', 'normal', 'high', 'urgent'] as const;

interface TaskFormProps {
  defaultValues?: Partial<TaskFormValues>;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  submitLabel?: string;
}

export function TaskForm({ defaultValues, onSubmit, submitLabel = 'Save task' }: TaskFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'normal',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: null,
      areaId: null,
      recurrenceRule: null,
      season: null,
      ...defaultValues,
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Title</Text>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="What needs doing?"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}

      <Text style={styles.label}>Description</Text>
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Optional details"
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
            multiline
          />
        )}
      />

      <Text style={styles.label}>Due date</Text>
      <Controller
        control={control}
        name="dueDate"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={value ?? ''}
            onChangeText={onChange}
          />
        )}
      />

      <Text style={styles.label}>Priority</Text>
      <Controller
        control={control}
        name="priority"
        render={({ field: { onChange, value } }) => (
          <View style={styles.chipRow}>
            {PRIORITIES.map((p) => (
              <Pressable
                key={p}
                onPress={() => onChange(p)}
                style={[styles.chip, value === p && styles.chipActive]}
              >
                <Text style={[styles.chipText, value === p && styles.chipTextActive]}>
                  {p}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      />

      <Button
        title={isSubmitting ? 'Saving…' : submitLabel}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        style={styles.submit}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  label: {
    fontSize: typography.size.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: typography.size.md,
    color: colors.textPrimary,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  error: { color: colors.danger, fontSize: typography.size.sm, marginTop: spacing.xs },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.sage, borderColor: colors.sage },
  chipText: { fontSize: typography.size.sm, color: colors.textSecondary, textTransform: 'capitalize' },
  chipTextActive: { color: colors.white },
  submit: { marginTop: spacing.xl },
});
