import { createCustomList } from "../../domain/List";

describe("createCustomList", () => {
  beforeAll(() => {
    jest.useFakeTimers({ now: new Date("2024-06-15T12:00:00") });
  });
  afterAll(() => jest.useRealTimers());

  it("creates a list with given parameters", () => {
    const list = createCustomList("Work", "📋", "#ff0000");
    expect(list.name).toBe("Work");
    expect(list.icon).toBe("📋");
    expect(list.color).toBe("#ff0000");
    expect(list.id).toBeTruthy();
    expect(list.createdAt).toBeGreaterThan(0);
  });

  it("trims whitespace from name", () => {
    const list = createCustomList("  Personal  ", "📋", "#0078d4");
    expect(list.name).toBe("Personal");
  });

  it("generates unique IDs", () => {
    const a = createCustomList("a", "📋", "#000");
    const b = createCustomList("b", "📋", "#000");
    expect(a.id).not.toBe(b.id);
  });
});
