import { StyleSheet } from "react-native";
import type { Theme } from "../theme";

export const createAuthLoadingScreenStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.surface,
  },
});
