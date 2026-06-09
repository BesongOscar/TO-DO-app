import { createTask, isOverdue } from "../../domain/Task";

describe("createTask", () => {
  beforeAll(() => {
    jest.useFakeTimers({ now: new Date("2024-06-15T12:00:00") });
  });
  afterAll(() => jest.useRealTimers());

  it("creates a task with the given text", () => {
    const task = createTask("Buy groceries");
    expect(task.text).toBe("Buy groceries");
    expect(task.completed).toBe(false);
    expect(task.important).toBe(false);
    expect(task.myDay).toBe(false);
    expect(task.id).toBeTruthy();
    expect(task.createdAt).toBeGreaterThan(0);
  });

  it("trims whitespace from text", () => {
    const task = createTask("  Hello  ");
    expect(task.text).toBe("Hello");
  });

  it("applies overrides", () => {
    const task = createTask("Test", { important: true, myDay: true });
    expect(task.important).toBe(true);
    expect(task.myDay).toBe(true);
  });

  it("generates unique IDs", () => {
    const a = createTask("a");
    const b = createTask("b");
    expect(a.id).not.toBe(b.id);
  });
});

describe("isOverdue", () => {
  const setFakeDate = (iso: string) => {
    jest.useFakeTimers({ now: new Date(iso) });
  };

  beforeEach(() => jest.useRealTimers());

  it("returns true when due date is yesterday", () => {
    setFakeDate("2024-06-15T12:00:00");
    expect(isOverdue({ id: "1", text: "", completed: false, important: false, myDay: false, dueDate: "2024-06-14" })).toBe(true);
    jest.useRealTimers();
  });

  it("returns false when due date is today", () => {
    setFakeDate("2024-06-15T12:00:00");
    expect(isOverdue({ id: "1", text: "", completed: false, important: false, myDay: false, dueDate: "2024-06-15" })).toBe(false);
    jest.useRealTimers();
  });

  it("returns false when due date is tomorrow", () => {
    setFakeDate("2024-06-15T12:00:00");
    expect(isOverdue({ id: "1", text: "", completed: false, important: false, myDay: false, dueDate: "2024-06-16" })).toBe(false);
    jest.useRealTimers();
  });

  it("returns false when task is completed even if overdue", () => {
    setFakeDate("2024-06-15T12:00:00");
    expect(isOverdue({ id: "1", text: "", completed: true, important: false, myDay: false, dueDate: "2024-06-14" })).toBe(false);
    jest.useRealTimers();
  });

  it("returns false when no due date", () => {
    expect(isOverdue({ id: "1", text: "", completed: false, important: false, myDay: false })).toBe(false);
  });
});
