import { StyleSheet } from "react-native";
import type { Theme } from "../../theme";

export const createMainContentStyles = (theme: Theme) => StyleSheet.create({
  mainContent: {
    flex: 1,
    backgroundColor: theme.surface,
  },
});
