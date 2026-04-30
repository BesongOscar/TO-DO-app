import { StyleSheet } from "react-native";
import { fontReg, fontSemi, androidPoppinsExtras } from "../../common";

export const headerStyles = StyleSheet.create({
  topHeader: {
    backgroundColor: "#0078d4",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 0,
    paddingVertical: 5,
    height: 60,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuButton: {
    padding: 8,
    marginRight: 12,
  },
  menuIcon: {
    color: "white",
    fontSize: 18,
  },
  appTitle: {
    color: "white",
    fontSize: 20,
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