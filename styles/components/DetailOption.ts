import { StyleSheet } from "react-native";
import { fontReg, androidPoppinsExtras, fontSemi } from "../common";

export const detailOptionStyles = StyleSheet.create({
  detailOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f2f1",
    borderRadius: 6,
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
  detailIconActive: {
    opacity: 0.85,
  },
  detailContent: {
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    color: "#323130",
    fontFamily: fontReg,
    ...androidPoppinsExtras,
  },
  detailTextActive: {
    color: "#0078d4",
    fontFamily: fontSemi,
    ...androidPoppinsExtras,
  },

  detailSubText: {
    fontSize: 12,
    color: "#605e5c",
    marginTop: 2,
    fontFamily: fontReg,
    ...androidPoppinsExtras,
  },
  detailActiveIndicator: {
    fontSize: 16,
    color: "#0078d4",
    marginLeft: 8,
    fontWeight: "600",
    marginTop: -3,
  },
});
