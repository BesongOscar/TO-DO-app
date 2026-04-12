import { StyleSheet } from "react-native";
import { fontReg, fontSemi, fontBold } from "../common";

export const customListModalStyles = StyleSheet.create({
  listPreview: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginBottom: 20,
  },
  listPreviewIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  listPreviewName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#323130",
    fontFamily: fontSemi,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#605e5c",
    marginBottom: 8,
    textTransform: "uppercase",
    fontFamily: fontSemi,
  },
  listNameInput: {
    borderWidth: 1,
    borderColor: "#e1dfdd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#323130",
    marginBottom: 20,
    fontFamily: fontReg,
  },
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    marginHorizontal: -4,
  },
  emojiOption: {
    width: "12.5%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  emojiOptionSelected: {
    backgroundColor: "#e1f3ff",
    borderRadius: 8,
  },
  emojiText: {
    fontSize: 24,
  },
  deleteListButton: {
    backgroundColor: "#d13438",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  deleteListText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: fontSemi,
  },
});