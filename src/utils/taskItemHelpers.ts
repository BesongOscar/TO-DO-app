/**
 * taskItemHelpers - Formatting utilities for display in TaskItem
 * 
 * Provides isOverdue check and formatDueDate for rendering
 * human-readable due date labels with optional time.
 */

export const isOverdue = (dueDateStr: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [year, month, day] = dueDateStr.split("-").map(Number);
  const dueDate = new Date(year, month - 1, day);
  return dueDate < today;
};

export const formatDueDate = (dueDateStr: string, dueTime?: string): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [year, month, day] = dueDateStr.split("-").map(Number);
  const dueDate = new Date(year, month - 1, day);

  let label: string;
  if (dueDate.getTime() === today.getTime()) {
    label = "Today";
  } else if (dueDate.getTime() === tomorrow.getTime()) {
    label = "Tomorrow";
  } else {
    label = dueDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  if (dueTime) {
    const [h, m] = dueTime.split(":");
    const ampm = parseInt(h, 10) >= 12 ? "PM" : "AM";
    const hour12 = parseInt(h, 10) % 12 || 12;
    return `${label} at ${hour12}:${m} ${ampm}`;
  }

  return label;
};
