/**
 * AddTaskInput - Text input for creating new tasks
 * 
 * Simple input field with submit button. Trims whitespace and
 * prevents empty tasks from being added.
 */

import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { addTaskInputStyles as styles } from "../styles/components/AddTaskInput";

interface AddTaskInputProps {
  onAddTask: (text: string) => void;
}

const AddTaskInput: React.FC<AddTaskInputProps> = ({ onAddTask }) => {
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
        style={styles.addTaskInput}
        placeholder="Add a task"
        placeholderTextColor="#8a8886"
        value={taskText}
        onChangeText={setTaskText}
        onSubmitEditing={handleAddTask}
        returnKeyType="done"
      />
      <TouchableOpacity style={styles.addTaskButton} onPress={handleAddTask}>
        <Text style={styles.addTaskIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddTaskInput;
