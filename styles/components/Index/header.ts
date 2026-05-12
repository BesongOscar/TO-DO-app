import { StyleSheet } from "react-native";
import { fontSemi, androidPoppinsExtras } from "../../common";
import type { Theme } from "../../theme";

export const createHeaderStyles = (theme: Theme) => StyleSheet.create({
  topHeader: {
    backgroundColor: theme.headerBackground,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 0,
    paddingVertical: 5,
    height: 65,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuButton: {
    padding: 8,
    marginRight: 12,
    marginLeft: 8,
  },
  menuIcon: {
    color: "white",
    fontSize: 18,
  },
  appTitle: {
    color: "white",
    fontSize: 25,
    fontWeight: "600",
    fontFamily: fontSemi,
    ...androidPoppinsExtras,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    marginRight: 8,
  },
});
