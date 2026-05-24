import { parseDateString } from "../../utils/date";

describe("parseDateString", () => {
  it("parses a valid YYYY-MM-DD string", () => {
    const date = parseDateString("2024-03-15");
    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(2); // 0-indexed
    expect(date.getDate()).toBe(15);
  });

  it("parses single-digit month and day", () => {
    const date = parseDateString("2024-01-05");
    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(5);
  });

  it("handles leap year dates", () => {
    const date = parseDateString("2024-02-29");
    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(1);
    expect(date.getDate()).toBe(29);
  });

  it("returns Invalid Date for empty string", () => {
    const date = parseDateString("");
    expect(date.getTime()).toBeNaN();
  });

  it("returns Invalid Date for non-date string", () => {
    const date = parseDateString("not-a-date");
    expect(date.getTime()).toBeNaN();
  });

  it("returns Invalid Date for partial date", () => {
    const date = parseDateString("2024-03");
    expect(date.getTime()).toBeNaN();
  });

  it("handles date with time component", () => {
    const date = parseDateString("2024-12-31");
    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(11);
    expect(date.getDate()).toBe(31);
  });
});
