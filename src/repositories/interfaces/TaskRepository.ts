import { Task } from "../../domain/Task";

export interface TaskRepository {
  getTasks(userId: string): Promise<Task[]>;
  saveTasks(userId: string, tasks: Task[]): Promise<void>;
  updateTask(
    userId: string,
    taskId: string,
    updates: Partial<Task>,
  ): Promise<void>;
  deleteTask(userId: string, taskId: string): Promise<void>;
  migrateFromLocal(userId: string, localTasks: Task[]): Promise<void>;
}
