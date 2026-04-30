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
import {
  firestoreGetTasks,
  firestoreSaveTasks,
  firestoreDeleteTask,
  firestoreUpdateTask,
} from "@/src/firebase/tasks";

/**
 * TasksContext - Manages global task state and Firestore persistence
 *
 * Provides task CRUD operations (add, toggle, delete, update) that sync
 * with Firestore in real-time. Handles loading states and error recovery.
 */

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
    // Load tasks from Firestore when user logs in or auth state changes, shows loading state while fetching, handles case where user logs out by clearing tasks, uses a cancellation flag to avoid setting state on unmounted component if auth state changes rapidly
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

  const saveTasks = useCallback(
    // Save entire task list to Firestore, used for bulk updates (e.g. on app close or refresh), ensures local and remote stay in sync, but should be used sparingly for large lists to avoid performance issues
    async (newTasks: Task[]) => {
      if (!user) return;
      try {
        await firestoreSaveTasks(user.uid, newTasks);
      } catch (e) {
        console.warn("Failed to save tasks to Firestore:", e);
      }
    },
    [user?.uid],
  );

  const addTask = useCallback(
    // Add a new task with the given text and optional list association, generates a unique ID client-side for immediate UI responsiveness, then saves to Firestore
    (text: string, listName = "My Day", listId?: string): void => {
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
    },
    [saveTasks],
  );

  const toggleTask = useCallback(
    // Toggle the completed status of a task by ID, updates local state immediately for responsiveness, then saves the change to Firestore
    (taskId: string): void => {
      setTasks((prev) => {
        const updated = prev.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t,
        );
        saveTasks(updated);
        return updated;
      });
    },
    [saveTasks],
  );

  const toggleImportant = useCallback(
    // Toggle the important status of a task by ID, updates local state immediately for responsiveness, then saves the change to Firestore
    (taskId: string): void => {
      setTasks((prev) => {
        const updated = prev.map((t) =>
          t.id === taskId ? { ...t, important: !t.important } : t,
        );
        saveTasks(updated);
        return updated;
      });
    },
    [saveTasks],
  );

  const deleteTask = useCallback(
    // Delete a task by ID, removes it from local state immediately for responsiveness, then deletes it from Firestore
    (taskId: string): void => {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      // delete only the one doc
      if (user) {
        firestoreDeleteTask(user.uid, taskId).catch((e) =>
          console.warn("Failed to delete task from Firestore:", e),
        );
      }
    },
    [user],
  );

  const updateTask = useCallback(
    // Update specific fields of a task by ID, merges updates with existing task data in local state for responsiveness, then updates only the changed fields in Firestore to minimize write size and latency
    (taskId: string, updates: Partial<Task>): void => {
      setTasks((prev) => {
        const updated = prev.map((t) =>
          t.id === taskId ? { ...t, ...updates } : t,
        );
        // only rewrite the whole list locally — Firestore gets a single doc update
        return updated;
      });
      // write only the changed doc to Firestore
      if (user) {
        firestoreUpdateTask(user.uid, taskId, updates).catch((e) =>
          console.warn("Failed to update task in Firestore:", e),
        );
      }
    },
    [user],
  );

  const refreshTasks = useCallback(async (): Promise<void> => {
    // Manually refresh tasks from Firestore, used for pull-to-refresh or error recovery, shows refreshing state while loading, replaces local state with remote data to ensure consistency
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

  const counts = useMemo<TaskCounts>( // Compute task counts for different categories (My Day, Important, Completed, Planned, All) based on the current task list, used for displaying badges and summaries in the UI, memoized to avoid unnecessary recalculations on every render
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

export const useTasks = (): TasksContextValue => {
  const ctx = useContext(TasksContext);
  if (!ctx) {
    throw new Error("useTasks must be used inside a <TasksProvider>");
  }
  return ctx;
};

export default TasksContext;
