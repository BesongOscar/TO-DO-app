import { StyleSheet } from "react-native";
import { fontReg, fontSemi } from "../common";

export const emptyStateStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  image: {
    height: 250,
    width: 250,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#323130",
    marginBottom: 8,
    marginTop: 20,
    textAlign: "center",
    fontFamily: fontSemi,
  },
  message: {
    fontSize: 14,
    color: "#605e5c",
    textAlign: "center",
    fontFamily: fontReg,
  },
});
