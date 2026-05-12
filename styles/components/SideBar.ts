import { StyleSheet } from "react-native";
import { fontReg, fontSemi, androidPoppinsExtras } from "../common";
import type { Theme } from "../theme";

export const createSideBarStyles = (theme: Theme) => StyleSheet.create({
  sidebar: {
    flex: 1,
    backgroundColor: theme.surfaceSecondary,
    borderRightWidth: 1,
    borderRightColor: theme.border,
    borderRadius: 8,
  },
  sidebarList: {
    flex: 1,
  },
  sidebarContainer: {
    flexGrow: 1,
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
    color: theme.text,
  },
  sidebarItemText: {
    fontSize: 14,
    color: theme.text,
    flex: 1,
    fontFamily: fontReg,
    ...androidPoppinsExtras,
  },
  sidebarCount: {
    fontSize: 12,
    color: theme.textSecondary,
    backgroundColor: theme.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 20,
    textAlign: "center",
    fontFamily: fontReg,
    ...androidPoppinsExtras,
  },
  listsSection: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.border,
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
    color: theme.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: fontSemi,
    ...androidPoppinsExtras,
  },
  addListButton: {
    fontSize: 22,
    color: theme.primary,
    fontWeight: "300",
    lineHeight: 24,
  },
});
