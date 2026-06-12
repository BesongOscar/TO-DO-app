import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { useThemeStyles } from "../src/hooks/useThemeStyles";
import { useTheme } from "../context/ThemeContext";
import { createAddTaskInputStyles } from "../styles/components/AddTaskInput";
import { useTranslation } from "react-i18next";

interface AddTaskInputProps {
  onAddTask: (text: string) => void;
}

const AddTaskInput: React.FC<AddTaskInputProps> = ({ onAddTask }) => {
  const styles = useThemeStyles(createAddTaskInputStyles);
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [taskText, setTaskText] = useState<string>("");

  const handleAddTask = (): void => {
    if (taskText.trim()) {
      onAddTask(taskText);
      setTaskText("");
    }
  };

  return (
    <View style={styles.addTaskContainer}>
      <TextInput
        testID="add-task-input"
        style={styles.addTaskInput}
        placeholder={t("tasks.add_placeholder")}
        placeholderTextColor={theme.placeholderTextColor}
        value={taskText}
        onChangeText={setTaskText}
        onSubmitEditing={handleAddTask}
        returnKeyType="done"
      />
      <TouchableOpacity testID="add-task-button" style={styles.addTaskButton} onPress={handleAddTask}>
        <Text style={styles.addTaskIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddTaskInput;
