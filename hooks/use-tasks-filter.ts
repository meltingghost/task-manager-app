import { useMemo, useState } from 'react';

import type { Task } from '@/types/task';
import { filterTasks, isTaskFilter, type TabFilter } from '@/utils/task-filters';

export function useTasksFilter(tasks: Task[]) {
  const [filter, setFilter] = useState<TabFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [colorFilter, setColorFilter] = useState<string | null>(null);

  const filteredTasks = useMemo(
    () => filterTasks({ tasks, filter, searchQuery, colorFilter }),
    [tasks, filter, searchQuery, colorFilter]
  );

  const currentListId = isTaskFilter(filter) ? undefined : filter;

  return {
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    colorFilter,
    setColorFilter,
    filteredTasks,
    currentListId,
  };
}
