import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";

interface ReminderOption {
  label: string;
  value: string;
}

const REMINDER_OPTIONS: ReminderOption[] = [
  { label: "Morning (9:00 AM)", value: "morning" },
  { label: "Afternoon (1:00 PM)", value: "afternoon" },
  { label: "Evening (6:00 PM)", value: "evening" },
  { label: "Later Today", value: "laterToday" },
  { label: "Tomorrow Morning", value: "tomorrow" },
  { label: "No Reminder", value: "" },
];

interface ReminderModalProps {
  visible: boolean;
  currentReminder: string | undefined;
  dueDate: string | undefined;
  onSelect: (reminder: string | undefined) => void;
  onClose: () => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({
  visible,
  currentReminder,
  dueDate,
  onSelect,
  onClose,
}) => {
  const [selectedReminder, setSelectedReminder] = useState<string>(
    currentReminder || "",
  );

  const getReminderTime = (option: string): string => {
    const baseDate = dueDate ? new Date(dueDate) : new Date();
    switch (option) {
      case "morning":
        baseDate.setHours(9, 0, 0, 0);
        return baseDate.toISOString();
      case "afternoon":
        baseDate.setHours(13, 0, 0, 0);
        return baseDate.toISOString();
      case "evening":
        baseDate.setHours(18, 0, 0, 0);
        return baseDate.toISOString();
      case "laterToday":
        const later = new Date();
        later.setHours(later.getHours() + 3);
        return later.toISOString();
      case "tomorrow":
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);
        return tomorrow.toISOString();
      default:
        return "";
    }
  };

  const formatReminderDisplay = (reminderStr: string | undefined): string => {
    if (!reminderStr) return "No Reminder";
    const date = new Date(reminderStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow =
      date.toDateString() === new Date(now.getTime() + 86400000).toDateString();

    let timeStr = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    if (isToday) return `Today at ${timeStr}`;
    if (isTomorrow) return `Tomorrow at ${timeStr}`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleSelect = (option: string) => {
    setSelectedReminder(option);
  };

  const handleSave = () => {
    const finalReminder = selectedReminder
      ? getReminderTime(selectedReminder)
      : undefined;
    onSelect(finalReminder);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={styles.sheet}
          activeOpacity={1}
          onPress={() => {}}
        >
          <View style={styles.handle} />
          <Text style={styles.title}>Remind Me</Text>

          <ScrollView style={styles.optionsList}>
            {REMINDER_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  selectedReminder === option.value && styles.optionSelected,
                ]}
                onPress={() => handleSelect(option.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedReminder === option.value &&
                      styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
                {selectedReminder === option.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {selectedReminder && (
            <View style={styles.preview}>
              <Text style={styles.previewLabel}>Reminder:</Text>
              <Text style={styles.previewDate}>
                {formatReminderDisplay(getReminderTime(selectedReminder))}
              </Text>
            </View>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 34,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#d1d0cd",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#323130",
    textAlign: "center",
    marginBottom: 16,
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f2f1",
  },
  optionSelected: {
    backgroundColor: "#e1f3ff",
  },
  optionText: {
    fontSize: 16,
    color: "#323130",
  },
  optionTextSelected: {
    color: "#0078d4",
    fontWeight: "600",
  },
  checkmark: {
    fontSize: 18,
    color: "#0078d4",
  },
  preview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "#f8f9fa",
    marginHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  previewLabel: {
    fontSize: 14,
    color: "#605e5c",
    marginRight: 8,
  },
  previewDate: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0078d4",
  },
  buttons: {
    flexDirection: "row",
    marginTop: 20,
    marginHorizontal: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#f3f2f1",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#605e5c",
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#0078d4",
    alignItems: "center",
  },
  saveText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default ReminderModal;
