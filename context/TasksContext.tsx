import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Task, TaskCounts } from "../types";
import { useAuth } from "@/context/AuthContext";
import { firestoreGetTasks, firestoreSaveTasks } from "@/src/firebase/tasks";


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

const TasksContext = createContext<TasksContextValue | null>(null);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    let cancelled = false;

    const loadTasks = async (): Promise<void> => {
      if (!user) {
        setTasks([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const loadedTasks = await firestoreGetTasks(user.uid);
        
        if (cancelled) return;

        if (loadedTasks.length > 0) {
          setTasks(loadedTasks);
        } else {
          setTasks([]);
        }
      } catch (e) {
        console.warn("Failed to load tasks from Firestore:", e);
        if (!cancelled) setTasks([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadTasks();
    return () => {
      cancelled = true;
    };
  }, [authLoading, user?.uid]);

  const saveTasks = useCallback(async (newTasks: Task[]) => {
    if (!user) return;
    try {
      await firestoreSaveTasks(user.uid, newTasks);
    } catch (e) {
      console.warn("Failed to save tasks to Firestore:", e);
    }
  }, [user?.uid]);

  const addTask = useCallback((text: string, listName = "My Day", listId?: string): void => {
    const newTask: Task = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      text: text.trim(),
      completed: false,
      important: false,
      myDay: listName === "My Day",
      listId: listId,
    };
    setTasks((prev) => {
      const updated = [newTask, ...prev];
      saveTasks(updated);
      return updated;
    });
  }, [saveTasks]);

  const toggleTask = useCallback((taskId: string): void => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
      saveTasks(updated);
      return updated;
    });
  }, [saveTasks]);

  const toggleImportant = useCallback((taskId: string): void => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === taskId ? { ...t, important: !t.important } : t));
      saveTasks(updated);
      return updated;
    });
  }, [saveTasks]);

  const deleteTask = useCallback((taskId: string): void => {
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== taskId);
      saveTasks(updated);
      return updated;
    });
  }, [saveTasks]);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>): void => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t));
      saveTasks(updated);
      return updated;
    });
  }, [saveTasks]);

  const refreshTasks = useCallback(async (): Promise<void> => {
    if (!user) return;
    setRefreshing(true);
    try {
      const loadedTasks = await firestoreGetTasks(user.uid);
      setTasks(loadedTasks);
    } catch (e) {
      console.warn("Failed to refresh tasks:", e);
    } finally {
      setRefreshing(false);
    }
  }, [user?.uid]);

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
    refreshing,
    counts,
    addTask,
    toggleTask,
    toggleImportant,
    deleteTask,
    updateTask,
    refreshTasks,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};

export const useTasks = (): TasksContextValue => {
  const ctx = useContext(TasksContext);
  if (!ctx) {
    throw new Error("useTasks must be used inside a <TasksProvider>");
  }
  return ctx;
};

export default TasksContext;