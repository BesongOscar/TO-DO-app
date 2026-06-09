/**
 * taskStore - Zustand store for task state management
 * 
 * Handles CRUD, reordering, debounced Firestore persistence,
 * and task counts. Uses repository pattern for data access.
 */

import { create } from "zustand";
import { Alert } from "react-native";
import { Task, TaskCounts } from "../../types";
import i18n from "@/src/i18n";
import { auth } from "../firebase/config";
import { getRepositories } from "../repositories/provider";

type RepoTask = import("../domain/Task").Task;

const asRepoTasks = (tasks: Task[]): RepoTask[] => tasks as unknown as RepoTask[];
const asTasks = (domainTasks: RepoTask[]): Task[] => domainTasks as unknown as Task[];

const getUserId = (): string | null => auth.currentUser?.uid ?? null;

interface TaskState {
  tasks: Task[];
  loading: boolean;
  refreshing: boolean;
  selectedTaskId: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (text: string, listName?: string, listId?: string) => void;
  toggleTask: (taskId: string) => void;
  toggleImportant: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  refreshTasks: () => Promise<void>;
  reorderTasks: (reorderedPendingTasks: Task[]) => void;
  setSelectedTaskId: (id: string | null) => void;
  getCounts: () => TaskCounts;
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

const debouncedSave = (tasks: Task[]) => {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      const { taskRepo } = getRepositories();
      await taskRepo.saveTasks(userId, asRepoTasks(tasks));
    } catch (e) {
      console.warn("Failed to save tasks:", e);
      Alert.alert(i18n.t("errors.save_failed"), "", [
        { text: i18n.t("common.ok") },
      ]);
    }
  }, 500);
};

const sortPendingByOrder = (tasks: Task[]): Task[] => {
  const pending = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);
  let orderCounter = 0;
  const withOrder = pending.map((task) => ({
    ...task,
    order: task.order ?? orderCounter++,
  }));
  withOrder.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return [...withOrder, ...completed];
};

export const useTaskStore = create<TaskState>()((set, get) => ({
  tasks: [],
  loading: true,
  refreshing: false,
  selectedTaskId: null,

  fetchTasks: async () => {
    const userId = getUserId();
    if (!userId) {
      set({ tasks: [], loading: false });
      return;
    }
    set({ loading: true });
    try {
      const { taskRepo } = getRepositories();
      const loadedTasks = await taskRepo.getTasks(userId);
      if (loadedTasks.length > 0) {
        set({ tasks: sortPendingByOrder(asTasks(loadedTasks)) });
      } else {
        set({ tasks: [] });
      }
    } catch (e) {
      console.warn("Failed to load tasks:", e);
      set({ tasks: [] });
    }
    set({ loading: false });
  },

  addTask: (text: string, listName?: string, listId?: string) => {
    const newTask: Task = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      text: text.trim(),
      completed: false,
      important: false,
      myDay: listName === "My Day",
      listId,
      order: 0,
      createdAt: Date.now(),
    };
    set((state) => {
      const updated = [
        newTask,
        ...state.tasks.map((t) =>
          t.completed ? t : { ...t, order: (t.order ?? 0) + 1 },
        ),
      ];
      debouncedSave(updated);
      return { tasks: updated };
    });
  },

  toggleTask: (taskId: string) => {
    const { tasks } = get();
    const prevTask = tasks.find((t) => t.id === taskId);
    if (!prevTask) return;

    const willBeCompleted = !prevTask.completed;
    let newOrder: number | undefined;

    if (!willBeCompleted) {
      const maxOrder = tasks
        .filter((t) => !t.completed && t.order !== undefined)
        .reduce((max, t) => Math.max(max, t.order ?? 0), -1);
      newOrder = maxOrder + 1;
    }

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, completed: willBeCompleted, order: newOrder }
          : t,
      ),
    }));

    const userId = getUserId();
    if (userId) {
      const { taskRepo } = getRepositories();
      taskRepo.updateTask(userId, taskId, {
        completed: willBeCompleted,
        order: newOrder,
      } as Partial<RepoTask>).catch((e: unknown) => {
        console.warn("Failed to toggle task:", e);
        Alert.alert(i18n.t("errors.save_failed"), "", [
          { text: i18n.t("common.ok") },
        ]);
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  completed: prevTask.completed,
                  order: prevTask.order,
                }
              : t,
          ),
        }));
      });
    }
  },

  toggleImportant: (taskId: string) => {
    const { tasks } = get();
    const prevTask = tasks.find((t) => t.id === taskId);
    if (!prevTask) return;

    const newImportant = !prevTask.important;

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, important: newImportant } : t,
      ),
    }));

    const userId = getUserId();
    if (userId) {
      const { taskRepo } = getRepositories();
      taskRepo.updateTask(userId, taskId, {
        important: newImportant,
      } as Partial<RepoTask>).catch(() => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, important: prevTask.important }
              : t,
          ),
        }));
      });
    }
  },

  deleteTask: (taskId: string) => {
    const { tasks } = get();
    const prevTask = tasks.find((t) => t.id === taskId);
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    }));

    const userId = getUserId();
    if (userId && prevTask) {
      const { taskRepo } = getRepositories();
      taskRepo.deleteTask(userId, taskId).catch((e: unknown) => {
        console.warn("Failed to delete task:", e);
        set((state) => {
          if (state.tasks.some((t) => t.id === taskId)) return state;
          return { tasks: [...state.tasks, prevTask] };
        });
        Alert.alert(i18n.t("errors.delete_failed"), "", [
          { text: i18n.t("common.ok") },
        ]);
      });
    }
  },

  updateTask: (taskId: string, updates: Partial<Task>) => {
    const { tasks } = get();
    const prevTask = tasks.find((t) => t.id === taskId);
    if (!prevTask) return;

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, ...updates } : t,
      ),
    }));

    const userId = getUserId();
    if (userId) {
      const { taskRepo } = getRepositories();
      taskRepo.updateTask(userId, taskId, updates as Partial<RepoTask>).catch((e: unknown) => {
        console.warn("Failed to update task:", e);
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? prevTask : t,
          ),
        }));
        Alert.alert(i18n.t("errors.update_failed"), "", [
          { text: i18n.t("common.ok") },
        ]);
      });
    }
  },

  refreshTasks: async () => {
    const userId = getUserId();
    if (!userId) return;
    set({ refreshing: true });
    try {
      const { taskRepo } = getRepositories();
      const loadedTasks = await taskRepo.getTasks(userId);
      set({ tasks: sortPendingByOrder(asTasks(loadedTasks)) });
    } catch (e) {
      console.warn("Failed to refresh tasks:", e);
      Alert.alert(i18n.t("errors.refresh_failed"), "", [
        { text: i18n.t("common.ok") },
      ]);
    }
    set({ refreshing: false });
  },

  reorderTasks: (reorderedPendingTasks: Task[]) => {
    const updatedPending = reorderedPendingTasks.map((task, index) => ({
      ...task,
      order: index,
    }));
    set((state) => {
      const completedTasks = state.tasks.filter((t) => t.completed);
      const newTasks = [...updatedPending, ...completedTasks];
      debouncedSave(newTasks);
      return { tasks: newTasks };
    });
  },

  setSelectedTaskId: (id: string | null) => {
    set({ selectedTaskId: id });
  },

  getCounts: (): TaskCounts => {
    const { tasks } = get();
    return {
      myDay: tasks.filter((t) => t.myDay && !t.completed).length,
      important: tasks.filter((t) => t.important && !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
      planned: tasks.filter((t) => Boolean(t.dueDate) && !t.completed).length,
      all: tasks.length,
      tasks: tasks.filter(
        (t) => !t.myDay && !t.important && !t.completed,
      ).length,
    };
  },
}));
