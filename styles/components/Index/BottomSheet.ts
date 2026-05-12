import { StyleSheet, Dimensions } from "react-native";
import type { Theme } from "../../theme";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
export const SHEET_HEIGHT = Math.min(400, SCREEN_HEIGHT * 0.6);

export const createBottomSheetStyles = (theme: Theme) => StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.overlay,
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: theme.surfaceSecondary,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.border,
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
});
