import { useCallback } from 'react';
import { FlatList, ListRenderItem, StyleSheet } from 'react-native';

import type { List } from '@/types/list';
import type { Task } from '@/types/task';

import { EmptyState } from './empty-state';
import { TaskItem } from './task-item';

export interface TaskListProps {
  tasks: Task[];
  lists: List[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate?: (id: string, title: string) => void;
  onAddTaskToList: (taskId: string, listId: string) => void;
  onRemoveTaskFromList: (taskId: string, listId: string) => void;
  onShowToast?: (message: string) => void;
}

export function TaskList({
  tasks,
  lists,
  onToggle,
  onDelete,
  onUpdate,
  onAddTaskToList,
  onRemoveTaskFromList,
  onShowToast,
}: TaskListProps) {
  const renderItem: ListRenderItem<Task> = useCallback(
    ({ item }) => (
      <TaskItem
        task={item}
        lists={lists}
        onToggle={onToggle}
        onDelete={onDelete}
        onUpdate={onUpdate}
        onAddTaskToList={onAddTaskToList}
        onRemoveTaskFromList={onRemoveTaskFromList}
        onShowToast={onShowToast}
      />
    ),
    [lists, onToggle, onDelete, onUpdate, onAddTaskToList, onRemoveTaskFromList, onShowToast]
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
