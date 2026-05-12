import { StyleSheet } from "react-native";
import { fontSemi, androidPoppinsExtras } from "../common";
import type { Theme } from "../theme";

export const createTaskListStyles = (theme: Theme) => StyleSheet.create({
  tasksContainer: {
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginTop: 16,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.textSecondary,
    fontFamily: fontSemi,
    ...androidPoppinsExtras,
  },
  completedSection: {
    marginTop: 8,
  },
  completedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: theme.background,
  },
  completedTitle: {
    fontSize: 14,
    color: theme.textSecondary,
    fontWeight: "600",
    fontFamily: fontSemi,
    ...androidPoppinsExtras,
  },
});
