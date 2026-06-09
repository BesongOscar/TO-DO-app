import { Task } from "../../domain/Task";

export interface NotificationRepository {
  scheduleTaskReminder(task: Task): Promise<void>;
  cancelTaskReminder(taskId: string): Promise<void>;
  cancelAll(): Promise<void>;
  requestPermissions(): Promise<boolean>;
  setupChannel(): Promise<void>;
  getAllScheduled(): Promise<unknown[]>;
}
