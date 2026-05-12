/**
 * ErrorBoundary - Class component that catches JavaScript errors
 *
 * React error boundary that catches errors in child component tree.
 * Displays fallback UI with retry button instead of crashing the app.
 * Respects the app's ThemeContext for consistent dark/light mode styling.
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ThemeContext } from "../context/ThemeContext";
import { lightTheme } from "../styles/theme";
import type { Theme } from "../styles/theme";
import { createErrorBoundaryStyles } from "../styles/components/ErrorBoundary";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  // Assign contextType so React populates this.context with the ThemeContext value.
  // We type it explicitly here instead of using `declare` (unsupported by Expo's Babel config).
  static contextType = ThemeContext;
  context: React.ContextType<typeof ThemeContext> = undefined;

  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  public render(): ReactNode {
    const theme: Theme = (this.context as React.ContextType<typeof ThemeContext>)?.theme ?? lightTheme;
    const styles = createErrorBoundaryStyles(theme);

    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            {this.state.error?.message || "An unexpected error occurred"}
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.handleReset}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;