const mockCollection = jest.fn();
const mockDoc = jest.fn();
const mockGetDocs = jest.fn();
const mockDeleteDoc = jest.fn();
const mockWriteBatch = jest.fn();
const mockUpdateDoc = jest.fn();
const mockDeleteField = jest.fn((...args: any[]) => "__DELETE__");

const mockBatchSet = jest.fn();
const mockBatchDelete = jest.fn();
const mockBatchCommit = jest.fn();
const mockBatch = { set: mockBatchSet, delete: mockBatchDelete, commit: mockBatchCommit };

jest.mock("firebase/firestore", () => ({
  collection: (...args: any[]) => mockCollection(args[0], args[1], args[2], args[3]),
  doc: (...args: any[]) => mockDoc(args[0], args[1], args[2], args[3], args[4]),
  getDocs: (...args: any[]) => mockGetDocs(args[0]),
  deleteDoc: (...args: any[]) => mockDeleteDoc(args[0]),
  writeBatch: (...args: any[]) => mockWriteBatch(args[0]),
  updateDoc: (...args: any[]) => mockUpdateDoc(args[0], args[1]),
  deleteField: (...args: any[]) => mockDeleteField(...args),
}));

jest.mock("../../firebase/config", () => ({
  db: { type: "mock-db" },
}));

import { FirebaseTaskRepository } from "../../repositories/firebase/FirebaseTaskRepository";

const toSnapshotDoc = (id: string, data: Record<string, unknown>) => ({
  id,
  data: () => data,
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("FirebaseTaskRepository", () => {
  const repo = new FirebaseTaskRepository();
  const userId = "user1";

  describe("getTasks", () => {
    it("fetches and normalizes tasks", async () => {
      mockCollection.mockReturnValue("tasks-collection-ref");
      mockGetDocs.mockResolvedValue({
        docs: [
          toSnapshotDoc("t1", { text: "Task 1", completed: true, important: false, myDay: false }),
          toSnapshotDoc("t2", { text: "Task 2", completed: false, important: true, myDay: true }),
        ],
      });

      const tasks = await repo.getTasks(userId);
      expect(tasks).toHaveLength(2);
      expect(tasks[0].id).toBe("t1");
      expect(tasks[0].text).toBe("Task 1");
      expect(tasks[0].completed).toBe(true);
      expect(tasks[1].id).toBe("t2");
      expect(mockCollection).toHaveBeenCalledWith({ type: "mock-db" }, "tasks", userId, "userTasks");
    });

    it("returns empty array on no docs", async () => {
      mockCollection.mockReturnValue("tasks-collection-ref");
      mockGetDocs.mockResolvedValue({ docs: [] });
      const tasks = await repo.getTasks(userId);
      expect(tasks).toEqual([]);
    });
  });

  describe("saveTasks", () => {
    it("writes a batch with set and delete", async () => {
      mockCollection.mockReturnValue("tasks-collection-ref");
      mockGetDocs.mockResolvedValue({
        docs: [toSnapshotDoc("existing1", {}), toSnapshotDoc("existing2", {})],
      });
      mockDoc
        .mockReturnValueOnce("doc-new")
        .mockReturnValueOnce("doc-existing2")
        .mockReturnValueOnce("doc-existing1");
      mockWriteBatch.mockReturnValue(mockBatch);
      mockBatchCommit.mockResolvedValue(undefined);

      const tasks = [
        { id: "new", text: "New", completed: false, important: false, myDay: false },
      ];
      await repo.saveTasks(userId, tasks);

      expect(mockBatchSet).toHaveBeenCalledWith("doc-new", expect.objectContaining({ text: "New" }));
      expect(mockBatchDelete).toHaveBeenCalledWith("doc-existing1");
      expect(mockBatchDelete).toHaveBeenCalledWith("doc-existing2");
      expect(mockBatchCommit).toHaveBeenCalled();
    });

    it("keeps all existing when all match", async () => {
      mockCollection.mockReturnValue("tasks-collection-ref");
      mockGetDocs.mockResolvedValue({ docs: [toSnapshotDoc("t1", {})] });
      mockDoc.mockReturnValue("doc-t1");
      mockWriteBatch.mockReturnValue(mockBatch);
      mockBatchCommit.mockResolvedValue(undefined);

      const tasks = [
        { id: "t1", text: "Keep", completed: false, important: false, myDay: false },
      ];
      await repo.saveTasks(userId, tasks);
      expect(mockBatchDelete).not.toHaveBeenCalled();
      expect(mockBatchSet).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateTask", () => {
    it("updates a single document", async () => {
      mockDoc.mockReturnValue("task-doc-ref");
      mockUpdateDoc.mockResolvedValue(undefined);

      await repo.updateTask(userId, "t1", { text: "Updated" });
      expect(mockDoc).toHaveBeenCalledWith(
        { type: "mock-db" }, "tasks", userId, "userTasks", "t1",
      );
      expect(mockUpdateDoc).toHaveBeenCalledWith("task-doc-ref", { text: "Updated" });
    });

    it("strips undefined fields with deleteField", async () => {
      mockDoc.mockReturnValue("task-doc-ref");
      mockUpdateDoc.mockResolvedValue(undefined);

      await repo.updateTask(userId, "t1", { text: "Updated", dueDate: undefined });
      expect(mockUpdateDoc).toHaveBeenCalledWith("task-doc-ref", {
        text: "Updated",
        dueDate: "__DELETE__",
      });
    });
  });

  describe("deleteTask", () => {
    it("deletes a single document", async () => {
      mockDoc.mockReturnValue("task-doc-ref");
      mockDeleteDoc.mockResolvedValue(undefined);

      await repo.deleteTask(userId, "t1");
      expect(mockDoc).toHaveBeenCalledWith(
        { type: "mock-db" }, "tasks", userId, "userTasks", "t1",
      );
      expect(mockDeleteDoc).toHaveBeenCalledWith("task-doc-ref");
    });
  });

  describe("migrateFromLocal", () => {
    it("writes all tasks without cleaning up existing", async () => {
      mockCollection.mockReturnValue("tasks-collection-ref");
      mockDoc.mockReturnValue("doc-ref");
      mockWriteBatch.mockReturnValue(mockBatch);
      mockBatchCommit.mockResolvedValue(undefined);

      const tasks = [
        { id: "t1", text: "A", completed: false, important: false, myDay: false },
        { id: "t2", text: "B", completed: false, important: false, myDay: false },
      ];
      await repo.migrateFromLocal(userId, tasks);

      expect(mockBatchSet).toHaveBeenCalledTimes(2);
      expect(mockBatchDelete).not.toHaveBeenCalled();
      expect(mockBatchCommit).toHaveBeenCalled();
    });
  });
});
