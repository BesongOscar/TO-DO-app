import { StyleSheet } from "react-native";
import { fontReg, fontSemi } from "../../common";

export const rightPanelStyles = StyleSheet.create({
  rightPanel: {
    width: 320,
    backgroundColor: "#faf9f8",
    borderLeftWidth: 1,
    borderLeftColor: "#e1e5e9",
    flex: 1,
  },
  taskDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e5e9",
  },
  taskDetailTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#323130",
    flex: 1,
    marginRight: 8,
    fontFamily: fontSemi,
  },
  taskDetailContent: {
    padding: 20,
    flexGrow: 1,
  },
  taskDetailFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e1e5e9",
  },
  closeDetailPanel: {
    fontSize: 20,
    color: "#605e5c",
    padding: 4,
  },
  createdDate: {
    fontSize: 12,
    color: "#8a8886",
    fontFamily: fontReg,
  },
});