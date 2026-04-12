import { StyleSheet } from "react-native";
import { fontReg, fontBold } from "../common";

export const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 50,
    paddingHorizontal: 15,
    alignItems: "center",
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#0078d4",
    fontFamily: fontBold,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    color: "#666",
    fontFamily: fontReg,
    marginTop: 10,
  },
  image: {
    height: 250,
    width: 200,
    marginBottom: 30,
    marginTop: 50,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
});