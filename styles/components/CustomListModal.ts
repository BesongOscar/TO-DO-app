import { StyleSheet } from "react-native";
import { fontReg, fontSemi, androidPoppinsExtras } from "../common";
import type { Theme } from "../theme";

export const createModalCommonStyles = (theme: Theme) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.overlay,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.surfaceSecondary,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: theme.text,
    fontFamily: fontSemi,
    ...androidPoppinsExtras,
  },
  modalCancelText: {
    fontSize: 17,
    color: theme.textSecondary,
    fontFamily: fontReg,
    ...androidPoppinsExtras,
  },
  modalSaveText: {
    fontSize: 17,
    color: theme.primary,
    fontWeight: "600",
    fontFamily: fontSemi,
    ...androidPoppinsExtras,
  },
  modalBody: {
    padding: 16,
  },
});

export const createCustomListModalStyles = (theme: Theme) => StyleSheet.create({
  listPreview: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: theme.background,
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
    color: theme.text,
    fontFamily: fontSemi,
    ...androidPoppinsExtras,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.textSecondary,
    marginBottom: 8,
    textTransform: "uppercase",
    fontFamily: fontSemi,
    ...androidPoppinsExtras,
  },
  listNameInput: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.text,
    marginBottom: 20,
    fontFamily: fontReg,
    ...androidPoppinsExtras,
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
    backgroundColor: theme.error,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  deleteListText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: fontSemi,
    ...androidPoppinsExtras,
  },
});
