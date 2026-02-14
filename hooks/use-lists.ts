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

  return { lists, addList };
}
