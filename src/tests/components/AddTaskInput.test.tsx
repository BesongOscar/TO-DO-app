import React from "react";
import { render, fireEvent, screen } from "@testing-library/react-native";
import AddTaskInput from "../../../components/AddTaskInput";

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

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("AddTaskInput", () => {
  it("renders text input and add button", () => {
    render(<AddTaskInput onAddTask={jest.fn()} />);
    expect(screen.getByPlaceholderText("tasks.add_placeholder")).toBeTruthy();
  });

  it("calls onAddTask with trimmed text on button press", () => {
    const onAddTask = jest.fn();
    render(<AddTaskInput onAddTask={onAddTask} />);

    fireEvent.changeText(
      screen.getByPlaceholderText("tasks.add_placeholder"),
      "Buy groceries",
    );
    fireEvent.press(screen.getByText("+"));

    expect(onAddTask).toHaveBeenCalledWith("Buy groceries");
  });

  it("calls onAddTask with trimmed text on submit editing", () => {
    const onAddTask = jest.fn();
    render(<AddTaskInput onAddTask={onAddTask} />);

    fireEvent.changeText(
      screen.getByPlaceholderText("tasks.add_placeholder"),
      "Buy groceries",
    );
    fireEvent(screen.getByPlaceholderText("tasks.add_placeholder"), "onSubmitEditing");

    expect(onAddTask).toHaveBeenCalledWith("Buy groceries");
  });

  it("does not call onAddTask when input is empty", () => {
    const onAddTask = jest.fn();
    render(<AddTaskInput onAddTask={onAddTask} />);

    fireEvent.press(screen.getByText("+"));

    expect(onAddTask).not.toHaveBeenCalled();
  });

  it("does not call onAddTask when input is only whitespace", () => {
    const onAddTask = jest.fn();
    render(<AddTaskInput onAddTask={onAddTask} />);

    fireEvent.changeText(
      screen.getByPlaceholderText("tasks.add_placeholder"),
      "   ",
    );
    fireEvent.press(screen.getByText("+"));

    expect(onAddTask).not.toHaveBeenCalled();
  });

  it("clears input after successful submission", () => {
    const onAddTask = jest.fn();
    render(<AddTaskInput onAddTask={onAddTask} />);

    const input = screen.getByPlaceholderText("tasks.add_placeholder");
    fireEvent.changeText(input, "Buy groceries");
    fireEvent.press(screen.getByText("+"));

    expect(input.props.value).toBe("");
  });
});
