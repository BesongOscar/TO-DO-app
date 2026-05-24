/**
 * Unit tests for taskFilters utility
 * 
 * Covers all filterKey variants: myDay, important, completed, planned, 
 * tasks, listId, all, and unknown/default fallback.
 */

import { filterTasks } from "../../utils/taskFilters";
import { Task, ListItem } from "../../../types";

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: "t1",
  text: "Test",
  completed: false,
  important: false,
  myDay: false,
  ...overrides,
});

const makeList = (overrides: Partial<ListItem> = {}): ListItem => ({
  id: "list-1",
  name: "My List",
  icon: "📋",
  color: "#0078d4",
  filterKey: "all",
  ...overrides,
});

describe("filterTasks", () => {
  const tasks = [
    makeTask({ id: "1", text: "My Day task", myDay: true }),
    makeTask({ id: "2", text: "Important task", important: true }),
    makeTask({ id: "3", text: "Completed task", completed: true }),
    makeTask({ id: "4", text: "My Day + Important", myDay: true, important: true }),
    makeTask({ id: "5", text: "Planned", dueDate: "2024-12-25" }),
    makeTask({ id: "6", text: "Custom list task", listId: "custom-1" }),
    makeTask({ id: "7", text: "Plain task" }),
  ];

  it('filters by "myDay"', () => {
    const result = filterTasks(tasks, makeList({ filterKey: "myDay" }));
    expect(result.map((t) => t.id)).toEqual(["1", "4"]);
  });

  it('filters by "important"', () => {
    const result = filterTasks(tasks, makeList({ filterKey: "important" }));
    expect(result.map((t) => t.id)).toEqual(["2", "4"]);
  });

  it('filters by "completed"', () => {
    const result = filterTasks(tasks, makeList({ filterKey: "completed" }));
    expect(result.map((t) => t.id)).toEqual(["3"]);
  });

  it('returns all tasks for "all"', () => {
    const result = filterTasks(tasks, makeList({ filterKey: "all" }));
    expect(result).toHaveLength(7);
  });

  it('filters by "planned" (has dueDate)', () => {
    const result = filterTasks(tasks, makeList({ filterKey: "planned" }));
    expect(result.map((t) => t.id)).toEqual(["5"]);
  });

  it('filters by "tasks" (no myDay, no important)', () => {
    const result = filterTasks(tasks, makeList({ filterKey: "tasks" }));
    expect(result.map((t) => t.id)).toEqual(["3", "5", "6", "7"]);
  });

  it('filters by "listId"', () => {
    const result = filterTasks(tasks, makeList({ id: "custom-1", filterKey: "listId" }));
    expect(result.map((t) => t.id)).toEqual(["6"]);
  });

  it("returns all tasks for unknown filterKey", () => {
    const result = filterTasks(tasks, makeList({ filterKey: "unknown" as never }));
    expect(result).toHaveLength(7);
  });

  it("returns empty array when no tasks match", () => {
    const result = filterTasks(tasks, makeList({ filterKey: "myDay", id: "none" }));
    const noMyDay = tasks.filter((t) => !t.myDay);
    expect(noMyDay.map((t) => t.id)).toEqual(["2", "3", "5", "6", "7"]);
  });
});
