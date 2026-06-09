import React, { useMemo } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import TaskItem from "./TaskItem";
import { useTheme } from "../../../context/ThemeContext";
import { useThemeStyles } from "../../../src/hooks/useThemeStyles";
import { createPlannedTasksListStyles } from "../../../styles/components/PlannedTasksList";
import { parseDateString } from "../../../src/utils/date";
import { Task } from "../../../types";
import i18n from "@/src/i18n";

interface PlannedTasksListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onSelectTask: (taskId: string) => void;
  onStarToggle?: (taskId: string) => void;
  onEdit: (taskId: string, newText: string) => void;
  onDelete: (taskId: string) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

interface TaskGroup {
  title: string;
  tasks: Task[];
  isOverdue?: boolean;
}

export const getDateCategory = (
  dateStr: string,
): { category: string; isOverdue: boolean } => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskDate = parseDateString(dateStr);
  taskDate.setHours(0, 0, 0, 0);

  const diffTime = taskDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0)
    return { category: i18n.t("date.overdue"), isOverdue: true };
  if (diffDays === 0)
    return { category: i18n.t("date.today"), isOverdue: false };
  if (diffDays === 1)
    return { category: i18n.t("date.tomorrow"), isOverdue: false };
  if (diffDays <= 7)
    return { category: i18n.t("date.this_week"), isOverdue: false };
  if (diffDays <= 14)
    return { category: i18n.t("date.next_week"), isOverdue: false };
  return { category: i18n.t("date.later"), isOverdue: false };
};

export const groupTasksByDate = (tasks: Task[]): TaskGroup[] => {
  const groups: { [key: string]: Task[] } = {};
  const overdueTasks: Task[] = [];

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  pendingTasks.forEach((task) => {
    if (!task.dueDate) return;

    const { category, isOverdue } = getDateCategory(task.dueDate);

    if (isOverdue) {
      overdueTasks.push(task);
    } else {
      if (!groups[category]) groups[category] = [];
      groups[category].push(task);
    }
  });

  const orderedCategories = [
    i18n.t("date.today"),
    i18n.t("date.tomorrow"),
    i18n.t("date.this_week"),
    i18n.t("date.next_week"),
    i18n.t("date.later"),
  ];

  const result: TaskGroup[] = [];

  if (overdueTasks.length > 0) {
    result.push({
      title: i18n.t("date.overdue"),
      tasks: overdueTasks,
      isOverdue: true,
    });
  }

  orderedCategories.forEach((category) => {
    if (groups[category]?.length > 0) {
      result.push({
        title: category,
        tasks: groups[category],
        isOverdue: false,
      });
    }
  });

  if (completedTasks.length > 0) {
    result.push({ title: i18n.t("date.completed"), tasks: completedTasks });
  }

  return result;
};

const PlannedTasksList: React.FC<PlannedTasksListProps> = ({
  tasks,
  onToggleTask,
  onSelectTask,
  onEdit,
  onDelete,
  refreshing = false,
  onRefresh,
}) => {
  const styles = useThemeStyles(createPlannedTasksListStyles);
  const { theme } = useTheme();
  const groups = useMemo(() => groupTasksByDate(tasks), [tasks]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.container}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        ) : undefined
      }
    >
      {groups.map((group) => (
        <View key={group.title} style={styles.group}>
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                group.isOverdue && styles.sectionTitleOverdue,
              ]}
            >
              {group.title}
              <Text style={styles.sectionCount}> ({group.tasks.length})</Text>
            </Text>
          </View>

          {group.tasks.map((task) => (
            <View key={task.id} style={styles.taskWrapper}>
              <TaskItem
                task={task}
                onToggle={() => onToggleTask(task.id)}
                onSelect={() => onSelectTask(task.id)}
                onEdit={onEdit}
                onDelete={onDelete}
                showDueDate
              />
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

export default PlannedTasksList;
