import React from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import TaskItem from "./TaskItem";
import { plannedTasksListStyles } from "../styles/components/PlannedTasksList";
import { Task } from "../types";

interface PlannedTasksListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onSelectTask: (taskId: string) => void;
  onStarToggle: (taskId: string) => void;
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

const getDateCategory = (
  dateStr: string,
): { category: string; isOverdue: boolean } => {
  // Categorizes a date string into "Overdue", "Today", "Tomorrow", "This Week", "Next Week", or "Later" based on the current date, also returns an isOverdue flag for styling purposes, normalizes dates to ignore time components for accurate day-based comparisons
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const taskDate = new Date(dateStr);
  taskDate.setHours(0, 0, 0, 0);

  const diffTime = taskDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // CHECK FOR OVERDUE FIRST before anything else
  if (diffDays < 0) return { category: "Overdue", isOverdue: true };
  if (diffDays === 0) return { category: "Today", isOverdue: false };
  if (diffDays === 1) return { category: "Tomorrow", isOverdue: false };
  if (diffDays <= 7) return { category: "This Week", isOverdue: false };
  if (diffDays <= 14) return { category: "Next Week", isOverdue: false };
  return { category: "Later", isOverdue: false }; // fix the last line too
};

const groupTasksByDate = (tasks: Task[]): TaskGroup[] => {
  // Groups tasks into categories based on their due dates for display in the PlannedTasksList, categorizes each task using getDateCategory and organizes them into groups, also separates overdue tasks for special styling, completed tasks are grouped separately at the end regardless of due date, returns an ordered array of TaskGroup objects for rendering
  const groups: { [key: string]: Task[] } = {};
  const overdueTasks: Task[] = [];

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  // pendingTasks.forEach((task) => {
  //   if (!task.dueDate) return;
  //   const { category, isOverdue } = getDateCategory(task.dueDate);

  //   if (isOverdue) {
  //     overdueTasks.push(task);
  //   } else {
  //     if (!groups[category]) groups[category] = [];
  //     groups[category].push(task);
  //   }
  // });

  const orderedCategories = [
    "Overdue",
    "Today",
    "Tomorrow",
    "This Week",
    "Next Week",
    "Later",
  ];
  const result: TaskGroup[] = [];

  if (overdueTasks.length > 0) {
    result.push({ title: "Overdue", tasks: overdueTasks, isOverdue: true });
  }

  orderedCategories.slice(1).forEach((category) => {
    if (groups[category]?.length > 0) {
      result.push({
        title: category,
        tasks: groups[category],
        isOverdue: category === "Overdue",
      });
    }
  });

  if (completedTasks.length > 0) {
    result.push({ title: "Completed", tasks: completedTasks });
  }

  return result;
};

const PlannedTasksList: React.FC<PlannedTasksListProps> = ({
  tasks,
  onToggleTask,
  onSelectTask,
  onStarToggle,
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
      {groups.map((group, groupIndex) => (
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
                onStarToggle={() => onStarToggle(task.id)}
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
