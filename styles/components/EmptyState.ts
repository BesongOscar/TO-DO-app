import { StyleSheet } from "react-native";
import { fontReg, fontSemi, androidPoppinsExtras } from "../common";
import type { Theme } from "../theme";

export const createEmptyStateStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  image: {
    height: 250,
    width: 250,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 8,
    marginTop: 20,
    textAlign: "center",
    fontFamily: fontSemi,
    ...androidPoppinsExtras,
  },
  message: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: "center",
    fontFamily: fontReg,
    ...androidPoppinsExtras,
  },
});
