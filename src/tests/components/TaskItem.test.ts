import { isOverdue, formatDueDate } from "../../utils/taskItemHelpers";

const setFakeDate = (iso: string) => {
  jest.useFakeTimers({ now: new Date(iso) });
};

describe("isOverdue", () => {
  beforeEach(() => {
    jest.useRealTimers();
  });

  it("returns true when due date is yesterday", () => {
    setFakeDate("2024-06-15T12:00:00");
    expect(isOverdue("2024-06-14")).toBe(true);
    jest.useRealTimers();
  });

  it("returns false when due date is today", () => {
    setFakeDate("2024-06-15T12:00:00");
    expect(isOverdue("2024-06-15")).toBe(false);
    jest.useRealTimers();
  });

  it("returns false when due date is tomorrow", () => {
    setFakeDate("2024-06-15T12:00:00");
    expect(isOverdue("2024-06-16")).toBe(false);
    jest.useRealTimers();
  });

  it("returns true when due date is last week", () => {
    setFakeDate("2024-06-15T12:00:00");
    expect(isOverdue("2024-06-08")).toBe(true);
    jest.useRealTimers();
  });

  it("returns false when due date is next month", () => {
    setFakeDate("2024-06-15T12:00:00");
    expect(isOverdue("2024-07-15")).toBe(false);
    jest.useRealTimers();
  });

  it("handles same date at different times", () => {
    setFakeDate("2024-06-15T23:59:59");
    expect(isOverdue("2024-06-15")).toBe(false);
    jest.useRealTimers();
  });
});

describe("formatDueDate", () => {
  beforeEach(() => {
    jest.useRealTimers();
  });

  it('returns "Today" for today\'s date', () => {
    setFakeDate("2024-06-15T12:00:00");
    expect(formatDueDate("2024-06-15")).toBe("Today");
    jest.useRealTimers();
  });

  it('returns "Tomorrow" for tomorrow\'s date', () => {
    setFakeDate("2024-06-15T12:00:00");
    expect(formatDueDate("2024-06-16")).toBe("Tomorrow");
    jest.useRealTimers();
  });

  it("returns short date for other dates", () => {
    setFakeDate("2024-06-15T12:00:00");
    expect(formatDueDate("2024-07-04")).toBe("Jul 4");
    jest.useRealTimers();
  });

  it("includes time when dueTime is provided (AM)", () => {
    setFakeDate("2024-06-15T12:00:00");
    expect(formatDueDate("2024-06-15", "09:30")).toBe("Today at 9:30 AM");
    jest.useRealTimers();
  });

  it("includes time when dueTime is provided (PM)", () => {
    setFakeDate("2024-06-15T12:00:00");
    expect(formatDueDate("2024-06-15", "14:30")).toBe("Today at 2:30 PM");
    jest.useRealTimers();
  });

  it('handles noon as "12:00 PM"', () => {
    setFakeDate("2024-06-15T12:00:00");
    expect(formatDueDate("2024-06-15", "12:00")).toBe("Today at 12:00 PM");
    jest.useRealTimers();
  });

  it('handles midnight as "12:00 AM"', () => {
    setFakeDate("2024-06-15T12:00:00");
    expect(formatDueDate("2024-06-15", "00:00")).toBe("Today at 12:00 AM");
    jest.useRealTimers();
  });

  it("formats tomorrow with time", () => {
    setFakeDate("2024-06-15T12:00:00");
    expect(formatDueDate("2024-06-16", "18:45")).toBe("Tomorrow at 6:45 PM");
    jest.useRealTimers();
  });
});
