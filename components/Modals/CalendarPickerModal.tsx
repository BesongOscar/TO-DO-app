import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

interface CalendarPickerModalProps {
  visible: boolean;
  currentDate: string | undefined;
  onSelect: (date: string | undefined) => void;
  onClose: () => void;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CalendarPickerModal: React.FC<CalendarPickerModalProps> = ({
  visible,
  currentDate,
  onSelect,
  onClose,
}) => {
  const today = new Date();
  const initialDate = currentDate ? new Date(currentDate) : today;
  const [viewDate, setViewDate] = useState<Date>(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    currentDate ? new Date(currentDate) : null,
  );

  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: CalendarDay[] = [];

    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const isToday = dateObj.toDateString() === today.toDateString();
      const isSelected = selectedDate
        ? dateObj.toDateString() === selectedDate.toDateString()
        : false;
      days.push({
        date: dateObj,
        isCurrentMonth: true,
        isToday,
        isSelected,
      });
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
      });
    }

    return days;
  };

  const goToPrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleSelectDate = (day: CalendarDay) => {
    if (!day.isCurrentMonth) return;
    setSelectedDate(day.date);
  };

  const handleSave = () => {
    if (selectedDate) {
      onSelect(selectedDate.toISOString().split("T")[0]);
    } else {
      onSelect(undefined);
    }
    onClose();
  };

  const handleClear = () => {
    setSelectedDate(null);
    onSelect(undefined);
    onClose();
  };

  const days = getDaysInMonth(viewDate);

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
          <Text style={styles.title}>Select Date</Text>

          <View style={styles.calendarContainer}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={goToPrevMonth}
                style={styles.navButton}
              >
                <Text style={styles.navText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.monthYear}>
                {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
              </Text>
              <TouchableOpacity
                onPress={goToNextMonth}
                style={styles.navButton}
              >
                <Text style={styles.navText}>›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.daysHeader}>
              {DAYS.map((day) => (
                <View key={day} style={styles.dayHeader}>
                  <Text style={styles.dayHeaderText}>{day}</Text>
                </View>
              ))}
            </View>

            <View style={styles.daysGrid}>
              {days.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    !day.isCurrentMonth && styles.dayCellOtherMonth,
                    day.isToday && styles.dayCellToday,
                    day.isSelected && styles.dayCellSelected,
                  ]}
                  onPress={() => handleSelectDate(day)}
                  disabled={!day.isCurrentMonth}
                >
                  <Text
                    style={[
                      styles.dayText,
                      !day.isCurrentMonth && styles.dayTextOtherMonth,
                      day.isToday && styles.dayTextToday,
                      day.isSelected && styles.dayTextSelected,
                    ]}
                  >
                    {day.date.getDate()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {selectedDate && (
            <View style={styles.preview}>
              <Text style={styles.previewLabel}>Selected:</Text>
              <Text style={styles.previewDate}>
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
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
  calendarContainer: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  navText: {
    fontSize: 28,
    color: "#0078d4",
    fontWeight: "300",
  },
  monthYear: {
    fontSize: 17,
    fontWeight: "600",
    color: "#323130",
  },
  daysHeader: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dayHeader: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#605e5c",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCellOtherMonth: {
    opacity: 0.3,
  },
  dayCellToday: {
    backgroundColor: "#f0f7ff",
    borderRadius: 20,
  },
  dayCellSelected: {
    backgroundColor: "#0078d4",
    borderRadius: 20,
  },
  dayText: {
    fontSize: 16,
    color: "#323130",
  },
  dayTextOtherMonth: {
    color: "#a19f9d",
  },
  dayTextToday: {
    color: "#0078d4",
    fontWeight: "600",
  },
  dayTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  preview: {
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "#f8f9fa",
    marginHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  previewLabel: {
    fontSize: 12,
    color: "#605e5c",
    marginBottom: 4,
  },
  previewDate: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0078d4",
  },
  buttons: {
    flexDirection: "row",
    marginTop: 20,
    marginHorizontal: 20,
    gap: 12,
  },
  clearButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#f3f2f1",
  },
  clearText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#d13438",
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

export default CalendarPickerModal;
