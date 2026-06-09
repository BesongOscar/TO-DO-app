const mockCollection = jest.fn();
const mockDoc = jest.fn();
const mockGetDocs = jest.fn();
const mockWriteBatch = jest.fn();
const mockUpdateDoc = jest.fn();

const mockBatchSet = jest.fn();
const mockBatchDelete = jest.fn();
const mockBatchCommit = jest.fn();
const mockBatch = { set: mockBatchSet, delete: mockBatchDelete, commit: mockBatchCommit };

jest.mock("firebase/firestore", () => ({
  collection: (...args: unknown[]) => mockCollection(...args),
  doc: (...args: unknown[]) => mockDoc(...args),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  writeBatch: (...args: unknown[]) => mockWriteBatch(...args),
  updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
}));

jest.mock("../../firebase/config", () => ({
  db: { type: "mock-db" },
}));

import { FirebaseListRepository } from "../../repositories/firebase/FirebaseListRepository";

const toSnapshotDoc = (id: string, data: Record<string, unknown>) => ({
  id,
  data: () => data,
  ref: { id },
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("FirebaseListRepository", () => {
  const repo = new FirebaseListRepository();
  const userId = "user1";

  describe("getLists", () => {
    it("fetches and normalizes lists", async () => {
      mockCollection.mockReturnValue("lists-collection-ref");
      mockGetDocs.mockResolvedValue({
        docs: [toSnapshotDoc("l1", { name: "Work", icon: "💼", color: "#000" })],
      });

      const lists = await repo.getLists(userId);
      expect(lists).toHaveLength(1);
      expect(lists[0].id).toBe("l1");
      expect(lists[0].name).toBe("Work");
      expect(lists[0].icon).toBe("💼");
      expect(mockCollection).toHaveBeenCalledWith(
        { type: "mock-db" }, "customLists", userId, "userLists",
      );
    });

    it("uses defaults for missing fields", async () => {
      mockCollection.mockReturnValue("lists-collection-ref");
      mockGetDocs.mockResolvedValue({ docs: [toSnapshotDoc("l1", { name: "Empty" })] });

      const lists = await repo.getLists(userId);
      expect(lists[0].icon).toBe("📋");
      expect(lists[0].color).toBe("#0078d4");
    });

    it("returns empty array on no docs", async () => {
      mockCollection.mockReturnValue("lists-collection-ref");
      mockGetDocs.mockResolvedValue({ docs: [] });
      const lists = await repo.getLists(userId);
      expect(lists).toEqual([]);
    });
  });

  describe("saveLists", () => {
    it("deletes all existing and writes new lists", async () => {
      mockCollection.mockReturnValue("lists-collection-ref");
      mockGetDocs.mockResolvedValue({
        docs: [toSnapshotDoc("old1", {}), toSnapshotDoc("old2", {})],
      });
      mockDoc
        .mockReturnValueOnce("doc-new1")
        .mockReturnValueOnce("doc-new2");
      mockWriteBatch.mockReturnValue(mockBatch);
      mockBatchCommit.mockResolvedValue(undefined);

      const lists = [
        { id: "l1", name: "A", icon: "📋", color: "#000" },
        { id: "l2", name: "B", icon: "📋", color: "#000" },
      ];
      await repo.saveLists(userId, lists);

      expect(mockBatchDelete).toHaveBeenCalledTimes(2);
      expect(mockBatchSet).toHaveBeenCalledTimes(2);
      expect(mockBatchCommit).toHaveBeenCalled();
    });
  });

  describe("updateList", () => {
    it("updates a single document", async () => {
      mockDoc.mockReturnValue("list-doc-ref");
      mockUpdateDoc.mockResolvedValue(undefined);

      await repo.updateList(userId, "l1", { name: "Updated" });
      expect(mockDoc).toHaveBeenCalledWith(
        { type: "mock-db" }, "customLists", userId, "userLists", "l1",
      );
      expect(mockUpdateDoc).toHaveBeenCalledWith("list-doc-ref", { name: "Updated" });
    });
  });

  describe("migrateFromLocal", () => {
    it("writes all lists without cleanup", async () => {
      mockCollection.mockReturnValue("lists-collection-ref");
      mockDoc.mockReturnValue("doc-ref");
      mockWriteBatch.mockReturnValue(mockBatch);
      mockBatchCommit.mockResolvedValue(undefined);

      const lists = [
        { id: "l1", name: "A", icon: "📋", color: "#000" },
      ];
      await repo.migrateFromLocal(userId, lists);

      expect(mockBatchSet).toHaveBeenCalledTimes(1);
      expect(mockBatchDelete).not.toHaveBeenCalled();
      expect(mockBatchCommit).toHaveBeenCalled();
    });
  });
});
