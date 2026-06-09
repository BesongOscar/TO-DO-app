import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, darkTheme, Theme } from "../../styles/theme";

type ThemeMode = "light" | "dark" | "system";

interface UIState {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  theme: Theme;
  isDark: boolean;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      themeMode: "system",

      setThemeMode: (mode: ThemeMode) => {
        set({ themeMode: mode });
      },

      get theme(): Theme {
        const { themeMode } = get();
        return themeMode === "dark" || false ? darkTheme : lightTheme;
      },

      get isDark(): boolean {
        const { themeMode } = get();
        return themeMode === "dark";
      },
    }),
    {
      name: "app_theme_mode",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ themeMode: state.themeMode }),
    },
  ),
);
