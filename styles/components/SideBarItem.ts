import { StyleSheet } from "react-native";
import { fontReg } from "../common";

export const sideBarItemStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 8,
    borderRadius: 4,
  },
  selected: {
    backgroundColor: "#e1f3ff",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 20,
    height: 20,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 16,
    color: "#323130",
  },
  itemText: {
    fontSize: 14,
    color: "#323130",
    flex: 1,
    fontFamily: fontReg,
  },
  count: {
    fontSize: 12,
    color: "#605e5c",
    backgroundColor: "#e1e5e9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 20,
    textAlign: "center",
    fontFamily: fontReg,
  },
});