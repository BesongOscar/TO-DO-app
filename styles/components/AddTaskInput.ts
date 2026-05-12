import { StyleSheet } from "react-native";
import { fontReg, androidPoppinsExtras } from "../common";
import type { Theme } from "../theme";

export const createAddTaskInputStyles = (theme: Theme) => StyleSheet.create({
  addTaskContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.surfaceSecondary,
  },
  addTaskButton: {
    width: 25,
    height: 25,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#ffffff",
    justifyContent: "center",
    backgroundColor: theme.primary,
    alignItems: "center",
    marginRight: 5,
  },
  addTaskIcon: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "bold",
  },
  addTaskInput: {
    flex: 1,
    fontSize: 16,
    color: theme.text,
    paddingVertical: 0,
    fontFamily: fontReg,
    ...androidPoppinsExtras,
  },
});
