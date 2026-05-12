/**
 * notificationService - Local notification scheduling for task reminders
 * 
 * Uses expo-notifications to schedule, cancel, and manage task reminders.
 * Supports complex repeat patterns (daily, multi-day weekly, monthly with
 * last-day handling, yearly) and handles Android notification channels.
 */

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { Task } from "../../types";

// ─── Setup ───────────────────────────────────────────────────────────────

export async function setupNotificationChannel(): Promise<void> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("task-reminders", {
      name: "Task Reminders",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#0078d4",
    });
  }
}

// ─── Permissions ─────────────────────────────────────────────────────────

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
}

//  ─── Scheduling ─────────────────────────────────────────────────────────
async function safeSchedule(
  request: Notifications.NotificationRequestInput,
): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync(request);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : String(error);
 
    if (message.includes("keep awake") || message.includes("keepAwake")) {
      // Non-fatal: expo-notifications couldn't acquire the wake lock but
      // the notification was still registered. Safe to ignore.
      return;
    }
 
    // Re-throw anything else (permission denied, invalid trigger, etc.)
    throw error;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────

// Extracts the reminder date from a task, returns null if no valid reminder is set
function getReminderDate(task: Task): Date | null {
  if (task.reminder) return new Date(task.reminder);
  return null;
}
// Builds the notification content for a given task 
function buildNotificationContent(
  task: Task,
): Notifications.NotificationContentInput {
  return {
    title: "Task Reminder",
    body: task.text,
    data: { taskId: task.id, type: "task_reminder" },
    sound: "default",
    ...(Platform.OS === "ios" && {
      interruptionLevel: "timeSensitive" as const,
    }),
  };
}
// Checks if a repeating task's end date has passed, meaning no more notifications should be scheduled 
export function hasRepeatExpired(task: Task): boolean {
  if (!task.repeatEndDate) return false;
  const endDate = new Date(task.repeatEndDate);
  endDate.setHours(23, 59, 59, 999);
  return endDate < new Date();
}

// ─── Scheduling ──────────────────────────────────────────────────────────

/**
 * Schedule a local notification for a task's reminder.
 * Uses task.id as the notification identifier.
 * Handles repeat types: daily, weekly (multi-day), monthly, yearly.
 */
export async function scheduleTaskReminder(task: Task): Promise<void> {
  const reminderDate = getReminderDate(task);
  if (!reminderDate) return;

  // Cancel any previously scheduled notification for this task
  await cancelTaskReminder(task.id);

  // Don't schedule if repeat has expired
  if (hasRepeatExpired(task)) return;

  const content = buildNotificationContent(task);

  if (task.repeat && task.repeat !== "none") {
    await scheduleRepeating(task, reminderDate, content);
  } else {
    await Notifications.scheduleNotificationAsync({
      identifier: task.id,
      content,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminderDate,
      },
    });
  }
}

async function scheduleRepeating(
  task: Task,
  reminderDate: Date,
  content: Notifications.NotificationContentInput,
): Promise<void> {
  const hour = reminderDate.getHours();
  const minute = reminderDate.getMinutes();

  switch (task.repeat) {
    case "daily": {
      await Notifications.scheduleNotificationAsync({
        identifier: task.id,
        content,
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour, minute,
        },
      });
      break;
    }

    case "weekly": {
      // If specific days selected, schedule one per day
      const days = task.repeatDays?.length ? task.repeatDays : [reminderDate.getDay()];
      for (const day of days) {
        const weekday = day === 0 ? 1 : day + 1; // JS 0=Sun → iOS 1=Sun
        await Notifications.scheduleNotificationAsync({
          identifier: `${task.id}-${day}`,
          content,
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday, hour, minute,
          },
        });
      }
      break;
    }

    case "monthly": {
      if (task.repeatOnLastDay) {
        // Last day varies per month — schedule individual notifications
        await scheduleMonthlyLastDay(task, reminderDate, content);
      } else {
        const day = task.repeatOnDay ?? reminderDate.getDate();
        if (day <= 28) {
          // Safe to use repeats: true for days 1-28
          await Notifications.scheduleNotificationAsync({
            identifier: task.id,
            content,
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
              day, hour, minute,
            },
          });
        } else {
          // Days 29-31 need manual handling
          await scheduleMonthlyIndividual(task, reminderDate, content, day);
        }
      }
      break;
    }

    case "yearly": {
      const month = reminderDate.getMonth() + 1; // 1-indexed
      const day = reminderDate.getDate();
      await Notifications.scheduleNotificationAsync({
        identifier: task.id,
        content,
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.YEARLY,
          month, day, hour, minute,
        },
      });
      break;
    }
  }
}

/**
 * For monthly "last day" — schedule one notification per month for
 * the next 12 months. Will be refreshed on app launch.
 */
async function scheduleMonthlyLastDay(
  task: Task,
  reminderDate: Date,
  content: Notifications.NotificationContentInput,
): Promise<void> {
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const year = now.getFullYear();
    const month = now.getMonth() + i;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const triggerDate = new Date(year, month, lastDay);
    triggerDate.setHours(
      reminderDate.getHours(),
      reminderDate.getMinutes(),
      reminderDate.getSeconds(),
    );

    if (triggerDate > now) {
      await Notifications.scheduleNotificationAsync({
        identifier: `${task.id}-last-${i}`,
        content,
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
        },
      });
    }
  }
}

/**
 * For monthly day 29-31 — schedule individual notifications per month
 */
async function scheduleMonthlyIndividual(
  task: Task,
  reminderDate: Date,
  content: Notifications.NotificationContentInput,
  day: number,
): Promise<void> {
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const year = now.getFullYear();
    const month = now.getMonth() + i;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const actualDay = Math.min(day, lastDay);
    const triggerDate = new Date(year, month, actualDay);
    triggerDate.setHours(
      reminderDate.getHours(),
      reminderDate.getMinutes(),
      reminderDate.getSeconds(),
    );

    if (triggerDate > now) {
      await Notifications.scheduleNotificationAsync({
        identifier: `${task.id}-month-${i}`,
        content,
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
        },
      });
    }
  }
}

// ─── Cancellation ────────────────────────────────────────────────────────

export async function cancelTaskReminder(taskId: string): Promise<void> {
  // Cancel all identifiers that might exist for this task
  const identifiers = [taskId];
  // Also cancel any monthly/weekly sub-notifications
  for (let i = 0; i < 12; i++) {
    identifiers.push(`${taskId}-last-${i}`);
    identifiers.push(`${taskId}-month-${i}`);
  }
  for (let day = 0; day < 7; day++) {
    identifiers.push(`${taskId}-${day}`);
  }
  await Promise.all(
    identifiers.map((id) =>
      Notifications.cancelScheduledNotificationAsync(id).catch(() => {}),
    ),
  );
}

export async function cancelAllTaskReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// ─── Debugging ───────────────────────────────────────────────────────────

export async function getAllScheduledReminders(): Promise<Notifications.NotificationRequest[]> {
  return await Notifications.getAllScheduledNotificationsAsync();
}