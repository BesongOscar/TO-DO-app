import { StyleSheet } from "react-native";
import { fontReg, fontSemi } from "../common";

export const sideBarStyles = StyleSheet.create({
  sidebar: {
    flex: 1,
    width: 280,
    backgroundColor: "#f3f2f1",
    borderRightWidth: 1,
    borderRightColor: "#e1e5e9",
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 8,
    borderRadius: 4,
  },
  sidebarItemSelected: {
    backgroundColor: "#e1f3ff",
  },
  sidebarItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  sidebarIcon: {
    width: 20,
    height: 20,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sidebarIconText: {
    fontSize: 16,
    color: "#323130",
  },
  sidebarItemText: {
    fontSize: 14,
    color: "#323130",
    flex: 1,
    fontFamily: fontReg,
  },
  sidebarCount: {
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
  listsSection: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e1e5e9",
    paddingTop: 8,
  },
  listsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listsSectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#605e5c",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: fontSemi,
  },
  addListButton: {
    fontSize: 22,
    color: "#0078d4",
    fontWeight: "300",
    lineHeight: 24,
  },
});
