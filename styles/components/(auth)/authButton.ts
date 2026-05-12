import { StyleSheet } from "react-native";
import { fontReg, androidPoppinsExtras } from "../../common";
import type { Theme } from "../../theme";

export const createAuthButtonStyles = (_theme: Theme) => StyleSheet.create({
  button: {
    padding: 20,
    borderRadius: 50,
    width: "100%",
    alignItems: "center",
    margin: 5,
    justifyContent: "center",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.65,
    shadowRadius: 3.84,
    elevation: 1,
  },
  buttonText: {
    fontWeight: "500",
    fontSize: 15,
    fontFamily: fontReg,
    ...androidPoppinsExtras,
  },
});
