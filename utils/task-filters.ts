/**
 * Helpers for tab filter type, status/list filtering, and combined filterTasks used by the UI.
 */
import type { Task } from '@/types/task';

export type TaskFilter = 'all' | 'active' | 'completed';

export type TabFilter = TaskFilter | string;

export function isTaskFilter(value: TabFilter): value is TaskFilter {
  return value === 'all' || value === 'active' || value === 'completed';
}

export function filterByStatus(tasks: Task[], filter: TaskFilter): Task[] {
  switch (filter) {
    case 'active':
      return tasks.filter((t) => !t.completed);
    case 'completed':
      return tasks.filter((t) => t.completed);
    default:
      return tasks;
  }
}

export function filterByList(tasks: Task[], listId: string): Task[] {
  return tasks.filter((t) => (t.listIds ?? []).includes(listId));
}

export interface FilterTasksParams {
  tasks: Task[];
  filter: TabFilter;
  searchQuery: string;
  colorFilter: string | null;
}

/**
 * Applies tab filter (status or list), then search by title, then color filter.
 */
export function filterTasks({
  tasks,
  filter,
  searchQuery,
  colorFilter,
}: FilterTasksParams): Task[] {
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
}
