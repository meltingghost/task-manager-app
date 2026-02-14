import { useCallback, useState } from 'react';

import type { List } from '@/types/list';

function generateId(): string {
  return `list-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useLists() {
  const [lists, setLists] = useState<List[]>([]);

  const addList = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setLists((prev) => [
      ...prev,
      { id: generateId(), name: trimmed },
    ]);
  }, []);

  const updateList = useCallback((id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setLists((prev) =>
      prev.map((l) => (l.id === id ? { ...l, name: trimmed } : l))
    );
  }, []);

  const deleteList = useCallback((id: string) => {
    setLists((prev) => prev.filter((l) => l.id !== id));
  }, []);

  return { lists, addList, updateList, deleteList };
}
