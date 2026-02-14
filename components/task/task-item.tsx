import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { TASK_COLORS } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { List } from '@/types/list';
import type { Task } from '@/types/task';

const defaultTaskColor = TASK_COLORS[0].hex;

export interface TaskItemProps {
  task: Task;
  lists: List[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate?: (id: string, title: string) => void;
  onAddTaskToList: (taskId: string, listId: string) => void;
  onRemoveTaskFromList: (taskId: string, listId: string) => void;
  onShowToast?: (message: string) => void;
}

function TaskItemComponent({
  task,
  lists,
  onToggle,
  onDelete,
  onUpdate,
  onAddTaskToList,
  onRemoveTaskFromList,
  onShowToast,
}: TaskItemProps) {
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');
  const exitColor = useThemeColor({}, 'exit');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const cardBg = useThemeColor({}, 'card');
  const surfaceColor = useThemeColor({}, 'surface');

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
    onShowToast?.('Tarea eliminada');
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

  const handleToggle = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle(task.id);
  }, [task.id, onToggle]);

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
        onPress={handleToggle}
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

      <Modal
        visible={listModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setListModalVisible(false)}
      >
        <Pressable
          style={styles.listModalOverlay}
          onPress={() => setListModalVisible(false)}
        >
          <Pressable
            style={[styles.listModalCard, { backgroundColor: cardBg, borderColor }]}
            onPress={(e) => e.stopPropagation()}
          >
            <ThemedText style={[styles.listModalTitle, { color: textColor }]}>
              Add to list
            </ThemedText>
            {lists.length === 0 ? (
              <ThemedText style={[styles.listModalEmpty, { color: iconColor }]}>
                No lists yet. Create one from the tabs.
              </ThemedText>
            ) : (
              <ScrollView
                style={styles.listModalScroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {lists.map((list) => {
                  const isInList = taskListIds.includes(list.id);
                  return (
                    <Pressable
                      key={list.id}
                      onPress={() => toggleTaskList(list.id)}
                      style={({ pressed }) => [
                        styles.listModalRow,
                        { borderBottomColor: borderColor },
                        pressed && styles.pressed,
                      ]}
                      accessibilityLabel={`${list.name}. ${isInList ? 'In list. Tap to remove.' : 'Not in list. Tap to add.'}`}
                      accessibilityRole="button"
                    >
                      <ThemedText
                        style={[styles.listModalRowText, { color: textColor }]}
                        numberOfLines={1}
                      >
                        {list.name}
                      </ThemedText>
                      <MaterialIcons
                        name={isInList ? 'check-circle' : 'radio-button-unchecked'}
                        size={24}
                        color={isInList ? tintColor : iconColor}
                      />
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}
            <Pressable
              onPress={() => setListModalVisible(false)}
              style={[styles.listModalDone, { backgroundColor: surfaceColor }]}
            >
              <ThemedText style={[styles.listModalDoneText, { color: textColor }]}>
                Done
              </ThemedText>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeDeleteModal}
      >
        <Pressable style={styles.listModalOverlay} onPress={closeDeleteModal}>
          <Pressable
            style={[styles.listModalCard, { backgroundColor: cardBg, borderColor }]}
            onPress={(e) => e.stopPropagation()}
          >
            <ThemedText style={[styles.listModalTitle, { color: textColor }]}>
              Delete task
            </ThemedText>
            <ThemedText style={[styles.deleteConfirmMessage, { color: textColor }]}>
              Are you sure you want to delete this task?
              This action cannot be undone.
            </ThemedText>
            <View style={styles.deleteConfirmActions}>
              <Pressable
                onPress={closeDeleteModal}
                style={({ pressed }) => [
                  styles.deleteConfirmButton,
                  { backgroundColor: surfaceColor },
                  pressed && styles.pressed,
                ]}
              >
                <ThemedText style={[styles.deleteConfirmButtonText, { color: textColor }]}>
                  Cancel
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={confirmDelete}
                style={({ pressed }) => [
                  styles.deleteConfirmButton,
                  styles.deleteConfirmButtonDanger,
                  { backgroundColor: exitColor },
                  pressed && styles.pressed,
                ]}
              >
                <ThemedText style={styles.deleteConfirmButtonDangerText}>
                  Delete
                </ThemedText>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
  listModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  listModalCard: {
    width: '100%',
    maxWidth: 320,
    maxHeight: '70%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  listModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  listModalEmpty: {
    fontSize: 14,
    marginBottom: 16,
  },
  listModalScroll: {
    maxHeight: 240,
    marginHorizontal: -4,
  },
  listModalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  listModalRowText: {
    flex: 1,
    fontSize: 16,
    marginRight: 12,
  },
  listModalDone: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  listModalDoneText: {
    fontSize: 16,
    fontWeight: '600',
  },
  deleteConfirmMessage: {
    fontSize: 15,
    marginBottom: 20,
    lineHeight: 22,
  },
  deleteConfirmActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  deleteConfirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  deleteConfirmButtonDanger: {},
  deleteConfirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  deleteConfirmButtonDangerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
