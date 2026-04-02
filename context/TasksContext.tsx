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
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "src/firebase/config";

// ─── Storage key ──────────────────────────────────────────────────────────────
const STORAGE_KEY = (uid: string) => "@tasks_${uid}";

// ─── Default seed data (only used on very first launch) ───────────────────────
const DEFAULT_TASKS: Task[] = [
  {
    id: "1",
    text: "Review quarterly reports",
    completed: false,
    important: true,
    myDay: true,
  },
  {
    id: "2",
    text: "Call client about project update",
    completed: false,
    important: false,
    myDay: true,
  },
  {
    id: "3",
    text: "Prepare presentation slides",
    completed: false,
    important: true,
    myDay: true,
  },
  {
    id: "4",
    text: "Team meeting at 3 PM",
    completed: false,
    important: false,
    myDay: false,
  },
  {
    id: "5",
    text: "Update project documentation",
    completed: true,
    important: false,
    myDay: false,
  },
  {
    id: "6",
    text: "Send weekly status report",
    completed: true,
    important: false,
    myDay: false,
  },
];

// ─── Context shape ────────────────────────────────────────────────────────────
interface TasksContextValue {
  tasks: Task[];
  loading: boolean;
  refreshing: boolean;
  counts: TaskCounts;
  addTask: (text: string, listName?: string, listId?: string) => void;
  toggleTask: (taskId: string) => void;
  toggleImportant: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  refreshTasks: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const TasksContext = createContext<TasksContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // ── Track the signed-in user ──────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Load tasks whenever the user changes (including on first mount)
  useEffect(() => {
    const loadTasks = async (): Promise<void> => {
      setLoading(true);
      try {
        if (!currentUser) {
          // No user signed in — clear tasks so nothing leaks between accounts.
          setTasks([]);
          return;
        }

        const key = STORAGE_KEY(currentUser.uid);
        const stored = await AsyncStorage.getItem(key);

        if (stored !== null) {
          const parsed = JSON.parse(stored) as Task[];
          setTasks(Array.isArray(parsed) ? parsed : []);
        } else {
          // First time this user logs in — start with an empty list.
          setTasks([]);
          await AsyncStorage.setItem(key, JSON.stringify([]));
        }
      } catch (e) {
        console.warn("Failed to load tasks from storage:", e);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [currentUser]);

  //Persist to AsyncStorage whenever tasks change (after initial load)
  useEffect(() => {
    if (loading || !currentUser) return;
    const key = STORAGE_KEY(currentUser.uid);
    AsyncStorage.setItem(key, JSON.stringify(tasks)).catch((e) =>
      console.warn("Failed to persist tasks:", e),
    );
  }, [tasks, loading, currentUser]);

  // ── Task actions ─────────────────────────────────────────────────────────

  const addTask = useCallback(
    (text: string, listName = "My Day", listId?: string): void => {
      const newTask: Task = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        text: text.trim(),
        completed: false,
        important: false,
        myDay: listName === "My Day",
        listId: listId,
      };
      setTasks((prev) => [newTask, ...prev]);
    },
    [],
  );

  const toggleTask = useCallback((taskId: string): void => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t,
      ),
    );
  }, []);

  const toggleImportant = useCallback((taskId: string): void => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, important: !t.important } : t,
      ),
    );
  }, []);

  const deleteTask = useCallback((taskId: string): void => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const updateTask = useCallback(
    (taskId: string, updates: Partial<Task>): void => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
      );
    },
    [],
  );

  const refreshTasks = useCallback(async (): Promise<void> => {
    if (!currentUser) return;
    setRefreshing(true);
    try {
      const key = STORAGE_KEY(currentUser.uid);
      const stored = await AsyncStorage.getItem(key);
      if (stored !== null) {
        const parsed = JSON.parse(stored) as Task[];
        if (Array.isArray(parsed)) {
          setTasks(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to refresh tasks:", e);
    } finally {
      setRefreshing(false);
    }
  }, [currentUser]);

  // ── Derived counts ───────────────────────────────────────────────────────
  const counts = useMemo<TaskCounts>(
    () => ({
      myDay: tasks.filter((t) => t.myDay && !t.completed).length,
      important: tasks.filter((t) => t.important && !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
      planned: tasks.filter((t) => Boolean(t.dueDate)).length,
      all: tasks.length,
      tasks: tasks.filter((t) => !t.myDay && !t.important && !t.completed)
        .length,
    }),
    [tasks],
  );

  const value: TasksContextValue = {
    tasks,
    loading,
    refreshing,
    counts,
    addTask,
    toggleTask,
    toggleImportant,
    deleteTask,
    updateTask,
    refreshTasks,
  };

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
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
