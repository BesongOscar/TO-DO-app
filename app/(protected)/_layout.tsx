/**
 * ProtectedLayout - Tab navigator for authenticated users
 * 
 * Bottom tabs: My Day, Lists, Planned, Profile.
 * Includes a shared BottomSheet for task details accessible from any tab.
 * Redirects unauthenticated/unverified users to auth screens.
 */

import { Redirect, Tabs } from "expo-router";
import { View, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@/context/AuthContext";
import { AuthLoadingScreen } from "../../components/AuthLoadingScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTasks } from "../../context/TasksContext";
import { useTheme } from "../../context/ThemeContext";
import BottomSheet from "../../components/Index/BottomSheet";
import BottomPanel from "../../components/Index/BottomPanel";
import { fontSemi, androidPoppinsExtras } from "@/styles/common";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProtectedLayout() {
  const insets = useSafeAreaInsets();
  const { user, loading } = useAuth();
  const { tasks, updateTask, selectedTaskId, setSelectedTaskId } = useTasks();
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null;

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (!user.emailVerified) {
    return <Redirect href="/emailVerification" />;
  }

  return (
    <>
      <StatusBar
        style={isDark ? "light" : "dark"}
        backgroundColor={theme.headerBackground}
      />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.tabBarBackground,
            borderTopWidth: 1,
            borderTopColor: theme.border,
            paddingBottom: 20,
          },
        }}
      >
        <Tabs.Screen
          name="myDay"
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: theme.headerBackground,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleStyle: {
              fontSize: 24,
              fontFamily: fontSemi,
              color: "#fff",
              ...androidPoppinsExtras,
            },
            tabBarLabel: t("navigation.my_day"),
            tabBarLabelStyle: {
              fontSize: 12,
              fontFamily: fontSemi,
              marginTop: 2,
            },
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "sunny" : "sunny-outline"}
                size={30}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Lists"
          options={{
            headerShown: false,
            tabBarLabel: t("navigation.lists"),
            tabBarLabelStyle: {
              fontSize: 12,
              fontFamily: fontSemi,
              marginTop: 2,
            },
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "list" : "list-outline"}
                size={30}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Planned"
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: theme.headerBackground,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleStyle: {
              fontSize: 24,
              fontFamily: fontSemi,
              color: "#fff",
              ...androidPoppinsExtras,
            },
            tabBarLabel: t("navigation.planned"),
            tabBarLabelStyle: {
              fontSize: 12,
              fontFamily: fontSemi,
              ...androidPoppinsExtras,
              marginTop: 2,
            },
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "calendar" : "calendar-outline"}
                size={30}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            tabBarLabel: t("navigation.profile"),
            tabBarLabelStyle: {
              fontSize: 12,
              fontFamily: fontSemi,
              ...androidPoppinsExtras,
              marginTop: 2,
            },
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={30}
                color={color}
              />
            ),
          }}
        />
      </Tabs>

      <BottomSheet
        visible={selectedTask != null}
        onClose={() => setSelectedTaskId(null)}
      >
        {selectedTask && (
          <BottomPanel
            selectedTask={selectedTask}
            onClose={() => setSelectedTaskId(null)}
            onUpdateTask={updateTask}
          />
        )}
      </BottomSheet>
    </>
  );
}
