import { useCallback, useReducer } from 'react';

import { TASK_COLORS } from '@/constants/theme';
import type { Task } from '@/types/task';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const defaultTaskColor = TASK_COLORS[0].hex;

// --- Action types (explicit names) ---

type TasksAction =
  | { type: 'ADD_TASK'; payload: { task: Task } }
  | { type: 'TOGGLE_TASK_COMPLETION'; payload: { taskId: string } }
  | { type: 'DELETE_TASK'; payload: { taskId: string } }
  | { type: 'UPDATE_TASK_TITLE'; payload: { taskId: string; title: string } }
  | { type: 'ADD_TASK_TO_LIST'; payload: { taskId: string; listId: string } }
  | { type: 'REMOVE_TASK_FROM_LIST'; payload: { taskId: string; listId: string } }
  | { type: 'REMOVE_LIST_FROM_ALL_TASKS'; payload: { listId: string } };

// --- Pure reducer (no side effects, same input => same output) ---

function tasksReducer(state: Task[], action: TasksAction): Task[] {
  switch (action.type) {
    case 'ADD_TASK': {
      const { task } = action.payload;
      return [task, ...state];
    }
    case 'TOGGLE_TASK_COMPLETION': {
      const { taskId } = action.payload;
      return state.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
    }
    case 'DELETE_TASK': {
      const { taskId } = action.payload;
      return state.filter((t) => t.id !== taskId);
    }
    case 'UPDATE_TASK_TITLE': {
      const { taskId, title } = action.payload;
      const trimmed = title.trim();
      if (!trimmed) return state;
      return state.map((t) =>
        t.id === taskId ? { ...t, title: trimmed } : t
      );
    }
    case 'ADD_TASK_TO_LIST': {
      const { taskId, listId } = action.payload;
      return state.map((t) => {
        if (t.id !== taskId) return t;
        const ids = t.listIds ?? [];
        if (ids.includes(listId)) return t;
        return { ...t, listIds: [...ids, listId] };
      });
    }
    case 'REMOVE_TASK_FROM_LIST': {
      const { taskId, listId } = action.payload;
      return state.map((t) => {
        if (t.id !== taskId) return t;
        const ids = t.listIds ?? [];
        if (!ids.includes(listId)) return t;
        return { ...t, listIds: ids.filter((id) => id !== listId) };
      });
    }
    case 'REMOVE_LIST_FROM_ALL_TASKS': {
      const { listId } = action.payload;
      return state.map((t) => ({
        ...t,
        listIds: (t.listIds ?? []).filter((id) => id !== listId),
      }));
    }
    default:
      return state;
  }
}

// --- Hook ---

export function useTasks() {
  const [tasks, dispatch] = useReducer(tasksReducer, []);

  const addTask = useCallback(
    (title: string, color?: string, listId?: string) => {
      const trimmed = title.trim();
      if (!trimmed) return;
      const task: Task = {
        id: generateId(),
        title: trimmed,
        completed: false,
        color: color ?? defaultTaskColor,
        listIds: listId ? [listId] : [],
        createdAt: Date.now(),
      };
      dispatch({ type: 'ADD_TASK', payload: { task } });
    },
    []
  );

  const toggleTaskCompletion = useCallback((taskId: string) => {
    dispatch({ type: 'TOGGLE_TASK_COMPLETION', payload: { taskId } });
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: { taskId } });
  }, []);

  const updateTask = useCallback((taskId: string, title: string) => {
    dispatch({ type: 'UPDATE_TASK_TITLE', payload: { taskId, title } });
  }, []);

  const addTaskToList = useCallback((taskId: string, listId: string) => {
    dispatch({ type: 'ADD_TASK_TO_LIST', payload: { taskId, listId } });
  }, []);

  const removeTaskFromList = useCallback((taskId: string, listId: string) => {
    dispatch({ type: 'REMOVE_TASK_FROM_LIST', payload: { taskId, listId } });
  }, []);

  const removeListFromAllTasks = useCallback((listId: string) => {
    dispatch({ type: 'REMOVE_LIST_FROM_ALL_TASKS', payload: { listId } });
  }, []);

  return {
    tasks,
    addTask,
    toggleTaskCompletion,
    deleteTask,
    updateTask,
    addTaskToList,
    removeTaskFromList,
    removeListFromAllTasks,
  };
}
