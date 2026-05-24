import { renderHook } from "@testing-library/react-native";
import { ThemeProvider } from "../../../context/ThemeContext";
import { useThemeStyles } from "../../hooks/useThemeStyles";
import { lightTheme, darkTheme } from "../../../styles/theme";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

jest.mock("react-native", () => ({
  useColorScheme: () => "light",
  View: "View",
  Text: "Text",
  StyleSheet: { create: (s: unknown) => s },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe("useThemeStyles", () => {
  it("returns result of factory function", () => {
    const factory = jest.fn().mockReturnValue({ container: { flex: 1 } });
    const { result } = renderHook(() => useThemeStyles(factory), { wrapper });
    expect(result.current).toEqual({ container: { flex: 1 } });
  });

  it("passes the current theme to factory", () => {
    const factory = jest.fn().mockReturnValue({});
    renderHook(() => useThemeStyles(factory), { wrapper });
    expect(factory).toHaveBeenCalledWith(lightTheme);
  });

  it("memoizes result across re-renders when theme is stable", () => {
    const factory = jest.fn().mockReturnValue({ container: { flex: 1 } });
    const { result, rerender } = renderHook(
      () => useThemeStyles(factory),
      { wrapper },
    );
    const firstResult = result.current;
    rerender();
    expect(result.current).toBe(firstResult);
    expect(factory).toHaveBeenCalledTimes(1);
  });
});
