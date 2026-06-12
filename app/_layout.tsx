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
import { configureGoogleSignIn } from "../src/services/googleAuth";
import { useNotifications } from "../src/hooks/useNotifications";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import AnimatedSplash from "../components/AnimatedSplash";
import { initI18n } from "@/src/i18n";
import { syncManager } from "../src/services/SyncManager";

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
  const [i18nReady, setI18nReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  // Initialize i18n once on mount
  useEffect(() => {
    initI18n().then(() => setI18nReady(true));
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && i18nReady) {
      // Fonts and i18n ready — dismiss the native splash
      // Your animated splash (AnimatedSplash) takes over from here
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, i18nReady]);

  if (!fontsLoaded || !i18nReady) return null; // native splash stays visible
  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      {!splashDone && <AnimatedSplash onFinish={() => setSplashDone(true)} />}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <ErrorBoundary>
            <AuthProvider>
              <CustomListsProvider>
                <TasksProvider>
                  <SyncInitializer />
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

function SyncInitializer() {
  useEffect(() => {
    const unsubscribe = syncManager.start();
    return () => {
      unsubscribe();
      syncManager.stop();
    };
  }, []);
  return null;
}

function NotificationsInitializer() {
  useNotifications();
  return null;
}
