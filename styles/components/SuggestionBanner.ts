import { StyleSheet } from "react-native";
import { fontReg, androidPoppinsExtras } from "../common";
import type { Theme } from "../theme";

export const createSuggestionBannerStyles = (theme: Theme) => StyleSheet.create({
  suggestionsBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff4ce",
    paddingHorizontal: 15,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.surfaceSecondary,
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
    color: theme.text,
    flex: 1,
    fontFamily: fontReg,
    ...androidPoppinsExtras,
  },
  suggestionsCloseButton: {
    padding: 8,
  },
  suggestionsCloseText: {
    fontSize: 20,
    color: theme.textSecondary,
  },
});
