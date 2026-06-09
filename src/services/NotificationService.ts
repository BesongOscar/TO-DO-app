import { Task } from "../domain/Task";
import { NotificationRepository } from "../repositories/interfaces/NotificationRepository";

export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async scheduleReminder(task: Task): Promise<void> {
    await this.notificationRepository.scheduleTaskReminder(task);
  }

  async cancelReminder(taskId: string): Promise<void> {
    await this.notificationRepository.cancelTaskReminder(taskId);
  }

  async cancelAll(): Promise<void> {
    await this.notificationRepository.cancelAll();
  }

  async setup(): Promise<boolean> {
    await this.notificationRepository.setupChannel();
    const granted = await this.notificationRepository.requestPermissions();
    return granted;
  }

  async scheduleRemindersForTasks(tasks: Task[]): Promise<void> {
    for (const task of tasks) {
      if (task.reminder) {
        try {
          await this.scheduleReminder(task);
        } catch {
          // Silently skip individual failures
        }
      }
    }
  }
}
