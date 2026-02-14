import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useCallback, useMemo, useState } from 'react';
import {
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import { AddListModal } from '@/components/task/add-list-modal';
import { AddTaskModal } from '@/components/task/add-task-modal';
import { FloatingAddButton } from '@/components/task/floating-add-button';
import { SearchAndFilterBar } from '@/components/task/search-and-filter-bar';
import { TaskList } from '@/components/task/task-list';
import { TasksHeader } from '@/components/task/tasks-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Toast } from '@/components/ui/toast';
import { useLists } from '@/hooks/use-lists';
import { useTasks } from '@/hooks/use-tasks';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { List } from '@/types/list';
import type { Task } from '@/types/task';

export type TaskFilter = 'all' | 'active' | 'completed';

function filterByStatus(tasks: Task[], filter: TaskFilter): Task[] {
  switch (filter) {
    case 'active':
      return tasks.filter((t) => !t.completed);
    case 'completed':
      return tasks.filter((t) => t.completed);
    default:
      return tasks;
  }
}

function filterByList(tasks: Task[], listId: string): Task[] {
  return tasks.filter((t) => (t.listIds ?? []).includes(listId));
}

export type TabFilter = TaskFilter | string;

function isTaskFilter(value: TabFilter): value is TaskFilter {
  return value === 'all' || value === 'active' || value === 'completed';
}

export default function TasksScreen() {
  const {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    addTaskToList,
    removeTaskFromList,
    removeListFromAllTasks,
  } = useTasks();
  const { lists, addList, updateList, deleteList } = useLists();
  const [filter, setFilter] = useState<TabFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [colorFilter, setColorFilter] = useState<string | null>(null);
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [addListModalVisible, setAddListModalVisible] = useState(false);
  const [listOptionsList, setListOptionsList] = useState<List | null>(null);
  const [renameList, setRenameList] = useState<List | null>(null);
  const [renameDraft, setRenameDraft] = useState('');
  const [deleteListConfirm, setDeleteListConfirm] = useState<List | null>(null);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = useCallback((message: string) => {
    setToast({ visible: true, message });
  }, []);

  const dismissToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  const filteredTasks = useMemo(() => {
    let result: Task[];
    if (isTaskFilter(filter)) {
      result = filterByStatus(tasks, filter);
    } else {
      result = filterByList(tasks, filter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q));
    }
    if (colorFilter !== null) {
      result = result.filter((t) => (t.color ?? '') === colorFilter);
    }
    return result;
  }, [tasks, filter, searchQuery, colorFilter]);

  const currentListId = isTaskFilter(filter) ? undefined : filter;

  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, 'text');
  const cardBg = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');
  const surfaceColor = useThemeColor({}, 'surface');
  const tintColor = useThemeColor({}, 'tint');
  const exitColor = useThemeColor({}, 'exit');
  const tabBarBg = colorScheme === 'dark' ? '#8ea8bd' : '#b5daf7';
  const tabInactiveBg = colorScheme === 'dark' ? '#93999e' : '#e8f4fc';

  const openListOptions = useCallback((list: List) => setListOptionsList(list), []);
  const closeListOptions = useCallback(() => setListOptionsList(null), []);

  const openRenameList = useCallback((list: List) => {
    setListOptionsList(null);
    setRenameList(list);
    setRenameDraft(list.name);
  }, []);
  const closeRenameList = useCallback(() => {
    Keyboard.dismiss();
    setRenameList(null);
    setRenameDraft('');
  }, []);
  const saveRenameList = useCallback(() => {
    if (renameList && renameDraft.trim()) {
      updateList(renameList.id, renameDraft.trim());
      showToast('List renamed');
      closeRenameList();
    }
  }, [renameList, renameDraft, updateList, showToast, closeRenameList]);

  const openDeleteListConfirm = useCallback((list: List) => {
    setListOptionsList(null);
    setDeleteListConfirm(list);
  }, []);
  const closeDeleteListConfirm = useCallback(() => setDeleteListConfirm(null), []);
  const confirmDeleteList = useCallback(() => {
    if (deleteListConfirm) {
      removeListFromAllTasks(deleteListConfirm.id);
      deleteList(deleteListConfirm.id);
      if (filter === deleteListConfirm.id) setFilter('all');
      showToast('List deleted');
      closeDeleteListConfirm();
    }
  }, [deleteListConfirm, filter, removeListFromAllTasks, deleteList, showToast, closeDeleteListConfirm]);

  const mainTabs: { key: TaskFilter; label: string }[] = [
    { key: 'all', label: 'Everything' },
    { key: 'active', label: 'Undone' },
    { key: 'completed', label: 'Done' },
  ];

  return (
    <ThemedView style={styles.container}>
      <TasksHeader onProfileSaved={() => showToast('Perfil actualizado')} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.tabsScroll, { backgroundColor: tabBarBg }]}
        contentContainerStyle={styles.tabsContent}
      >
        {mainTabs.map(({ key, label }) => {
          const isSelected = filter === key;
          return (
            <Pressable
              key={key}
              onPress={() => setFilter(key)}
              style={({ pressed, hovered }) => [
                styles.tab,
                isSelected && [styles.tabSelected, { backgroundColor: cardBg }],
                !isSelected && { backgroundColor: tabInactiveBg },
                (pressed || hovered) && styles.tabPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={
                key === 'all' ? 'Show all tasks' : key === 'active' ? 'Show undone' : 'Show done'
              }
              accessibilityState={{ selected: isSelected }}
            >
              <ThemedText
                style={[
                  styles.tabText,
                  { color: textColor },
                  isSelected && styles.tabTextActive,
                ]}
              >
                {label}
              </ThemedText>
            </Pressable>
          );
        })}
        {lists.map((list) => {
          const isSelected = filter === list.id;
          return (
            <Pressable
              key={list.id}
              onPress={() => setFilter(list.id)}
              onLongPress={() => openListOptions(list)}
              style={({ pressed, hovered }) => [
                styles.tab,
                isSelected && [styles.tabSelected, { backgroundColor: cardBg }],
                !isSelected && { backgroundColor: tabInactiveBg },
                (pressed || hovered) && styles.tabPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Show list ${list.name}. Long press to edit or delete.`}
              accessibilityState={{ selected: isSelected }}
            >
              <ThemedText
                style={[
                  styles.tabText,
                  { color: textColor },
                  isSelected && styles.tabTextActive,
                ]}
                numberOfLines={1}
              >
                {list.name}
              </ThemedText>
            </Pressable>
          );
        })}
        <Pressable
          onPress={() => setAddListModalVisible(true)}
          style={({ pressed, hovered }) => [
            styles.tab,
            { backgroundColor: tabInactiveBg },
            (pressed || hovered) && styles.tabPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Add list"
        >
          <MaterialIcons name="add" size={18} color={textColor} style={styles.tabAddIcon} />
          <ThemedText style={[styles.tabTextAdd, { color: textColor }]}>Add List</ThemedText>
        </Pressable>
      </ScrollView>

      <SearchAndFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        selectedColorFilter={colorFilter}
        onColorFilterChange={setColorFilter}
      />

      <View style={styles.listContainer}>
        <TaskList
          tasks={filteredTasks}
          lists={lists}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onUpdate={updateTask}
          onAddTaskToList={addTaskToList}
          onRemoveTaskFromList={removeTaskFromList}
          onShowToast={showToast}
        />
      </View>

      <FloatingAddButton onPress={() => setAddTaskModalVisible(true)} />

      <AddTaskModal
        visible={addTaskModalVisible}
        onClose={() => setAddTaskModalVisible(false)}
        onSubmit={(title, color) => addTask(title, color, currentListId)}
        onTaskAdded={() => showToast('Task added')}
      />

      <AddListModal
        visible={addListModalVisible}
        onClose={() => setAddListModalVisible(false)}
        onCreateList={addList}
        onListCreated={() => showToast('List created')}
      />

      <Modal
        visible={listOptionsList !== null}
        transparent
        animationType="fade"
        onRequestClose={closeListOptions}
      >
        <Pressable style={styles.modalOverlay} onPress={closeListOptions}>
          <Pressable
            style={[styles.modalCard, { backgroundColor: cardBg, borderColor }]}
            onPress={(e) => e.stopPropagation()}
          >
            <ThemedText style={[styles.modalTitle, { color: textColor }]}>
              {listOptionsList?.name}
            </ThemedText>
            <Pressable
              onPress={() => listOptionsList && openRenameList(listOptionsList)}
              style={({ pressed }) => [styles.modalOption, pressed && styles.modalOptionPressed]}
            >
              <MaterialIcons name="edit" size={22} color={iconColor} />
              <ThemedText style={[styles.modalOptionText, { color: textColor }]}>
                Rename list
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={() => listOptionsList && openDeleteListConfirm(listOptionsList)}
              style={({ pressed }) => [styles.modalOption, pressed && styles.modalOptionPressed]}
            >
              <MaterialIcons name="delete-outline" size={22} color={exitColor} />
              <ThemedText style={[styles.modalOptionText, { color: exitColor }]}>
                Delete list
              </ThemedText>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={renameList !== null}
        transparent
        animationType="fade"
        onRequestClose={closeRenameList}
      >
        <Pressable style={styles.modalOverlay} onPress={closeRenameList}>
          <Pressable
            style={[styles.modalCard, { backgroundColor: cardBg, borderColor }]}
            onPress={(e) => e.stopPropagation()}
          >
            <ThemedText style={[styles.modalTitle, { color: textColor }]}>
              Rename list
            </ThemedText>
            <TextInput
              style={[styles.modalInput, { color: textColor, borderColor, backgroundColor: surfaceColor }]}
              placeholder="List name"
              placeholderTextColor={iconColor}
              value={renameDraft}
              onChangeText={setRenameDraft}
              accessibilityLabel="List name"
            />
            <View style={styles.modalActions}>
              <Pressable
                onPress={closeRenameList}
                style={({ pressed }) => [
                  styles.modalButton,
                  { backgroundColor: surfaceColor },
                  pressed && styles.modalOptionPressed,
                ]}
              >
                <ThemedText style={[styles.modalButtonText, { color: textColor }]}>Cancel</ThemedText>
              </Pressable>
              <Pressable
                onPress={saveRenameList}
                disabled={!renameDraft.trim()}
                style={({ pressed }) => [
                  styles.modalButton,
                  { backgroundColor: tintColor },
                  !renameDraft.trim() && styles.modalButtonDisabled,
                  pressed && styles.modalOptionPressed,
                ]}
              >
                <ThemedText style={styles.modalButtonPrimaryText}>Save</ThemedText>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={deleteListConfirm !== null}
        transparent
        animationType="fade"
        onRequestClose={closeDeleteListConfirm}
      >
        <Pressable style={styles.modalOverlay} onPress={closeDeleteListConfirm}>
          <Pressable
            style={[styles.modalCard, { backgroundColor: cardBg, borderColor }]}
            onPress={(e) => e.stopPropagation()}
          >
            <ThemedText style={[styles.modalTitle, { color: textColor }]}>
              Delete list
            </ThemedText>
            <ThemedText style={[styles.modalMessage, { color: textColor }]}>
              {`Delete "${deleteListConfirm?.name}"? Tasks will be removed from this list.`}
            </ThemedText>
            <View style={styles.modalActions}>
              <Pressable
                onPress={closeDeleteListConfirm}
                style={({ pressed }) => [
                  styles.modalButton,
                  { backgroundColor: surfaceColor },
                  pressed && styles.modalOptionPressed,
                ]}
              >
                <ThemedText style={[styles.modalButtonText, { color: textColor }]}>Cancel</ThemedText>
              </Pressable>
              <Pressable
                onPress={confirmDeleteList}
                style={({ pressed }) => [
                  styles.modalButton,
                  { backgroundColor: exitColor },
                  pressed && styles.modalOptionPressed,
                ]}
              >
                <ThemedText style={styles.modalButtonPrimaryText}>Delete</ThemedText>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Toast
        visible={toast.visible}
        message={toast.message}
        onDismiss={dismissToast}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  tabsScroll: {
    flexGrow: 0,
    flexShrink: 0,
    paddingTop: 10,
    paddingHorizontal: 8,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  tabsContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    minHeight: 40,
    justifyContent: 'center',
    marginBottom: -1,
  },
  tabSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  tabPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  tabText: {
    fontSize: 13,
    opacity: 0.95,
  },
  tabTextActive: {
    fontWeight: '600',
    opacity: 1,
  },
  tabAddIcon: {
    marginRight: 4,
  },
  tabTextAdd: {
    fontSize: 13,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  modalMessage: {
    fontSize: 15,
    marginBottom: 20,
    lineHeight: 22,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 0,
  },
  modalOptionPressed: {
    opacity: 0.7,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalInput: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 90,
    alignItems: 'center',
  },
  modalButtonDisabled: {
    opacity: 0.5,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonPrimaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
