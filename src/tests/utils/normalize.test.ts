import { normalizeTask, normalizeCustomList } from "../../utils/normalize";

describe("normalizeTask", () => {
  it("returns a complete Task with all fields provided", () => {
    const input = {
      id: "task-1",
      text: "Buy groceries",
      completed: true,
      important: true,
      myDay: true,
      listId: "list-1",
      order: 3,
      dueDate: "2024-03-15",
      dueTime: "14:30",
      reminder: "2024-03-15T14:30:00",
      note: "Remember milk",
      repeat: "weekly",
      repeatDays: [1, 3, 5],
      repeatOnDay: 15,
      repeatOnLastDay: false,
      repeatEndDate: "2024-06-15",
      createdAt: 1700000000,
    };

    const result = normalizeTask(input);

    expect(result).toEqual({
      id: "task-1",
      text: "Buy groceries",
      completed: true,
      important: true,
      myDay: true,
      listId: "list-1",
      order: 3,
      dueDate: "2024-03-15",
      dueTime: "14:30",
      reminder: "2024-03-15T14:30:00",
      note: "Remember milk",
      repeat: "weekly",
      repeatDays: [1, 3, 5],
      repeatOnDay: 15,
      repeatOnLastDay: false,
      repeatEndDate: "2024-06-15",
      createdAt: 1700000000,
    });
  });

  it("applies defaults for missing fields", () => {
    const result = normalizeTask({ id: "task-2", text: "Test task" });

    expect(result.id).toBe("task-2");
    expect(result.text).toBe("Test task");
    expect(result.completed).toBe(false);
    expect(result.important).toBe(false);
    expect(result.myDay).toBe(false);
    expect(result.listId).toBeUndefined();
    expect(result.order).toBeUndefined();
    expect(result.dueDate).toBeUndefined();
    expect(result.dueTime).toBeUndefined();
    expect(result.reminder).toBeUndefined();
    expect(result.note).toBeUndefined();
    expect(result.repeat).toBeUndefined();
  });

  it("handles null values from Firestore", () => {
    const input = {
      id: "task-3",
      text: "Null test",
      completed: null,
      important: null,
      myDay: null,
    };
    const result = normalizeTask(input as Record<string, unknown>);
    expect(result.completed).toBe(false);
    expect(result.important).toBe(false);
    expect(result.myDay).toBe(false);
  });

  it("handles empty object", () => {
    const result = normalizeTask({});
    expect(result.id).toBe("");
    expect(result.text).toBe("");
    expect(result.completed).toBe(false);
  });

  it("strips unknown fields", () => {
    const input = {
      id: "task-4",
      text: "Known",
      secretField: "should not appear",
    };
    const result = normalizeTask(input);
    expect(result).not.toHaveProperty("secretField");
    expect(result.text).toBe("Known");
  });
});

describe("normalizeCustomList", () => {
  it("returns a complete CustomList with all fields", () => {
    const input = {
      id: "list-1",
      name: "Work Tasks",
      icon: "💼",
      color: "#ff0000",
      createdAt: 1700000000,
    };
    const result = normalizeCustomList(input);
    expect(result).toEqual({
      id: "list-1",
      name: "Work Tasks",
      icon: "💼",
      color: "#ff0000",
      createdAt: 1700000000,
    });
  });

  it("applies defaults for missing fields", () => {
    const result = normalizeCustomList({ id: "list-2", name: "Personal" });

    expect(result.id).toBe("list-2");
    expect(result.name).toBe("Personal");
    expect(result.icon).toBe("📋");
    expect(result.color).toBe("#0078d4");
    expect(result.createdAt).toBeUndefined();
  });

  it("handles empty object", () => {
    const result = normalizeCustomList({});
    expect(result.id).toBe("");
    expect(result.name).toBe("");
    expect(result.icon).toBe("📋");
    expect(result.color).toBe("#0078d4");
  });

  it("handles null values", () => {
    const input = { id: "list-3", name: null, icon: null, color: null };
    const result = normalizeCustomList(input as Record<string, unknown>);
    expect(result.name).toBe("");
    expect(result.icon).toBe("📋");
    expect(result.color).toBe("#0078d4");
  });
});
