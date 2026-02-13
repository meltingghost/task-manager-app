import { useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { AddTaskInput } from '@/components/task/add-task-input';
import { TaskList } from '@/components/task/task-list';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTasks } from '@/hooks/use-tasks';
import type { Task } from '@/types/task';

export type TaskFilter = 'all' | 'active' | 'completed';

function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  switch (filter) {
    case 'active':
      return tasks.filter((t) => !t.completed);
    case 'completed':
      return tasks.filter((t) => t.completed);
    default:
      return tasks;
  }
}

export default function TasksScreen() {
  const { tasks, addTask, toggleTask, deleteTask, updateTask } = useTasks();
  const [filter, setFilter] = useState<TaskFilter>('all');

  const filteredTasks = useMemo(() => filterTasks(tasks, filter), [tasks, filter]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Tareas</ThemedText>
        <ThemedView style={styles.filterRow}>
          {(['all', 'active', 'completed'] as const).map((f) => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={styles.filterChip}
              accessibilityRole="button"
              accessibilityLabel={
                f === 'all' ? 'Ver todas las tareas' : f === 'active' ? 'Ver pendientes' : 'Ver completadas'
              }
              accessibilityState={{ selected: filter === f }}
            >
              <ThemedText
                type="subtitle"
                style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}
              >
                {f === 'all' ? 'Todas' : f === 'active' ? 'Pendientes' : 'Hechas'}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      </ThemedView>
      <AddTaskInput onAddTask={addTask} />
      <TaskList
        tasks={filteredTasks}
        onToggle={toggleTask}
        onDelete={deleteTask}
        onUpdate={updateTask}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  filterChipText: {
    fontSize: 14,
    opacity: 0.8,
  },
  filterChipTextActive: {
    opacity: 1,
  },
});
