import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  Modal,
  Pressable,
} from "react-native";
import { taskItemStyles } from "../styles/components/TaskItem";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Task } from "../types";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onSelect: () => void;
  onStarToggle: () => void;
  onEdit: (taskId: string, newText: string) => void;
  onDelete: (taskId: string) => void;
  showDueDate?: boolean;
  isOverdue?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onSelect,
  onStarToggle,
  onEdit,
  onDelete,
  showDueDate = false,
  isOverdue = false,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>(task.text);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  const formatDueDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dateStr);
    taskDate.setHours(0, 0, 0, 0);
    
    const diffTime = taskDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays <= 7) return date.toLocaleDateString("en-US", { weekday: "short" });
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Edit handlers
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

  // Context menu (long-press)
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

  // Render: editing mode
  if (isEditing) {
    return (
      <View style={taskItemStyles.taskItem}>
        <TouchableOpacity
          style={[
            taskItemStyles.taskCheckbox,
            task.completed && taskItemStyles.taskCheckboxCompleted,
          ]}
          onPress={onToggle}
          activeOpacity={0.7}
        >
          {task.completed && <Text style={taskItemStyles.checkmark}>✔</Text>}
        </TouchableOpacity>

        <TextInput
          style={taskItemStyles.editInput}
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
          style={taskItemStyles.editAction}
          activeOpacity={0.7}
        >
          <Ionicons name="checkmark" size={20} color="#0078d4" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCancelEdit}
          style={taskItemStyles.editAction}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={20} color="#8a8886" />
        </TouchableOpacity>
      </View>
    );
  }

  // Render: normal mode
  return (
    <>
      <TouchableOpacity
        style={taskItemStyles.taskItem}
        onPress={onSelect}
        onLongPress={handleLongPress}
        delayLongPress={400}
        activeOpacity={0.7}
        accessibilityLabel={`Task: ${task.text}${task.completed ? ", completed" : ""}${task.important ? ", important" : ""}`}
        accessibilityRole="button"
      >
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <TouchableOpacity
            style={[
              taskItemStyles.taskCheckbox,
              task.completed && taskItemStyles.taskCheckboxCompleted,
            ]}
            onPress={onToggle}
            activeOpacity={0.7}
            accessibilityLabel={
              task.completed
                ? "Mark task as incomplete"
                : "Mark task as complete"
            }
            accessibilityRole="checkbox"
          >
            {task.completed && <Text style={taskItemStyles.checkmark}>✔</Text>}
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text
              style={task.completed ? taskItemStyles.taskTextCompleted : taskItemStyles.taskText}
              numberOfLines={2}
            >
              {task.text}
            </Text>
            {showDueDate && task.dueDate && (
              <View style={taskItemStyles.dueDateBadge}>
                <Text
                  style={[
                    taskItemStyles.dueDateText,
                    isOverdue && taskItemStyles.dueDateTextOverdue,
                    task.completed && taskItemStyles.dueDateTextCompleted,
                  ]}
                >
                  {formatDueDate(task.dueDate)}
                </Text>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity
          onPress={onStarToggle}
          style={taskItemStyles.starButton}
          activeOpacity={0.7}
          accessibilityLabel={
            task.important ? "Remove importance" : "Mark as important"
          }
          accessibilityRole="button"
        >
          <Ionicons
            name={task.important ? "star" : "star-outline"}
            size={20}
            color={task.important ? "#FFD700" : "#ccc"}
          />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Long-press context menu */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={taskItemStyles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={taskItemStyles.menuCard}>
            <Text style={taskItemStyles.menuTaskPreview} numberOfLines={1}>
              {task.text}
            </Text>

            <View style={taskItemStyles.menuDivider} />

            <TouchableOpacity
              style={taskItemStyles.menuItem}
              onPress={handleMenuEdit}
              activeOpacity={0.7}
            >
              <Ionicons
                name="pencil-outline"
                size={18}
                color="#323130"
                style={taskItemStyles.menuIcon}
              />
              <Text style={taskItemStyles.menuItemText}>Edit task</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={taskItemStyles.menuItem}
              onPress={handleMenuDelete}
              activeOpacity={0.7}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color="#d13438"
                style={taskItemStyles.menuIcon}
              />
              <Text
                style={[
                  taskItemStyles.menuItemText,
                  taskItemStyles.menuItemDestructive,
                ]}
              >
                Delete task
              </Text>
            </TouchableOpacity>

            <View style={taskItemStyles.menuDivider} />

            <TouchableOpacity
              style={taskItemStyles.menuItem}
              onPress={() => setMenuVisible(false)}
              activeOpacity={0.7}
            >
              <Text
                style={[taskItemStyles.menuItemText, taskItemStyles.menuItemCancel]}
              >
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
