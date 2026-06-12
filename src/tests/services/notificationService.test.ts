jest.mock("expo-notifications", () => ({}));

import { hasRepeatExpired } from "../../services/notificationService";
import { Task } from "../../../types";

const mockDate = (iso: string) => {
  jest.useFakeTimers({ now: new Date(iso) });
};

const baseTask: Task = {
  id: "task-1",
  text: "Test task",
  completed: false,
  important: false,
  myDay: false,
};

describe("hasRepeatExpired", () => {
  beforeEach(() => {
    jest.useRealTimers();
  });

  it("returns false when no repeatEndDate is set", () => {
    expect(hasRepeatExpired(baseTask)).toBe(false);
  });

  it("returns false when repeatEndDate is in the future", () => {
    mockDate("2024-03-01T12:00:00");
    const task: Task = { ...baseTask, repeatEndDate: "2024-06-15" };
    expect(hasRepeatExpired(task)).toBe(false);
    jest.useRealTimers();
  });

  it("returns true when repeatEndDate is in the past", () => {
    mockDate("2024-07-01T12:00:00");
    const task: Task = { ...baseTask, repeatEndDate: "2024-06-15" };
    expect(hasRepeatExpired(task)).toBe(true);
    jest.useRealTimers();
  });

  it("returns false when repeatEndDate is today (end of day not yet passed)", () => {
    mockDate("2024-06-15T10:00:00");
    const task: Task = { ...baseTask, repeatEndDate: "2024-06-15" };
    expect(hasRepeatExpired(task)).toBe(false);
    jest.useRealTimers();
  });

  it("returns true when repeatEndDate is yesterday at midnight", () => {
    mockDate("2024-06-16T00:00:00");
    const task: Task = { ...baseTask, repeatEndDate: "2024-06-14" };
    expect(hasRepeatExpired(task)).toBe(true);
    jest.useRealTimers();
  });

  it("handles edge case of same day but slightly before end", () => {
    mockDate("2024-06-15T23:59:58");
    const task: Task = { ...baseTask, repeatEndDate: "2024-06-15" };
    expect(hasRepeatExpired(task)).toBe(false);
    jest.useRealTimers();
  });
});
