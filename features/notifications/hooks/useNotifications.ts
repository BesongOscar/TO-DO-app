import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import {
  setupNotificationChannel,
  requestNotificationPermissions,
} from "../services/notificationService";

export function useNotifications() {
  const router = useRouter();
  const [notificationPermission, setNotificationPermission] =
    useState<boolean>(false);
  const responseListenerRef = useRef<Notifications.Subscription | null>(null);
  const receivedListenerRef = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    let isMounted = true;

    const init = async () => {
      if (Platform.OS === "android") {
        await setupNotificationChannel();
      }
      const granted = await requestNotificationPermissions();
      if (isMounted) setNotificationPermission(granted);

      await cleanupExpiredNotifications();
    };

    init();

    responseListenerRef.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        const taskId = data?.taskId as string | undefined;
        const type = data?.type as string | undefined;
        try {
          if (type === "task_reminder" && taskId) {
            router.push(`/(protected)/main?taskId=${taskId}`);
          }
        } catch (e) {
          console.error("Error handling notification response:", e);
        }
      });

    receivedListenerRef.current = Notifications.addNotificationReceivedListener(
      async (notification) => {
        const data = notification.request.content.data;
        if (data?.type === "task_reminder") {
        }
      },
    );

    return () => {
      isMounted = false;
      responseListenerRef.current?.remove();
      responseListenerRef.current = null;
      receivedListenerRef.current?.remove();
      receivedListenerRef.current = null;
    };
  }, []);

  return { notificationPermission };
}
async function cleanupExpiredNotifications(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notification of scheduled) {
    const id = notification.identifier;
    if (id.includes('-last-') || id.includes('-month-')) {
      const trigger = notification.trigger;
      if (trigger && 'date' in trigger) {
        const d = (trigger as { date: number | Date }).date;
        const ts = typeof d === 'number' ? d : d.getTime();
        if (ts < Date.now()) {
          await Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
        }
      }
    }
  }
}
