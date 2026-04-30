import { StyleSheet } from "react-native";
import { fontReg, androidPoppinsExtras } from "../common";

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
    width: 25,
    height: 25,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#ffffff",
    justifyContent: "center",
    backgroundColor: "#0078d4",
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
    color: "#323130",
    paddingVertical: 0,
    fontFamily: fontReg,
    ...androidPoppinsExtras,
  },
});
