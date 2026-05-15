/**
 * RootLayout - App entry point with providers
 *
 * Wraps app with all context providers and error boundary.
 * Loads Poppins font family before rendering content.
 */
LogBox.ignoreLogs(["Unable to activate keep awake"]);
import { Stack } from "expo-router";
import { TasksProvider } from "../context/TasksContext";
import { CustomListsProvider } from "../context/CustomListsContext";
import ErrorBoundary from "../components/ErrorBoundary";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { View, LogBox } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { configureGoogleSignIn } from "../src/auth/googleAuth";
import { useNotifications } from "../src/notifications/useNotifications";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import AnimatedSplash from "../components/AnimatedSplash";
import { useState } from "react";

// Configure Google Sign-In once at app startup
configureGoogleSignIn();
// Prevent auto-hiding the splash screen until fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": Poppins_400Regular,
    "Poppins-SemiBold": Poppins_600SemiBold,
    "Poppins-Bold": Poppins_700Bold,
  });
  const [splashDone, setSplashDone] = useState(false);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      // Fonts ready — dismiss the native splash
      // Your animated splash (AnimatedSplash) takes over from here
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null; // native splash stays visible
  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      {!splashDone && <AnimatedSplash onFinish={() => setSplashDone(true)} />}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <ErrorBoundary>
            <AuthProvider>
              <CustomListsProvider>
                <TasksProvider>
                  <NotificationsInitializer />
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(protected)" />
                  </Stack>
                </TasksProvider>
              </CustomListsProvider>
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </GestureHandlerRootView>
    </View>
  );
}

function NotificationsInitializer() {
  useNotifications();
  return null;
}
