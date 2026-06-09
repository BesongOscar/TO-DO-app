import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { Task, TaskCounts } from "../types";
import { useAuth } from "@/context/AuthContext";
import { useTaskStore } from "../src/store/taskStore";
import { useTaskNotifications } from "../features/notifications/hooks/useTaskNotifications";

interface TasksData {
  tasks: Task[];
  loading: boolean;
  refreshing: boolean;
  counts: TaskCounts;
  selectedTaskId: string | null;
}

const TasksDataContext = createContext<TasksData | null>(null);

interface TasksActions {
  addTask: (text: string, listName?: string, listId?: string) => void;
  toggleTask: (taskId: string) => void;
  toggleImportant: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  refreshTasks: () => Promise<void>;
  reorderTasks: (reorderedPendingTasks: Task[]) => void;
  setSelectedTaskId: (id: string | null) => void;
}

const TasksActionsContext = createContext<TasksActions | null>(null);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading: authLoading } = useAuth();
  const tasks = useTaskStore((s) => s.tasks);
  const loading = useTaskStore((s) => s.loading);
  const refreshing = useTaskStore((s) => s.refreshing);
  const selectedTaskId = useTaskStore((s) => s.selectedTaskId);
  const addTask = useTaskStore((s) => s.addTask);
  const toggleTask = useTaskStore((s) => s.toggleTask);
  const toggleImportant = useTaskStore((s) => s.toggleImportant);
  const deleteTaskAction = useTaskStore((s) => s.deleteTask);
  const updateTaskAction = useTaskStore((s) => s.updateTask);
  const refreshTasks = useTaskStore((s) => s.refreshTasks);
  const reorderTasks = useTaskStore((s) => s.reorderTasks);
  const setSelectedTaskId = useTaskStore((s) => s.setSelectedTaskId);

  const tasksRef = useRef<Task[]>(tasks);
  const { onTasksLoaded, onTaskToggled, onTaskUpdated, onTaskDeleted } =
    useTaskNotifications();

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  useEffect(() => {
    if (authLoading) return;
    const store = useTaskStore.getState();
    store.fetchTasks().then(() => {
      const currentTasks = useTaskStore.getState().tasks;
      onTasksLoaded(currentTasks);
    });
  }, [authLoading, user?.uid]);

  const wrappedToggleTask = useCallback(
    (taskId: string) => {
      const prevTask = tasksRef.current.find((t) => t.id === taskId);
      toggleTask(taskId);
      if (prevTask) {
        const willBeCompleted = !prevTask.completed;
        onTaskToggled(prevTask, willBeCompleted);
      }
    },
    [toggleTask, onTaskToggled],
  );

  const wrappedToggleImportant = useCallback(
    (taskId: string) => {
      toggleImportant(taskId);
    },
    [toggleImportant],
  );

  const wrappedDeleteTask = useCallback(
    (taskId: string) => {
      deleteTaskAction(taskId);
      onTaskDeleted(taskId);
    },
    [deleteTaskAction, onTaskDeleted],
  );

  const wrappedUpdateTask = useCallback(
    (taskId: string, updates: Partial<Task>) => {
      const prevTask = tasksRef.current.find((t) => t.id === taskId);
      updateTaskAction(taskId, updates);
      if (prevTask) {
        onTaskUpdated(prevTask, updates);
      }
    },
    [updateTaskAction, onTaskUpdated],
  );

  const counts = useMemo<TaskCounts>(() => {
    const store = useTaskStore.getState();
    return store.getCounts();
  }, [tasks]);

  const dataValue = useMemo<TasksData>(
    () => ({ tasks, loading, refreshing, counts, selectedTaskId }),
    [tasks, loading, refreshing, counts, selectedTaskId],
  );

  const actionsValue = useMemo<TasksActions>(
    () => ({
      addTask,
      toggleTask: wrappedToggleTask,
      toggleImportant: wrappedToggleImportant,
      deleteTask: wrappedDeleteTask,
      updateTask: wrappedUpdateTask,
      refreshTasks,
      reorderTasks,
      setSelectedTaskId,
    }),
    [
      addTask,
      wrappedToggleTask,
      wrappedToggleImportant,
      wrappedDeleteTask,
      wrappedUpdateTask,
      refreshTasks,
      reorderTasks,
      setSelectedTaskId,
    ],
  );

  return (
    <TasksDataContext.Provider value={dataValue}>
      <TasksActionsContext.Provider value={actionsValue}>
        {children}
      </TasksActionsContext.Provider>
    </TasksDataContext.Provider>
  );
};

export const useTasksData = (): TasksData => {
  const ctx = useContext(TasksDataContext);
  if (!ctx) throw new Error("useTasksData must be inside <TasksProvider>");
  return ctx;
};

export const useTasksActions = (): TasksActions => {
  const ctx = useContext(TasksActionsContext);
  if (!ctx) throw new Error("useTasksActions must be inside <TasksProvider>");
  return ctx;
};

export const useTasks = (): TasksData & TasksActions => ({
  ...useTasksData(),
  ...useTasksActions(),
});
