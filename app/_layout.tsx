import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TasksProvider } from "../context/TasksContext";
import ErrorBoundary from "../components/ErrorBoundary";

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <TasksProvider>
        <StatusBar backgroundColor="#0078d4" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)"/>
          <Stack.Screen name="main" />
        </Stack>
      </TasksProvider>
    </ErrorBoundary>
  );
}
