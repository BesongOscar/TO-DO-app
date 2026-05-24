/**
 * taskFilters - Filter tasks based on the active list's filterKey
 * 
 * Maps each list type to its corresponding filter function.
 * Supports: myDay, important, completed, all, planned, tasks, listId
 */

import { Task, ListItem } from "../types";

export const filterTasks = (tasks: Task[], list: ListItem): Task[] => {
  switch (list.filterKey) {
    case "myDay":
      return tasks.filter((t) => t.myDay);
    case "important":
      return tasks.filter((t) => t.important);
    case "completed":
      return tasks.filter((t) => t.completed);
    case "all":
      return tasks;
    case "planned":
      return tasks.filter((t) => Boolean(t.dueDate));
    case "tasks":
      return tasks.filter((t) => !t.myDay && !t.important);
    case "listId":
      return tasks.filter((t) => t.listId === list.id);
    default:
      return tasks;
  }
};
