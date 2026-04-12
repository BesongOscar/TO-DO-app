import { StyleSheet } from "react-native";
import { fontReg } from "../common";

export const addTaskInputStyles = StyleSheet.create({
  addTaskContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f2f1",
  },
  addTaskButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#0078d4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  addTaskIcon: {
    fontSize: 12,
    color: "#0078d4",
    fontWeight: "bold",
  },
  addTaskInput: {
    flex: 1,
    fontSize: 16,
    color: "#323130",
    paddingVertical: 0,
    fontFamily: fontReg,
  },
});
