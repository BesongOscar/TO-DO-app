import { CustomList } from "../../domain/List";

export interface ListRepository {
  getLists(userId: string): Promise<CustomList[]>;
  saveLists(userId: string, lists: CustomList[]): Promise<void>;
  updateList(
    userId: string,
    listId: string,
    updates: Partial<Omit<CustomList, "id">>,
  ): Promise<void>;
  migrateFromLocal(userId: string, localLists: CustomList[]): Promise<void>;
}
