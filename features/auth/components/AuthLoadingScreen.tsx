import React from "react";
import { View, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useThemeStyles } from "../../../src/hooks/useThemeStyles";
import { useTheme } from "../../../context/ThemeContext";
import { createAuthLoadingScreenStyles } from "../../../styles/components/AuthLoadingScreen";

export const AuthLoadingScreen: React.FC = () => {
  const styles = useThemeStyles(createAuthLoadingScreenStyles);
  const { theme } = useTheme();
  return (
    <>
      <StatusBar style="dark" backgroundColor={theme.surface} />
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    </>
  );
};
