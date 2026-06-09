const mockGetTasks = jest.fn().mockResolvedValue([]);
const mockSaveTasks = jest.fn().mockResolvedValue(undefined);
const mockUpdateTask = jest.fn().mockResolvedValue(undefined);
const mockDeleteTask = jest.fn().mockResolvedValue(undefined);

jest.mock("../../repositories/provider", () => ({
  getRepositories: jest.fn(() => ({
    taskRepo: {
      getTasks: mockGetTasks,
      saveTasks: mockSaveTasks,
      updateTask: mockUpdateTask,
      deleteTask: mockDeleteTask,
      migrateFromLocal: jest.fn(),
    },
  })),
}));

let mockCurrentUser: { uid: string } | null = { uid: "test-user" };
jest.mock("../../firebase/config", () => ({
  auth: {
    get currentUser() {
      return mockCurrentUser;
    },
  },
}));

jest.mock("@/src/i18n", () => ({
  t: (key: string) => key,
  default: { t: (key: string) => key },
}));

const mockAlert = jest.fn();
jest.mock("react-native", () => ({
  Alert: { alert: mockAlert },
  Platform: { OS: "ios" },
}));

import { useTaskStore } from "../../store/taskStore";

beforeEach(() => {
  useTaskStore.setState({ tasks: [], loading: true, refreshing: false, selectedTaskId: null });
  mockGetTasks.mockReset().mockResolvedValue([]);
  mockSaveTasks.mockReset().mockResolvedValue(undefined);
  mockUpdateTask.mockReset().mockResolvedValue(undefined);
  mockDeleteTask.mockReset().mockResolvedValue(undefined);
  mockAlert.mockClear();
  mockCurrentUser = { uid: "test-user" };
});

describe("taskStore", () => {
  describe("fetchTasks", () => {
    it("loads tasks from repo on fetch", async () => {
      mockGetTasks.mockResolvedValue([
        { id: "1", text: "Test", completed: false, important: false, myDay: false },
      ]);
      await useTaskStore.getState().fetchTasks();
      const state = useTaskStore.getState();
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0].text).toBe("Test");
      expect(state.loading).toBe(false);
    });

    it("sets empty array when repo returns empty", async () => {
      mockGetTasks.mockResolvedValue([]);
      await useTaskStore.getState().fetchTasks();
      expect(useTaskStore.getState().tasks).toEqual([]);
    });

    it("sets empty array when user is null", async () => {
      mockCurrentUser = null;
      await useTaskStore.getState().fetchTasks();
      expect(useTaskStore.getState().tasks).toEqual([]);
      expect(useTaskStore.getState().loading).toBe(false);
    });

    it("handles fetch errors gracefully", async () => {
      mockGetTasks.mockRejectedValue(new Error("network error"));
      await useTaskStore.getState().fetchTasks();
      expect(useTaskStore.getState().tasks).toEqual([]);
      expect(useTaskStore.getState().loading).toBe(false);
    });
  });

  describe("addTask", () => {
    it("adds a new task to the top", () => {
      useTaskStore.setState({ tasks: [] });
      useTaskStore.getState().addTask("New task");
      const state = useTaskStore.getState();
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0].text).toBe("New task");
      expect(state.tasks[0].completed).toBe(false);
    });

    it("trims whitespace in task text", () => {
      useTaskStore.getState().addTask("  Spaced  ");
      expect(useTaskStore.getState().tasks[0].text).toBe("Spaced");
    });

    it("sets myDay when listName is My Day", () => {
      useTaskStore.getState().addTask("Today", "My Day");
      expect(useTaskStore.getState().tasks[0].myDay).toBe(true);
    });
  });

  describe("toggleTask", () => {
    it("toggles a task from pending to completed", () => {
      useTaskStore.setState({
        tasks: [{ id: "1", text: "Test", completed: false, important: false, myDay: false, order: 0 }],
      });
      useTaskStore.getState().toggleTask("1");
      expect(useTaskStore.getState().tasks[0].completed).toBe(true);
      expect(mockUpdateTask).toHaveBeenCalled();
    });

    it("toggles a task from completed to pending", () => {
      useTaskStore.setState({
        tasks: [{ id: "1", text: "Test", completed: true, important: false, myDay: false, order: 0 }],
      });
      useTaskStore.getState().toggleTask("1");
      expect(useTaskStore.getState().tasks[0].completed).toBe(false);
    });

    it("does nothing for unknown task id", () => {
      useTaskStore.setState({
        tasks: [{ id: "1", text: "Test", completed: false, important: false, myDay: false }],
      });
      useTaskStore.getState().toggleTask("nonexistent");
      expect(useTaskStore.getState().tasks).toHaveLength(1);
      expect(useTaskStore.getState().tasks[0].completed).toBe(false);
    });
  });

  describe("toggleImportant", () => {
    it("toggles important flag", () => {
      useTaskStore.setState({
        tasks: [{ id: "1", text: "Test", completed: false, important: false, myDay: false }],
      });
      useTaskStore.getState().toggleImportant("1");
      expect(useTaskStore.getState().tasks[0].important).toBe(true);
    });

    it("toggles important off", () => {
      useTaskStore.setState({
        tasks: [{ id: "1", text: "Test", completed: false, important: true, myDay: false }],
      });
      useTaskStore.getState().toggleImportant("1");
      expect(useTaskStore.getState().tasks[0].important).toBe(false);
    });
  });

  describe("deleteTask", () => {
    it("removes the task from state", () => {
      useTaskStore.setState({
        tasks: [{ id: "1", text: "Test", completed: false, important: false, myDay: false }],
      });
      useTaskStore.getState().deleteTask("1");
      expect(useTaskStore.getState().tasks).toHaveLength(0);
    });

    it("calls deleteTask on repo", () => {
      mockDeleteTask.mockResolvedValue(undefined);
      useTaskStore.setState({
        tasks: [{ id: "1", text: "Test", completed: false, important: false, myDay: false }],
      });
      useTaskStore.getState().deleteTask("1");
      expect(mockDeleteTask).toHaveBeenCalledWith("test-user", "1");
    });
  });

  describe("updateTask", () => {
    it("updates task fields", () => {
      useTaskStore.setState({
        tasks: [{ id: "1", text: "Old", completed: false, important: false, myDay: false }],
      });
      useTaskStore.getState().updateTask("1", { text: "Updated" });
      expect(useTaskStore.getState().tasks[0].text).toBe("Updated");
    });

    it("calls updateTask on repo", () => {
      mockUpdateTask.mockResolvedValue(undefined);
      useTaskStore.setState({
        tasks: [{ id: "1", text: "Old", completed: false, important: false, myDay: false }],
      });
      useTaskStore.getState().updateTask("1", { text: "Updated" });
      expect(mockUpdateTask).toHaveBeenCalledWith("test-user", "1", { text: "Updated" });
    });
  });

  describe("getCounts", () => {
    it("returns correct counts", () => {
      useTaskStore.setState({
        tasks: [
          { id: "1", text: "a", completed: false, important: true, myDay: false, dueDate: undefined },
          { id: "2", text: "b", completed: false, important: false, myDay: true, dueDate: undefined },
          { id: "3", text: "c", completed: false, important: false, myDay: false, dueDate: "2024-07-01" },
          { id: "4", text: "d", completed: true, important: false, myDay: false, dueDate: undefined },
          { id: "5", text: "e", completed: false, important: false, myDay: false, dueDate: undefined },
        ],
      });
      const counts = useTaskStore.getState().getCounts();
      expect(counts.myDay).toBe(1);
      expect(counts.important).toBe(1);
      expect(counts.completed).toBe(1);
      expect(counts.planned).toBe(1);
      expect(counts.all).toBe(5);
    });
  });

  describe("setSelectedTaskId", () => {
    it("sets selected id", () => {
      useTaskStore.getState().setSelectedTaskId("abc");
      expect(useTaskStore.getState().selectedTaskId).toBe("abc");
    });

    it("clears selected id with null", () => {
      useTaskStore.setState({ selectedTaskId: "abc" });
      useTaskStore.getState().setSelectedTaskId(null);
      expect(useTaskStore.getState().selectedTaskId).toBeNull();
    });
  });
});
