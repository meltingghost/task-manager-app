import { useCallback, useState } from 'react';

import { TASK_COLORS } from '@/constants/theme';
import type { Task } from '@/types/task';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const defaultTaskColor = TASK_COLORS[0].hex;

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = useCallback((title: string, color?: string, listId?: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTasks((prev) => [
      {
        id: generateId(),
        title: trimmed,
        completed: false,
        color: color ?? defaultTaskColor,
        listIds: listId ? [listId] : [],
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  }, []);

  const addTaskToList = useCallback((taskId: string, listId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const ids = t.listIds ?? [];
        if (ids.includes(listId)) return t;
        return { ...t, listIds: [...ids, listId] };
      })
    );
  }, []);

  const removeTaskFromList = useCallback((taskId: string, listId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const ids = t.listIds ?? [];
        if (!ids.includes(listId)) return t;
        return { ...t, listIds: ids.filter((id) => id !== listId) };
      })
    );
  }, []);

  const removeListFromAllTasks = useCallback((listId: string) => {
    setTasks((prev) =>
      prev.map((t) => ({
        ...t,
        listIds: (t.listIds ?? []).filter((id) => id !== listId),
      }))
    );
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateTask = useCallback((id: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: trimmed } : t))
    );
  }, []);

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    addTaskToList,
    removeTaskFromList,
    removeListFromAllTasks,
  };
}
