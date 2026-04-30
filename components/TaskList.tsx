/**
 * TasksList - Scrollable list of TaskItems with pull-to-refresh
 * 
 * Renders pending and completed tasks in a single scrollable view.
 * Completed tasks section is collapsible (only shows if tasks exist).
 */

import React from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import TaskItem from "./TaskItem";
import { taskListStyles as styles } from "../styles/components/TaskList";
import { Task } from "../types";

interface TasksListProps {
  pendingTasks: Task[];
  completedTasks: Task[];
  onToggleTask: (taskId: string) => void;
  onSelectTask: (taskId: string) => void;
  onStarToggle: (taskId: string) => void;
  onEdit: (taskId: string, newText: string) => void;
  onDelete: (taskId: string) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

const TasksList: React.FC<TasksListProps> = ({
  pendingTasks,
  completedTasks,
  onToggleTask,
  onSelectTask,
  onStarToggle,
  onEdit,
  onDelete,
  refreshing = false,
  onRefresh,
}) => {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.tasksContainer}
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
      {pendingTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={() => onToggleTask(task.id)}
          onSelect={() => onSelectTask(task.id)}
          onStarToggle={() => onStarToggle(task.id)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}

      {completedTasks.length > 0 && (
        <View style={styles.completedHeader}>
          <Text style={styles.completedTitle}>
            Completed ({completedTasks.length})
          </Text>
        </View>
      )}

      {completedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={() => onToggleTask(task.id)}
          onSelect={() => onSelectTask(task.id)}
          onStarToggle={() => onStarToggle(task.id)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ScrollView>
  );
};

export default TasksList;
