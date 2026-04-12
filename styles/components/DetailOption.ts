import { StyleSheet } from "react-native";
import { fontReg } from "../common";

export const detailOptionStyles = StyleSheet.create({
  detailOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f2f1",
  },
  detailOptionActive: {
    backgroundColor: "#f0f7ff",
  },
  detailIcon: {
    fontSize: 18,
    marginRight: 16,
    width: 24,
    textAlign: "center",
  },
  detailContent: {
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    color: "#323130",
    fontFamily: fontReg,
  },
  detailTextActive: {
    color: "#0078d4",
    fontWeight: "500",
  },
  detailSubText: {
    fontSize: 12,
    color: "#605e5c",
    marginTop: 2,
    fontFamily: fontReg,
  },
  detailActiveIndicator: {
    fontSize: 16,
    color: "#0078d4",
    marginLeft: 8,
  },
});