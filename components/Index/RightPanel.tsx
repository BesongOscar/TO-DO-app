import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../../styles/styles";
import DetailOption from "../DetailOption";
import { Task } from "../../types";

interface DetailOptionConfig {
  icon: string;
  text: string;
}

const DETAIL_OPTIONS: DetailOptionConfig[] = [
  { icon: "📅", text: "Add due date" },
  { icon: "🔔", text: "Remind me" },
  { icon: "🔄", text: "Repeat" },
  { icon: "📝", text: "Add note" },
];

interface RightPanelProps {
  selectedTask: Task | null;
  onClose: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ selectedTask, onClose }) => {
  if (!selectedTask) return null;

  return (
    <View style={styles.rightPanel}>
      {/* Header */}
      <View style={styles.taskDetailHeader}>
        <Text style={styles.taskDetailTitle} numberOfLines={2}>
          {selectedTask.text}
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeDetailPanel}>×</Text>
        </TouchableOpacity>
      </View>

      {/* Detail option rows */}
      <View style={styles.taskDetailContent}>
        {DETAIL_OPTIONS.map((option) => (
          <DetailOption
            key={option.text}
            icon={option.icon}
            text={option.text}
          />
        ))}
      </View>

      {/* Footer */}
      <View style={styles.taskDetailFooter}>
        <Text style={styles.createdDate}>Created today</Text>
      </View>
    </View>
  );
};

export default RightPanel;
