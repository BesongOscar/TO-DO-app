import { StyleSheet } from "react-native";
import { fontReg, fontSemi, androidPoppinsExtras } from "../../common";
import type { Theme } from "../../theme";

export const createBottomPanelStyles = (theme: Theme) => StyleSheet.create({
  bottomPanel: {
    flex: 1,
    backgroundColor: "transparent",
    minHeight: 0,
  },
  taskDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  taskDetailTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.text,
    flex: 1,
    marginRight: 8,
    fontFamily: fontSemi,
    ...androidPoppinsExtras,
  },
  taskDetailContent: {
    flex: 1,
    minHeight: 0,
  },
  taskDetailContentInner: {
    padding: 20,
    flexGrow: 1,
  },
  taskDetailFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  closeDetailPanel: {
    fontSize: 20,
    color: theme.textSecondary,
    padding: 4,
  },
  createdDate: {
    fontSize: 12,
    color: theme.textMuted,
    fontFamily: fontReg,
    ...androidPoppinsExtras,
  },
});
