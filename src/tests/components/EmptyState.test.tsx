import React from "react";
import { render, screen } from "@testing-library/react-native";
import EmptyState from "../../../components/EmptyState";

const mockTheme = {
  background: "#fff", surface: "#fff", surfaceSecondary: "#f0f0f0",
  text: "#000", textSecondary: "#666", textMuted: "#999",
  placeholderTextColor: "#999", border: "#ddd", primary: "#0078d4",
  error: "#d13438", success: "#107c10", headerBackground: "#0078d4",
  tabBarBackground: "#fff", inputBackground: "#f0f0f0", overlay: "rgba(0,0,0,0.4)",
};

jest.mock("../../../context/ThemeContext", () => ({
  useTheme: () => ({ theme: mockTheme }),
}));

describe("EmptyState", () => {
  it("renders the title", () => {
    render(<EmptyState title="No tasks yet" message="Add one to get started" />);
    expect(screen.getByText("No tasks yet")).toBeTruthy();
  });

  it("renders the message", () => {
    render(<EmptyState title="No tasks yet" message="Add one to get started" />);
    expect(screen.getByText("Add one to get started")).toBeTruthy();
  });

  it("renders without crashing", () => {
    const { toJSON } = render(
      <EmptyState title="No tasks yet" message="Add one to get started" />,
    );
    expect(toJSON()).not.toBeNull();
  });

  it("renders different title and message props", () => {
    render(<EmptyState title="All done!" message="You have no pending tasks" />);
    expect(screen.getByText("All done!")).toBeTruthy();
    expect(screen.getByText("You have no pending tasks")).toBeTruthy();
  });
});
