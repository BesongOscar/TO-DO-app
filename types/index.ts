// ─── Task ─────────────────────────────────────────────────────────────────────
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  important: boolean;
  myDay: boolean;
  dueDate?: string;
  dueTime?: string;
  reminder?: string;
  note?: string;
  repeat?: RepeatType;
  repeatDays?: number[];
  repeatOnDay?: number;
  repeatOnLastDay?: boolean;
  repeatEndDate?: string;
  listId?: string;
  order?: number;
}

// ─── Shared list fields ───────────────────────────────────────────────────────
export interface ListFields {
  id: string;
  name: string;
  icon: string;
  color: string;
}

// ─── List ─────────────────────────────────────────────────────────────────────
export interface ListItem extends ListFields {
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

// ─── Custom List ──────────────────────────────────────────────────────────────
export interface CustomList extends ListFields {
  taskCount: number;
  createdAt?: number;
}

// ─── Repeat ───────────────────────────────────────────────────────────────────
export type RepeatType = "daily" | "weekly" | "monthly" | "yearly" | "none";
