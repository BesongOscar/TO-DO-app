/**
 * CompletedSection - Renders the "Completed" task section
 * 
 * Only renders if there are completed tasks. Displays a header
 * with count and a list of completed TaskItems.
 */

import React from "react";
import { View, Text } from "react-native";
import TaskItem from "./TaskItem";
import { taskListStyles as styles } from "../styles/components/TaskList";
import { Task } from "../types";

interface CompletedSectionProps {
  completedTasks: Task[];
  onToggleTask: (taskId: string) => void;
  onSelectTask: (taskId: string) => void;
  onEdit: (taskId: string, newText: string) => void;
  onDelete: (taskId: string) => void;
}

const CompletedSection: React.FC<CompletedSectionProps> = ({
  completedTasks,
  onToggleTask,
  onSelectTask,
  onEdit,
  onDelete,
}) => {
  if (completedTasks.length === 0) return null;

  return (
    <View style={styles.completedSection}>
      {/* Section header */}
      <View style={styles.completedHeader}>
        <Text style={styles.completedTitle}>
          Completed ({completedTasks.length})
        </Text>
      </View>

      {/* Completed task rows */}
      {completedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={() => onToggleTask(task.id)}
          onSelect={() => onSelectTask(task.id)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </View>
  );
};

export default CompletedSection;
