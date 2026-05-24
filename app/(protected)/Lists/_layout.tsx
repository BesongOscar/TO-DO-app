/**
 * ListsLayout - Stack navigator for Lists screens
 * 
 * Provides the stack navigation between the lists overview
 * (index) and individual list detail ([listId]) screens.
 * Uses theme-aware header styling.
 */

import { Stack } from "expo-router";
import { useTheme } from "../../../context/ThemeContext";

export default function ListsLayout() {
  const { theme } = useTheme();
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{
          headerStyle: { backgroundColor: theme.headerBackground },
          headerTintColor: "#fff",
          headerTitle: "Lists",
          headerTitleStyle: {
            fontFamily: "Poppins-SemiBold",
            fontSize: 24,
          },
        }}
      />
      <Stack.Screen
        name="[listId]"
        options={{
          headerStyle: { backgroundColor: theme.headerBackground },
          headerTintColor: "#fff",
          headerTitle: "",
        }}
      />
    </Stack>
  );
}
