import { useCallback } from 'react';
import { FlatList, ListRenderItem, StyleSheet } from 'react-native';

import type { Task } from '@/types/task';

import { EmptyState } from './empty-state';
import { TaskItem } from './task-item';

export interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate?: (id: string, title: string) => void;
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
      ListEmptyComponent={EmptyState}
      contentContainerStyle={tasks.length === 0 ? styles.emptyContainer : undefined}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flexGrow: 1,
  },
});
