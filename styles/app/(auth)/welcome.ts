/**
 * Onboarding screen styles.
 * Bold dark-navy theme with vibrant blue accents.
 * Used exclusively by app/(auth)/welcome.tsx.
 */

import { StyleSheet, Dimensions } from "react-native";
import { fontReg, fontBold, androidPoppinsExtras } from "../../common";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0f2e",
    alignItems: "center",
  },

  // ── Skip ──────────────────────────────────────────────────────────────────
  skipButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  skipText: {
    color: "#7a8bbf",
    fontSize: 15,
    fontFamily: fontReg,
    ...androidPoppinsExtras,
  },

  // ── Individual slide ──────────────────────────────────────────────────────
  slide: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 36,
    paddingBottom: 40,
  },

  // Circular backdrop behind the emoji
  emojiContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 48,
    // Soft glow effect
    shadowColor: "#0078d4",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
    elevation: 20,
  },
  emoji: {
    fontSize: 80,
  },

  title: {
    fontSize: 32,
    fontFamily: fontBold,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 40,
    ...androidPoppinsExtras,
  },
  body: {
    fontSize: 16,
    fontFamily: fontReg,
    color: "#7a8bbf",
    textAlign: "center",
    lineHeight: 26,
    ...androidPoppinsExtras,
  },

  // ── Dot indicators ────────────────────────────────────────────────────────
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0078d4",
  },

  // ── Next / Get Started button ─────────────────────────────────────────────
  nextButton: {
    width: SCREEN_WIDTH - 48,
    backgroundColor: "#0078d4",
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 16,
    // Glow under the button
    shadowColor: "#0078d4",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  nextText: {
    color: "#ffffff",
    fontSize: 17,
    fontFamily: fontBold,
    ...androidPoppinsExtras,
  },

  // ── Legacy fields (kept so old imports don't break) ───────────────────────
  // These were in the original welcome.ts; safe to leave or delete if unused.
  image: { height: 250, width: 200 },
  textContainer: { alignItems: "center", marginBottom: 40 },
  buttonContainer: { width: "100%", paddingHorizontal: 20 },
  subtitle: {
    fontSize: 14,
    color: "#7a8bbf",
    fontFamily: fontReg,
    marginTop: 10,
    ...androidPoppinsExtras,
  },
  title_legacy: {
    fontSize: 30,
    fontFamily: fontBold,
    color: "#0078d4",
  },
});