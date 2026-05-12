import { StyleSheet } from "react-native";
import type { Theme } from "../../../theme";

export const createListDetailStyles = (theme: Theme) => StyleSheet.create({
  container: { flex: 1 },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    backgroundColor: theme.headerBackground,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginLeft: 8,
    paddingVertical: 4,
  },
  cancelButton: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginLeft: 12,
  },
  headerRightRow: {
    flexDirection: "row",
  },
  headerIcon: {
    marginRight: 16,
  },
});
