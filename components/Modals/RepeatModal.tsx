import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { RepeatType } from "../../types";

interface RepeatOption {
  label: string;
  description: string;
  value: RepeatType;
}

const REPEAT_OPTIONS: RepeatOption[] = [
  { label: "Never", description: "Does not repeat", value: "none" },
  { label: "Daily", description: "Repeats every day", value: "daily" },
  { label: "Weekly", description: "Repeats every week", value: "weekly" },
  { label: "Monthly", description: "Repeats every month", value: "monthly" },
  { label: "Yearly", description: "Repeats every year", value: "yearly" },
];

interface RepeatModalProps {
  visible: boolean;
  currentRepeat: RepeatType | undefined;
  onSelect: (repeat: RepeatType) => void;
  onClose: () => void;
}

const RepeatModal: React.FC<RepeatModalProps> = ({
  visible,
  currentRepeat,
  onSelect,
  onClose,
}) => {
  const [selectedRepeat, setSelectedRepeat] = useState<RepeatType>(
    currentRepeat || "none",
  );

  const handleSelect = (option: RepeatType) => {
    setSelectedRepeat(option);
  };

  const handleSave = () => {
    onSelect(selectedRepeat);
    onClose();
  };

  const formatRepeatDisplay = (repeat: RepeatType): string => {
    const option = REPEAT_OPTIONS.find((o) => o.value === repeat);
    return option?.label || "Never";
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
          <Text style={styles.title}>Repeat</Text>

          <View style={styles.optionsList}>
            {REPEAT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  selectedRepeat === option.value && styles.optionSelected,
                ]}
                onPress={() => handleSelect(option.value)}
              >
                <View style={styles.optionContent}>
                  <Text
                    style={[
                      styles.optionText,
                      selectedRepeat === option.value &&
                        styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text style={styles.optionDescription}>
                    {option.description}
                  </Text>
                </View>
                {selectedRepeat === option.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.preview}>
            <Text style={styles.previewLabel}>Selected:</Text>
            <Text style={styles.previewDate}>
              {formatRepeatDisplay(selectedRepeat)}
            </Text>
          </View>

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
  optionContent: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    color: "#323130",
  },
  optionTextSelected: {
    color: "#0078d4",
    fontWeight: "600",
  },
  optionDescription: {
    fontSize: 12,
    color: "#605e5c",
    marginTop: 2,
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

export default RepeatModal;
