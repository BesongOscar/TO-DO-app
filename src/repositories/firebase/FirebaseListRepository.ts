import {
  collection,
  doc,
  getDocs,
  writeBatch,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { CustomList } from "../../domain/List";
import { ListRepository } from "../interfaces/ListRepository";

const normalizeList = (data: Record<string, unknown>): CustomList => ({
  id: (data.id as string) ?? "",
  name: (data.name as string) ?? "",
  icon: (data.icon as string) ?? "📋",
  color: (data.color as string) ?? "#0078d4",
  createdAt: data.createdAt as number | undefined,
});

export class FirebaseListRepository implements ListRepository {
  async getLists(userId: string): Promise<CustomList[]> {
    const listsRef = collection(db, "customLists", userId, "userLists");
    const snapshot = await getDocs(listsRef);
    return snapshot.docs.map((d) =>
      normalizeList({ id: d.id, ...d.data() }),
    );
  }

  async saveLists(userId: string, lists: CustomList[]): Promise<void> {
    const listsRef = collection(db, "customLists", userId, "userLists");
    const batch = writeBatch(db);

    const snapshot = await getDocs(listsRef);
    snapshot.docs.forEach((d) => batch.delete(d.ref));

    for (const list of lists) {
      const listDoc = doc(listsRef, list.id);
      batch.set(listDoc, list);
    }

    await batch.commit();
  }

  async updateList(
    userId: string,
    listId: string,
    updates: Partial<Omit<CustomList, "id">>,
  ): Promise<void> {
    const listDoc = doc(db, "customLists", userId, "userLists", listId);
    await updateDoc(listDoc, updates);
  }

  async migrateFromLocal(
    userId: string,
    localLists: CustomList[],
  ): Promise<void> {
    const listsRef = collection(db, "customLists", userId, "userLists");
    const batch = writeBatch(db);

    for (const list of localLists) {
      const listDoc = doc(listsRef, list.id);
      batch.set(listDoc, list);
    }

    await batch.commit();
  }
}
