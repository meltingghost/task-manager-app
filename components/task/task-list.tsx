import { useCallback } from 'react';
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { Task } from '@/types/task';

import { TaskItem } from './task-item';

export interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate?: (id: string, title: string) => void;
}

function EmptyList() {
  return (
    <View style={styles.empty}>
      <ThemedText style={styles.emptyText}>
        No hay tareas. Añade una arriba.
      </ThemedText>
    </View>
  );
}

export function TaskList({ tasks, onToggle, onDelete, onUpdate }: TaskListProps) {
  const renderItem: ListRenderItem<Task> = useCallback(
    ({ item }) => (
      <TaskItem
        task={item}
        onToggle={onToggle}
        onDelete={onDelete}
        onUpdate={onUpdate}
      />
    ),
    [onToggle, onDelete, onUpdate]
  );

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListEmptyComponent={EmptyList}
      contentContainerStyle={tasks.length === 0 ? styles.emptyContainer : undefined}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.8,
  },
});
