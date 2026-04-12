import { StyleSheet } from "react-native";
import { fontReg, fontSemi, fontBold } from "../common";

export const listHeaderStyles = StyleSheet.create({
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f2f1",
  },
  listTitleSection: {
    flex: 1,
  },
  listTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#323130",
    marginBottom: 4,
    fontFamily: fontBold,
  },
  listDate: {
    fontSize: 14,
    color: "#605e5c",
    fontFamily: fontReg,
  },
  moreOptionsButton: {
    padding: 8,
  },
  moreOptionsIcon: {
    fontSize: 20,
    color: "#605e5c",
    letterSpacing: 1,
  },
});
