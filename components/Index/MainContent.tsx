import React, { useState } from "react";
import { View } from "react-native";
import { mainContentStyles } from "../../styles/components/Index/MainContent";
import ListHeader from "../ListHeader";
import SuggestionsBanner from "../SuggestionBanner";
import AddTaskInput from "../AddTaskInput";
import TasksList from "../TaskList";
import PlannedTasksList from "../PlannedTasksList";
import EmptyState from "../EmptyState";
import { Task, ListItem } from "../../types";

const filterTasks = (tasks: Task[], list: ListItem): Task[] => {
  switch (list.filterKey) {
    case "myDay":
      return tasks.filter((t) => t.myDay);
    case "important":
      return tasks.filter((t) => t.important);
    case "completed":
      return tasks.filter((t) => t.completed);
    case "all":
      return tasks;
    case "planned":
      return tasks.filter((t) => Boolean(t.dueDate));
    case "tasks":
      return tasks.filter((t) => !t.myDay && !t.important);
    case "listId":
      return tasks.filter((t) => t.listId === list.id);
    default:
      return tasks;
  }
};

interface MainContentProps {
  currentList: ListItem;
  tasks: Task[];
  onAddTask: (text: string) => void;
  onToggleTask: (taskId: string) => void;
  onSelectTask: (taskId: string) => void;
  onStarToggle: (taskId: string) => void;
  onEdit: (taskId: string, newText: string) => void;
  onDelete: (taskId: string) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

const MainContent: React.FC<MainContentProps> = ({
  currentList,
  tasks,
  onAddTask,
  onToggleTask,
  onSelectTask,
  onStarToggle,
  onEdit,
  onDelete,
  refreshing = false,
  onRefresh,
}) => {
  const [showBanner, setShowBanner] = useState<boolean>(true);

  const filteredTasks = filterTasks(tasks, currentList);
  const pendingTasks = filteredTasks.filter((t) => !t.completed);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Good morning!"
      : hour < 18
        ? "Good afternoon!"
        : "Good evening!";
  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <View style={mainContentStyles.mainContent}>
      <ListHeader title={currentList.name} date={todayDate} />

      {showBanner && (
        <SuggestionsBanner
          message={`${greeting} Here are your tasks for today.`}
          onClose={() => setShowBanner(false)}
        />
      )}

      <AddTaskInput onAddTask={onAddTask} />

      {filteredTasks.length === 0 ? (
        <EmptyState
          title={
            currentList.filterKey === "all" &&
            currentList.name === "Search Results"
              ? "No results found"
              : currentList.filterKey === "planned"
              ? "No planned tasks"
              : `No tasks in "${currentList.name}"`
          }
          message={
            currentList.filterKey === "all" &&
            currentList.name === "Search Results"
              ? "Try a different search term"
              : currentList.filterKey === "planned"
              ? "Add a due date to your tasks to see them here"
              : "Add a task below to get started"
          }
        />
      ) : currentList.filterKey === "planned" ? (
        <PlannedTasksList
          tasks={filteredTasks}
          onToggleTask={onToggleTask}
          onSelectTask={onSelectTask}
          onStarToggle={onStarToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      ) : (
        <TasksList
          pendingTasks={pendingTasks}
          completedTasks={completedTasks}
          onToggleTask={onToggleTask}
          onSelectTask={onSelectTask}
          onStarToggle={onStarToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
    </View>
  );
};

export default MainContent;
