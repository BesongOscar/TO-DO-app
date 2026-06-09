import { TaskService } from "../../services/TaskService";

const mockGetTasks = jest.fn();
const mockSaveTasks = jest.fn();
const mockUpdateTask = jest.fn();
const mockDeleteTask = jest.fn();
const mockMigrateFromLocal = jest.fn();

const mockTaskRepo = {
  getTasks: mockGetTasks,
  saveTasks: mockSaveTasks,
  updateTask: mockUpdateTask,
  deleteTask: mockDeleteTask,
  migrateFromLocal: mockMigrateFromLocal,
};

let service: TaskService;

beforeEach(() => {
  jest.clearAllMocks();
  service = new TaskService(mockTaskRepo);
});

describe("TaskService", () => {
  describe("fetchTasks", () => {
    it("returns tasks from repository", async () => {
      const tasks = [{ id: "1", text: "Test", completed: false, important: false, myDay: false }];
      mockGetTasks.mockResolvedValue(tasks);
      const result = await service.fetchTasks("user1");
      expect(result).toEqual(tasks);
      expect(mockGetTasks).toHaveBeenCalledWith("user1");
    });
  });

  describe("addTask", () => {
    it("creates a task and saves it", async () => {
      mockSaveTasks.mockResolvedValue(undefined);
      const task = await service.addTask("user1", "New task");
      expect(task.text).toBe("New task");
      expect(task.completed).toBe(false);
      expect(mockSaveTasks).toHaveBeenCalledWith("user1", [task]);
    });

    it("saves with existing tasks when provided", async () => {
      mockSaveTasks.mockResolvedValue(undefined);
      const existing = [{ id: "1", text: "Old", completed: false, important: false, myDay: false }];
      const task = await service.addTask("user1", "New", "My Day", undefined, existing);
      expect(mockSaveTasks).toHaveBeenCalledTimes(1);
      const args = mockSaveTasks.mock.calls[0];
      expect(args[0]).toBe("user1");
      expect(args[1]).toHaveLength(2);
      expect(args[1][0].text).toBe("New");
      expect(args[1][0].myDay).toBe(true);
      expect(args[1][1].text).toBe("Old");
    });
  });

  describe("toggleTask", () => {
    it("marks a pending task as completed", async () => {
      mockUpdateTask.mockResolvedValue(undefined);
      const task = { id: "1", text: "Test", completed: false, order: 0, important: false, myDay: false };
      await service.toggleTask("user1", task, [task]);
      expect(mockUpdateTask).toHaveBeenCalledWith("user1", "1", {
        completed: true,
        order: undefined,
      });
    });

    it("marks a completed task as pending with new order", async () => {
      mockUpdateTask.mockResolvedValue(undefined);
      const task = { id: "1", text: "Test", completed: true, order: 0, important: false, myDay: false };
      const pendingTask = { id: "2", text: "Other", completed: false, order: 5, important: false, myDay: false };
      await service.toggleTask("user1", task, [task, pendingTask]);
      expect(mockUpdateTask).toHaveBeenCalledWith("user1", "1", {
        completed: false,
        order: 6,
      });
    });
  });

  describe("toggleImportant", () => {
    it("toggles important flag", async () => {
      mockGetTasks.mockResolvedValue([{ id: "1", text: "Test", completed: false, important: false, myDay: false }]);
      mockUpdateTask.mockResolvedValue(undefined);
      await service.toggleImportant("user1", "1");
      expect(mockUpdateTask).toHaveBeenCalledWith("user1", "1", { important: true });
    });
  });

  describe("deleteTask", () => {
    it("deletes a task", async () => {
      mockDeleteTask.mockResolvedValue(undefined);
      await service.deleteTask("user1", "1");
      expect(mockDeleteTask).toHaveBeenCalledWith("user1", "1");
    });
  });

  describe("updateTask", () => {
    it("updates task fields", async () => {
      mockUpdateTask.mockResolvedValue(undefined);
      await service.updateTask("user1", "1", { text: "Updated" });
      expect(mockUpdateTask).toHaveBeenCalledWith("user1", "1", { text: "Updated" });
    });
  });

  describe("reorderTasks", () => {
    it("reorders and saves", async () => {
      mockSaveTasks.mockResolvedValue(undefined);
      const tasks = [
        { id: "1", text: "A", order: 5, completed: false, important: false, myDay: false },
        { id: "2", text: "B", order: 3, completed: false, important: false, myDay: false },
      ];
      const result = await service.reorderTasks("user1", tasks);
      expect(result[0].order).toBe(0);
      expect(result[1].order).toBe(1);
      expect(mockSaveTasks).toHaveBeenCalledWith("user1", result);
    });
  });

  describe("computeCounts", () => {
    it("returns correct counts", () => {
      const tasks = [
        { id: "1", text: "a", completed: false, important: true, myDay: false, dueDate: undefined },
        { id: "2", text: "b", completed: false, important: false, myDay: true, dueDate: undefined },
        { id: "3", text: "c", completed: false, important: false, myDay: false, dueDate: "2024-07-01" },
        { id: "4", text: "d", completed: true, important: false, myDay: false, dueDate: undefined },
        { id: "5", text: "e", completed: false, important: false, myDay: false, dueDate: undefined },
      ];
      const counts = service.computeCounts(tasks);
      expect(counts.myDay).toBe(1);
      expect(counts.important).toBe(1);
      expect(counts.completed).toBe(1);
      expect(counts.planned).toBe(1);
      expect(counts.all).toBe(5);
    });
  });

  describe("isTaskOverdue", () => {
    it("returns true for overdue task", () => {
      jest.useFakeTimers({ now: new Date("2024-06-15T12:00:00") });
      const task = { id: "1", text: "", completed: false, important: false, myDay: false, dueDate: "2024-06-14" };
      expect(service.isTaskOverdue(task)).toBe(true);
      jest.useRealTimers();
    });

    it("returns false for non-overdue task", () => {
      jest.useFakeTimers({ now: new Date("2024-06-15T12:00:00") });
      const task = { id: "1", text: "", completed: false, important: false, myDay: false, dueDate: "2024-06-16" };
      expect(service.isTaskOverdue(task)).toBe(false);
      jest.useRealTimers();
    });
  });

  describe("migrateFromLocal", () => {
    it("calls repo migrate", async () => {
      mockMigrateFromLocal.mockResolvedValue(undefined);
      const tasks = [{ id: "1", text: "Migrated", completed: false, important: false, myDay: false }];
      await service.migrateFromLocal("user1", tasks);
      expect(mockMigrateFromLocal).toHaveBeenCalledWith("user1", tasks);
    });
  });
});
