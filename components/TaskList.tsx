/**
 * TasksList - Scrollable list of TaskItems with long-press drag reordering
 *
 * Replaces react-native-draggable-flatlist with a manual implementation
 * using only React Native core + react-native-gesture-handler to avoid
 * the react-native-reanimated New Architecture TurboModule crash.
 *
 * Drag UX:
 * - User long-presses the ☰ grip icon to initiate a drag
 * - The dragged item is visually highlighted (opacity + background)
 * - On release, the item is inserted at the nearest valid position
 * - onReorderTasks is called with the updated order
 */

import React, { useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  PanResponder,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import TaskItem from "./TaskItem";
import { useThemeStyles } from "../hooks/useThemeStyles";
import { useTheme } from "../context/ThemeContext";
import { createTaskListStyles } from "../styles/components/TaskList";
import { Task } from "../types";
import { useTranslation } from "react-i18next";

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ITEM_HEIGHT = 56; // approximate height per task row in px

interface TasksListProps {
  pendingTasks: Task[];
  completedTasks: Task[];
  onToggleTask: (taskId: string) => void;
  onSelectTask: (taskId: string) => void;
  onStarToggle?: (taskId: string) => void;
  onEdit: (taskId: string, newText: string) => void;
  onDelete: (taskId: string) => void;
  onReorderTasks: (reorderedTasks: Task[]) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

interface DraggableTaskItemProps {
  task: Task;
  index: number;
  pendingTasks: Task[];
  draggingIndex: number | null;
  hoverIndex: number | null;
  onReorderTasks: (tasks: Task[]) => void;
  onToggleTask: (id: string) => void;
  onSelectTask: (id: string) => void;
  onStarToggle?: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  setDraggingIndex: (i: number | null) => void;
  setHoverIndex: (i: number | null) => void;
}

const DraggableTaskItem = React.memo<DraggableTaskItemProps>(({
  task, index, pendingTasks, draggingIndex, hoverIndex,
  onReorderTasks, onToggleTask, onSelectTask, onStarToggle, onEdit, onDelete,
  setDraggingIndex, setHoverIndex,
}) => {
  const { theme } = useTheme();
  const indexRef = useRef(index);
  indexRef.current = index;

  const pendingTasksRef = useRef(pendingTasks);
  pendingTasksRef.current = pendingTasks;

  const onReorderTasksRef = useRef(onReorderTasks);
  onReorderTasksRef.current = onReorderTasks;

  const dragStartY = useRef(0);
  const dragHoverIndex = useRef<number | null>(null);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,

        onPanResponderGrant: (evt) => {
          dragStartY.current = evt.nativeEvent.pageY;
          const idx = indexRef.current;
          dragHoverIndex.current = idx;
          setDraggingIndex(idx);
          setHoverIndex(idx);
        },

        onPanResponderMove: (evt) => {
          const dy = evt.nativeEvent.pageY - dragStartY.current;
          const rawTarget = indexRef.current + Math.round(dy / ITEM_HEIGHT);
          const clampedTarget = Math.max(
            0,
            Math.min(pendingTasksRef.current.length - 1, rawTarget),
          );
          dragHoverIndex.current = clampedTarget;
          setHoverIndex(clampedTarget);
        },

        onPanResponderRelease: () => {
          const di = indexRef.current;
          const hi = dragHoverIndex.current;
          if (hi !== null && di !== hi) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            const reordered = [...pendingTasksRef.current];
            const [moved] = reordered.splice(di, 1);
            reordered.splice(hi, 0, moved);
            onReorderTasksRef.current(reordered);
          }
          dragHoverIndex.current = null;
          setDraggingIndex(null);
          setHoverIndex(null);
        },

        onPanResponderTerminate: () => {
          dragHoverIndex.current = null;
          setDraggingIndex(null);
          setHoverIndex(null);
        },
      }),
    [], // created once per component instance
  );

  const isActive = draggingIndex === index;
  const isHoverTarget = hoverIndex === index && draggingIndex !== index;

  return (
    <View
      style={isHoverTarget ? { borderTopWidth: 2, borderTopColor: theme.primary } : undefined}
    >
      <TaskItem
        task={task}
        onToggle={() => onToggleTask(task.id)}
        onSelect={() => onSelectTask(task.id)}
        onEdit={onEdit}
        onDelete={onDelete}
        isActive={isActive}
        gripPanHandlers={panResponder.panHandlers}
      />
    </View>
  );
}, (prev, next) => {
  if (prev.task.id !== next.task.id) return false;
  if (prev.task.text !== next.task.text) return false;
  if (prev.task.completed !== next.task.completed) return false;
  if (prev.task.important !== next.task.important) return false;
  if (prev.task.myDay !== next.task.myDay) return false;
  if (prev.task.dueDate !== next.task.dueDate) return false;
  if (prev.task.listId !== next.task.listId) return false;

  const prevIsActive = prev.draggingIndex === prev.index;
  const nextIsActive = next.draggingIndex === next.index;
  const prevIsHover = prev.hoverIndex === prev.index && prev.draggingIndex !== prev.index;
  const nextIsHover = next.hoverIndex === next.index && next.draggingIndex !== next.index;

  if (prevIsActive !== nextIsActive) return false;
  if (prevIsHover !== nextIsHover) return false;

  if (prev.index !== next.index) return false;

  return true;
});

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
  const styles = useThemeStyles(createTaskListStyles);
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.tasksContainer}
      keyboardShouldPersistTaps="handled"
      // Disable scroll while dragging so pan gesture takes over
      scrollEnabled={draggingIndex === null}
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
      {/* Pending tasks — draggable */}
      {pendingTasks.map((task, index) => (
        <DraggableTaskItem
          key={task.id}
          task={task}
          index={index}
          pendingTasks={pendingTasks}
          draggingIndex={draggingIndex}
          hoverIndex={hoverIndex}
          onReorderTasks={onReorderTasks}
          onToggleTask={onToggleTask}
          onSelectTask={onSelectTask}
          onEdit={onEdit}
          onDelete={onDelete}
          setDraggingIndex={setDraggingIndex}
          setHoverIndex={setHoverIndex}
        />
      ))}

      {/* Completed tasks — static */}
      {completedTasks.length > 0 && (
        <View style={styles.completedHeader}>
          <Text style={styles.completedTitle}>
            {t("tasks.completed_count", { count: completedTasks.length })}
          </Text>
        </View>
      )}

      {completedTasks.map((item) => (
        <TaskItem
          key={item.id}
          task={item}
          onToggle={() => onToggleTask(item.id)}
          onSelect={() => onSelectTask(item.id)}
          onEdit={onEdit}
          onDelete={onDelete}
          isActive={false}
        />
      ))}
    </ScrollView>
  );
};

export default TasksList;
