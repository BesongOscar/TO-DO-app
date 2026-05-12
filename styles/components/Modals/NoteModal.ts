import { StyleSheet } from "react-native";
import type { Theme } from "../../theme";

export const createNoteModalStyles = (theme: Theme) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.overlay,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: theme.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 34,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.border,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: theme.text,
    textAlign: "center",
    marginBottom: 16,
  },
  inputContainer: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    backgroundColor: theme.surfaceSecondary,
  },
  textInput: {
    fontSize: 16,
    color: theme.text,
    padding: 16,
    minHeight: 120,
  },
  charCount: {
    fontSize: 12,
    color: theme.textMuted,
    textAlign: "right",
    marginTop: 8,
    marginRight: 20,
  },
  buttons: {
    flexDirection: "row",
    marginTop: 20,
    marginHorizontal: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: theme.surfaceSecondary,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.textSecondary,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: theme.primary,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: theme.border,
  },
  saveText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  saveTextDisabled: {
    color: theme.textMuted,
  },
});
