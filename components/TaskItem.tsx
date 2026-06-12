import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  Modal,
  Pressable,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useThemeStyles } from "../src/hooks/useThemeStyles";
import { useTheme } from "../context/ThemeContext";
import { createTaskItemStyles } from "../styles/components/TaskItem";
import { Task } from "../types";
import { useTranslation } from "react-i18next";
import { isOverdue, formatDueDate } from "../src/utils/taskItemHelpers";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onSelect: () => void;
  onEdit: (taskId: string, newText: string) => void;
  onDelete: (taskId: string) => void;
  isActive?: boolean;
  showDueDate?: boolean;
  gripPanHandlers?: object;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onSelect,
  onEdit,
  onDelete,
  isActive = false,
  showDueDate = true,
  gripPanHandlers,
}) => {
  const styles = useThemeStyles(createTaskItemStyles);
  const { theme } = useTheme();
  const { t } = useTranslation();
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
          <Ionicons name="checkmark" size={20} color={theme.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCancelEdit}
          style={styles.editAction}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={20} color={theme.textMuted} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <View style={[styles.taskItem, isActive && styles.taskItemDragging]}>
        {!task.completed && gripPanHandlers && (
          <View {...gripPanHandlers}>
            <TouchableOpacity
              style={styles.gripIcon}
              activeOpacity={0.6}
              accessibilityLabel={t("tasks.drag_reorder")}
              accessibilityRole="button"
            >
              <Ionicons name="reorder-two" size={20} color={theme.textMuted} />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          testID={`task-text-${task.id}`}
          style={{ flex: 1, paddingLeft: 10 }}
          onPress={onSelect}
          onLongPress={handleLongPress}
          delayLongPress={200}
          activeOpacity={0.7}
          accessibilityLabel={`Task: ${task.text}${task.completed ? `, ${t("tasks.completed").toLowerCase()}` : ""}${task.important ? ", important" : ""}`}
          accessibilityRole="button"
        >
          <View style={{ flex: 1 }}>
            <Text
              testID={`task-title-${task.id}`}
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
                      ? theme.textMuted
                      : isOverdue(task.dueDate)
                        ? theme.error
                        : theme.success
                  }
                />
                <Text
                  style={[
                    styles.dueDateText,
                    isOverdue(task.dueDate) && styles.dueDateTextOverdue,
                    task.completed && styles.dueDateTextCompleted,
                  ]}
                >
                  {formatDueDate(task.dueDate, task.dueTime)}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          testID={`task-checkbox-${task.id}`}
          style={[
            styles.taskCheckbox,
            task.completed && styles.taskCheckboxCompleted,
          ]}
          onPress={onToggle}
          activeOpacity={0.7}
          accessibilityLabel={
            task.completed
              ? t("tasks.mark_incomplete")
              : t("tasks.mark_complete")
          }
          accessibilityRole="checkbox"
        >
          {task.completed && <Text style={styles.checkmark}>✔</Text>}
        </TouchableOpacity>
      </View>

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
                color={theme.text}
                style={styles.menuIcon}
              />
              <Text style={styles.menuItemText}>{t("tasks.edit_task")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleMenuDelete}
              activeOpacity={0.7}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color={theme.error}
                style={styles.menuIcon}
              />
              <Text style={[styles.menuItemText, styles.menuItemDestructive]}>
                {t("tasks.delete_task")}
              </Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setMenuVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={[styles.menuItemText, styles.menuItemCancel]}>
                {t("common.cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default React.memo(TaskItem);
