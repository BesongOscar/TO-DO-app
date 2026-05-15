import React, { useMemo } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import TaskItem from "./TaskItem";
import { useTheme } from "../context/ThemeContext";
import { useThemeStyles } from "../hooks/useThemeStyles";
import { createPlannedTasksListStyles } from "../styles/components/PlannedTasksList";
import { parseDateString } from "../src/utils/date";
import { Task } from "../types";
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

/**
 * Categorizes a date string relative to today.
 *
 * Returns a human-readable category label ("Overdue", "Today", "Tomorrow",
 * "This Week", "Next Week", "Later") and an `isOverdue` flag used for
 * applying red styling to the section header.
 *
 * Both dates are normalised to midnight so time-of-day doesn't affect
 * the bucket a task lands in.
 */
const getDateCategory = (
  dateStr: string,
): { category: string; isOverdue: boolean } => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskDate = parseDateString(dateStr);
  taskDate.setHours(0, 0, 0, 0);

  const diffTime = taskDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0)  return { category: i18n.t('date.overdue'),   isOverdue: true  };
  if (diffDays === 0) return { category: i18n.t('date.today'),    isOverdue: false };
  if (diffDays === 1) return { category: i18n.t('date.tomorrow'), isOverdue: false };
  if (diffDays <= 7)  return { category: i18n.t('date.this_week'),isOverdue: false };
  if (diffDays <= 14) return { category: i18n.t('date.next_week'),isOverdue: false };
  return              { category: i18n.t('date.later'),           isOverdue: false };
};

/**
 * Groups an array of tasks into dated buckets for the Planned view.
 *
 * Algorithm:
 * 1. Split tasks into pending and completed.
 * 2. For each *pending* task that has a dueDate, determine its bucket via
 *    `getDateCategory`. Overdue tasks go into a dedicated array so they can
 *    be rendered first with red styling.
 * 3. Build the final ordered array using the canonical category order, then
 *    append a single "Completed" group at the end (regardless of due date).
 *
 * Tasks without a dueDate are silently skipped — they shouldn't appear in
 * the Planned view at all.
 */
const groupTasksByDate = (tasks: Task[]): TaskGroup[] => {
  const groups: { [key: string]: Task[] } = {};
  const overdueTasks: Task[] = [];

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  
  pendingTasks.forEach((task) => { // ignore completed tasks in this loop since they all go in the same "Completed" bucket at the end
    if (!task.dueDate) return; // tasks without a due date don't belong here

    const { category, isOverdue } = getDateCategory(task.dueDate);

    if (isOverdue) {
      overdueTasks.push(task);
    } else {
      if (!groups[category]) groups[category] = [];
      groups[category].push(task);
    }
  });

  // Render sections in a meaningful chronological order
  const orderedCategories = [
    i18n.t('date.today'),
    i18n.t('date.tomorrow'),
    i18n.t('date.this_week'),
    i18n.t('date.next_week'),
    i18n.t('date.later'),
  ];

  const result: TaskGroup[] = [];

  // Overdue tasks always appear first so the user can't miss them
  if (overdueTasks.length > 0) {
    result.push({ title: i18n.t('date.overdue'), tasks: overdueTasks, isOverdue: true });
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

  // Completed tasks are always last, grouped together regardless of due date
  if (completedTasks.length > 0) {
    result.push({ title: i18n.t('date.completed'), tasks: completedTasks });
  }

  return result;
};

/**
 * PlannedTasksList
 *
 * Renders tasks that have a due date, organised into dated sections
 * ("Overdue", "Today", "Tomorrow", "This Week", "Next Week", "Later").
 * Completed tasks are shown at the bottom in a single section.
 *
 * Supports pull-to-refresh via the optional `onRefresh` / `refreshing` props.
 */
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
              <Text style={styles.sectionCount}>
                {" "}
                ({group.tasks.length})
              </Text>
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
