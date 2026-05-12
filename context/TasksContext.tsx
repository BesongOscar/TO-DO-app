import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Alert } from "react-native";
import { Task, TaskCounts } from "../types";
import { useAuth } from "@/context/AuthContext";
import {
  firestoreGetTasks,
  firestoreSaveTasks,
  firestoreDeleteTask,
  firestoreUpdateTask,
} from "@/src/firebase/tasks";
import { useTaskNotifications } from "../src/hooks/useTaskNotifications";

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
  reorderTasks: (reorderedPendingTasks: Task[]) => void;
  // Shared selected task ID for bottom panel across all tabs
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
}

const TasksContext = createContext<TasksContextValue | null>(null);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tasksRef = useRef<Task[]>([]);
  const userRef = useRef(user);

  //keep refs in sync:
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const { onTasksLoaded, onTaskToggled, onTaskUpdated, onTaskDeleted } =
    useTaskNotifications();

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
          // Initialize order for pending tasks that don't have it
          const pendingTasks = loadedTasks.filter((t) => !t.completed);
          const completedTasks = loadedTasks.filter((t) => t.completed);

          let orderCounter = 0;
          const pendingWithOrder = pendingTasks.map((task) => {
            if (task.order === undefined) {
              return { ...task, order: orderCounter++ };
            }
            return task;
          });

          // Sort pending tasks by order
          pendingWithOrder.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

          setTasks([...pendingWithOrder, ...completedTasks]);
        } else {
          setTasks([]);
        }

        onTasksLoaded(loadedTasks);
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

  // Debounced save to Firestore - avoids rapid successive writes
  const debouncedSaveTasks = useCallback(
    (newTasks: Task[]) => {
      const currentUser = userRef.current;
      if (!currentUser) return;

      // Clear any pending save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Debounce: wait 500ms before saving to batch rapid changes
      saveTimeoutRef.current = setTimeout(async () => {
        const uid = userRef.current?.uid;
        if (!uid) return;
        try {
          await firestoreSaveTasks(uid, newTasks);
        } catch (e) {
          console.warn("Failed to save tasks to Firestore:", e);
          Alert.alert(
            "Save Failed",
            "Your changes couldn't be saved. Please check your connection and try again.",
            [{ text: "OK" }],
          );
        }
      }, 500);
    },
    [], // stable - reads user from ref at execution time
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  
  const addTask = useCallback(
        (text: string, listName?: string, listId?: string): void => {
      const newTask: Task = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        text: text.trim(),
        completed: false,
        important: false,
        myDay: listName === "My Day",
        listId: listId,
        order: 0,
        reminder: undefined,
        dueDate: undefined,
        dueTime: undefined,
        repeat: undefined,
      };
      setTasks((prev) => {
        // Increment order of all existing pending tasks by 1
        const updated = [
          newTask,
          ...prev.map((t) =>
            t.completed ? t : { ...t, order: (t.order ?? 0) + 1 },
          ),
        ];
        // Schedule debounced save after state update
        setTimeout(() => debouncedSaveTasks(updated), 0);
        return updated;
      });
    },
    [debouncedSaveTasks],
  );

  // Toggle the completed status of a task by ID, updates local state immediately for responsiveness, then saves the change to Firestore
  const toggleTask = useCallback(
    (taskId: string): void => {
      const prevTask = tasksRef.current.find((t) => t.id === taskId);
      if (!prevTask) return;

      const willBeCompleted = !prevTask.completed;
      let newOrder: number | undefined;

      if (!willBeCompleted) {
        const maxOrder = tasksRef.current
          .filter((t) => !t.completed && t.order !== undefined)
          .reduce((max, t) => Math.max(max, t.order ?? 0), -1);
        newOrder = maxOrder + 1;
      }

      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, completed: willBeCompleted, order: newOrder }
            : t,
        ),
      );

      if (user) {
        firestoreUpdateTask(user.uid, taskId, {
          completed: willBeCompleted,
          order: newOrder,
        }).catch((e) => {
          console.warn("Failed to toggle task in Firestore:", e);
          Alert.alert(
            "Save Failed",
            "Please check your connection and try again.",
            [{ text: "OK" }],
          );
          setTasks((prev) =>
            prev.map((t) =>
              t.id === taskId
                ? { ...t, completed: prevTask.completed, order: prevTask.order }
                : t,
            ),
          );
        });
      }

      onTaskToggled(prevTask, willBeCompleted);
    },
    [user, onTaskToggled],
  );

  // Toggle the important status of a task by ID, updates local state immediately for responsiveness, then saves the change to Firestore
  const toggleImportant = useCallback(
    (taskId: string): void => {
      const prevTask = tasksRef.current.find((t) => t.id === taskId);
      if (!prevTask) return;

      const newImportant = !prevTask.important;

      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, important: newImportant } : t,
        ),
      );

      if (user) {
        firestoreUpdateTask(user.uid, taskId, { important: newImportant }).catch((e) => {
          console.warn("Failed to toggle important in Firestore:", e);
          setTasks((prev) =>
            prev.map((t) =>
              t.id === taskId ? { ...t, important: prevTask.important } : t,
            ),
          );
        });
      }
    },
    [user, onTaskUpdated],
  );

    // Delete a task by ID, removes it from local state immediately for responsiveness, then deletes it from Firestore
  const deleteTask = useCallback(
    (taskId: string): void => {
      const prevTask = tasksRef.current.find((t) => t.id === taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      onTaskDeleted(taskId);
      if (user && prevTask) {
        firestoreDeleteTask(user.uid, taskId).catch((e) => {
          console.warn("Failed to delete task from Firestore:", e);
          setTasks((prev) => {
            if (prev.some((t) => t.id === taskId)) return prev;
            return [...prev, prevTask];
          });
          Alert.alert(
            "Delete Failed",
            "Could not delete the task. Please try again.",
            [{ text: "OK" }],
          );
        });
      }
    },
    [user, onTaskDeleted],
  );

  // Update a task by ID with given partial updates, merges updates into existing task, updates local state immediately for responsiveness, then saves changes to Firestore, also handles scheduling or canceling notifications based on reminder changes
  const updateTask = useCallback(
    (taskId: string, updates: Partial<Task>): void => {
      const prevTask = tasksRef.current.find((t) => t.id === taskId);

      setTasks((prev) => {
        const updated = prev.map((t) =>
          t.id === taskId ? { ...t, ...updates } : t,
        );
        return updated;
      });
      if (prevTask) {
        onTaskUpdated(prevTask, updates);
      }
      if (user && prevTask) {
        firestoreUpdateTask(user.uid, taskId, updates).catch((e) => {
          console.warn("Failed to update task in Firestore:", e);
          setTasks((prev) =>
            prev.map((t) =>
              t.id === taskId ? prevTask : t,
            ),
          );
          Alert.alert(
            "Update Failed",
            "Could not save changes. Please try again.",
            [{ text: "OK" }],
          );
        });
      }
    },
    [user, onTaskUpdated],
  );

  // Manually refresh tasks from Firestore, used for pull-to-refresh or error recovery, shows refreshing state while loading, replaces local state with remote data to ensure consistency
  const refreshTasks = useCallback(async (): Promise<void> => {
    if (!user) return;
    setRefreshing(true);
    try {
      const loadedTasks = await firestoreGetTasks(user.uid);

      // Initialize order for pending tasks that don't have it
      const pendingTasks = loadedTasks.filter((t) => !t.completed);
      const completedTasks = loadedTasks.filter((t) => t.completed);

      let orderCounter = 0;
      const pendingWithOrder = pendingTasks.map((task) => {
        if (task.order === undefined) {
          return { ...task, order: orderCounter++ };
        }
        return task;
      });

      // Sort pending tasks by order
      pendingWithOrder.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      setTasks([...pendingWithOrder, ...completedTasks]);
    } catch (e) {
      console.warn("Failed to refresh tasks:", e);
      Alert.alert(
        "Refresh Failed",
        "Could not load tasks. Please check your connection and try again.",
        [{ text: "OK" }],
      );
    } finally {
      setRefreshing(false);
    }
  }, [user?.uid]);

  const reorderTasks = useCallback(
    // Reorder pending tasks after drag-and-drop, assigns order based on new positions
    (reorderedPendingTasks: Task[]): void => {
      const updatedPending = reorderedPendingTasks.map((task, index) => ({
        ...task,
        order: index,
      }));

      setTasks((prev) => {
        const completedTasks = prev.filter((t) => t.completed);
        const newTasks = [...updatedPending, ...completedTasks];
        // Save after state update
        debouncedSaveTasks(newTasks);
        return newTasks;
      });
    },
    [debouncedSaveTasks],
  );

  const counts = useMemo<TaskCounts>( // Compute task counts for different categories (My Day, Important, Completed, Planned, All) based on the current task list, used for displaying badges and summaries in the UI, memoized to avoid unnecessary recalculations on every render
    () => ({
      myDay: tasks.filter((t) => t.myDay && !t.completed).length,
      important: tasks.filter((t) => t.important && !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
      planned: tasks.filter((t) => Boolean(t.dueDate) && !t.completed).length,
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
    reorderTasks,
    selectedTaskId,
    setSelectedTaskId,
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
