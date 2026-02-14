import { useCallback, useMemo, useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';

import { AddListModal } from '@/components/task/add-list-modal';
import { AddTaskModal } from '@/components/task/add-task-modal';
import { DeleteListConfirmModal } from '@/components/task/delete-list-confirm-modal';
import { FloatingAddButton } from '@/components/task/floating-add-button';
import { ListOptionsModal } from '@/components/task/list-options-modal';
import { RenameListModal } from '@/components/task/rename-list-modal';
import { SearchAndFilterBar } from '@/components/task/search-and-filter-bar';
import { TaskList } from '@/components/task/task-list';
import { TasksHeader } from '@/components/task/tasks-header';
import { TasksTabBar } from '@/components/task/tasks-tab-bar';
import { ThemedView } from '@/components/themed-view';
import { Toast } from '@/components/ui/toast';
import { useLists } from '@/hooks/use-lists';
import { useTasks } from '@/hooks/use-tasks';
import type { List } from '@/types/list';
import {
  filterTasks,
  isTaskFilter,
  type TabFilter,
  type TaskFilter,
} from '@/utils/task-filters';

export type { TabFilter, TaskFilter };

export default function TasksScreen() {
  const {
    tasks,
    addTask,
    toggleTaskCompletion,
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

  const filteredTasks = useMemo(
    () => filterTasks({ tasks, filter, searchQuery, colorFilter }),
    [tasks, filter, searchQuery, colorFilter]
  );

  const currentListId = isTaskFilter(filter) ? undefined : filter;

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

  return (
    <ThemedView style={styles.container}>
      <TasksHeader onProfileSaved={() => showToast('Perfil actualizado')} />

      <TasksTabBar
        filter={filter}
        lists={lists}
        onFilterChange={setFilter}
        onListOptions={openListOptions}
        onAddList={() => setAddListModalVisible(true)}
      />

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
          onToggleCompletion={toggleTaskCompletion}
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

      <ListOptionsModal
        visible={listOptionsList !== null}
        list={listOptionsList}
        onClose={closeListOptions}
        onRename={openRenameList}
        onDelete={openDeleteListConfirm}
      />

      <RenameListModal
        visible={renameList !== null}
        draft={renameDraft}
        onDraftChange={setRenameDraft}
        onClose={closeRenameList}
        onSave={saveRenameList}
      />

      <DeleteListConfirmModal
        visible={deleteListConfirm !== null}
        list={deleteListConfirm}
        onClose={closeDeleteListConfirm}
        onConfirm={confirmDeleteList}
      />

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
});
