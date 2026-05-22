/**
 * RepeatModal - Recurrence rule configuration modal
 * 
 * Supports: daily, weekly (with multi-day selection), monthly
 * (specific day or last day), yearly. Configurable end date.
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
import { useTranslation } from "react-i18next";

interface RepeatOption {
  label: string;
  value: RepeatType;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface RepeatModalProps {
  visible: boolean;
  currentRepeat: RepeatType | undefined;
  currentRepeatDays?: number[] | undefined;
  currentRepeatOnDay?: number | undefined;
  currentRepeatOnLastDay?: boolean | undefined;
  currentRepeatEndDate?: string | undefined;
  dueTime: string | undefined;
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
  const { t } = useTranslation();
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
    ? ` ${t("date.at")} ${dueTime.slice(0, 2)}:${dueTime.slice(3)}`
    : "";

  const REPEAT_OPTIONS: RepeatOption[] = [
    { label: t("repeat.never"), value: "none" },
    { label: t("repeat.daily"), value: "daily" },
    { label: t("repeat.weekly"), value: "weekly" },
    { label: t("repeat.monthly"), value: "monthly" },
    { label: t("repeat.yearly"), value: "yearly" },
  ];

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const getRepeatLabel = (): string => {
    switch (selectedRepeat) {
      case "none":
        return t("repeat.never");
      case "daily":
        return `${t("repeat.every_day")}${timeSuffix}`;
      case "weekly": {
        if (selectedDays.length === 0) return `${t("repeat.every_week")}${timeSuffix}`;
        const dayNames = selectedDays.sort().map((d) => DAY_LABELS[d]);
        return `${t("repeat.repeat_on")} ${dayNames.join(", ")}${timeSuffix}`;
      }
      case "monthly": {
        if (isLastDay) return `${t("repeat.last_day")}${timeSuffix}`;
        return `${t("repeat.day_of_month")} ${monthlyDay}${timeSuffix}`;
      }
      case "yearly":
        return `${t("repeat.every_year")}${timeSuffix}`;
      default:
        return "";
    }
  };

  const handleSave = () => {
    const options: {
      repeatDays?: number[];
      repeatOnDay?: number;
      repeatOnLastDay?: boolean;
      repeatEndDate?: string;
    } = {};

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
          <Text style={styles.title}>{t("repeat.title")}</Text>

          <ScrollView style={styles.optionsList}>
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
                    <Text style={styles.timeHint}> {t("date.at")} {dueTime}</Text>
                  )}
                </Text>
                {selectedRepeat === option.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}

            {selectedRepeat === "weekly" && (
              <View style={styles.dayPickerContainer}>
                <Text style={styles.sectionLabel}>{t("repeat.repeat_on")}</Text>
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

            {selectedRepeat === "monthly" && (
              <View style={styles.monthlyContainer}>
                <Text style={styles.sectionLabel}>{t("repeat.repeat_on")}</Text>
                <TouchableOpacity
                  style={[
                    styles.monthlyOption,
                    !isLastDay && styles.monthlyOptionSelected,
                  ]}
                  onPress={() => setIsLastDay(false)}
                >
                  <Text style={styles.monthlyOptionText}>{t("repeat.day_of_month")}</Text>
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
                  <Text style={styles.monthlyOptionText}>{t("repeat.last_day")}</Text>
                  {isLastDay && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              </View>
            )}

            {selectedRepeat !== "none" && (
              <View style={styles.endRepeatContainer}>
                <Text style={styles.sectionLabel}>{t("repeat.end_repeat")}</Text>
                <TouchableOpacity
                  style={[
                    styles.endRepeatOption,
                    endRepeatType === "never" && styles.optionSelected,
                  ]}
                  onPress={() => setEndRepeatType("never")}
                >
                  <Text style={styles.optionText}>{t("repeat.never")}</Text>
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
                  <Text style={styles.optionText}>{t("repeat.on_date")}</Text>
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

          <View style={styles.preview}>
            <Text style={styles.previewLabel}>{t("repeat.selected_label")}</Text>
            <Text style={styles.previewDate}>
              {getRepeatLabel()}
              {endRepeatType === "onDate" &&
                selectedRepeat !== "none" &&
                ` ${t("date.until")} ${endDateYear}/${String(endDateMonth).padStart(2, "0")}/${String(endDateDay).padStart(2, "0")}`}
            </Text>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>{t("common.cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>{t("common.save")}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default RepeatModal;
