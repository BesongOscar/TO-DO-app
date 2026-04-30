/**
 * Custom Lists Firestore API - Handles user-created list CRUD
 * 
 * Uses subcollection structure: /customLists/{userId}/userLists/{listId}
 */

import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./config";
import { CustomList } from "../../types";

export const firestoreGetCustomLists = async (
  userId: string,
): Promise<CustomList[]> => {
  const listsRef = collection(db, "customLists", userId, "userLists");
  const snapshot = await getDocs(listsRef);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as CustomList[];
};

export const firestoreSaveCustomLists = async (
  userId: string,
  lists: CustomList[],
): Promise<void> => {
  const listsRef = collection(db, "customLists", userId, "userLists");
  const batch = writeBatch(db);

  const snapshot = await getDocs(listsRef);
  snapshot.docs.forEach((d) => batch.delete(d.ref));

  for (const list of lists) {
    const listDoc = doc(listsRef, list.id);
    batch.set(listDoc, list);
  }

  await batch.commit();
};

export const firestoreMigrateCustomListsFromLocal = async (
  userId: string,
  localLists: CustomList[],
): Promise<void> => {
  const listsRef = collection(db, "customLists", userId, "userLists");
  const batch = writeBatch(db);

  for (const list of localLists) {
    const listDoc = doc(listsRef, list.id);
    batch.set(listDoc, list);
  }

  await batch.commit();
};