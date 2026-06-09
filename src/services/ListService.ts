import { CustomList, createCustomList } from "../domain/List";
import { ListRepository } from "../repositories/interfaces/ListRepository";

export class ListService {
  constructor(private readonly listRepository: ListRepository) {}

  async fetchLists(userId: string): Promise<CustomList[]> {
    return await this.listRepository.getLists(userId);
  }

  async addList(
    userId: string,
    name: string,
    icon: string,
    color: string,
    existingLists?: CustomList[],
  ): Promise<CustomList> {
    const list = createCustomList(name, icon, color);
    if (existingLists) {
      await this.listRepository.saveLists(userId, [list, ...existingLists]);
    } else {
      await this.listRepository.saveLists(userId, [list]);
    }
    return list;
  }

  async updateList(
    userId: string,
    listId: string,
    updates: Partial<Omit<CustomList, "id">>,
  ): Promise<void> {
    await this.listRepository.updateList(userId, listId, updates);
  }

  async deleteList(
    userId: string,
    listId: string,
    existingLists: CustomList[],
  ): Promise<void> {
    const updated = existingLists.filter((list) => list.id !== listId);
    await this.listRepository.saveLists(userId, updated);
  }

  async saveLists(userId: string, lists: CustomList[]): Promise<void> {
    await this.listRepository.saveLists(userId, lists);
  }

  async migrateFromLocal(
    userId: string,
    localLists: CustomList[],
  ): Promise<void> {
    await this.listRepository.migrateFromLocal(userId, localLists);
  }
}
