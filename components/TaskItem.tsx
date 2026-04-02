import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";
import styles from "../styles/styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Task } from "../types";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onSelect: () => void;
  onStarToggle: () => void;
  onEdit: (taskId: string, newText: string) => void;
  onDelete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onSelect,
  onStarToggle,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>(task.text);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

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
          style={localStyles.editInput}
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
          style={localStyles.editAction}
          activeOpacity={0.7}
        >
          <Ionicons name="checkmark" size={20} color="#0078d4" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCancelEdit}
          style={localStyles.editAction}
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
        style={styles.taskItem}
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
              styles.taskCheckbox,
              task.completed && styles.taskCheckboxCompleted,
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
            {task.completed && <Text style={styles.checkmark}>✔</Text>}
          </TouchableOpacity>

          <Text
            style={task.completed ? styles.taskTextCompleted : styles.taskText}
            numberOfLines={2}
          >
            {task.text}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onStarToggle}
          style={styles.starButton}
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
          style={localStyles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={localStyles.menuCard}>
            <Text style={localStyles.menuTaskPreview} numberOfLines={1}>
              {task.text}
            </Text>

            <View style={localStyles.menuDivider} />

            <TouchableOpacity
              style={localStyles.menuItem}
              onPress={handleMenuEdit}
              activeOpacity={0.7}
            >
              <Ionicons
                name="pencil-outline"
                size={18}
                color="#323130"
                style={localStyles.menuIcon}
              />
              <Text style={localStyles.menuItemText}>Edit task</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={localStyles.menuItem}
              onPress={handleMenuDelete}
              activeOpacity={0.7}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color="#d13438"
                style={localStyles.menuIcon}
              />
              <Text
                style={[
                  localStyles.menuItemText,
                  localStyles.menuItemDestructive,
                ]}
              >
                Delete task
              </Text>
            </TouchableOpacity>

            <View style={localStyles.menuDivider} />

            <TouchableOpacity
              style={localStyles.menuItem}
              onPress={() => setMenuVisible(false)}
              activeOpacity={0.7}
            >
              <Text
                style={[localStyles.menuItemText, localStyles.menuItemCancel]}
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

const localStyles = StyleSheet.create({
  editInput: {
    flex: 1,
    fontSize: 16,
    color: "#323130",
    borderBottomWidth: 2,
    borderBottomColor: "#0078d4",
    paddingVertical: 2,
    marginRight: 8,
  },
  editAction: {
    padding: 4,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  menuCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    width: "100%",
    maxWidth: 320,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
  menuTaskPreview: {
    fontSize: 13,
    color: "#8a8886",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    fontStyle: "italic",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#f3f2f1",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuIcon: {
    marginRight: 14,
    width: 20,
    textAlign: "center",
  },
  menuItemText: {
    fontSize: 15,
    color: "#323130",
  },
  menuItemDestructive: {
    color: "#d13438",
  },
  menuItemCancel: {
    color: "#605e5c",
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
});

export default TaskItem;
