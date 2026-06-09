import { Q } from "@nozbe/watermelondb";
import { database } from "../../db/database";
import { Task } from "../../domain/Task";
import { TaskRepository } from "../interfaces/TaskRepository";

const toDomain = (r: { _raw: Record<string, unknown> }): Task => {
  const raw = r._raw;
  return {
    id: raw.id as string,
    text: raw.text as string,
    completed: raw.completed === "true",
    important: raw.important === "true",
    myDay: raw.my_day === "true",
    order: raw.order ? parseInt(raw.order as string, 10) : undefined,
    dueDate: (raw.due_date as string) || undefined,
    dueTime: (raw.due_time as string) || undefined,
    reminder: (raw.reminder as string) || undefined,
    note: (raw.note as string) || undefined,
    repeat: raw.repeat as Task["repeat"] | undefined,
    repeatDays: raw.repeat_days ? JSON.parse(raw.repeat_days as string) : undefined,
    repeatOnDay: raw.repeat_on_day ? parseInt(raw.repeat_on_day as string, 10) : undefined,
    repeatOnLastDay: raw.repeat_on_last_day === "true" || undefined,
    repeatEndDate: (raw.repeat_end_date as string) || undefined,
    listId: (raw.list_id as string) || undefined,
    createdAt: raw.created_at ? parseInt(raw.created_at as string, 10) : undefined,
  } as Task;
};

export class WatermelonTaskRepository implements TaskRepository {
  async getTasks(userId: string): Promise<Task[]> {
    const records = await database.get("tasks").query(Q.where("user_id", userId)).fetch();
    return records.map(toDomain);
  }

  async saveTasks(userId: string, tasks: Task[]): Promise<void> {
    const existing = await database.get("tasks").query(Q.where("user_id", userId)).fetch();
    const existingById = new Map(existing.map((r) => [r.id, r]));
    const incomingIds = new Set(tasks.map((t) => t.id));

    await database.write(async () => {
      for (const [id, record] of existingById) {
        if (!incomingIds.has(id)) {
          await record.destroyPermanently();
        }
      }

      for (const task of tasks) {
        const match = existingById.get(task.id);
        if (match) {
          await match.update(() => {
            const raw = match._raw as Record<string, string>;
            raw.text = task.text;
            raw.completed = task.completed ? "true" : "false";
            raw.important = task.important ? "true" : "false";
            raw.my_day = task.myDay ? "true" : "false";
            raw.order = task.order?.toString() ?? "";
            raw.due_date = task.dueDate ?? "";
            raw.due_time = task.dueTime ?? "";
            raw.reminder = task.reminder ?? "";
            raw.note = task.note ?? "";
            raw.repeat = task.repeat ?? "";
            raw.repeat_days = task.repeatDays ? JSON.stringify(task.repeatDays) : "";
            raw.repeat_on_day = task.repeatOnDay?.toString() ?? "";
            raw.repeat_on_last_day = task.repeatOnLastDay ? "true" : "false";
            raw.repeat_end_date = task.repeatEndDate ?? "";
            raw.list_id = task.listId ?? "";
            raw.updated_at = Date.now().toString();
          });
        } else {
          await database.get("tasks").create((record) => {
            const raw = record._raw as Record<string, string>;
            raw.id = task.id;
            raw.text = task.text;
            raw.completed = task.completed ? "true" : "false";
            raw.important = task.important ? "true" : "false";
            raw.my_day = task.myDay ? "true" : "false";
            raw.order = task.order?.toString() ?? "";
            raw.due_date = task.dueDate ?? "";
            raw.due_time = task.dueTime ?? "";
            raw.reminder = task.reminder ?? "";
            raw.note = task.note ?? "";
            raw.repeat = task.repeat ?? "";
            raw.repeat_days = task.repeatDays ? JSON.stringify(task.repeatDays) : "";
            raw.repeat_on_day = task.repeatOnDay?.toString() ?? "";
            raw.repeat_on_last_day = task.repeatOnLastDay ? "true" : "false";
            raw.repeat_end_date = task.repeatEndDate ?? "";
            raw.list_id = task.listId ?? "";
            raw.user_id = userId;
            raw.created_at = (task.createdAt ?? Date.now()).toString();
            raw.updated_at = Date.now().toString();
          });
        }
      }
    });
  }

  async updateTask(userId: string, taskId: string, updates: Partial<Task>): Promise<void> {
    const records = await database.get("tasks").query(Q.where("id", taskId)).fetch();
    const record = records[0];
    if (!record) return;

    await database.write(async () => {
      await record.update(() => {
        const raw = record._raw as Record<string, string>;
        if (updates.text !== undefined) raw.text = updates.text;
        if (updates.completed !== undefined) raw.completed = updates.completed ? "true" : "false";
        if (updates.important !== undefined) raw.important = updates.important ? "true" : "false";
        if (updates.myDay !== undefined) raw.my_day = updates.myDay ? "true" : "false";
        if (updates.order !== undefined) raw.order = updates.order.toString();
        if (updates.dueDate !== undefined) raw.due_date = updates.dueDate ?? "";
        if (updates.dueTime !== undefined) raw.due_time = updates.dueTime ?? "";
        if (updates.note !== undefined) raw.note = updates.note ?? "";
        if (updates.listId !== undefined) raw.list_id = updates.listId ?? "";
        if (updates.reminder !== undefined) raw.reminder = updates.reminder ?? "";
        raw.updated_at = Date.now().toString();
      });
    });
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    const records = await database.get("tasks").query(Q.where("id", taskId)).fetch();
    const record = records[0];
    if (!record) return;
    await database.write(async () => {
      await record.destroyPermanently();
    });
  }

  async migrateFromLocal(userId: string, localTasks: Task[]): Promise<void> {
    await this.saveTasks(userId, localTasks);
  }
}
