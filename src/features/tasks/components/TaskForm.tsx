import { ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormInput, TextArea, DateField, SelectField } from '@/components/ui';
import { taskFormSchema, type TaskFormValues } from '@/features/tasks/schemas';
import { spacing } from '@/theme';

const PRIORITY_OPTIONS = [
  { value: 'low' as const, label: 'Low' },
  { value: 'normal' as const, label: 'Normal' },
  { value: 'high' as const, label: 'High' },
  { value: 'urgent' as const, label: 'Urgent' },
];

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
    <ScrollView
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="Title"
            placeholder="What needs doing?"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.title?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextArea
            label="Description"
            placeholder="Optional details"
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
            rows={3}
          />
        )}
      />

      <Controller
        control={control}
        name="dueDate"
        render={({ field: { onChange, value } }) => (
          <DateField
            label="Due date"
            value={value ?? ''}
            onChangeText={onChange}
            error={errors.dueDate?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="priority"
        render={({ field: { onChange, value } }) => (
          <SelectField
            label="Priority"
            value={value}
            options={PRIORITY_OPTIONS}
            onChange={onChange}
          />
        )}
      />

      <Button
        title={isSubmitting ? 'Saving…' : submitLabel}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        loading={isSubmitting}
        fullWidth
        style={{ marginTop: spacing.xl }}
      />
    </ScrollView>
  );
}
