// ─── Task ─────────────────────────────────────────────────────────────────────
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  important: boolean;
  myDay: boolean;
  dueDate?: string;
  listId?: string;
}

// ─── List ─────────────────────────────────────────────────────────────────────
export interface ListItem {
  id: string;
  name: string;
  icon: string;
  color?: string;
  filterKey: FilterKey;
  count?: number;
}

export type FilterKey =
  | "myDay"
  | "important"
  | "planned"
  | "all"
  | "completed"
  | "tasks"
  | "listId";

// ─── Counts ───────────────────────────────────────────────────────────────────
export interface TaskCounts {
  myDay: number;
  important: number;
  completed: number;
  planned: number;
  all: number;
  tasks: number;
}

export interface CustomList{
  id: string;
  name: string;
  icon: string;
  createdAt: number;
}