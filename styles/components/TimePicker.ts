import { StyleSheet } from "react-native";
import type { Theme } from "../theme";

export const createTimePickerStyles = (_theme: Theme) => StyleSheet.create({
  iosContainer: {
    alignItems: "center",
    marginVertical: 8,
  },
  iosPicker: {
    width: 200,
    height: 180,
  },
});
