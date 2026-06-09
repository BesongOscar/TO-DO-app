import {
  collection,
  doc,
  getDocs,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Task } from "../domain/Task";
import { CustomList } from "../domain/List";

interface SyncChanges {
  tasks: {
    created: Record<string, unknown>[];
    updated: Record<string, unknown>[];
    deleted: string[];
  };
  custom_lists: {
    created: Record<string, unknown>[];
    updated: Record<string, unknown>[];
    deleted: string[];
  };
}

const toFirestoreTask = (raw: Record<string, unknown>) => ({
  id: raw.id as string,
  text: raw.text as string,
  completed: raw.completed as boolean,
  important: raw.important as boolean,
  myDay: raw.my_day as boolean,
  order: raw.order as number | undefined,
  dueDate: raw.due_date as string | undefined,
  dueTime: raw.due_time as string | undefined,
  reminder: raw.reminder as string | undefined,
  note: raw.note as string | undefined,
  repeat: raw.repeat as Task["repeat"] | undefined,
  repeatDays: raw.repeat_days ? JSON.parse(raw.repeat_days as string) : undefined,
  repeatOnDay: raw.repeat_on_day as number | undefined,
  repeatOnLastDay: raw.repeat_on_last_day as boolean | undefined,
  repeatEndDate: raw.repeat_end_date as string | undefined,
  listId: raw.list_id as string | undefined,
  createdAt: raw.created_at as number,
});

const toFirestoreList = (raw: Record<string, unknown>) => ({
  id: raw.id as string,
  name: raw.name as string,
  icon: raw.icon as string,
  color: raw.color as string,
  createdAt: raw.created_at as number,
});

const toLocalTask = (task: Task): Record<string, unknown> => ({
  id: task.id,
  firestore_id: task.id,
  text: task.text,
  completed: task.completed,
  important: task.important,
  my_day: task.myDay,
  order: task.order ?? null,
  due_date: task.dueDate ?? null,
  due_time: task.dueTime ?? null,
  reminder: task.reminder ?? null,
  note: task.note ?? null,
  repeat: task.repeat ?? null,
  repeat_days: task.repeatDays ? JSON.stringify(task.repeatDays) : null,
  repeat_on_day: task.repeatOnDay ?? null,
  repeat_on_last_day: task.repeatOnLastDay ?? null,
  repeat_end_date: task.repeatEndDate ?? null,
  list_id: task.listId ?? null,
  created_at: task.createdAt ?? Date.now(),
  updated_at: Date.now(),
});

const toLocalList = (list: CustomList): Record<string, unknown> => ({
  id: list.id,
  firestore_id: list.id,
  name: list.name,
  icon: list.icon,
  color: list.color,
  created_at: list.createdAt ?? Date.now(),
  updated_at: Date.now(),
});

export class SyncService {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async pullChanges(
    lastPulledAt: number,
  ): Promise<{ changes: SyncChanges; timestamp: number }> {
    const timestamp = Date.now();
    const changes: SyncChanges = {
      tasks: { created: [], updated: [], deleted: [] },
      custom_lists: { created: [], updated: [], deleted: [] },
    };

    try {
      const tasksRef = collection(db, "tasks", this.userId, "userTasks");
      const tasksSnapshot = await getDocs(tasksRef);
      const now = Timestamp.now().toMillis();

      for (const docSnap of tasksSnapshot.docs) {
        const data = { id: docSnap.id, ...docSnap.data() };
        const task = toFirestoreTask(data);
        const local = toLocalTask(task);
        local.user_id = this.userId;
        changes.tasks.created.push(local);
      }

      const listsRef = collection(
        db,
        "customLists",
        this.userId,
        "userLists",
      );
      const listsSnapshot = await getDocs(listsRef);

      for (const docSnap of listsSnapshot.docs) {
        const data = { id: docSnap.id, ...docSnap.data() };
        const list = toFirestoreList(data);
        const local = toLocalList(list);
        local.user_id = this.userId;
        changes.custom_lists.created.push(local);
      }

      return { changes, timestamp: now };
    } catch (error) {
      console.warn("Sync pull failed, returning empty changes:", error);
      return { changes, timestamp };
    }
  }

  async pushChanges(changes: SyncChanges): Promise<void> {
    const tasksRef = collection(db, "tasks", this.userId, "userTasks");
    const listsRef = collection(
      db,
      "customLists",
      this.userId,
      "userLists",
    );

    const batch = writeBatch(db);

    for (const raw of changes.tasks.created) {
      const task = toFirestoreTask(raw);
      batch.set(doc(tasksRef, task.id), task);
    }

    for (const raw of changes.tasks.updated) {
      const task = toFirestoreTask(raw);
      batch.set(doc(tasksRef, task.id), task);
    }

    for (const id of changes.tasks.deleted) {
      batch.delete(doc(tasksRef, id));
    }

    for (const raw of changes.custom_lists.created) {
      const list = toFirestoreList(raw);
      batch.set(doc(listsRef, list.id), list);
    }

    for (const raw of changes.custom_lists.updated) {
      const list = toFirestoreList(raw);
      batch.set(doc(listsRef, list.id), list);
    }

    for (const id of changes.custom_lists.deleted) {
      batch.delete(doc(listsRef, id));
    }

    await batch.commit();
  }
}
