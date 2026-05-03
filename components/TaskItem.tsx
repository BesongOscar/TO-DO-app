/**
 * TaskItem - Individual task component with inline edit and context menu
 *
 * Displays task text, checkbox, and star (important) toggle. Supports:
 * - Inline editing via double-tap or menu
 * - Long-press context menu for edit/delete
 * - Drag-and-drop via grip icon (☰)
 * - Accessibility labels for screen readers
 */

import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { taskItemStyles as styles } from "../styles/components/TaskItem";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Task } from "../types";

const isOverdue = (dueDateStr: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(dueDateStr);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate < today;
};

const formatDueDate = (dueDateStr: string): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dueDate = new Date(dueDateStr);
  dueDate.setHours(0, 0, 0, 0);

  if (dueDate.getTime() === today.getTime()) {
    return "Today";
  } else if (dueDate.getTime() === tomorrow.getTime()) {
    return "Tomorrow";
  } else {
    return dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
};

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onSelect: () => void;
  onStarToggle: () => void;
  onEdit: (taskId: string, newText: string) => void;
  onDelete: (taskId: string) => void;
  isActive?: boolean;
  showDueDate?: boolean;
  index?: number;
  isDragging?: boolean;
  onDragStart?: (index: number) => void;
  onDragEnd?: () => void;
  onDragMove?: (fromIndex: number, toIndex: number) => void;
  onLayout?: (event: any) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onSelect,
  onStarToggle,
  onEdit,
  onDelete,
  isActive = false,
  showDueDate = true,
  index,
  isDragging = false,
  onDragStart,
  onDragEnd,
  onDragMove,
  onLayout,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>(task.text);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  useEffect(() => {
    setIsEditing(false);
    setMenuVisible(false);
    setEditText(task.text);
  }, [task.id]);

  const handleSaveEdit = (): void => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== task.text) {
      onEdit(task.id, trimmed);
    } else {
      setEditText(task.text);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = (): void => {
    setEditText(task.text);
    setIsEditing(false);
  };

  const handleLongPress = (): void => {
    setMenuVisible(true);
  };

  const handleMenuEdit = (): void => {
    setMenuVisible(false);
    setIsEditing(true);
  };

  const handleMenuDelete = (): void => {
    setMenuVisible(false);
    onDelete(task.id);
  };

  // Drag gesture - detect direction and calculate target index
  const dragGesture = Gesture.Pan()
    .minDistance(10)
    .onBegin(() => {
      if (index !== undefined) {
        onDragStart?.(index);
      }
    })
    .onUpdate((event) => {
      if (index !== undefined && onDragMove) {
        // translationY negative = dragging up, positive = dragging down
        // Calculate how many items to move (assuming ~60px per item)
        const itemHeight = 60;
        const itemsToMove = Math.round(event.translationY / itemHeight);
        const toIndex = index + itemsToMove;
        onDragMove(index, toIndex);
      }
    })
    .onFinalize(() => {
      onDragEnd?.();
    });

  if (isEditing) {
    return (
      <View style={styles.taskItem}>
        <TouchableOpacity
          style={[styles.taskCheckbox, task.completed && styles.taskCheckboxCompleted]}
          onPress={onToggle}
          activeOpacity={0.7}
        >
          {task.completed && <Text style={styles.checkmark}>✔</Text>}
        </TouchableOpacity>
        <TextInput
          style={styles.editInput}
          value={editText}
          onChangeText={setEditText}
          autoFocus
          selectTextOnFocus
          onSubmitEditing={handleSaveEdit}
          returnKeyType="done"
          multiline={false}
        />
        <TouchableOpacity onPress={handleSaveEdit} style={styles.editAction} activeOpacity={0.7}>
          <Ionicons name="checkmark" size={20} color="#0078d4" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCancelEdit} style={styles.editAction} activeOpacity={0.7}>
          <Ionicons name="close" size={20} color="#8a8886" />
        </TouchableOpacity>
      </View>
    );
  }

  const dragOpacity = isDragging ? 0.5 : 1;

  return (
    <>
      <View
        style={[styles.taskItem, { opacity: isActive ? 0.5 : dragOpacity }]}
        onLayout={onLayout}
      >
        {!task.completed && (
          <GestureDetector gesture={dragGesture}>
            <View style={styles.gripIcon}>
              <Ionicons name="reorder-two" size={20} color="#8a8886" />
            </View>
          </GestureDetector>
        )}

        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={onSelect}
          onLongPress={handleLongPress}
          delayLongPress={200}
          activeOpacity={0.7}
          accessibilityLabel={`Task: ${task.text}${task.completed ? ", completed" : ""}${task.important ? ", important" : ""}`}
          accessibilityRole="button"
        >
          <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
            <TouchableOpacity
              style={[styles.taskCheckbox, task.completed && styles.taskCheckboxCompleted]}
              onPress={onToggle}
              activeOpacity={0.7}
              accessibilityLabel={task.completed ? "Mark task as incomplete" : "Mark task as complete"}
              accessibilityRole="checkbox"
            >
              {task.completed && <Text style={styles.checkmark}>✔</Text>}
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
              <Text style={task.completed ? styles.taskTextCompleted : styles.taskText} numberOfLines={2}>
                {task.text}
              </Text>

              {showDueDate && task.dueDate && (
                <View style={styles.dueDateBadge}>
                  <Ionicons
                    name="calendar-outline"
                    size={12}
                    color={
                      task.completed
                        ? "#8a8886"
                        : isOverdue(task.dueDate)
                        ? "#d13438"
                        : "#107c10"
                    }
                  />
                  <Text
                    style={[
                      styles.dueDateText,
                      isOverdue(task.dueDate) && styles.dueDateTextOverdue,
                      task.completed && styles.dueDateTextCompleted,
                    ]}
                  >
                    {formatDueDate(task.dueDate)}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={onStarToggle}
              style={styles.starButton}
              activeOpacity={0.7}
              accessibilityLabel={task.important ? "Remove importance" : "Mark as important"}
              accessibilityRole="button"
            >
              <Ionicons name={task.important ? "star" : "star-outline"} size={20} color={task.important ? "#FFD700" : "#ccc"} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>

      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuCard}>
            <Text style={styles.menuTaskPreview} numberOfLines={1}>{task.text}</Text>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={handleMenuEdit} activeOpacity={0.7}>
              <Ionicons name="pencil-outline" size={18} color="#323130" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Edit task</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleMenuDelete} activeOpacity={0.7}>
              <Ionicons name="trash-outline" size={18} color="#d13438" style={styles.menuIcon} />
              <Text style={[styles.menuItemText, styles.menuItemDestructive]}>Delete task</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)} activeOpacity={0.7}>
              <Text style={[styles.menuItemText, styles.menuItemCancel]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};


export default TaskItem;
