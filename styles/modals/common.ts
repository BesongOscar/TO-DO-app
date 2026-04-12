import { StyleSheet } from "react-native";
import { fontReg, fontSemi } from "../common";

export const modalCommonStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
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
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#323130",
    fontFamily: fontSemi,
  },
  modalCancelText: {
    fontSize: 17,
    color: "#605e5c",
    fontFamily: fontReg,
  },
  modalSaveText: {
    fontSize: 17,
    color: "#0078d4",
    fontWeight: "600",
    fontFamily: fontSemi,
  },
  modalBody: {
    padding: 16,
  },
});