/**
 * Tasks Firestore API - Handles task CRUD operations with Firestore
 *
 * Uses subcollection structure: /tasks/{userId}/userTasks/{taskId}
 * All operations use batched writes for performance
 */

import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { db } from "./config";
import { Task } from "../../types";

// Remove undefined fields before storing to Firestore
const cleanTask = (task: Task): Record<string, unknown> => {
  // Firestore doesn't store undefined, but we want to avoid storing fields at all if they're not set
  const cleaned: Record<string, unknown> = {};
  Object.entries(task).forEach(([key, value]) => {
    // Only include fields that are not undefined
    if (value !== undefined) {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

// Clean updates object for Firestore, converting undefined to deleteField()
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

export const firestoreGetTasks = async (userId: string): Promise<Task[]> => {
  // Get all tasks for a user, returns empty array if none exist
  const tasksRef = collection(db, "tasks", userId, "userTasks");
  const snapshot = await getDocs(tasksRef);

  return snapshot.docs.map((doc) => ({
    // Map Firestore documents to Task objects, using doc.id as task ID
    id: doc.id,
    ...doc.data(),
  })) as Task[];
};

export const firestoreSaveTasks = async (
  // Save entire task list for a user, replacing all existing tasks with the provided set
  userId: string,
  tasks: Task[],
): Promise<void> => {
  const tasksRef = collection(db, "tasks", userId, "userTasks"); // Reference to the user's tasks subcollection
  const batch = writeBatch(db);

  // Delete all existing tasks first
  const snapshot = await getDocs(tasksRef);
  snapshot.docs.forEach((d) => batch.delete(d.ref));

  // Write new task set using task.id as document ID
  for (const task of tasks) {
    const taskDoc = doc(tasksRef, task.id); // Use task.id as Firestore document ID for easier updates/deletes later
    batch.set(taskDoc, cleanTask(task));
  }

  await batch.commit();
};

export const firestoreUpdateTask = async (
  // Update specific fields of a task for a user by task ID, only updates provided fields without affecting others
  userId: string,
  taskId: string,
  updates: Partial<Task>,
): Promise<void> => {
  const taskDoc = doc(db, "tasks", userId, "userTasks", taskId);
  await updateDoc(taskDoc, cleanUpdates(updates));
};

export const firestoreDeleteTask = async (
  // Delete a specific task for a user by task ID
  userId: string,
  taskId: string,
): Promise<void> => {
  const taskDoc = doc(db, "tasks", userId, "userTasks", taskId);
  await deleteDoc(taskDoc);
};

export const firestoreMigrateFromLocal = async (
  // Migrate local tasks to Firestore for a user, used when logging in for the first time with existing local data
  userId: string,
  localTasks: Task[],
): Promise<void> => {
  const tasksRef = collection(db, "tasks", userId, "userTasks");
  const batch = writeBatch(db);

  for (const task of localTasks) {
    const taskDoc = doc(tasksRef, task.id);
    batch.set(taskDoc, cleanTask(task));
  }

  await batch.commit();
};
