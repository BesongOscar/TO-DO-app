/**
 * useThemeStyles - Creates memoized StyleSheets from theme
 * 
 * Accepts a factory function that receives the current Theme object
 * and returns a StyleSheet.NamedStyles. The result is memoized and
 * recalculated only when the theme changes.
 */

import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import type { Theme } from '../../styles/theme';

export function useThemeStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (theme: Theme) => T
): T {
  const { theme } = useTheme();
  return useMemo(() => factory(theme), [theme]);
}
