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
  // Get all custom lists for a user, returns empty array if none exist
  userId: string,
): Promise<CustomList[]> => {
  const listsRef = collection(db, "customLists", userId, "userLists");
  const snapshot = await getDocs(listsRef);

  return snapshot.docs.map((d) => ({
    // Map Firestore documents to CustomList objects, using doc.id as list ID
    id: d.id,
    ...d.data(),
  })) as CustomList[];
};

export const firestoreSaveCustomLists = async (
  // Save entire custom list set for a user, replacing all existing lists with the provided set
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
  // Migrate local custom lists to Firestore for a user, used when logging in for the first time with existing local data
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
