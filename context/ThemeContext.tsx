import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { useUIStore } from "../src/store/uiStore";
import { lightTheme, darkTheme, Theme } from "../styles/theme";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemScheme = useColorScheme();
  const themeMode = useUIStore((s) => s.themeMode);
  const setThemeMode = useUIStore((s) => s.setThemeMode);

  const { isDark, theme } = useMemo(() => {
    const dark =
      themeMode === "dark" ||
      (themeMode === "system" && systemScheme === "dark");
    return { isDark: dark, theme: dark ? darkTheme : lightTheme };
  }, [themeMode, systemScheme]);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, isDark, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};
