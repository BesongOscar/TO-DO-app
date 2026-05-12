import { StyleSheet } from "react-native";
import { fontReg, fontSemi, androidPoppinsExtras } from "../common";
import type { Theme } from "../theme";

export const createPlannedTasksListStyles = (theme: Theme) => StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  group: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: theme.surfaceSecondary,
    borderRadius: 4,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.text,
    fontFamily: fontSemi,
    ...androidPoppinsExtras,
  },
  sectionTitleOverdue: {
    color: theme.error,
  },
  sectionCount: {
    fontSize: 14,
    fontWeight: "400",
    color: theme.textSecondary,
    fontFamily: fontReg,
    ...androidPoppinsExtras,
  },
  taskWrapper: {
    backgroundColor: theme.surface,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.textSecondary,
    fontFamily: fontSemi,
    ...androidPoppinsExtras,
  },
});
