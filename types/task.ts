/**
 * Task model for the Task Manager app.
 * createdAt allows stable ordering (newest first) without mutating array order on each action.
 */
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  color?: string;
  listId?: string;
  createdAt?: number;
}
