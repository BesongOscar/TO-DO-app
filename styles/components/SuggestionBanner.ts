import { StyleSheet } from "react-native";
import { fontReg } from "../common";

export const suggestionBannerStyles = StyleSheet.create({
  suggestionsBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff4ce",
    paddingHorizontal: 15,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f2f1",
  },
  suggestionsLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  suggestionsIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  suggestionsText: {
    fontSize: 14,
    color: "#323130",
    flex: 1,
    fontFamily: fontReg,
  },
  suggestionsCloseButton: {
    padding: 8,
  },
  suggestionsCloseText: {
    fontSize: 20,
    color: "#605e5c",
  },
});
