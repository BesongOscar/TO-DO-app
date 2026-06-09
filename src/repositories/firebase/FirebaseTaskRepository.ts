import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  writeBatch,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { Task } from "../../domain/Task";
import { TaskRepository } from "../interfaces/TaskRepository";

const cleanTask = (task: Task): Record<string, unknown> => {
  const cleaned: Record<string, unknown> = {};
  Object.entries(task).forEach(([key, value]) => {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

const cleanUpdates = (updates: Partial<Task>): Record<string, unknown> => {
  const cleaned: Record<string, unknown> = {};
  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined) {
      cleaned[key] = deleteField();
    } else {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

const normalizeTask = (data: Record<string, unknown>): Task => ({
  id: (data.id as string) ?? "",
  text: (data.text as string) ?? "",
  completed: (data.completed as boolean) ?? false,
  important: (data.important as boolean) ?? false,
  myDay: (data.myDay as boolean) ?? false,
  listId: data.listId as string | undefined,
  order: data.order as number | undefined,
  dueDate: data.dueDate as string | undefined,
  dueTime: data.dueTime as string | undefined,
  reminder: data.reminder as string | undefined,
  note: data.note as string | undefined,
  repeat: data.repeat as Task["repeat"] | undefined,
  repeatDays: data.repeatDays as number[] | undefined,
  repeatOnDay: data.repeatOnDay as number | undefined,
  repeatOnLastDay: data.repeatOnLastDay as boolean | undefined,
  repeatEndDate: data.repeatEndDate as string | undefined,
  createdAt: data.createdAt as number | undefined,
});

export class FirebaseTaskRepository implements TaskRepository {
  async getTasks(userId: string): Promise<Task[]> {
    const tasksRef = collection(db, "tasks", userId, "userTasks");
    const snapshot = await getDocs(tasksRef);
    return snapshot.docs.map((doc) =>
      normalizeTask({ id: doc.id, ...doc.data() }),
    );
  }

  async saveTasks(userId: string, tasks: Task[]): Promise<void> {
    const tasksRef = collection(db, "tasks", userId, "userTasks");
    const batch = writeBatch(db);

    const snapshot = await getDocs(tasksRef);
    const existingIds = new Set(snapshot.docs.map((d) => d.id));
    const currentIds = new Set(tasks.map((t) => t.id));

    for (const task of tasks) {
      const taskDoc = doc(tasksRef, task.id);
      batch.set(taskDoc, cleanTask(task));
    }

    for (const existingId of existingIds) {
      if (!currentIds.has(existingId)) {
        const taskDoc = doc(tasksRef, existingId);
        batch.delete(taskDoc);
      }
    }

    await batch.commit();
  }

  async updateTask(
    userId: string,
    taskId: string,
    updates: Partial<Task>,
  ): Promise<void> {
    const taskDoc = doc(db, "tasks", userId, "userTasks", taskId);
    await updateDoc(taskDoc, cleanUpdates(updates));
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    const taskDoc = doc(db, "tasks", userId, "userTasks", taskId);
    await deleteDoc(taskDoc);
  }

  async migrateFromLocal(userId: string, localTasks: Task[]): Promise<void> {
    const tasksRef = collection(db, "tasks", userId, "userTasks");
    const batch = writeBatch(db);

    for (const task of localTasks) {
      const taskDoc = doc(tasksRef, task.id);
      batch.set(taskDoc, cleanTask(task));
    }

    await batch.commit();
  }
}
