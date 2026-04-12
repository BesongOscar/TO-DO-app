import { StyleSheet } from "react-native";
import { fontReg, fontSemi, fontBold } from "../common";

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    position: "relative",
  },
  iconCircle: {
    backgroundColor: "#0078d4",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  image: {
    height: 200,
    width: 200,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    fontFamily: fontBold,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 30,
    fontFamily: fontReg,
  },
  formContainer: {
    width: "100%",
    marginBottom: 10,
  },
  textInputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: "#333",
    paddingVertical: 0,
    fontFamily: fontReg,
  },
  orText: {
    fontSize: 14,
    color: "#999",
    fontFamily: fontReg,
  },
  linkText: {
    flexDirection: "row",
    marginTop: 30,
    color: "#666",
    fontFamily: fontReg,
  },
  link: {
    color: "#0078d4",
    fontWeight: "600",
    marginLeft: 4,
    fontFamily: fontSemi,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 16,
    fontFamily: fontReg,
  },
});