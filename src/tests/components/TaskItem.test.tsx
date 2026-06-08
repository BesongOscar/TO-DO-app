import React from "react";
import { render, fireEvent, screen } from "@testing-library/react-native";
import TaskItem from "../../../components/TaskItem";

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

jest.mock("@expo/vector-icons/Ionicons", () => "Ionicons");

const baseTask = {
  id: "task-1",
  text: "Buy groceries",
  completed: false,
  important: false,
  myDay: false,
};

const baseCallbacks = {
  onToggle: jest.fn(),
  onSelect: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

describe("TaskItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders task text", () => {
    render(<TaskItem task={baseTask} {...baseCallbacks} />);
    expect(screen.getByText("Buy groceries")).toBeTruthy();
  });

  it("calls onToggle when checkbox is pressed", () => {
    render(<TaskItem task={baseTask} {...baseCallbacks} />);
    fireEvent.press(screen.getByLabelText("tasks.mark_complete"));
    expect(baseCallbacks.onToggle).toHaveBeenCalledTimes(1);
  });

  it("calls onSelect when task text is pressed", () => {
    render(<TaskItem task={baseTask} {...baseCallbacks} />);
    fireEvent.press(screen.getByText("Buy groceries"));
    expect(baseCallbacks.onSelect).toHaveBeenCalledTimes(1);
  });

  it("opens context menu on long press", () => {
    render(<TaskItem task={baseTask} {...baseCallbacks} />);
    fireEvent(screen.getByText("Buy groceries"), "onLongPress");
    expect(screen.getByText("tasks.edit_task")).toBeTruthy();
    expect(screen.getByText("tasks.delete_task")).toBeTruthy();
    expect(screen.getByText("common.cancel")).toBeTruthy();
  });

  it("calls onDelete from context menu", () => {
    render(<TaskItem task={baseTask} {...baseCallbacks} />);
    fireEvent(screen.getByText("Buy groceries"), "onLongPress");
    fireEvent.press(screen.getByText("tasks.delete_task"));
    expect(baseCallbacks.onDelete).toHaveBeenCalledWith("task-1");
  });

  it("enters edit mode from context menu", () => {
    render(<TaskItem task={baseTask} {...baseCallbacks} />);
    fireEvent(screen.getByText("Buy groceries"), "onLongPress");
    fireEvent.press(screen.getByText("tasks.edit_task"));
    expect(screen.getByDisplayValue("Buy groceries")).toBeTruthy();
  });

  it("shows due date badge when showDueDate and task has dueDate", () => {
    jest.useFakeTimers({ now: new Date("2024-12-25T10:00:00") });
    const task = { ...baseTask, dueDate: "2024-12-25", dueTime: "14:00" };
    render(<TaskItem task={task} {...baseCallbacks} showDueDate />);
    expect(screen.getByText("Today at 2:00 PM")).toBeTruthy();
    jest.useRealTimers();
  });

  it("does not show due date badge when showDueDate is false", () => {
    const task = { ...baseTask, dueDate: "2024-12-25" };
    render(<TaskItem task={task} {...baseCallbacks} showDueDate={false} />);
    expect(screen.queryByText("Today")).toBeNull();
    expect(screen.queryByText("Tomorrow")).toBeNull();
  });

  it("does not show due date badge when task has no dueDate", () => {
    render(<TaskItem task={baseTask} {...baseCallbacks} showDueDate />);
    expect(screen.queryByText("Today")).toBeNull();
    expect(screen.queryByText("Tomorrow")).toBeNull();
  });

  it("shows drag handle when task is not completed and gripPanHandlers provided", () => {
    render(
      <TaskItem
        task={baseTask}
        {...baseCallbacks}
        gripPanHandlers={{ onStartShouldSetResponder: () => true }}
      />,
    );
    expect(screen.getByLabelText("tasks.drag_reorder")).toBeTruthy();
  });

  it("does not show drag handle when task is completed", () => {
    const completedTask = { ...baseTask, completed: true };
    render(
      <TaskItem
        task={completedTask}
        {...baseCallbacks}
        gripPanHandlers={{ onStartShouldSetResponder: () => true }}
      />,
    );
    expect(screen.queryByLabelText("tasks.drag_reorder")).toBeNull();
  });
});
