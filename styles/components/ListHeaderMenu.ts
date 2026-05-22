import { StyleSheet } from "react-native";
import { fontReg, fontSemi, androidPoppinsExtras } from "../common";

export const listHeaderMenuStyles = StyleSheet.create({
    overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    paddingBottom: 20, // safe area bottom
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 16,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#c8c6c4",
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 13,
    color: "#8a8886",
    fontFamily: fontSemi,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginLeft: 20,
    marginTop: 16,
    marginBottom: 4,
    ...androidPoppinsExtras,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  menuIcon: {
    marginRight: 14,
    width: 22,
    textAlign: "center",
  },
  menuItemText: {
    fontSize: 15,
    color: "#323130",
    fontFamily: fontReg,
    flex: 1,
    ...androidPoppinsExtras,
  },
  menuItemDestructive: {
    color: "#d13438",
  },
  checkmark: {
    fontSize: 16,
    color: "#0078d4",
    marginLeft: "auto",
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#f3f2f1",
    marginHorizontal: 20,
    marginVertical: 4,
  },
  cancelButton: {
    paddingVertical: 16,
    marginHorizontal: 20,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f3f2f1",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 15,
    color: "#605e5c",
    fontFamily: fontSemi,
    ...androidPoppinsExtras,
  },
})