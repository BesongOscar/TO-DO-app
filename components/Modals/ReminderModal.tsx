/**
 * ReminderModal - Task reminder scheduling modal
 * 
 * Offers preset reminder options (15min, 1hr, custom time, etc.)
 * powered by expo-notifications. Requires notification permission.
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Platform,
  Linking,
  Alert,
} from "react-native";
import TimePicker from "../TimePicker";
import { requestNotificationPermissions } from "../../src/notifications/notificationService";
import { reminderModalStyles as styles } from "../../styles/modals/reminderModal";

interface ReminderOption {
  label: string;
  value: string;
  description?: string;
}

interface ReminderModalProps {
  visible: boolean;
  currentReminder: string | undefined;
  dueDate: string | undefined;
  dueTime: string | undefined;
  onSelect: (reminder: string | undefined) => void;
  onClose: () => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({
  visible,
  currentReminder,
  dueDate,
  dueTime,
  onSelect,
  onClose,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customHour, setCustomHour] = useState(9);
  const [customMinute, setCustomMinute] = useState(0);

  // Compute target date/time for relative reminders
  const getTargetDateTime = (): Date => {
    if (dueDate && dueTime) {
      return new Date(`${dueDate}T${dueTime}:00`);
    }
    if (dueDate) {
      const d = new Date(`${dueDate}T00:00:00`);
      d.setHours(23, 59, 0, 0); // end of day
      return d;
    }
    return new Date();
  };

  const getReminderOptions = (): ReminderOption[] => {
    const options: ReminderOption[] = [];

    // "At due time" — only if date+time both set
    if (dueDate && dueTime) {
      options.push({ label: "At due time", value: "atDueTime", description: `${dueDate} at ${dueTime}` });
    }

    if (dueDate) {
      const target = getTargetDateTime();
      options.push(
        { label: "15 minutes before", value: "15min", description: formatRelativeTime(new Date(target.getTime() - 15 * 60000)) },
        { label: "30 minutes before", value: "30min", description: formatRelativeTime(new Date(target.getTime() - 30 * 60000)) },
        { label: "1 hour before", value: "1hour", description: formatRelativeTime(new Date(target.getTime() - 60 * 60000)) },
        { label: "2 hours before", value: "2hours", description: formatRelativeTime(new Date(target.getTime() - 120 * 60000)) },
        { label: "1 day before", value: "1day", description: formatRelativeTime(new Date(target.getTime() - 24 * 60 * 60000)) },
      );
    }
    options.push(
      { label: "Custom time", value: "custom" },
      { label: "No Reminder", value: "" },
    );

    return options;
  };

  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow =
      date.toDateString() === new Date(now.getTime() + 86400000).toDateString();

    const timeStr = date.toLocaleTimeString("en-US", {
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

  const getReminderTime = (option: string): string | undefined => {
    if (!option) return undefined;

    if (option === "custom") return undefined; // handled by save

    if (option === "atDueTime" && dueDate && dueTime) {
      return new Date(`${dueDate}T${dueTime}:00`).toISOString();
    }

    const target = getTargetDateTime();
    let reminderDate: Date;

    switch (option) {
      case "15min":
        reminderDate = new Date(target.getTime() - 15 * 60000);
        break;
      case "30min":
        reminderDate = new Date(target.getTime() - 30 * 60000);
        break;
      case "1hour":
        reminderDate = new Date(target.getTime() - 60 * 60000);
        break;
      case "2hours":
        reminderDate = new Date(target.getTime() - 120 * 60000);
        break;
      case "1day":
        reminderDate = new Date(target.getTime() - 24 * 60 * 60000);
        break;
      default:
        return undefined;
    }

    return reminderDate.toISOString();
  };

  const REMINDER_OPTIONS = getReminderOptions();

  // Request permissions when modal opens
  useEffect(() => {
    if (visible) {
      requestNotificationPermissions().then((granted) => {
        if (!granted) {
          Alert.alert(
            "Notifications Disabled",
            "Enable notifications in Settings to receive task reminders.",
            [
              { text: "Not Now", style: "cancel" },
              {
                text: "Open Settings",
                onPress: () => {
                  if (Platform.OS === "ios") {
                    Linking.openURL("app-settings:");
                  } else {
                    Linking.openSettings();
                  }
                },
              },
            ],
          );
        }
      });
    }
  }, [visible]);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    if (option === "custom") {
      setShowCustomPicker(true);
    } else {
      setShowCustomPicker(false);
    }
  };

  const handleSave = () => {
    if (selectedOption === "custom") {
      const now = new Date();
      const customDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        customHour,
        customMinute,
      );
      if (customDate <= now) customDate.setDate(customDate.getDate() + 1);
      onSelect(customDate.toISOString());
    } else {
      const reminderTime = getReminderTime(selectedOption);
      onSelect(reminderTime);
    }
    onClose();
  };

  const handleClose = () => {
    setShowCustomPicker(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleClose}
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
                  selectedOption === option.value && styles.optionSelected,
                ]}
                onPress={() => handleSelect(option.value)}
              >
                <View style={styles.optionContent}>
                  <Text
                    style={[
                      styles.optionText,
                      selectedOption === option.value &&
                        styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {option.description && (
                    <Text style={styles.optionDescription}>
                      {option.description}
                    </Text>
                  )}
                </View>
                {selectedOption === option.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}

            {showCustomPicker && (
              <View style={styles.customPickerContainer}>
                <TimePicker
                  value={new Date(0, 0, 0, customHour, customMinute)}
                  onChange={(h, m) => {
                    setCustomHour(h);
                    setCustomMinute(m);
                  }}
                />
              </View>
            )}
          </ScrollView>

          {/* Preview */}
          {selectedOption && selectedOption !== "custom" && selectedOption !== "" && (
            <View style={styles.preview}>
              <Text style={styles.previewLabel}>Reminder:</Text>
              <Text style={styles.previewDate}>
                {formatRelativeTime(new Date(getReminderTime(selectedOption)!))}
              </Text>
            </View>
          )}

          {selectedOption === "custom" && (
            <View style={styles.preview}>
              <Text style={styles.previewLabel}>Reminder:</Text>
              <Text style={styles.previewDate}>
                {`${String(customHour).padStart(2, "0")}:${String(customMinute).padStart(2, "0")}`}
              </Text>
            </View>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
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

export default ReminderModal;