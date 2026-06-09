/**
 * Task domain model with repeat scheduling support
 * 
 * Supports daily/weekly/monthly/yearly repeats with advanced options:
 * repeatDays (weekly: 0-6), repeatOnDay (monthly: 1-31), repeatOnLastDay,
 * and repeatEndDate for auto-expiry.
 */

export type RepeatType = "daily" | "weekly" | "monthly" | "yearly" | "none";

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
  createdAt?: number;
}

export const isOverdue = (task: Task): boolean => {
  if (!task.dueDate || task.completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(task.dueDate + "T00:00:00");
  return due < today;
};

export const createTask = (
  text: string,
  overrides?: Partial<Task>,
): Task => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  text: text.trim(),
  completed: false,
  important: false,
  myDay: false,
  order: 0,
  createdAt: Date.now(),
  ...overrides,
});
