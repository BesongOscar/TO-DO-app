import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task, TaskCounts } from "../types";

// ─── Storage key ──────────────────────────────────────────────────────────────
const STORAGE_KEY = "@tasks";

// ─── Default seed data (only used on very first launch) ───────────────────────
const DEFAULT_TASKS: Task[] = [
  { id: "1", text: "Review quarterly reports",         completed: false, important: true,  myDay: true  },
  { id: "2", text: "Call client about project update", completed: false, important: false, myDay: true  },
  { id: "3", text: "Prepare presentation slides",      completed: false, important: true,  myDay: true  },
  { id: "4", text: "Team meeting at 3 PM",             completed: false, important: false, myDay: false },
  { id: "5", text: "Update project documentation",     completed: true,  important: false, myDay: false },
  { id: "6", text: "Send weekly status report",        completed: true,  important: false, myDay: false },
];

// ─── Context shape ────────────────────────────────────────────────────────────
interface TasksContextValue {
  tasks: Task[];
  loading: boolean;
  counts: TaskCounts;
  addTask: (text: string, listName?: string) => void;
  toggleTask: (taskId: string) => void;
  toggleImportant: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const TasksContext = createContext<TasksContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ── Load persisted tasks on first mount ──────────────────────────────────
  useEffect(() => {
    const loadTasks = async (): Promise<void> => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored !== null) {
          setTasks(JSON.parse(stored) as Task[]);
        } else {
          setTasks(DEFAULT_TASKS);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TASKS));
        }
      } catch (e) {
        console.warn("Failed to load tasks from storage:", e);
        setTasks(DEFAULT_TASKS);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  // ── Persist to AsyncStorage whenever tasks change (after initial load) ───
  useEffect(() => {
    if (loading) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch((e) =>
      console.warn("Failed to persist tasks:", e),
    );
  }, [tasks, loading]);

  // ── Task actions ─────────────────────────────────────────────────────────

  const addTask = useCallback((text: string, listName = "My Day"): void => {
    const newTask: Task = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      text: text.trim(),
      completed: false,
      important: false,
      myDay: listName === "My Day",
    };
    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const toggleTask = useCallback((taskId: string): void => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
    );
  }, []);

  const toggleImportant = useCallback((taskId: string): void => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, important: !t.important } : t)),
    );
  }, []);

  const deleteTask = useCallback((taskId: string): void => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>): void => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
    );
  }, []);

  // ── Derived counts ───────────────────────────────────────────────────────
  const counts = useMemo<TaskCounts>(
    () => ({
      myDay:     tasks.filter((t) => t.myDay && !t.completed).length,
      important: tasks.filter((t) => t.important && !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
      planned:   tasks.filter((t) => Boolean(t.dueDate)).length,
      all:       tasks.length,
      tasks:     tasks.filter((t) => !t.myDay && !t.important && !t.completed).length,
    }),
    [tasks],
  );

  const value: TasksContextValue = {
    tasks,
    loading,
    counts,
    addTask,
    toggleTask,
    toggleImportant,
    deleteTask,
    updateTask,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useTasks = (): TasksContextValue => {
  const ctx = useContext(TasksContext);
  if (!ctx) {
    throw new Error("useTasks must be used inside a <TasksProvider>");
  }
  return ctx;
};

export default TasksContext;
