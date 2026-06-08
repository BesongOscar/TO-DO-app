import { ListItem } from "../types";

// Each list has a `filterKey` that TasksContext.counts uses to derive live badge numbers.
export const sidebarLists: ListItem[] = [
  { id: "1", name: "My Day", icon: "☀️", color: "#0078d4", filterKey: "myDay" },
  {
    id: "2",
    name: "Important",
    icon: "⭐",
    color: "#d83b01",
    filterKey: "important",
  },
  { id: "3", name: "All", icon: "📝", color: "#5c2d91", filterKey: "all" },
  {
    id: "4",
    name: "Completed",
    icon: "✅",
    color: "#0078d4",
    filterKey: "completed",
  },
  { id: "5", name: "Tasks", icon: "🏠", color: "#0078d4", filterKey: "tasks" },
];
