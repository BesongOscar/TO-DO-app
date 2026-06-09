import { ListService } from "../../services/ListService";

const mockGetLists = jest.fn();
const mockSaveLists = jest.fn();
const mockUpdateList = jest.fn();
const mockMigrateFromLocal = jest.fn();

const mockListRepo = {
  getLists: mockGetLists,
  saveLists: mockSaveLists,
  updateList: mockUpdateList,
  migrateFromLocal: mockMigrateFromLocal,
};

let service: ListService;

beforeEach(() => {
  jest.clearAllMocks();
  service = new ListService(mockListRepo);
});

describe("ListService", () => {
  describe("fetchLists", () => {
    it("returns lists from repository", async () => {
      const lists = [{ id: "1", name: "Work", icon: "📋", color: "#ff0000" }];
      mockGetLists.mockResolvedValue(lists);
      const result = await service.fetchLists("user1");
      expect(result).toEqual(lists);
      expect(mockGetLists).toHaveBeenCalledWith("user1");
    });
  });

  describe("addList", () => {
    it("creates a list and saves it", async () => {
      jest.useFakeTimers({ now: new Date("2024-06-15T12:00:00") });
      mockSaveLists.mockResolvedValue(undefined);
      const list = await service.addList("user1", "Work", "📋", "#ff0000");
      expect(list.name).toBe("Work");
      expect(list.icon).toBe("📋");
      expect(list.color).toBe("#ff0000");
      expect(mockSaveLists).toHaveBeenCalledWith("user1", [list]);
      jest.useRealTimers();
    });

    it("saves with existing lists when provided", async () => {
      mockSaveLists.mockResolvedValue(undefined);
      const existing = [{ id: "1", name: "Old", icon: "📋", color: "#000" }];
      const list = await service.addList("user1", "New", "📋", "#fff", existing);
      expect(mockSaveLists).toHaveBeenCalledTimes(1);
      const args = mockSaveLists.mock.calls[0];
      expect(args[1]).toHaveLength(2);
      expect(args[1][0].name).toBe("New");
      expect(args[1][1].name).toBe("Old");
    });
  });

  describe("updateList", () => {
    it("calls repo updateList", async () => {
      mockUpdateList.mockResolvedValue(undefined);
      await service.updateList("user1", "1", { name: "Updated" });
      expect(mockUpdateList).toHaveBeenCalledWith("user1", "1", { name: "Updated" });
    });
  });

  describe("deleteList", () => {
    it("filters out the list and saves remaining", async () => {
      mockSaveLists.mockResolvedValue(undefined);
      const existing = [
        { id: "1", name: "A", icon: "📋", color: "#000" },
        { id: "2", name: "B", icon: "📋", color: "#000" },
      ];
      await service.deleteList("user1", "1", existing);
      expect(mockSaveLists).toHaveBeenCalledWith("user1", [{ id: "2", name: "B", icon: "📋", color: "#000" }]);
    });
  });

  describe("saveLists", () => {
    it("calls repo saveLists", async () => {
      mockSaveLists.mockResolvedValue(undefined);
      const lists = [{ id: "1", name: "A", icon: "📋", color: "#000" }];
      await service.saveLists("user1", lists);
      expect(mockSaveLists).toHaveBeenCalledWith("user1", lists);
    });
  });

  describe("migrateFromLocal", () => {
    it("calls repo migrateFromLocal", async () => {
      mockMigrateFromLocal.mockResolvedValue(undefined);
      const lists = [{ id: "1", name: "A", icon: "📋", color: "#000" }];
      await service.migrateFromLocal("user1", lists);
      expect(mockMigrateFromLocal).toHaveBeenCalledWith("user1", lists);
    });
  });
});
