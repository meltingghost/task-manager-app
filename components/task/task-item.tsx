import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AddTaskToListModal } from '@/components/task/add-task-to-list-modal';
import { DeleteTaskConfirmModal } from '@/components/task/delete-task-confirm-modal';
import { ThemedText } from '@/components/themed-text';
import { TASK_COLORS } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { List } from '@/types/list';
import type { Task } from '@/types/task';

const defaultTaskColor = TASK_COLORS[0].hex;

export interface TaskItemProps {
  task: Task;
  lists: List[];
  onToggleCompletion: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate?: (id: string, title: string) => void;
  onAddTaskToList: (taskId: string, listId: string) => void;
  onRemoveTaskFromList: (taskId: string, listId: string) => void;
  onShowToast?: (message: string) => void;
}

function TaskItemComponent({
  task,
  lists,
  onToggleCompletion,
  onDelete,
  onUpdate,
  onAddTaskToList,
  onRemoveTaskFromList,
  onShowToast,
}: TaskItemProps) {
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const [listModalVisible, setListModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const taskListIds = useMemo(() => task.listIds ?? [], [task.listIds]);

  const toggleTaskList = useCallback(
    (listId: string) => {
      const isInList = taskListIds.includes(listId);
      const listName = lists.find((l) => l.id === listId)?.name ?? '';
      if (isInList) {
        onRemoveTaskFromList(task.id, listId);
        onShowToast?.(`Quitada de ${listName}`);
      } else {
        onAddTaskToList(task.id, listId);
        onShowToast?.(`Añadida a ${listName}`);
      }
    },
    [task.id, taskListIds, lists, onAddTaskToList, onRemoveTaskFromList, onShowToast]
  );

  const openDeleteModal = useCallback(() => setDeleteModalVisible(true), []);
  const closeDeleteModal = useCallback(() => setDeleteModalVisible(false), []);

  const confirmDelete = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onDelete(task.id);
    closeDeleteModal();
    onShowToast?.('Task deleted');
  }, [task.id, onDelete, closeDeleteModal, onShowToast]);

  const handleSaveEdit = useCallback(() => {
    if (onUpdate && editValue.trim() !== task.title) {
      onUpdate(task.id, editValue.trim());
    }
    setEditValue(task.title);
    setIsEditing(false);
  }, [onUpdate, task.id, task.title, editValue]);

  const handleCancelEdit = useCallback(() => {
    setEditValue(task.title);
    setIsEditing(false);
  }, [task.title]);

  const handleToggleCompletion = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleCompletion(task.id);
  }, [task.id, onToggleCompletion]);

  const taskColor = task.color ?? defaultTaskColor;

  if (isEditing && onUpdate) {
    return (
      <View style={[styles.row, styles.rowBorder, { borderBottomColor: borderColor }]}>
        <View style={[styles.colorBar, { backgroundColor: taskColor }]} />
        <TextInput
          style={[styles.input, { color: textColor }]}
          value={editValue}
          onChangeText={setEditValue}
          onSubmitEditing={handleSaveEdit}
          onBlur={handleSaveEdit}
          autoFocus
          accessibilityLabel="Edit task title"
          accessibilityRole="none"
        />
        <Pressable
          onPress={handleSaveEdit}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          accessibilityLabel="Save changes"
          accessibilityRole="button"
        >
          <MaterialIcons name="check" size={24} color={tintColor} />
        </Pressable>
        <Pressable
          onPress={handleCancelEdit}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          accessibilityLabel="Cancel edit"
          accessibilityRole="button"
        >
          <MaterialIcons name="close" size={24} color={iconColor} />
        </Pressable>
      </View>
    );
  }

  return (
    <Animated.View entering={FadeIn.duration(200)} style={[styles.row, styles.rowBorder, { borderBottomColor: borderColor }]}>
      <View style={[styles.colorBar, { backgroundColor: taskColor }]} />
      <Pressable
        onPress={handleToggleCompletion}
        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        accessibilityLabel={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        accessibilityRole="button"
      >
        <MaterialIcons
          name={task.completed ? 'check-circle' : 'radio-button-unchecked'}
          size={28}
          color={task.completed ? tintColor : iconColor}
        />
      </Pressable>
      <View style={styles.titleRow}>
        <Pressable
          style={styles.titleWrap}
          onLongPress={() => onUpdate && setIsEditing(true)}
          accessibilityLabel={`Task: ${task.title}. ${task.completed ? 'Completed.' : 'Pending.'}`}
          accessibilityRole="none"
        >
          <ThemedText
            style={[
              styles.title,
              task.completed && styles.titleCompleted,
            ]}
            numberOfLines={2}
          >
            {task.title}
          </ThemedText>
        </Pressable>
        {onUpdate && (
          <Pressable
            onPress={() => setIsEditing(true)}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            accessibilityLabel="Edit task name"
            accessibilityRole="button"
          >
            <MaterialIcons name="edit" size={22} color={iconColor} />
          </Pressable>
        )}
      </View>
      <Pressable
        onPress={() => setListModalVisible(true)}
        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        accessibilityLabel="Add to list"
        accessibilityRole="button"
      >
        <MaterialIcons name="playlist-add" size={24} color={iconColor} />
      </Pressable>
      <Pressable
        onPress={openDeleteModal}
        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        accessibilityLabel="Delete task"
        accessibilityRole="button"
      >
        <MaterialIcons name="delete-outline" size={24} color={iconColor} />
      </Pressable>

      <AddTaskToListModal
        visible={listModalVisible}
        lists={lists}
        taskListIds={taskListIds}
        onToggleList={toggleTaskList}
        onClose={() => setListModalVisible(false)}
      />

      <DeleteTaskConfirmModal
        visible={deleteModalVisible}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </Animated.View>
  );
}

export const TaskItem = React.memo(TaskItemComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingLeft: 12,
    gap: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
  },
  colorBar: {
    width: 4,
    borderRadius: 2,
    alignSelf: 'stretch',
  },
  iconButton: {
    padding: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  titleRow: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  titleWrap: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
  },
  titleCompleted: {
    opacity: 0.7,
    textDecorationLine: 'line-through',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 0,
    minWidth: 0,
  },
});
