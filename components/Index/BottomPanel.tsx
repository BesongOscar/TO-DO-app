/**
 * BottomPanel - Task detail panel (replaces RightPanel)
 * 
 * Shows task details and provides access to modals:
 * Calendar (due date), Reminder, Repeat, and Note.
 * Also displays formatted due dates and reminders.
 */

import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { bottomPanelStyles as styles } from "../../styles/components/Index/BottomPanel";
import DetailOption from "../DetailOption";
import { RepeatType, Task } from "../../types";
import CalendarPickerModal from "../Modals/CalendarPickerModal";
import ReminderModal from "../Modals/ReminderModal";
import RepeatModal from "../Modals/RepeatModal";
import NoteModal from "../Modals/NoteModal";

const formatDueDate = (dateStr: string): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // dueDate strings are YYYY-MM-DD — parse without timezone shift
  const [year, month, day] = dateStr.split("-").map(Number);
  const due = new Date(year, month - 1, day);

  if (due.getTime() === today.getTime()) return "Today";
  if (due.getTime() === tomorrow.getTime()) return "Tomorrow";

  return due.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const formatReminder = (reminderStr: string): string => {
  const date = new Date(reminderStr);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  if (isToday) return `Today at ${timeStr}`;
  if (isTomorrow) return `Tomorrow at ${timeStr}`;

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

interface DetailOptionConfig {
  icon: string;
  text: string;
}

const BASE_OPTIONS: DetailOptionConfig[] = [
  { icon: "📅", text: "Add due date" },
  { icon: "🔔", text: "Remind me" },
  { icon: "🔄", text: "Repeat" },
  { icon: "📝", text: "Add note" },
];

const getDetailOptions = (isFavorited: boolean): DetailOptionConfig[] => [
  ...BASE_OPTIONS,
  {icon: "⭐", text: isFavorited ? "Remove from Favorites" : "Add to Favorites"},

]
interface BottomPanelProps {
  selectedTask: Task | null;
  onClose: () => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onStarToggle: () => void;
}

const BottomPanel: React.FC<BottomPanelProps> = ({
  selectedTask,
  onClose,
  onUpdateTask,
  onStarToggle,
}) => {
  const [modalType, setModalType] = useState<string | null>(null);

  if (!selectedTask) return null;

  const handleOptionPress = (text: string) => {
    if (text === "Add due date") setModalType("calendar");
    else if (text === "Remind me") setModalType("reminder");
    else if (text === "Repeat") setModalType("repeat");
    else if (text === "Add note") setModalType("note");
    else if (text === "Add to Favorites" || text === "Remove from Favorites") {
      onStarToggle();
    }
  };

  const closeModal = () => setModalType(null);

  const hasDueDate = Boolean(selectedTask.dueDate);
  const dueDateLabel = hasDueDate
    ? formatDueDate(selectedTask.dueDate!)
    : undefined;

  const hasReminder = Boolean(selectedTask.reminder);
  const reminderLabel = hasReminder
    ? formatReminder(selectedTask.reminder!)
    : undefined;

  const hasRepeat = selectedTask.repeat && selectedTask.repeat !== "none";
  const repeatLabel = hasRepeat
    ? formatRepeat(selectedTask.repeat!)
    : undefined;

  const hasNote = Boolean(selectedTask.note?.trim());
  const noteLabel = hasNote ? formatNote(selectedTask.note!) : undefined;

  // ── Formatted creation date ─────────────────────────────────────────────────

  const createdLabel = "Created today"; // extend with real timestamp if added to Task type

  return (
    <View style={styles.bottomPanel}>
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
      <ScrollView
        style={styles.taskDetailContent}
        contentContainerStyle={styles.taskDetailContentInner}
        keyboardShouldPersistTaps="handled"
      >
        {getDetailOptions(selectedTask.important).map((option) => (
          <DetailOption
            key={option.text}
            icon={option.icon}
            text={option.text}
            isActive= {option.text === (selectedTask.important ? "Remove from Favorites" : "Add to Favorites")}
            onPress={() => handleOptionPress(option.text)}
          />
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.taskDetailFooter}>
        <Text style={styles.createdDate}>{createdLabel}</Text>
      </View>

      {/* Modals */}
      <Modal
        visible={modalType === "calendar"}
        transparent
        animationType="slide"
      >
        <CalendarPickerModal
          visible={modalType === "calendar"}
          currentDate={selectedTask.dueDate}
          onSelect={(date) => {
            onUpdateTask(selectedTask.id, { dueDate: date });
            closeModal();
          }}
          onClose={closeModal}
        />
      </Modal>

      <Modal
        visible={modalType === "reminder"}
        transparent
        animationType="slide"
      >
        <ReminderModal
          visible={modalType === "reminder"}
          currentReminder={selectedTask.reminder || undefined}
          dueDate={selectedTask.dueDate}
          onSelect={(time) => {
            onUpdateTask(selectedTask.id, { reminder: time });
            closeModal();
          }}
          onClose={closeModal}
        />
      </Modal>

      <Modal visible={modalType === "repeat"} transparent animationType="slide">
        <RepeatModal
          visible={modalType === "repeat"}
          currentRepeat={selectedTask.repeat || "none"}
          onSelect={(rule) => {
            onUpdateTask(selectedTask.id, { repeat: rule });
            closeModal();
          }}
          onClose={closeModal}
        />
      </Modal>

      <Modal visible={modalType === "note"} transparent animationType="slide">
        <NoteModal
          visible={modalType === "note"}
          currentNote={selectedTask.note || undefined}
          onSave={(note) => {
            onUpdateTask(selectedTask.id, { note });
            closeModal();
          }}
          onClose={closeModal}
        />
      </Modal>
    </View>
  );
};

export default BottomPanel;
