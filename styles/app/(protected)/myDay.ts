import { StyleSheet } from "react-native";
import type { Theme } from "../../theme";

export const createMyDayStyles = (theme: Theme) => StyleSheet.create({
  container: { flex: 1 },
  searchBar: {
    backgroundColor: theme.headerBackground,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 12,
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
  },
  headerRightRow: {
    marginRight: 10,
    flexDirection: "row",
  },
  headerIcon: {
    marginRight: 16,
  },
});
