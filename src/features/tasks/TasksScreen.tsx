import { useState } from 'react';
import { Card, EmptyState, Screen } from '@/components';
import { TaskRow } from './TaskRow';
import { mockTasks } from './mocks';
import type { Task } from '@/types';

export function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const toggle = (id: string) =>
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === 'done' ? 'open' : 'done' } : t
      )
    );

  return (
    <Screen title="Tasks" subtitle="Everything on the to-do list">
      {tasks.length === 0 ? (
        <EmptyState
          icon="check-square"
          title="No tasks yet"
          message="Chores and reminders you add will show up here."
          note="Mock data only — task management arrives in a later phase."
        />
      ) : (
        <Card padded={false}>
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} onToggle={toggle} />
          ))}
        </Card>
      )}
    </Screen>
  );
}
