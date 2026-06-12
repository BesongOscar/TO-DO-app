import { Task } from "../../domain/Task";
import { NotificationRepository } from "../interfaces/NotificationRepository";
import * as notificationService from "../../services/notificationService";

export class FirebaseNotificationRepository
  implements NotificationRepository
{
  async scheduleTaskReminder(task: Task): Promise<void> {
    await notificationService.scheduleTaskReminder(task as any);
  }

  async cancelTaskReminder(taskId: string): Promise<void> {
    await notificationService.cancelTaskReminder(taskId);
  }

  async cancelAll(): Promise<void> {
    await notificationService.cancelAllTaskReminders();
  }

  async requestPermissions(): Promise<boolean> {
    return await notificationService.requestNotificationPermissions();
  }

  async setupChannel(): Promise<void> {
    await notificationService.setupNotificationChannel();
  }

  async getAllScheduled(): Promise<unknown[]> {
    return await notificationService.getAllScheduledReminders();
  }
}
