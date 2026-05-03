/**
 * TasksList - Scrollable list of TaskItems with drag-and-drop reordering for pending tasks
 *
 * Renders pending tasks (draggable via grip icon) and completed tasks (static) in a single scrollable view.
 * Completed tasks section is collapsible (only shows if tasks exist).
 */

import React, { useState } from "react";
import { View, Text, ScrollView, RefreshControl, FlatList } from "react-native";
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
  onReorderTasks: (reorderedTasks: Task[]) => void;
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
  onReorderTasks,
  refreshing = false,
  onRefresh,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
    setDragOverIndex(index);
  };

  const handleDragMove = (fromIndex: number, toIndex: number) => {
    if (toIndex >= 0 && toIndex < pendingTasks.length && toIndex !== dragOverIndex) {
      setDragOverIndex(toIndex);
    }
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const newTasks = [...pendingTasks];
      const [moved] = newTasks.splice(draggedIndex, 1);
      newTasks.splice(dragOverIndex, 0, moved);
      onReorderTasks(newTasks);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const renderTaskItem = ({ item, index }: { item: Task; index: number }) => {
    const isDragOver = dragOverIndex === index && draggedIndex !== index;
    return (
      <View>
        {isDragOver && <View style={styles.dragOverSpacer} />}
        <TaskItem
          task={item}
          onToggle={() => onToggleTask(item.id)}
          onSelect={() => onSelectTask(item.id)}
          onStarToggle={() => onStarToggle(item.id)}
          onEdit={onEdit}
          onDelete={onDelete}
          index={index}
          isActive={draggedIndex === index}
          isDragging={draggedIndex === index}
          onDragStart={() => handleDragStart(index)}
          onDragEnd={handleDragEnd}
          onDragMove={(toIndex: number) => handleDragMove(index, toIndex)}
        />
      </View>
    );
  };

  const renderCompletedTask = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onToggle={() => onToggleTask(item.id)}
      onSelect={() => onSelectTask(item.id)}
      onStarToggle={() => onStarToggle(item.id)}
      onEdit={onEdit}
      onDelete={onDelete}
      isActive={false}
    />
  );

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
      <FlatList
        data={pendingTasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
      {completedTasks.length > 0 && (
        <View style={styles.completedHeader}>
          <Text style={styles.completedTitle}>
            Completed ({completedTasks.length})
          </Text>
        </View>
      )}

      <FlatList
        data={completedTasks}
        renderItem={renderCompletedTask}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

export default TasksList;
