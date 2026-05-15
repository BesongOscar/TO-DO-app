import { StyleSheet } from "react-native";
import type { Theme } from "../../../theme";
import { fontReg, fontSemi, fontBold, androidPoppinsExtras } from "../../../common";


export const createListsIndexStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.surface,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.headerBackground,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: fontSemi,
    ...androidPoppinsExtras,
    color: "#fff",
  },
  list: {
    paddingVertical: 8,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
    fontFamily: fontReg,
    ...androidPoppinsExtras,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 16,
    fontFamily: fontReg,
    ...androidPoppinsExtras,
    color: theme.text,
  },
  countContainer: {
    marginRight: 8,
    minWidth: 24,
    alignItems: "center",
    backgroundColor: theme.border,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  count: {
    fontSize: 14,
    fontFamily: fontReg,
    ...androidPoppinsExtras,
    color: theme.textMuted,
  },
});
