import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TasksProvider } from "../context/TasksContext";
import ErrorBoundary from "../components/ErrorBoundary";
import { AuthProvider } from "../src/context/AuthContext";

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TasksProvider>
          <StatusBar backgroundColor="#0078d4" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)"/>
            <Stack.Screen name="main" />
          </Stack>
        </TasksProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
