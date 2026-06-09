import { useCallback } from "react";
import * as Notifications from "expo-notifications";
import {
  scheduleTaskReminder,
  cancelTaskReminder,
} from "../services/notificationService";
import { Task } from "../../../types";

export function useTaskNotifications() {
  const onTasksLoaded = useCallback(async (tasks: Task[]): Promise<void> => {
    for (const task of tasks) {
      if (task.reminder) {
        try {
          await scheduleTaskReminder(task);
        } catch (e) {
          console.warn("Failed to reschedule notification:", e);
        }
      }
    }

    try {
      const scheduledAll =
        await Notifications.getAllScheduledNotificationsAsync();
      for (const task of tasks) {
        if (!task.reminder || task.repeat !== "monthly") continue;
        if (
          !task.repeatOnLastDay &&
          (!task.repeatOnDay || task.repeatOnDay < 29)
        )
          continue;
        const seriesCount = scheduledAll.filter(
          (s) =>
            s.identifier.startsWith(`${task.id}-last-`) ||
            s.identifier.startsWith(`${task.id}-month-`),
        ).length;
        if (seriesCount < 12) {
          try {
            await scheduleTaskReminder(task);
          } catch (e) {
            console.warn("Failed to refill monthly repeats:", e);
          }
        }
      }
    } catch (e) {
      console.warn("Failed to check monthly repeat refills:", e);
    }
  }, []);

  const onTaskToggled = useCallback(
    (task: Task, willBeCompleted: boolean): void => {
      if (!task.reminder) return;
      if (willBeCompleted) {
        cancelTaskReminder(task.id);
      } else {
        scheduleTaskReminder(task);
      }
    },
    [],
  );

  const onTaskUpdated = useCallback(
    (prevTask: Task, updates: Partial<Task>): void => {
      const completing = updates.completed === true;
      const newReminder =
        "reminder" in updates ? updates.reminder : prevTask.reminder;
      const newRepeat =
        "repeat" in updates ? updates.repeat : prevTask.repeat;
      const hadReminder = !!prevTask.reminder;

      if (completing || (!newReminder && hadReminder)) {
        cancelTaskReminder(prevTask.id);
      } else if (newReminder) {
        const fullTask: Task = {
          ...prevTask,
          ...updates,
          reminder: newReminder,
          repeat: newRepeat,
        };
        scheduleTaskReminder(fullTask);
      }
    },
    [],
  );

  const onTaskDeleted = useCallback((taskId: string): void => {
    cancelTaskReminder(taskId);
  }, []);

  return { onTasksLoaded, onTaskToggled, onTaskUpdated, onTaskDeleted };
}
