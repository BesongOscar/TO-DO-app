import { StyleSheet } from "react-native";
import type { Theme } from "../../theme";
import {
  fontReg,
  fontSemi,
  fontBold,
  androidPoppinsExtras,
} from "../../common";

export const createEmailVerificationStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 25,
    alignItems: "center",
    backgroundColor: theme.background,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    position: "relative",
  },
  iconCircle: {
    backgroundColor: theme.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  image: {
    height: 200,
    width: 200,
  },
  title: {
    fontSize: 27,
    fontWeight: "bold",
    color: theme.text,
    marginBottom: 8,
    fontFamily: fontBold,
    ...androidPoppinsExtras,
  },
  subtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 30,
    fontFamily: fontReg,
    ...androidPoppinsExtras,
  },
  emailHighlight: {
    fontFamily: fontSemi,
    color: theme.text,
    ...androidPoppinsExtras,
  },
  resendRow: {
    marginTop: 28,
    alignItems: "center",
    alignSelf: "center",
  },
  resendText: {
    color: theme.textMuted,
    fontFamily: fontReg,
    ...androidPoppinsExtras,
  },
  resendLink: {
    fontFamily: fontReg,
    color: theme.primary,
    fontWeight: "600",
    ...androidPoppinsExtras,
  },
  otpContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  verifyButton: {
    width: "100%",
    backgroundColor: theme.primary,
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: fontSemi,
    ...androidPoppinsExtras,
  },
  secondaryButton: {
    width: "100%",
    marginTop: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: theme.primary,
    backgroundColor: theme.surface,
  },
  secondaryButtonText: {
    color: theme.primary,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: fontSemi,
    ...androidPoppinsExtras,
  },
  signOutLink: {
    color: theme.textMuted,
    fontSize: 14,
    fontFamily: fontReg,
    textDecorationLine: "underline",
    ...androidPoppinsExtras,
  },
  button: {
    marginTop: 15,
  },
});
