import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { addTaskInputStyles } from "../styles/components/AddTaskInput";

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
    <View style={addTaskInputStyles.addTaskContainer}>
      <TextInput
        style={addTaskInputStyles.addTaskInput}
        placeholder="Add a task"
        placeholderTextColor="#8a8886"
        value={taskText}
        onChangeText={setTaskText}
        onSubmitEditing={handleAddTask}
        returnKeyType="done"
      />
      <TouchableOpacity style={addTaskInputStyles.addTaskButton} onPress={handleAddTask}>
        <Text style={addTaskInputStyles.addTaskIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddTaskInput;
