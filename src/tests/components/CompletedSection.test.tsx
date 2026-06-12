import React from "react";
import { render, screen } from "@testing-library/react-native";
import CompletedSection from "../../../components/CompletedSection";
import { Task } from "../../../types";

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
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) =>
      key === "tasks.completed_count" ? `Completed (${options?.count})` : key,
  }),
}));

jest.mock("../../../components/TaskItem", () => {
  const { View, Text } = jest.requireActual("react-native");
  const MockTaskItem = ({ task }: { task: Task }) => (
    <View><Text>{task.text}</Text></View>
  );
  MockTaskItem.displayName = "MockTaskItem";
  return MockTaskItem;
});

const baseCallbacks = {
  onToggleTask: jest.fn(),
  onSelectTask: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: "t1",
  text: "Completed task",
  completed: true,
  important: false,
  myDay: false,
  ...overrides,
});

describe("CompletedSection", () => {
  it("returns null when completedTasks is empty", () => {
    const { toJSON } = render(
      <CompletedSection completedTasks={[]} {...baseCallbacks} />,
    );
    expect(toJSON()).toBeNull();
  });

  it("renders header with completed count", () => {
    const tasks = [makeTask()];
    render(<CompletedSection completedTasks={tasks} {...baseCallbacks} />);
    expect(screen.getByText("Completed (1)")).toBeTruthy();
  });

  it("renders a TaskItem for each completed task", () => {
    const tasks = [
      makeTask({ id: "t1", text: "Task one" }),
      makeTask({ id: "t2", text: "Task two" }),
    ];
    render(<CompletedSection completedTasks={tasks} {...baseCallbacks} />);
    expect(screen.getByText("Task one")).toBeTruthy();
    expect(screen.getByText("Task two")).toBeTruthy();
  });

  it("renders correct count for multiple tasks", () => {
    const tasks = [
      makeTask({ id: "t1" }),
      makeTask({ id: "t2" }),
      makeTask({ id: "t3" }),
    ];
    render(<CompletedSection completedTasks={tasks} {...baseCallbacks} />);
    expect(screen.getByText("Completed (3)")).toBeTruthy();
  });
});
