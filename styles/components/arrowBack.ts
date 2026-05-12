import { StyleSheet } from "react-native";
import type { Theme } from "../theme";

export const createArrowBackStyles = (theme: Theme) => StyleSheet.create({
  ButtonContainer: {
    borderWidth: 1,
    borderColor: theme.border,
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    alignSelf: "flex-start",
  },
});
