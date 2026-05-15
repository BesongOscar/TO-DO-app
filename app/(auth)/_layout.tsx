import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function AuthLayout() {
  const { user, loading } = useAuth();
  const { theme, isDark } = useTheme();

  if (loading) return null;

  if (user && user.emailVerified) {
    return <Redirect href="/(protected)/myDay" />;
  }

  return (
    <>
      <StatusBar
        style={isDark ? "light" : "dark"}
        backgroundColor={theme.background}
      />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="login" />
        <Stack.Screen name="forgotPassword" />
        <Stack.Screen name="emailVerification" />
      </Stack>
    </>
  );
}
