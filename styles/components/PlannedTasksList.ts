import { StyleSheet } from "react-native";
import { fontReg, fontSemi } from "../common";

export const plannedTasksListStyles = StyleSheet.create({
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
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#323130",
    fontFamily: fontSemi,
  },
  sectionTitleOverdue: {
    color: "#d13438",
  },
  sectionCount: {
    fontSize: 14,
    fontWeight: "400",
    color: "#605e5c",
    fontFamily: fontReg,
  },
  taskWrapper: {
    backgroundColor: "#fff",
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    fontFamily: fontSemi,
  },
});