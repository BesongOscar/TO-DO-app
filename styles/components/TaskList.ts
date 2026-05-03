import { StyleSheet } from "react-native";
import { fontSemi, androidPoppinsExtras } from "../common";

export const taskListStyles = StyleSheet.create({
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
    color: "#444",
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
    backgroundColor: "#f8f9fa",
  },
  completedTitle: {
    fontSize: 14,
    color: "#605e5c",
    fontWeight: "600",
    fontFamily: fontSemi,
    ...androidPoppinsExtras,
  },
  dragOverSpacer: {
    height: 4,
    backgroundColor: "#0078d4",
    marginHorizontal: 16,
    borderRadius: 2,
  },
});