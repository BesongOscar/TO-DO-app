import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TasksProvider } from "../context/TasksContext";
import { CustomListsProvider } from "../context/CustomListsContext";
import ErrorBoundary from "../components/ErrorBoundary";
import { AuthProvider } from "../src/context/AuthContext";
import { useFonts } from "@expo-google-fonts/poppins";
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CustomListsProvider>
          <TasksProvider>
            <StatusBar backgroundColor="#0078d4" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="main" />
              <Stack.Screen name="settings" />
            </Stack>
          </TasksProvider>
        </CustomListsProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
