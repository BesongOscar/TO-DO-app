import { StyleSheet } from "react-native";
import type { Theme } from "../../theme";

export const createOTPInputStyles = (theme: Theme) => StyleSheet.create({
  OTPcontainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 25,
  },
  OTPinput: {
    borderWidth: 1.1,
    borderColor: theme.border,
    width: 70,
    height: 70,
    marginHorizontal: 5,
    textAlign: "center",
    fontSize: 20,
    borderRadius: 30,
  },
});
