import { Q } from "@nozbe/watermelondb";
import { database } from "../../db/database";
import { CustomList } from "../../domain/List";
import { ListRepository } from "../interfaces/ListRepository";

const toDomain = (r: { _raw: Record<string, unknown> }): CustomList => {
  const raw = r._raw;
  return {
    id: raw.id as string,
    name: raw.name as string,
    icon: raw.icon as string,
    color: raw.color as string,
    createdAt: raw.created_at ? parseInt(raw.created_at as string, 10) : undefined,
  } as CustomList;
};

export class WatermelonListRepository implements ListRepository {
  async getLists(userId: string): Promise<CustomList[]> {
    const records = await database.get("custom_lists").query(Q.where("user_id", userId)).fetch();
    return records.map(toDomain);
  }

  async saveLists(userId: string, lists: CustomList[]): Promise<void> {
    const existing = await database.get("custom_lists").query(Q.where("user_id", userId)).fetch();
    const existingById = new Map(existing.map((r) => [r.id, r]));
    const incomingIds = new Set(lists.map((l) => l.id));

    await database.write(async () => {
      for (const [id, record] of existingById) {
        if (!incomingIds.has(id)) {
          await record.destroyPermanently();
        }
      }

      for (const list of lists) {
        const match = existingById.get(list.id);
        if (match) {
          await match.update(() => {
            const raw = match._raw as Record<string, string>;
            raw.name = list.name;
            raw.icon = list.icon;
            raw.color = list.color;
            raw.updated_at = Date.now().toString();
          });
        } else {
          await database.get("custom_lists").create((record) => {
            const raw = record._raw as Record<string, string>;
            raw.id = list.id;
            raw.name = list.name;
            raw.icon = list.icon;
            raw.color = list.color;
            raw.user_id = userId;
            raw.created_at = (list.createdAt ?? Date.now()).toString();
            raw.updated_at = Date.now().toString();
          });
        }
      }
    });
  }

  async updateList(
    userId: string,
    listId: string,
    updates: Partial<Omit<CustomList, "id">>,
  ): Promise<void> {
    const records = await database.get("custom_lists").query(Q.where("id", listId)).fetch();
    const record = records[0];
    if (!record) return;

    await database.write(async () => {
      await record.update(() => {
        const raw = record._raw as Record<string, string>;
        if (updates.name !== undefined) raw.name = updates.name;
        if (updates.icon !== undefined) raw.icon = updates.icon;
        if (updates.color !== undefined) raw.color = updates.color;
        raw.updated_at = Date.now().toString();
      });
    });
  }

  async migrateFromLocal(userId: string, localLists: CustomList[]): Promise<void> {
    await this.saveLists(userId, localLists);
  }
}
