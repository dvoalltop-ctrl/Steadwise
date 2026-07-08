import { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button, Input } from '@/src/components/ui/Button';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { ErrorState } from '@/src/components/ui/ErrorState';
import { LoadingState } from '@/src/components/ui/LoadingState';
import { ScreenHeader } from '@/src/components/ui/ScreenHeader';
import { TaskItem } from '@/src/features/tasks/TaskItem';
import { useTasks } from '@/src/features/tasks/useTasks';
import { useDatabase } from '@/src/providers/DatabaseProvider';
import { spacing } from '@/src/theme/spacing';
import { useThemeColors } from '@/src/theme/useThemeColors';

export function TasksScreen() {
  const theme = useThemeColors();
  const { isReady, error: dbError, retry } = useDatabase();
  const { tasks, isLoading, error, refresh, addTask, toggleTask, removeTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const closeModal = () => {
    setIsModalOpen(false);
    setTitle('');
    setNotes('');
    setFormError(null);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setFormError('Give your task a short title.');
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
      await addTask({ title, notes });
      closeModal();
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : 'Could not save this task.';
      setFormError(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isReady) {
    if (dbError) {
      return <ErrorState message={dbError} onRetry={retry} />;
    }
    return <LoadingState message="Preparing your homestead journal…" />;
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.cream }]}>
      <ScreenHeader
        title="Tasks"
        subtitle="Track chores, planting dates, and daily homestead work."
      />

      {isLoading ? (
        <LoadingState message="Loading tasks…" />
      ) : error ? (
        <ErrorState message={error} onRetry={() => void refresh()} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={tasks.length === 0 ? styles.emptyList : styles.list}
          ListEmptyComponent={
            <EmptyState
              title="No tasks yet"
              description="Add your first chore or garden job. Everything saves on your phone, even offline."
            />
          }
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={(id, done) => void toggleTask(id, done)}
              onDelete={(id) => void removeTask(id)}
            />
          )}
        />
      )}

      <Pressable
        accessibilityLabel="Add task"
        onPress={() => setIsModalOpen(true)}
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: theme.sage, opacity: pressed ? 0.9 : 1 },
        ]}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <Modal visible={isModalOpen} animationType="slide" transparent onRequestClose={closeModal}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.white }]}>
            <Text style={[styles.modalTitle, { color: theme.earth }]}>New task</Text>
            <Input
              label="Title"
              value={title}
              onChangeText={setTitle}
              placeholder="Feed chickens"
            />
            <Input
              label="Notes (optional)"
              value={notes}
              onChangeText={setNotes}
              placeholder="Add details you'll want later"
              multiline
            />
            {formError ? (
              <Text style={[styles.formError, { color: theme.error }]}>{formError}</Text>
            ) : null}
            <View style={styles.modalActions}>
              <Button label="Cancel" variant="secondary" onPress={closeModal} />
              <Button
                label={isSaving ? 'Saving…' : 'Save task'}
                onPress={() => void handleSave()}
                disabled={isSaving}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: 96,
    gap: spacing.sm,
  },
  emptyList: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingBottom: 96,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 32,
    lineHeight: 34,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalCard: {
    padding: spacing.lg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: spacing.md,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  formError: {
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
