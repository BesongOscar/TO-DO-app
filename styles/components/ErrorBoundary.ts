import { StyleSheet } from "react-native";
import type { Theme } from "../theme";

export const createErrorBoundaryStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.surface,
      padding: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 8,
    },
    message: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center",
      marginBottom: 20,
    },
    button: {
      backgroundColor: theme.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 4,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
  });
