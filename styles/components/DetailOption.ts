import { StyleSheet } from "react-native";
import { fontReg, fontSemi, androidPoppinsExtras } from "../common";
import type { Theme } from "../theme";

export const createDetailOptionStyles = (theme: Theme) => StyleSheet.create({
  detailOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: theme.surfaceSecondary,
    borderRadius: 6,
  },
  detailOptionActive: {
    backgroundColor: "#f0f7ff",
  },
  detailIcon: {
    fontSize: 18,
    marginRight: 16,
    width: 24,
    textAlign: "center",
  },
  detailIconActive: {
    opacity: 0.85,
  },
  detailContent: {
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 15,
    color: theme.text,
    fontFamily: fontReg,
    ...androidPoppinsExtras,
  },
  detailTextActive: {
    marginLeft:  35,
    color: theme.primary,
    fontFamily: fontSemi,
    ...androidPoppinsExtras,
  },
  detailSubText: {
    fontSize: 12,
    color: theme.textMuted,
    marginTop: 2,
    marginLeft: 20,
    fontFamily: fontReg,
    ...androidPoppinsExtras,
  },
  detailActiveIndicator: {
    fontSize: 16,
    color: theme.primary,
    marginLeft: 8,
    fontWeight: "600",
    marginTop: -3,
  },
});
