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
} from "react-native";
import { taskItemStyles as styles } from "../styles/components/TaskItem";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Task } from "../types";

// Helper to determine if a task is overdue (due date before today)
const isOverdue = (dueDateStr: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(dueDateStr);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate < today;
};

// Reusable date formatting for due date badges
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
    return dueDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
};

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onSelect: () => void;
  onEdit: (taskId: string, newText: string) => void;
  onDelete: (taskId: string) => void;
  isActive?: boolean;
  showDueDate?: boolean;
  onDragStart?: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onSelect,
  onEdit,
  onDelete,
  isActive = false,
  showDueDate = true,
  onDragStart,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>(task.text);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  // Reset edit state when task changes (e.g. after saving or when a different task is selected)
  useEffect(() => {
    setIsEditing(false);
    setMenuVisible(false);
    setEditText(task.text);
  }, [task.id]);

  // Optional: track if the item is currently being dragged (for styling)
  const handleSaveEdit = (): void => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== task.text) {
      onEdit(task.id, trimmed);
    } else {
      setEditText(task.text);
    }
    setIsEditing(false);
  };

  // Canceling edit reverts text and exits edit mode
  const handleCancelEdit = (): void => {
    setEditText(task.text);
    setIsEditing(false);
  };

  // Long-press opens context menu with Edit/Delete options
  const handleLongPress = (): void => {
    setMenuVisible(true);
  };

  // Menu option handlers
  const handleMenuEdit = (): void => {
    setMenuVisible(false);
    setIsEditing(true);
  };

  // Deletes the task after confirming from the menu
  const handleMenuDelete = (): void => {
    setMenuVisible(false);
    onDelete(task.id);
  };

  if (isEditing) {
    return (
      <View style={styles.taskItem}>
        <TouchableOpacity
          style={[
            styles.taskCheckbox,
            task.completed && styles.taskCheckboxCompleted,
          ]}
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
        <TouchableOpacity
          onPress={handleSaveEdit}
          style={styles.editAction}
          activeOpacity={0.7}
        >
          <Ionicons name="checkmark" size={20} color="#0078d4" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCancelEdit}
          style={styles.editAction}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={20} color="#8a8886" />
        </TouchableOpacity>
      </View>
    );
  }

  // Normal Display Mode
  return (
    <>
      <View style={[styles.taskItem, isActive && styles.taskItemDragging]}>
        {/* Drag Handle */}
        {!task.completed && onDragStart && (
          <TouchableOpacity
            style={styles.gripIcon}
            onPressIn={() => onDragStart?.()}
            activeOpacity={0.6}
            accessibilityLabel="Drag to reorder"
            accessibilityRole="button"
          >
            <Ionicons name="reorder-two" size={20} color="#c8c6c4" />
          </TouchableOpacity>
        )}

        {/* Task Text */}
        <TouchableOpacity
          style={{ flex: 1, paddingLeft: 10 }}
          onPress={onSelect}
          onLongPress={handleLongPress}
          delayLongPress={200}
          activeOpacity={0.7}
          accessibilityLabel={`Task: ${task.text}${task.completed ? ", completed" : ""}${task.important ? ", important" : ""}`}
          accessibilityRole="button"
        >
          <View style={{ flex: 1 }}>
            <Text
              style={
                task.completed ? styles.taskTextCompleted : styles.taskText
              }
              numberOfLines={2}
            >
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
        </TouchableOpacity>

        {/* Task Checkbox */}
        <TouchableOpacity
          style={[
            styles.taskCheckbox,
            task.completed && styles.taskCheckboxCompleted,
          ]}
          onPress={onToggle}
          activeOpacity={0.7}
          accessibilityLabel={
            task.completed ? "Mark task as incomplete" : "Mark task as complete"
          }
          accessibilityRole="checkbox"
        >
          {task.completed && <Text style={styles.checkmark}>✔</Text>}
        </TouchableOpacity>
      </View>

      {/* Context Menu */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuCard}>
            <Text style={styles.menuTaskPreview} numberOfLines={1}>
              {task.text}
            </Text>
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleMenuEdit}
              activeOpacity={0.7}
            >
              <Ionicons
                name="pencil-outline"
                size={18}
                color="#323130"
                style={styles.menuIcon}
              />
              <Text style={styles.menuItemText}>Edit task</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleMenuDelete}
              activeOpacity={0.7}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color="#d13438"
                style={styles.menuIcon}
              />
              <Text style={[styles.menuItemText, styles.menuItemDestructive]}>
                Delete task
              </Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setMenuVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={[styles.menuItemText, styles.menuItemCancel]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default TaskItem;
