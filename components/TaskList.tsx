/**
 * TasksList - Scrollable list of TaskItems with drag-and-drop reordering for pending tasks
 *
 * Renders pending tasks (draggable via grip icon) and completed tasks (static) in a single scrollable view.
 * Completed tasks section is collapsible (only shows if tasks exist).
 */

import React from "react";
import { View, Text, ScrollView, RefreshControl, FlatList } from "react-native";
import TaskItem from "./TaskItem";
import { taskListStyles as styles } from "../styles/components/TaskList";
import { Task } from "../types";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";

interface TasksListProps {
  pendingTasks: Task[];
  completedTasks: Task[];
  onToggleTask: (taskId: string) => void;
  onSelectTask: (taskId: string) => void;
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
  onEdit,
  onDelete,
  onReorderTasks,
  refreshing = false,
  onRefresh,
}) => {
  const renderPendingItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<Task>) => (
    // ScaleDecorator slightly scales up the dragged item so it lifts above
    // its siblings — this is the standard DraggableFlatList UX pattern.
    <ScaleDecorator>
      <TaskItem
        task={item}
        onToggle={() => onToggleTask(item.id)}
        onSelect={() => onSelectTask(item.id)}
        onEdit={onEdit}
        onDelete={onDelete}
        isActive={isActive}
        // TaskItem calls this when the user presses the ☰ grip icon
        onDragStart={drag}
      />
    </ScaleDecorator>
  );

  const renderCompletedTask = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onToggle={() => onToggleTask(item.id)}
      onSelect={() => onSelectTask(item.id)}
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
      <DraggableFlatList
        data={pendingTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderPendingItem}
        onDragEnd={({ data }) => onReorderTasks(data)}
        // Must be false — the outer ScrollView handles vertical scrolling
        scrollEnabled={false}
        // This is the default distance the user must drag before the item lifts and starts dragging.
        activationDistance={5}
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
