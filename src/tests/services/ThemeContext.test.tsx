import React from "react";
import { TouchableOpacity } from "react-native";
import { render, fireEvent, waitFor, screen } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider, useTheme } from "../../../context/ThemeContext";
import { lightTheme, darkTheme } from "../../../styles/theme";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

const mockUseColorScheme = jest.fn(() => "light");

jest.mock("react-native", () => ({
  useColorScheme: () => mockUseColorScheme(),
  View: "View",
  Text: "Text",
  TouchableOpacity: "TouchableOpacity",
  StyleSheet: { create: (s: unknown) => s, flatten: (s: unknown) => s },
}));

interface ThemeContextType {
  theme: typeof lightTheme;
  themeMode: string;
  isDark: boolean;
  setThemeMode: (mode: string) => void;
}

function Consumer({ onRender }: { onRender: (ctx: ThemeContextType) => void }) {
  const ctx = useTheme() as unknown as ThemeContextType;
  React.useEffect(() => { onRender(ctx); }, [ctx, onRender]);
  return null;
}

function Controls() {
  const { setThemeMode } = useTheme() as unknown as ThemeContextType;
  return (
    <>
      <TouchableOpacity testID="set-light" onPress={() => setThemeMode("light")} />
      <TouchableOpacity testID="set-dark" onPress={() => setThemeMode("dark")} />
      <TouchableOpacity testID="set-system" onPress={() => setThemeMode("system")} />
    </>
  );
}

describe("ThemeContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it("provides light theme by default with system=light", () => {
    const onRender = jest.fn();
    render(
      <ThemeProvider>
        <Consumer onRender={onRender} />
      </ThemeProvider>,
    );
    expect(onRender).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: lightTheme,
        themeMode: "system",
        isDark: false,
      }),
    );
  });

  it("setThemeMode('dark') switches to dark theme", async () => {
    const onRender = jest.fn();
    render(
      <ThemeProvider>
        <Consumer onRender={onRender} />
        <Controls />
      </ThemeProvider>,
    );

    fireEvent.press(screen.getByTestId("set-dark"));

    await waitFor(() => {
      expect(onRender).toHaveBeenLastCalledWith(
        expect.objectContaining({
          theme: darkTheme,
          themeMode: "dark",
          isDark: true,
        }),
      );
    });
  });

  it("setThemeMode('light') switches to light theme even when system is dark", () => {
    mockUseColorScheme.mockReturnValue("dark");
    const onRender = jest.fn();
    render(
      <ThemeProvider>
        <Consumer onRender={onRender} />
        <Controls />
      </ThemeProvider>,
    );

    fireEvent.press(screen.getByTestId("set-light"));

    expect(onRender).toHaveBeenLastCalledWith(
      expect.objectContaining({
        theme: lightTheme,
        themeMode: "light",
        isDark: false,
      }),
    );
  });

  it("system mode follows useColorScheme changes", () => {
    const onRender = jest.fn();
    render(
      <ThemeProvider>
        <Consumer onRender={onRender} />
        <Controls />
      </ThemeProvider>,
    );

    fireEvent.press(screen.getByTestId("set-dark"));
    fireEvent.press(screen.getByTestId("set-system"));
    mockUseColorScheme.mockReturnValue("dark");

    expect(onRender).toHaveBeenLastCalledWith(
      expect.objectContaining({
        theme: darkTheme,
        themeMode: "system",
        isDark: true,
      }),
    );
  });

  it("persists theme mode to AsyncStorage on change", () => {
    render(
      <ThemeProvider>
        <Controls />
      </ThemeProvider>,
    );

    fireEvent.press(screen.getByTestId("set-dark"));

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "app_theme_mode",
      JSON.stringify({ state: { themeMode: "dark" }, version: 0 }),
    );
  });

  it("loads saved preference from AsyncStorage on mount", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ state: { themeMode: "dark" }, version: 0 }),
    );
    const onRender = jest.fn();
    render(
      <ThemeProvider>
        <Consumer onRender={onRender} />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(onRender).toHaveBeenLastCalledWith(
        expect.objectContaining({ themeMode: "dark" }),
      );
    });
  });

  it("useTheme() throws when used outside ThemeProvider", () => {
    function BadComponent() {
      useTheme();
      return null;
    }

    try {
      render(<BadComponent />);
    } catch (e: unknown) {
      expect((e as Error).message).toBe(
        "useTheme must be used inside ThemeProvider",
      );
    }
  });
});
