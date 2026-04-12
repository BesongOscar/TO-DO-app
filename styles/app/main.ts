import { StyleSheet } from "react-native";
import { fontReg } from "../common";

export const mainStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchHeader: {
    backgroundColor: "#0078d4",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 2,
    height: 56,
  },
  searchBackButton: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: "white",
    paddingHorizontal: 12,
    fontFamily: fontReg,
  },
  mainContainer: {
    flex: 1,
    flexDirection: "row",
  },
  mainContent: {
    flex: 1,
    backgroundColor: "white",
  },
  overlay: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 5,
  },
  animatedSidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    zIndex: 10,
  },
});
