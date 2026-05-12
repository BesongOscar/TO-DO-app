/**
 * RepeatModal - Task repeat scheduling modal
 * 
 * Supports daily, weekly, monthly, yearly, and custom repeat options.
 * Weekly includes day-of-week toggles; monthly includes last-day support.
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import { RepeatType } from "../../types";
import { useThemeStyles } from "../../hooks/useThemeStyles";
import { createRepeatModalStyles } from "../../styles/components/Modals/RepeatModal";

interface RepeatOption {
  label: string;
  value: RepeatType;
}

const REPEAT_OPTIONS: RepeatOption[] = [
  { label: "Never", value: "none" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface RepeatModalProps {
  visible: boolean;
  currentRepeat: RepeatType | undefined;
  currentRepeatDays?: number[] | undefined; // for weekly repeats
  currentRepeatOnDay?: number | undefined; // for monthly/yearly repeats
  currentRepeatOnLastDay?: boolean | undefined; // for monthly repeats
  currentRepeatEndDate?: string | undefined; // optional end date for repeats
  dueTime: string | undefined; // for preview display
  onSelect: (
    repeat: RepeatType,
    options?: {
      repeatDays?: number[];
      repeatOnDay?: number;
      repeatOnLastDay?: boolean;
      repeatEndDate?: string;
    },
  ) => void;
  onClose: () => void;
}

const RepeatModal: React.FC<RepeatModalProps> = ({
  visible,
  currentRepeat,
  currentRepeatDays,
  currentRepeatOnDay,
  currentRepeatOnLastDay,
  currentRepeatEndDate,
  dueTime,
  onSelect,
  onClose,
}) => {
  const styles = useThemeStyles(createRepeatModalStyles);
  const [selectedRepeat, setSelectedRepeat] = useState<RepeatType>(
    currentRepeat || "none",
  );
  const [selectedDays, setSelectedDays] = useState<number[]>(
    currentRepeatDays || [],
  );
  const [monthlyDay, setMonthlyDay] = useState<number>(currentRepeatOnDay || 1);
  const [isLastDay, setIsLastDay] = useState<boolean>(
    currentRepeatOnLastDay || false,
  );
  // End repeat state
  const [endRepeatType, setEndRepeatType] = useState<"never" | "onDate">(
    currentRepeatEndDate ? "onDate" : "never",
  );
  const [endDateYear, setEndDateYear] = useState<number>(
    currentRepeatEndDate
      ? parseInt(currentRepeatEndDate.split("-")[0], 10)
      : new Date().getFullYear(),
  );
  const [endDateMonth, setEndDateMonth] = useState<number>(
    currentRepeatEndDate
      ? parseInt(currentRepeatEndDate.split("-")[1], 10)
      : new Date().getMonth() + 1,
  );
  const [endDateDay, setEndDateDay] = useState<number>(
    currentRepeatEndDate
      ? parseInt(currentRepeatEndDate.split("-")[2], 10)
      : new Date().getDate(),
  );
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const timeSuffix = dueTime
    ? ` at ${dueTime.slice(0, 2)}:${dueTime.slice(3)}`
    : "";

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const getRepeatLabel = (): string => {
    switch (selectedRepeat) {
      case "none":
        return "Never";
      case "daily":
        return `Daily${timeSuffix}`;
      case "weekly": {
        if (selectedDays.length === 0) return `Weekly${timeSuffix}`;
        const dayNames = selectedDays.sort().map((d) => DAY_LABELS[d]);
        return `Weekly on ${dayNames.join(", ")}${timeSuffix}`;
      }
      case "monthly": {
        if (isLastDay) return `Last day of month${timeSuffix}`;
        return `Monthly on day ${monthlyDay}${timeSuffix}`;
      }
      case "yearly":
        return `Yearly${timeSuffix}`;
      default:
        return "";
    }
  };

  const handleSave = () => {
    const options: Record<string, any> = {};

    if (selectedRepeat === "weekly" && selectedDays.length > 0) {
      options.repeatDays = selectedDays;
    }

    if (selectedRepeat === "monthly") {
      options.repeatOnLastDay = isLastDay;
      if (!isLastDay) {
        options.repeatOnDay = monthlyDay;
      }
    }

    if (endRepeatType === "onDate") {
      options.repeatEndDate = `${endDateYear}-${String(endDateMonth).padStart(2, "0")}-${String(endDateDay).padStart(2, "0")}`;
    }

    onSelect(
      selectedRepeat,
      Object.keys(options).length > 0 ? options : undefined,
    );
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
          <Text style={styles.title}>Repeat</Text>

          <ScrollView style={styles.optionsList}>
            {/* Repeat Type Selection */}
            {REPEAT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  selectedRepeat === option.value && styles.optionSelected,
                ]}
                onPress={() => setSelectedRepeat(option.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedRepeat === option.value &&
                      styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                  {option.value !== "none" && timeSuffix && (
                    <Text style={styles.timeHint}> at {dueTime}</Text>
                  )}
                </Text>
                {selectedRepeat === option.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}

            {/* Weekly Day Picker */}
            {selectedRepeat === "weekly" && (
              <View style={styles.dayPickerContainer}>
                <Text style={styles.sectionLabel}>Repeat on:</Text>
                <View style={styles.dayRow}>
                  {DAY_LABELS.map((label, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dayButton,
                        selectedDays.includes(index) &&
                          styles.dayButtonSelected,
                      ]}
                      onPress={() => toggleDay(index)}
                    >
                      <Text
                        style={[
                          styles.dayButtonText,
                          selectedDays.includes(index) &&
                            styles.dayButtonTextSelected,
                        ]}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Monthly Options */}
            {selectedRepeat === "monthly" && (
              <View style={styles.monthlyContainer}>
                <Text style={styles.sectionLabel}>Repeat on:</Text>
                <TouchableOpacity
                  style={[
                    styles.monthlyOption,
                    !isLastDay && styles.monthlyOptionSelected,
                  ]}
                  onPress={() => setIsLastDay(false)}
                >
                  <Text style={styles.monthlyOptionText}>Day of month</Text>
                  {!isLastDay && (
                    <View style={styles.dayNumberRow}>
                      <TouchableOpacity
                        onPress={() =>
                          setMonthlyDay(Math.max(1, monthlyDay - 1))
                        }
                      >
                        <Text style={styles.dayArrow}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.dayNumber}>{monthlyDay}</Text>
                      <TouchableOpacity
                        onPress={() =>
                          setMonthlyDay(Math.min(31, monthlyDay + 1))
                        }
                      >
                        <Text style={styles.dayArrow}>+</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.monthlyOption,
                    isLastDay && styles.monthlyOptionSelected,
                  ]}
                  onPress={() => setIsLastDay(true)}
                >
                  <Text style={styles.monthlyOptionText}>
                    Last day of month
                  </Text>
                  {isLastDay && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              </View>
            )}

            {/* End Repeat Section */}
            {selectedRepeat !== "none" && (
              <View style={styles.endRepeatContainer}>
                <Text style={styles.sectionLabel}>End Repeat</Text>
                <TouchableOpacity
                  style={[
                    styles.endRepeatOption,
                    endRepeatType === "never" && styles.optionSelected,
                  ]}
                  onPress={() => setEndRepeatType("never")}
                >
                  <Text style={styles.optionText}>Never</Text>
                  {endRepeatType === "never" && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.endRepeatOption,
                    endRepeatType === "onDate" && styles.optionSelected,
                  ]}
                  onPress={() => setEndRepeatType("onDate")}
                >
                  <Text style={styles.optionText}>On Date</Text>
                  {endRepeatType === "onDate" && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>

                {endRepeatType === "onDate" && (
                  <View style={styles.endDatePicker}>
                    <View style={styles.endDateRow}>
                      <TouchableOpacity
                        onPress={() =>
                          setEndDateMonth(Math.max(1, endDateMonth - 1))
                        }
                        style={styles.endDateArrow}
                      >
                        <Text style={styles.dayArrow}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.endDateValue}>
                        {endDateYear}/{String(endDateMonth).padStart(2, "0")}/
                        {String(endDateDay).padStart(2, "0")}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          setEndDateMonth(Math.min(12, endDateMonth + 1))
                        }
                        style={styles.endDateArrow}
                      >
                        <Text style={styles.dayArrow}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.endDateRow}>
                      <TouchableOpacity
                        onPress={() =>
                          setEndDateDay(Math.max(1, endDateDay - 1))
                        }
                        style={styles.endDateArrow}
                      >
                        <Text style={styles.dayArrow}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.endDateHint}>Day</Text>
                      <TouchableOpacity
                        onPress={() =>
                          setEndDateDay(Math.min(31, endDateDay + 1))
                        }
                        style={styles.endDateArrow}
                      >
                        <Text style={styles.dayArrow}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          {/* Preview */}
          <View style={styles.preview}>
            <Text style={styles.previewLabel}>Selected:</Text>
            <Text style={styles.previewDate}>
              {getRepeatLabel()}
              {endRepeatType === "onDate" &&
                selectedRepeat !== "none" &&
                ` until ${endDateYear}/${String(endDateMonth).padStart(2, "0")}/${String(endDateDay).padStart(2, "0")}`}
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

export default RepeatModal;
