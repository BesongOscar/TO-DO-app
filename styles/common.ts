import { Platform, TextStyle } from "react-native";

export const fontReg = "Poppins-Regular";
export const fontSemi = "Poppins-SemiBold";
export const fontBold = "Poppins-Bold";

/**
 * Android often ignores bundled fonts when `fontWeight` tries to pick a synthetic
 * weight instead of the loaded Poppins file. Spread this last on any style that sets
 * `fontFamily` to one of the Poppins names above.
 */
export const androidPoppinsExtras: TextStyle =
  Platform.OS === "android" ? { fontWeight: "normal" } : {};


