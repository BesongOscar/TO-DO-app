import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { Task } from "../../types";

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

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
}

async function safeSchedule(
  request: Notifications.NotificationRequestInput,
): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync(request);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : String(error);

    if (message.includes("keep awake") || message.includes("keepAwake")) {
      return;
    }

    throw error;
  }
}

function getReminderDate(task: Task): Date | null {
  if (task.reminder) return new Date(task.reminder);
  return null;
}

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

export function hasRepeatExpired(task: Task): boolean {
  if (!task.repeatEndDate) return false;
  const endDate = new Date(task.repeatEndDate);
  endDate.setHours(23, 59, 59, 999);
  return endDate < new Date();
}

export async function scheduleTaskReminder(task: Task): Promise<void> {
  const reminderDate = getReminderDate(task);
  if (!reminderDate) return;

  await cancelTaskReminder(task.id);

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
      const days = task.repeatDays?.length ? task.repeatDays : [reminderDate.getDay()];
      for (const day of days) {
        const weekday = day === 0 ? 1 : day + 1;
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
        await scheduleMonthlyLastDay(task, reminderDate, content);
      } else {
        const day = task.repeatOnDay ?? reminderDate.getDate();
        if (day <= 28) {
          await Notifications.scheduleNotificationAsync({
            identifier: task.id,
            content,
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
              day, hour, minute,
            },
          });
        } else {
          await scheduleMonthlyIndividual(task, reminderDate, content, day);
        }
      }
      break;
    }

    case "yearly": {
      const month = reminderDate.getMonth() + 1;
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

export async function cancelTaskReminder(taskId: string): Promise<void> {
  const identifiers = [taskId];
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

export async function getAllScheduledReminders(): Promise<Notifications.NotificationRequest[]> {
  return await Notifications.getAllScheduledNotificationsAsync();
}
