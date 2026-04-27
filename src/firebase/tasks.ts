import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./config";
import { Task } from "../../types";

const cleanTask = (task: Task): Record<string, unknown> => {
  const cleaned: Record<string, unknown> = {};
  Object.entries(task).forEach(([key, value]) => {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

export const firestoreGetTasks = async (userId: string): Promise<Task[]> => {
  const tasksRef = collection(db, "tasks", userId, "userTasks");
  const snapshot = await getDocs(tasksRef);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Task[];
};

export const firestoreSaveTasks = async (
  userId: string,
  tasks: Task[],
): Promise<void> => {
  const tasksRef = collection(db, "tasks", userId, "userTasks");
  const batch = writeBatch(db);
  
  const snapshot = await getDocs(tasksRef);
  snapshot.docs.forEach((d) => batch.delete(d.ref));
  
  for (const task of tasks) {
    const taskDoc = doc(tasksRef);
    batch.set(taskDoc, cleanTask(task));
  }
  
  await batch.commit();
};

export const firestoreMigrateFromLocal = async (
  userId: string,
  localTasks: Task[],
): Promise<void> => {
  const tasksRef = collection(db, "tasks", userId, "userTasks");
  const batch = writeBatch(db);
  
  for (const task of localTasks) {
    const taskDoc = doc(tasksRef);
    batch.set(taskDoc, cleanTask(task));
  }
  
  await batch.commit();
};