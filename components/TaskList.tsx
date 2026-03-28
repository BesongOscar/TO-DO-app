import React from "react";
import { View, Text, ScrollView } from "react-native";
import TaskItem from "./TaskItem";
import styles from "../styles/styles";
import { Task } from "../types";

interface TasksListProps {
  pendingTasks: Task[];
  completedTasks: Task[];
  onToggleTask: (taskId: string) => void;
  onSelectTask: (taskId: string) => void;
  onStarToggle: (taskId: string) => void;
  onEdit: (taskId: string, newText: string) => void;
  onDelete: (taskId: string) => void;
}

const TasksList: React.FC<TasksListProps> = ({
  pendingTasks,
  completedTasks,
  onToggleTask,
  onSelectTask,
  onStarToggle,
  onEdit,
  onDelete,
}) => {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.tasksContainer}>
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
