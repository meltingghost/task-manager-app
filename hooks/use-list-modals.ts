import { useCallback, useState } from 'react';
import { Keyboard } from 'react-native';

import type { List } from '@/types/list';
import type { TabFilter } from '@/utils/task-filters';

export interface UseListModalsParams {
  updateList: (id: string, name: string) => void;
  deleteList: (id: string) => void;
  removeListFromAllTasks: (listId: string) => void;
  showToast: (message: string) => void;
  filter: TabFilter;
  setFilter: (filter: TabFilter) => void;
}

export function useListModals({
  updateList,
  deleteList,
  removeListFromAllTasks,
  showToast,
  filter,
  setFilter,
}: UseListModalsParams) {
  const [listOptionsList, setListOptionsList] = useState<List | null>(null);
  const [renameList, setRenameList] = useState<List | null>(null);
  const [renameDraft, setRenameDraft] = useState('');
  const [deleteListConfirm, setDeleteListConfirm] = useState<List | null>(null);

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
  }, [deleteListConfirm, filter, removeListFromAllTasks, deleteList, showToast, closeDeleteListConfirm, setFilter]);

  return {
    listOptionsList,
    renameList,
    renameDraft,
    setRenameDraft,
    deleteListConfirm,
    openListOptions,
    closeListOptions,
    openRenameList,
    closeRenameList,
    saveRenameList,
    openDeleteListConfirm,
    closeDeleteListConfirm,
    confirmDeleteList,
  };
}
