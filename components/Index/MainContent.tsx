/**
 * MainContent - Central task list area with filtering
 * 
 * Renders the appropriate list view based on currentList:
 * - "planned" -> PlannedTasksList (grouped by date)
 * - Others -> TasksList (pending + completed sections)
 * Handles task filtering, drag-and-drop reorder, and empty states.
 */

import React, { useState, useEffect } from "react";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mainContentStyles as styles } from "../../styles/components/Index/MainContent";
import { useAuth } from "@/context/AuthContext";
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

const getTodayDateString = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
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
  onReorderTasks: (reorderedTasks: Task[]) => void;
  showReorderControls?: boolean;
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
  onReorderTasks,
  showReorderControls = false,
  refreshing = false,
  onRefresh,
}) => {
  const { user } = useAuth();
  const [showBanner, setShowBanner] = useState<boolean>(true);

  useEffect(() => {
    const loadBannerState = async () => {
      if (!user?.uid) {
        setShowBanner(true);
        return;
      }
      const key = `suggestionBannerDismissed_${user.uid}`;
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        const { date, dismissed } = JSON.parse(stored);
        if (date === getTodayDateString() && dismissed) {
          setShowBanner(false);
        } else {
          setShowBanner(true);
        }
      }
    };
    loadBannerState();
  }, [user?.uid]);

  const handleCloseBanner = async () => {
    setShowBanner(false);
    if (user?.uid) {
      const key = `suggestionBannerDismissed_${user.uid}`;
      await AsyncStorage.setItem(key, JSON.stringify({ date: getTodayDateString(), dismissed: true }));
    }
  };

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
    <View style={styles.mainContent}>
      <ListHeader title={currentList.name} date={todayDate} />

      {showBanner && (
        <SuggestionsBanner
          message={`${greeting} Here are your tasks for today.`}
          onClose={handleCloseBanner}
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
                ? "Set a due date on a task to see it here"
                : "Add a task above to get started"
          }
        />
      ) : currentList.filterKey === "planned" ? (
        <PlannedTasksList
          tasks={filteredTasks}
          onToggleTask={onToggleTask}
          onSelectTask={onSelectTask}
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
          onEdit={onEdit}
          onDelete={onDelete}
          onReorderTasks={onReorderTasks}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
    </View>
  );
};

export default MainContent;
