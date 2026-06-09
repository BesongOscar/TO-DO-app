import React, { useState, useMemo, useCallback } from "react";
import { View, ActivityIndicator } from "react-native";
import { useThemeStyles } from "../../../src/hooks/useThemeStyles";
import { useTheme } from "../../../context/ThemeContext";
import { createMainContentStyles } from "../../../styles/components/Index/MainContent";
import { useAuth } from "@/context/AuthContext";
import { useDismissibleBanner } from "../../../src/hooks/useDismissibleBanner";
import ListHeader from "./ListHeader";
import ListHeaderMenu from "./ListHeaderMenu";
import { SortBy } from "../../../types";
import SuggestionsBanner from "./SuggestionBanner";
import AddTaskInput from "../../tasks/components/AddTaskInput";
import TasksList from "../../tasks/components/TaskList";
import PlannedTasksList from "../../tasks/components/PlannedTasksList";
import EmptyState from "../../tasks/components/EmptyState";
import { Task, ListItem } from "../../../types";
import { useTranslation } from "react-i18next";
import { filterTasks } from "../../../src/utils/taskFilters";

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
  loading?: boolean;
  onRefresh?: () => void;
  sortBy: SortBy;
  onSortChange: (sortBy: SortBy) => void;
  onEditList?: () => void;
  onDeleteList?: () => void;
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
  refreshing = false,
  onRefresh,
  sortBy,
  onSortChange,
  onEditList,
  onDeleteList,
  loading = false,
}) => {
  const styles = useThemeStyles(createMainContentStyles);
  const { theme } = useTheme();
  const { user } = useAuth();
  const bannerKey = user ? `suggestionBannerDismissed_${user.uid}` : "";
  const { visible: showBanner, dismiss: handleCloseBanner } =
    useDismissibleBanner(bannerKey);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  const filteredTasks = useMemo(
    () => filterTasks(tasks, currentList),
    [tasks, currentList],
  );
  const pendingTasks = useMemo(
    () => filteredTasks.filter((t) => !t.completed),
    [filteredTasks],
  );
  const completedTasks = useMemo(
    () => filteredTasks.filter((t) => t.completed),
    [filteredTasks],
  );

  const handleMarkAllComplete = useCallback(() => {
    pendingTasks.forEach((task) => onToggleTask(task.id));
  }, [pendingTasks, onToggleTask]);

  const handleDeleteCompleted = useCallback(() => {
    completedTasks.forEach((task) => onDelete(task.id));
  }, [completedTasks, onDelete]);

  const hour = new Date().getHours();
  const { t } = useTranslation();
  const greeting =
    hour < 12
      ? t("greeting.morning")
      : hour < 18
        ? t("greeting.afternoon")
        : t("greeting.evening");
  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return (
      <View style={[styles.mainContent, styles.centered]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.mainContent}>
      <ListHeader
        title={currentList.name}
        date={todayDate}
        onMoreOptions={() => setMenuVisible(true)}
      />

      {showBanner === true && (
        <SuggestionsBanner
          message={t("greeting.banner", { greeting })}
          onClose={handleCloseBanner}
        />
      )}

      <AddTaskInput onAddTask={onAddTask} />

      {filteredTasks.length === 0 ? (
        <EmptyState
          title={
            currentList.filterKey === "all" &&
            currentList.name === "Search Results"
              ? t("tasks.no_results")
              : currentList.filterKey === "planned"
                ? t("tasks.no_planned")
                : t("tasks.no_tasks", { listName: currentList.name })
          }
          message={
            currentList.filterKey === "all" &&
            currentList.name === "Search Results"
              ? t("tasks.no_results_hint")
              : currentList.filterKey === "planned"
                ? t("tasks.no_planned_hint")
                : t("tasks.no_tasks_add")
          }
        />
      ) : currentList.filterKey === "planned" && pendingTasks.length === 0 ? (
        <EmptyState
          title={t("tasks.all_planned_completed")}
          message={t("tasks.no_planned_hint")}
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
          onEdit={onEdit}
          onDelete={onDelete}
          onReorderTasks={onReorderTasks}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
      <ListHeaderMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        currentList={currentList}
        sortBy={sortBy}
        onSortChange={onSortChange}
        onMarkAllComplete={handleMarkAllComplete}
        onDeleteCompleted={handleDeleteCompleted}
        onEditList={onEditList}
        onDeleteList={onDeleteList}
        pendingCount={pendingTasks.length}
        completedCount={completedTasks.length}
      />
    </View>
  );
};

export default MainContent;
