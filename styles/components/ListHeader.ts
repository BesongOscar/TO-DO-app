import { StyleSheet } from "react-native";
import { fontReg, fontBold, androidPoppinsExtras } from "../common";
import type { Theme } from "../theme";

export const createListHeaderStyles = (theme: Theme) => StyleSheet.create({
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.surfaceSecondary,
  },
  listTitleSection: {
    flex: 1,
  },
  listTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.text,
    marginBottom: 4,
    fontFamily: fontBold,
    ...androidPoppinsExtras,
  },
  listDate: {
    fontSize: 14,
    color: theme.textSecondary,
    fontFamily: fontReg,
    ...androidPoppinsExtras,
  },
});
