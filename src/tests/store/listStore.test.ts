const mockGetLists = jest.fn().mockResolvedValue([]);
const mockSaveLists = jest.fn().mockResolvedValue(undefined);
const mockUpdateList = jest.fn().mockResolvedValue(undefined);

jest.mock("../../repositories/provider", () => ({
  getRepositories: jest.fn(() => ({
    listRepo: {
      getLists: mockGetLists,
      saveLists: mockSaveLists,
      updateList: mockUpdateList,
      migrateFromLocal: jest.fn(),
    },
  })),
}));

let mockCurrentUser: { uid: string } | null = { uid: "test-user" };
jest.mock("../../firebase/config", () => ({
  auth: {
    get currentUser() {
      return mockCurrentUser;
    },
  },
}));

const mockAlert = jest.fn();
jest.mock("react-native", () => ({
  Alert: { alert: mockAlert },
  Platform: { OS: "ios" },
}));

import { useListStore } from "../../store/listStore";

beforeEach(() => {
  useListStore.setState({ customLists: [], loading: true });
  mockGetLists.mockReset().mockResolvedValue([]);
  mockSaveLists.mockReset().mockResolvedValue(undefined);
  mockUpdateList.mockReset().mockResolvedValue(undefined);
  mockAlert.mockClear();
  mockCurrentUser = { uid: "test-user" };
});

describe("listStore", () => {
  describe("fetchLists", () => {
    it("loads lists from repo", async () => {
      mockGetLists.mockResolvedValue([
        { id: "1", name: "Work", icon: "📋", color: "#ff0000" },
      ]);
      await useListStore.getState().fetchLists();
      const state = useListStore.getState();
      expect(state.customLists).toHaveLength(1);
      expect(state.customLists[0].name).toBe("Work");
      expect(state.loading).toBe(false);
    });

    it("sets empty array when repo returns empty", async () => {
      mockGetLists.mockResolvedValue([]);
      await useListStore.getState().fetchLists();
      expect(useListStore.getState().customLists).toEqual([]);
    });

    it("sets empty array when user is null", async () => {
      mockCurrentUser = null;
      await useListStore.getState().fetchLists();
      expect(useListStore.getState().customLists).toEqual([]);
      expect(useListStore.getState().loading).toBe(false);
    });

    it("handles fetch errors gracefully", async () => {
      mockGetLists.mockRejectedValue(new Error("network error"));
      await useListStore.getState().fetchLists();
      expect(useListStore.getState().customLists).toEqual([]);
      expect(useListStore.getState().loading).toBe(false);
    });
  });

  describe("addList", () => {
    it("adds a new list to the top", () => {
      useListStore.setState({ customLists: [] });
      useListStore.getState().addList("Work", "📋", "#ff0000");
      const state = useListStore.getState();
      expect(state.customLists).toHaveLength(1);
      expect(state.customLists[0].name).toBe("Work");
      expect(state.customLists[0].icon).toBe("📋");
    });

    it("trims whitespace from name", () => {
      useListStore.getState().addList("  Personal  ", "📋", "#0078d4");
      expect(useListStore.getState().customLists[0].name).toBe("Personal");
    });

    it("calls saveLists on repo", () => {
      mockSaveLists.mockResolvedValue(undefined);
      useListStore.getState().addList("Test", "📋", "#000");
      expect(mockSaveLists).toHaveBeenCalled();
      const args = mockSaveLists.mock.calls[0];
      expect(args[0]).toBe("test-user");
      expect(args[1]).toHaveLength(1);
      expect(args[1][0].name).toBe("Test");
    });
  });

  describe("updateList", () => {
    it("updates a list in state", () => {
      useListStore.setState({
        customLists: [{ id: "1", name: "Old", icon: "📋", color: "#000" }],
      });
      useListStore.getState().updateList("1", { name: "Updated" });
      expect(useListStore.getState().customLists[0].name).toBe("Updated");
    });

    it("calls updateList on repo", () => {
      mockUpdateList.mockResolvedValue(undefined);
      useListStore.setState({
        customLists: [{ id: "1", name: "Old", icon: "📋", color: "#000" }],
      });
      useListStore.getState().updateList("1", { name: "Updated" });
      expect(mockUpdateList).toHaveBeenCalledWith("test-user", "1", { name: "Updated" });
    });
  });

  describe("deleteList", () => {
    it("removes list from state", () => {
      useListStore.setState({
        customLists: [
          { id: "1", name: "A", icon: "📋", color: "#000" },
          { id: "2", name: "B", icon: "📋", color: "#000" },
        ],
      });
      useListStore.getState().deleteList("1");
      expect(useListStore.getState().customLists).toHaveLength(1);
      expect(useListStore.getState().customLists[0].id).toBe("2");
    });

    it("calls saveLists on repo with remaining lists", () => {
      mockSaveLists.mockResolvedValue(undefined);
      useListStore.setState({
        customLists: [
          { id: "1", name: "A", icon: "📋", color: "#000" },
          { id: "2", name: "B", icon: "📋", color: "#000" },
        ],
      });
      useListStore.getState().deleteList("1");
      expect(mockSaveLists).toHaveBeenCalled();
      const args = mockSaveLists.mock.calls[0];
      expect(args[1]).toHaveLength(1);
      expect(args[1][0].id).toBe("2");
    });
  });
});
