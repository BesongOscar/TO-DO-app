import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  searchHeader: {
    backgroundColor: "#0078d4",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    height: 56,
  },
  searchBackButton: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: "white",
    paddingHorizontal: 12,
  },

  // Header
  topHeader: {
    backgroundColor: "#0078d4",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 0,
    paddingVertical: 5,
    height: 56,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuButton: {
    padding: 8,
    marginRight: 12,
  },
  menuIcon: {
    color: "white",
    fontSize: 18,
  },
  appTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    marginRight: 8,
  },

  // Sidebar
  animatedSidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    zIndex: 10,
  },
  overlay: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 5,
  },
  sidebar: {
    flex: 1,
    width: 280,
    backgroundColor: "#f3f2f1",
    borderRightWidth: 1,
    borderRightColor: "#e1e5e9",
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 8,
    borderRadius: 4,
  },
  sidebarItemSelected: {
    backgroundColor: "#e1f3ff",
  },
  sidebarItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  sidebarIcon: {
    width: 20,
    height: 20,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sidebarIconText: {
    fontSize: 16,
    color: "#323130",
  },
  sidebarItemText: {
    fontSize: 14,
    color: "#323130",
    flex: 1,
  },
  sidebarCount: {
    fontSize: 12,
    color: "#605e5c",
    backgroundColor: "#e1e5e9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 20,
    textAlign: "center",
  },

  // (in Sidebar)
  listsSection: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e1e5e9",
    paddingTop: 8,
  },
  listsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listsSectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#605e5c",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  addListButton: {
    fontSize: 22,
    color: "#0078d4",
    fontWeight: "300",
    lineHeight: 24,
  },

  // Main Layout
  mainContainer: {
    flex: 1,
    flexDirection: "row",
  },
  mainContent: {
    flex: 1,
    backgroundColor: "white",
  },

  // List Header
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f2f1",
  },
  listTitleSection: {
    flex: 1,
  },
  listTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#323130",
    marginBottom: 4,
  },
  listDate: {
    fontSize: 14,
    color: "#605e5c",
  },
  moreOptionsButton: {
    padding: 8,
  },
  moreOptionsIcon: {
    fontSize: 20,
    color: "#605e5c",
    letterSpacing: 1,
  },

  // Suggestions Banner
  suggestionsBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff4ce",
    paddingHorizontal: 15,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f2f1",
  },
  suggestionsLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  suggestionsIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  suggestionsText: {
    fontSize: 14,
    color: "#323130",
    flex: 1,
  },
  suggestionsCloseButton: {
    padding: 8,
  },
  suggestionsCloseText: {
    fontSize: 20,
    color: "#605e5c",
  },

  // Add Task Input
  addTaskContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f2f1",
  },
  addTaskButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#0078d4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  addTaskIcon: {
    fontSize: 12,
    color: "#0078d4",
    fontWeight: "bold",
  },
  addTaskInput: {
    flex: 1,
    fontSize: 16,
    color: "#323130",
    paddingVertical: 0,
  },

  // Tasks List
  tasksContainer: {
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f9fa",
    justifyContent: "space-between",
  },
  taskCheckbox: {
    marginRight: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#0078d4",
    justifyContent: "center",
    alignItems: "center",
  },
  taskCheckboxCompleted: {
    backgroundColor: "#0078d4",
  },
  checkmark: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  taskText: {
    fontSize: 16,
    color: "#323130",
    flex: 1,
  },
  taskTextCompleted: {
    fontSize: 16,
    color: "#8a8886",
    textDecorationLine: "line-through",
    flex: 1,
  },
  starButton: {
    padding: 4,
    marginLeft: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginTop: 16,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },

  // Completed Section
  completedSection: {
    marginTop: 8,
  },
  completedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#f8f9fa",
  },
  completedTitle: {
    fontSize: 14,
    color: "#605e5c",
    fontWeight: "600",
  },

  // Right Panel
  rightPanel: {
    width: 320,
    backgroundColor: "#faf9f8",
    borderLeftWidth: 1,
    borderLeftColor: "#e1e5e9",
    flex: 1,
  },
  taskDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e5e9",
  },
  taskDetailTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#323130",
    flex: 1,
    marginRight: 8,
  },
  taskDetailContent: {
    padding: 20,
    flexGrow: 1,
  },
  taskDetailFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e1e5e9",
  },
  closeDetailPanel: {
    fontSize: 20,
    color: "#605e5c",
    padding: 4,
  },
  createdDate: {
    fontSize: 12,
    color: "#8a8886",
  },

  // Detail Options (Right Panel rows)
  detailOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f2f1",
  },
  detailIcon: {
    fontSize: 18,
    marginRight: 16,
    width: 24,
    textAlign: "center",
  },
  detailText: {
    fontSize: 14,
    color: "#323130",
  },

  // Custom List Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#323130",
  },
  modalCancelText: {
    fontSize: 17,
    color: "#605e5c",
  },
  modalSaveText: {
    fontSize: 17,
    color: "#0078d4",
    fontWeight: "600",
  },
  modalBody: {
    padding: 16,
  },
  listPreview: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginBottom: 20,
  },
  listPreviewIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  listPreviewName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#323130",
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#605e5c",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  listNameInput: {
    borderWidth: 1,
    borderColor: "#e1dfdd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#323130",
    marginBottom: 20,
  },
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    marginHorizontal: -4,
  },
  emojiOption: {
    width: "12.5%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  emojiOptionSelected: {
    backgroundColor: "#e1f3ff",
    borderRadius: 8,
  },
  emojiText: {
    fontSize: 24,
  },
  deleteListButton: {
    backgroundColor: "#d13438",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  deleteListText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default styles;
