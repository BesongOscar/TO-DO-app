import { renderHook, waitFor, act } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDismissibleBanner } from "../../hooks/useDismissibleBanner";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

let keyCounter = 0;
const uniqueKey = () => `banner-test-key-${++keyCounter}`;

const today = () => new Date().toISOString().slice(0, 10);
const daysAgo = (n: number) =>
  new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);

describe("useDismissibleBanner", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockImplementation(
      () => Promise.resolve(null),
    );
    (AsyncStorage.setItem as jest.Mock).mockImplementation(
      () => Promise.resolve(),
    );
  });

  it("returns visible=null while loading", () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementationOnce(
      () => new Promise(() => {}),
    );
    const { result } = renderHook(() => useDismissibleBanner(uniqueKey()));
    expect(result.current.visible).toBeNull();
  });

  it("shows banner when no stored data", async () => {
    const { result } = renderHook(() => useDismissibleBanner(uniqueKey()));
    await waitFor(
      () => expect(result.current.visible).toBe(true),
      { timeout: 5000 },
    );
  });

  it("hides banner when dismissed today", async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation(
      () => Promise.resolve(
        JSON.stringify({ date: today(), dismissed: true }),
      ),
    );
    const { result } = renderHook(() => useDismissibleBanner(uniqueKey()));
    await waitFor(
      () => expect(result.current.visible).toBe(false),
      { timeout: 5000 },
    );
  });

  it("shows banner when dismissed yesterday (daily reset)", async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation(
      () => Promise.resolve(
        JSON.stringify({ date: daysAgo(1), dismissed: true }),
      ),
    );
    const { result } = renderHook(() => useDismissibleBanner(uniqueKey()));
    await waitFor(
      () => expect(result.current.visible).toBe(true),
      { timeout: 5000 },
    );
  });

  it("dismiss() sets visible to false and persists", async () => {
    const { result } = renderHook(() => useDismissibleBanner(uniqueKey()));
    await waitFor(
      () => expect(result.current.visible).toBe(true),
      { timeout: 5000 },
    );

    act(() => { result.current.dismiss(); });

    await waitFor(
      () => expect(result.current.visible).toBe(false),
      { timeout: 5000 },
    );
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining(today()),
    );
  });

  it("uses cached value on re-render (skips AsyncStorage)", async () => {
    const key = uniqueKey();
    const { result, unmount } = renderHook(() => useDismissibleBanner(key));
    await waitFor(
      () => expect(result.current.visible).toBe(true),
      { timeout: 5000 },
    );
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
    unmount();

    (AsyncStorage.getItem as jest.Mock).mockClear();

    const { result: result2 } = renderHook(() => useDismissibleBanner(key));
    await waitFor(
      () => expect(result2.current.visible).toBe(true),
      { timeout: 5000 },
    );
    expect(AsyncStorage.getItem).not.toHaveBeenCalled();
  });
});
