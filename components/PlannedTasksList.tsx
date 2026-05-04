import React from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import TaskItem from "./TaskItem";
import { plannedTasksListStyles } from "../styles/components/PlannedTasksList";
import { Task } from "../types";

interface PlannedTasksListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onSelectTask: (taskId: string) => void;
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

  const taskDate = new Date(dateStr);
  taskDate.setHours(0, 0, 0, 0);

  const diffTime = taskDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { category: "Overdue", isOverdue: true };
  if (diffDays === 0) return { category: "Today", isOverdue: false };
  if (diffDays === 1) return { category: "Tomorrow", isOverdue: false };
  if (diffDays <= 7) return { category: "This Week", isOverdue: false };
  if (diffDays <= 14) return { category: "Next Week", isOverdue: false };
  return { category: "Later", isOverdue: false };
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

  // ── FIX: this loop was accidentally commented out, leaving the Planned
  //         view perpetually empty. It now runs and populates `groups` and
  //         `overdueTasks` correctly.
  pendingTasks.forEach((task) => {
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
    "Today",
    "Tomorrow",
    "This Week",
    "Next Week",
    "Later",
  ];

  const result: TaskGroup[] = [];

  // Overdue tasks always appear first so the user can't miss them
  if (overdueTasks.length > 0) {
    result.push({ title: "Overdue", tasks: overdueTasks, isOverdue: true });
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
    result.push({ title: "Completed", tasks: completedTasks });
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
  const groups = groupTasksByDate(tasks);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={plannedTasksListStyles.container}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0078d4"
          />
        ) : undefined
      }
    >
      {groups.map((group) => (
        <View key={group.title} style={plannedTasksListStyles.group}>
          <View style={plannedTasksListStyles.sectionHeader}>
            <Text
              style={[
                plannedTasksListStyles.sectionTitle,
                group.isOverdue && plannedTasksListStyles.sectionTitleOverdue,
              ]}
            >
              {group.title}
              <Text style={plannedTasksListStyles.sectionCount}>
                {" "}
                ({group.tasks.length})
              </Text>
            </Text>
          </View>

          {group.tasks.map((task) => (
            <View key={task.id} style={plannedTasksListStyles.taskWrapper}>
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
