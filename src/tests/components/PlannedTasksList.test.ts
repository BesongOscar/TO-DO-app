import { getDateCategory, groupTasksByDate } from "../../../features/tasks/components/PlannedTasksList";
import { Task } from "../../../types";

jest.mock("@/src/i18n", () => ({
  t: (key: string) => {
    const labels: Record<string, string> = {
      "date.overdue": "Overdue",
      "date.today": "Today",
      "date.tomorrow": "Tomorrow",
      "date.this_week": "This Week",
      "date.next_week": "Next Week",
      "date.later": "Later",
      "date.completed": "Completed",
    };
    return labels[key] ?? key;
  },
  initI18n: jest.fn(),
  changeLanguage: jest.fn(),
  SUPPORTED_LANGUAGES: ["en", "fr"],
  LANGUAGE_KEY: "appLanguage",
  default: { t: () => "" },
}));

jest.mock("../../../context/ThemeContext", () => ({
  useTheme: () => ({
    theme: { primary: "#0078d4", background: "#fff", text: "#000" },
  }),
}));

jest.mock("../../../src/hooks/useThemeStyles", () => ({
  useThemeStyles: () => ({}),
}));

jest.mock("../../../styles/components/PlannedTasksList", () => ({
  createPlannedTasksListStyles: () => ({}),
}));

jest.mock("../../../features/tasks/components/TaskItem", () => () => null);

const setFakeDate = (iso: string) => {
  jest.useFakeTimers({ now: new Date(iso) });
};

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: "t1",
  text: "Test",
  completed: false,
  important: false,
  myDay: false,
  ...overrides,
});

describe("getDateCategory", () => {
  beforeEach(() => {
    jest.useRealTimers();
  });

  it('returns "Overdue" with isOverdue true for past dates', () => {
    setFakeDate("2024-06-15T12:00:00");
    const result = getDateCategory("2024-06-14");
    expect(result.category).toBe("Overdue");
    expect(result.isOverdue).toBe(true);
    jest.useRealTimers();
  });

  it('returns "Today" for current date', () => {
    setFakeDate("2024-06-15T12:00:00");
    const result = getDateCategory("2024-06-15");
    expect(result.category).toBe("Today");
    expect(result.isOverdue).toBe(false);
    jest.useRealTimers();
  });

  it('returns "Tomorrow" for next day', () => {
    setFakeDate("2024-06-15T12:00:00");
    const result = getDateCategory("2024-06-16");
    expect(result.category).toBe("Tomorrow");
    expect(result.isOverdue).toBe(false);
    jest.useRealTimers();
  });

  it('returns "This Week" for dates within 7 days', () => {
    setFakeDate("2024-06-15T12:00:00");
    const result = getDateCategory("2024-06-18");
    expect(result.category).toBe("This Week");
    expect(result.isOverdue).toBe(false);
    jest.useRealTimers();
  });

  it('returns "Next Week" for dates 8-14 days away', () => {
    setFakeDate("2024-06-15T12:00:00");
    const result = getDateCategory("2024-06-25");
    expect(result.category).toBe("Next Week");
    expect(result.isOverdue).toBe(false);
    jest.useRealTimers();
  });

  it('returns "Later" for dates more than 14 days away', () => {
    setFakeDate("2024-06-15T12:00:00");
    const result = getDateCategory("2024-07-15");
    expect(result.category).toBe("Later");
    expect(result.isOverdue).toBe(false);
    jest.useRealTimers();
  });
});

describe("groupTasksByDate", () => {
  beforeEach(() => {
    jest.useRealTimers();
  });

  it("groups tasks by date category with overdue first", () => {
    setFakeDate("2024-06-15T12:00:00");

    const tasks: Task[] = [
      makeTask({ id: "1", text: "Overdue task", dueDate: "2024-06-10" }),
      makeTask({ id: "2", text: "Today task", dueDate: "2024-06-15" }),
      makeTask({ id: "3", text: "Tomorrow task", dueDate: "2024-06-16" }),
    ];

    const groups = groupTasksByDate(tasks);
    expect(groups).toHaveLength(3);
    expect(groups[0].title).toBe("Overdue");
    expect(groups[0].isOverdue).toBe(true);
    expect(groups[0].tasks).toHaveLength(1);
    expect(groups[0].tasks[0].id).toBe("1");
    expect(groups[1].title).toBe("Today");
    expect(groups[2].title).toBe("Tomorrow");
    jest.useRealTimers();
  });

  it("places completed tasks in a separate group at the end", () => {
    setFakeDate("2024-06-15T12:00:00");

    const tasks: Task[] = [
      makeTask({ id: "1", text: "Pending today", dueDate: "2024-06-15" }),
      makeTask({ id: "2", text: "Completed overdue", dueDate: "2024-06-10", completed: true }),
      makeTask({ id: "3", text: "Completed today", dueDate: "2024-06-15", completed: true }),
    ];

    const groups = groupTasksByDate(tasks);
    const lastGroup = groups[groups.length - 1];
    expect(lastGroup.title).toBe("Completed");
    expect(lastGroup.tasks.map((t) => t.id)).toEqual(["2", "3"]);
    jest.useRealTimers();
  });

  it("skips tasks without a dueDate", () => {
    setFakeDate("2024-06-15T12:00:00");

    const tasks: Task[] = [
      makeTask({ id: "1", text: "With due date", dueDate: "2024-06-15" }),
      makeTask({ id: "2", text: "No due date" }),
    ];

    const groups = groupTasksByDate(tasks);
    const allTaskIds = groups.flatMap((g) => g.tasks.map((t) => t.id));
    expect(allTaskIds).toEqual(["1"]);
    jest.useRealTimers();
  });

  it("returns empty array for empty input", () => {
    setFakeDate("2024-06-15T12:00:00");
    const groups = groupTasksByDate([]);
    expect(groups).toEqual([]);
    jest.useRealTimers();
  });

  it("returns only Completed group when all tasks are completed", () => {
    setFakeDate("2024-06-15T12:00:00");

    const tasks: Task[] = [
      makeTask({ id: "1", dueDate: "2024-06-10", completed: true }),
      makeTask({ id: "2", dueDate: "2024-06-15", completed: true }),
    ];

    const groups = groupTasksByDate(tasks);
    expect(groups).toHaveLength(1);
    expect(groups[0].title).toBe("Completed");
    jest.useRealTimers();
  });
});
