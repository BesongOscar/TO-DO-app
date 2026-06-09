import { Task } from "./Task";

export interface Reminder {
  taskId: string;
  date: Date;
  repeat?: Task["repeat"];
  repeatDays?: number[];
  repeatOnDay?: number;
  repeatOnLastDay?: boolean;
  repeatEndDate?: string;
}

export const reminderFromTask = (task: Task): Reminder | null => {
  if (!task.reminder) return null;
  return {
    taskId: task.id,
    date: new Date(task.reminder),
    repeat: task.repeat,
    repeatDays: task.repeatDays,
    repeatOnDay: task.repeatOnDay,
    repeatOnLastDay: task.repeatOnLastDay,
    repeatEndDate: task.repeatEndDate,
  };
};

export const hasRepeatExpired = (reminder: Reminder): boolean => {
  if (!reminder.repeatEndDate) return false;
  const endDate = new Date(reminder.repeatEndDate);
  endDate.setHours(23, 59, 59, 999);
  return endDate < new Date();
};
