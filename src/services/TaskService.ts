import { Task, createTask, isOverdue } from "../domain/Task";
import { TaskRepository } from "../repositories/interfaces/TaskRepository";
import { TaskCounts } from "../../types";

export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async fetchTasks(userId: string): Promise<Task[]> {
    return await this.taskRepository.getTasks(userId);
  }

  async addTask(
    userId: string,
    text: string,
    listName?: string,
    listId?: string,
    existingTasks?: Task[],
  ): Promise<Task> {
    const task = createTask(text, {
      myDay: listName === "My Day",
      listId,
    });
    if (existingTasks) {
      const allTasks = [task, ...existingTasks];
      await this.taskRepository.saveTasks(userId, allTasks);
    } else {
      await this.taskRepository.saveTasks(userId, [task]);
    }
    return task;
  }

  async toggleTask(
    userId: string,
    task: Task,
    allTasks: Task[],
  ): Promise<void> {
    const willBeCompleted = !task.completed;
    let newOrder: number | undefined;

    if (!willBeCompleted) {
      const maxOrder = allTasks
        .filter((t) => !t.completed && t.order !== undefined)
        .reduce((max, t) => Math.max(max, t.order ?? 0), -1);
      newOrder = maxOrder + 1;
    }

    await this.taskRepository.updateTask(userId, task.id, {
      completed: willBeCompleted,
      order: newOrder,
    });
  }

  async toggleImportant(
    userId: string,
    taskId: string,
  ): Promise<void> {
    const task = await this.getTaskById(userId, taskId);
    if (!task) return;
    await this.taskRepository.updateTask(userId, taskId, {
      important: !task.important,
    });
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    await this.taskRepository.deleteTask(userId, taskId);
  }

  async updateTask(
    userId: string,
    taskId: string,
    updates: Partial<Task>,
  ): Promise<void> {
    await this.taskRepository.updateTask(userId, taskId, updates);
  }

  async reorderTasks(
    userId: string,
    tasks: Task[],
  ): Promise<Task[]> {
    const reordered = tasks.map((task, index) => ({
      ...task,
      order: index,
    }));
    await this.taskRepository.saveTasks(userId, reordered);
    return reordered;
  }

  computeCounts(tasks: Task[]): TaskCounts {
    return {
      myDay: tasks.filter((t) => t.myDay && !t.completed).length,
      important: tasks.filter((t) => t.important && !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
      planned: tasks.filter((t) => Boolean(t.dueDate) && !t.completed).length,
      all: tasks.length,
      tasks: tasks.filter(
        (t) => !t.myDay && !t.important && !t.completed,
      ).length,
    };
  }

  isTaskOverdue(task: Task): boolean {
    return isOverdue(task);
  }

  private async getTaskById(
    userId: string,
    taskId: string,
  ): Promise<Task | null> {
    const tasks = await this.taskRepository.getTasks(userId);
    return tasks.find((t) => t.id === taskId) ?? null;
  }

  async migrateFromLocal(
    userId: string,
    localTasks: Task[],
  ): Promise<void> {
    await this.taskRepository.migrateFromLocal(userId, localTasks);
  }
}
