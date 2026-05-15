/**
 * BottomPanel - Task detail panel shown in the BottomSheet
 *
 * Shows task details and provides access to modals:
 * Calendar (due date), Reminder, Repeat, and Note.
 */

import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useThemeStyles } from "../../hooks/useThemeStyles";
import { createBottomPanelStyles } from "../../styles/components/Index/BottomPanel";
import DetailOption from "../DetailOption";
import { RepeatType, Task } from "../../types";
import CalendarPickerModal from "../Modals/CalendarPickerModal";
import ReminderModal from "../Modals/ReminderModal";
import RepeatModal from "../Modals/RepeatModal";
import NoteModal from "../Modals/NoteModal";
import { useTranslation } from "react-i18next";

const formatDueDate = (dateStr: string, timeStr?: string): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [year, month, day] = dateStr.split("-").map(Number);
  const due = new Date(year, month - 1, day);

  if (due.getTime() === today.getTime()) {
    return timeStr ? `${formatTime(timeStr)}` : new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  } else if (due.getTime() === tomorrow.getTime()) {
    return timeStr ? `${formatTime(timeStr)}` : new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  } else {
    const dateLabel = due.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    if (timeStr) {
      return `${dateLabel} ${formatTime(timeStr)}`;
    }
    return dateLabel;
  }
};

const formatTime = (timeStr: string): string => {
  const [h, m] = timeStr.split(":");
  const ampm = parseInt(h, 10) >= 12 ? "PM" : "AM";
  const hour12 = parseInt(h, 10) % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
};

const formatReminder = (reminderStr: string): string => {
  const date = new Date(reminderStr);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  if (date.toDateString() === now.toDateString()) return `Today at ${timeStr}`;
  if (date.toDateString() === tomorrow.toDateString()) return `Tomorrow at ${timeStr}`;

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatRepeat = (repeat: RepeatType): string => {
  const labels: Record<RepeatType, string> = {
    none: "Never",
    daily: "Every day",
    weekly: "Every week",
    monthly: "Every month",
    yearly: "Every year",
  };
  return labels[repeat] ?? "Never";
};

const formatNote = (note: string): string => {
  const oneLine = note.replace(/\n/g, " ").trim();
  return oneLine.length > 40 ? `${oneLine.slice(0, 40)}…` : oneLine;
};

const formatTimeOnly = (timeStr: string): string => {
  const [h, m] = timeStr.split(":");
  const ampm = parseInt(h, 10) >= 12 ? "PM" : "AM";
  const hour12 = parseInt(h, 10) % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
};

// ── Static config ─────────────────────────────────────────────────────────────

interface DetailOptionConfig {
  icon: string;
  text: string;
  key: string;
}

// ── Component ───────────────────────────────────────────────────────────────

interface BottomPanelProps {
  selectedTask: Task | null;
  onClose: () => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

const BottomPanel: React.FC<BottomPanelProps> = ({
  selectedTask,
  onClose,
  onUpdateTask,
}) => {
  const styles = useThemeStyles(createBottomPanelStyles);
  const { t } = useTranslation();
  const [modalType, setModalType] = useState<string | null>(null);

  if (!selectedTask) return null;

  const BASE_OPTIONS: DetailOptionConfig[] = [
    { icon: "📅", text: t("detail.add_due_date"), key: "calendar" },
    { icon: "🔔", text: t("detail.remind_me"), key: "reminder" },
    { icon: "🔄", text: t("detail.repeat"), key: "repeat" },
    { icon: "📝", text: t("detail.add_note"), key: "note" },
  ];

  const getDetailOptions = (isFavorited: boolean): DetailOptionConfig[] => [
    ...BASE_OPTIONS,
    {
      icon: "⭐",
      text: isFavorited ? t("detail.remove_from_favorites") : t("detail.add_to_favorites"),
      key: "favorite",
    },
  ];

  const handleOptionPress = (option: DetailOptionConfig) => {
    if (option.key === "calendar") setModalType("calendar");
    else if (option.key === "reminder") setModalType("reminder");
    else if (option.key === "repeat") setModalType("repeat");
    else if (option.key === "note") setModalType("note");
    else if (option.key === "favorite") {
      onUpdateTask(selectedTask.id, { important: !selectedTask.important });
    }
  };

  const closeModal = () => setModalType(null);

  const hasDueDate = Boolean(selectedTask.dueDate);
  const hasReminder = Boolean(selectedTask.reminder);
  const hasRepeat = selectedTask.repeat && selectedTask.repeat !== "none";
  const hasNote = Boolean(selectedTask.note?.trim());

  return (
    <View style={styles.bottomPanel}>
      <View style={styles.taskDetailHeader}>
        <Text style={styles.taskDetailTitle} numberOfLines={2}>
          {selectedTask.text}
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeDetailPanel}>×</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.taskDetailContent}
        contentContainerStyle={styles.taskDetailContentInner}
        keyboardShouldPersistTaps="handled"
      >
        {getDetailOptions(selectedTask.important).map((option) => {
          let activeValue = "";
          switch (option.key) {
            case "calendar":
              if (selectedTask.dueDate)
                activeValue = formatDueDate(selectedTask.dueDate, selectedTask.dueTime);
              break;
            case "reminder":
              if (selectedTask.reminder)
                activeValue = formatReminder(selectedTask.reminder);
              break;
            case "repeat":
              if (selectedTask.repeat && selectedTask.repeat !== "none")
                activeValue = formatRepeat(selectedTask.repeat);
              break;
            case "note":
              if (selectedTask.note?.trim())
                activeValue = formatNote(selectedTask.note);
              break;
          }
          return (
            <DetailOption
              key={option.key}
              icon={option.icon}
              text={option.text}
              activeValue={activeValue}
              isActive={option.key === "favorite"}
              onPress={() => handleOptionPress(option)}
            />
          );
        })}
      </ScrollView>

      <CalendarPickerModal
        visible={modalType === "calendar"}
        currentDate={selectedTask.dueDate}
        currentTime={selectedTask.dueTime}
        onSelect={(date, time) => {
          onUpdateTask(selectedTask.id, { dueDate: date, dueTime: time });
          closeModal();
        }}
        onClose={closeModal}
      />

      <ReminderModal
        visible={modalType === "reminder"}
        currentReminder={selectedTask.reminder || undefined}
        dueDate={selectedTask.dueDate}
        dueTime={selectedTask.dueTime}
        onSelect={(time) => {
          onUpdateTask(selectedTask.id, { reminder: time });
          closeModal();
        }}
        onClose={closeModal}
      />

      <RepeatModal
        visible={modalType === "repeat"}
        currentRepeat={selectedTask.repeat || "none"}
        currentRepeatDays={selectedTask.repeatDays}
        currentRepeatOnDay={selectedTask.repeatOnDay}
        currentRepeatOnLastDay={selectedTask.repeatOnLastDay}
        currentRepeatEndDate={selectedTask.repeatEndDate}
        dueTime={selectedTask.dueTime}
        onSelect={(rule, options) => {
          const updates: Partial<Task> = { repeat: rule };
          if (options?.repeatDays) updates.repeatDays = options.repeatDays;
          if (options?.repeatOnDay !== undefined)
            updates.repeatOnDay = options.repeatOnDay;
          if (options?.repeatOnLastDay !== undefined)
            updates.repeatOnLastDay = options.repeatOnLastDay;
          if (options?.repeatEndDate)
            updates.repeatEndDate = options.repeatEndDate;
          onUpdateTask(selectedTask.id, updates);
          closeModal();
        }}
        onClose={closeModal}
      />

      <NoteModal
        visible={modalType === "note"}
        currentNote={selectedTask.note || undefined}
        onSave={(note) => {
          onUpdateTask(selectedTask.id, { note });
          closeModal();
        }}
        onClose={closeModal}
      />
    </View>
  );
};

export default BottomPanel;
