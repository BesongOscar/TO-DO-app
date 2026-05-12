import { StyleSheet } from "react-native";
import { fontReg, androidPoppinsExtras } from "../common";
import type { Theme } from "../theme";

export const createSideBarItemStyles = (theme: Theme) => StyleSheet.create({
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
    color: theme.text,
  },
  itemText: {
    fontSize: 14,
    color: theme.text,
    flex: 1,
    fontFamily: fontReg,
    ...androidPoppinsExtras,
  },
  count: {
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
});
