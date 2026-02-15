import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

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
import { useListModals } from '@/hooks/use-list-modals';
import { useLists } from '@/hooks/use-lists';
import { useTasks } from '@/hooks/use-tasks';
import { useTasksFilter } from '@/hooks/use-tasks-filter';
import { useToast } from '@/hooks/use-toast';
import type { TabFilter, TaskFilter } from '@/utils/task-filters';

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
  const { visible: toastVisible, message: toastMessage, showToast, dismissToast } = useToast();
  const {
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    colorFilter,
    setColorFilter,
    filteredTasks,
    currentListId,
  } = useTasksFilter(tasks);
  const listModals = useListModals({
    updateList,
    deleteList,
    removeListFromAllTasks,
    showToast,
    filter,
    setFilter,
  });

  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [addListModalVisible, setAddListModalVisible] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <TasksHeader onProfileSaved={() => showToast('Perfil actualizado')} />

      <TasksTabBar
        filter={filter}
        lists={lists}
        onFilterChange={setFilter}
        onListOptions={listModals.openListOptions}
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
        visible={listModals.listOptionsList !== null}
        list={listModals.listOptionsList}
        onClose={listModals.closeListOptions}
        onRename={listModals.openRenameList}
        onDelete={listModals.openDeleteListConfirm}
      />

      <RenameListModal
        visible={listModals.renameList !== null}
        draft={listModals.renameDraft}
        onDraftChange={listModals.setRenameDraft}
        onClose={listModals.closeRenameList}
        onSave={listModals.saveRenameList}
      />

      <DeleteListConfirmModal
        visible={listModals.deleteListConfirm !== null}
        list={listModals.deleteListConfirm}
        onClose={listModals.closeDeleteListConfirm}
        onConfirm={listModals.confirmDeleteList}
      />

      <Toast
        visible={toastVisible}
        message={toastMessage}
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
