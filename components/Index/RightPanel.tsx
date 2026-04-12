import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DetailOption from "../DetailOption";
import { rightPanelStyles } from "../../styles/components/Index/RightPanel";
import { Task, RepeatType } from "../../types";
import CalendarPickerModal from "../Modals/CalendarPickerModal";
import ReminderModal from "../Modals/ReminderModal";
import RepeatModal from "../Modals/RepeatModal";
import NoteModal from "../Modals/NoteModal";

interface RightPanelProps {
  selectedTask: Task;
  onClose: () => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  selectedTask,
  onClose,
  onUpdateTask,
}) => {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [reminderVisible, setReminderVisible] = useState(false);
  const [repeatVisible, setRepeatVisible] = useState(false);
  const [noteVisible, setNoteVisible] = useState(false);

  const formatDateDisplay = (dateStr: string | undefined): string => {
    if (!dateStr) return "Add due date";
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatReminderDisplay = (reminderStr: string | undefined): string => {
    if (!reminderStr) return "Remind me";
    const date = new Date(reminderStr);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatRepeatDisplay = (repeat: RepeatType | undefined): string => {
    switch (repeat) {
      case "daily":
        return "Daily";
      case "weekly":
        return "Weekly";
      case "monthly":
        return "Monthly";
      case "yearly":
        return "Yearly";
      default:
        return "Repeat";
    }
  };

  const handleDateSelect = (date: string | undefined) => {
    onUpdateTask(selectedTask.id, { dueDate: date });
  };

  const handleReminderSelect = (reminder: string | undefined) => {
    onUpdateTask(selectedTask.id, { reminder });
  };

  const handleRepeatSelect = (repeat: RepeatType) => {
    onUpdateTask(selectedTask.id, { repeat });
  };

  const handleNoteSave = (note: string) => {
    onUpdateTask(selectedTask.id, { note });
  };

  return (
    <View style={rightPanelStyles.rightPanel}>
      <View style={rightPanelStyles.taskDetailHeader}>
        <Text style={rightPanelStyles.taskDetailTitle} numberOfLines={2}>
          {selectedTask.text}
        </Text>
        <TouchableOpacity onPress={onClose} style={rightPanelStyles.closeDetailPanel}>
          <Text style={rightPanelStyles.closeDetailPanel}>×</Text>
        </TouchableOpacity>
      </View>

      <View style={rightPanelStyles.taskDetailContent}>
        <DetailOption
          icon="📅"
          text={formatDateDisplay(selectedTask.dueDate)}
          isActive={!!selectedTask.dueDate}
          onPress={() => setCalendarVisible(true)}
        />

        <DetailOption
          icon="🔔"
          text={formatReminderDisplay(selectedTask.reminder)}
          isActive={!!selectedTask.reminder}
          onPress={() => setReminderVisible(true)}
        />

        <DetailOption
          icon="🔄"
          text={formatRepeatDisplay(selectedTask.repeat)}
          isActive={selectedTask.repeat && selectedTask.repeat !== "none"}
          onPress={() => setRepeatVisible(true)}
        />

        <DetailOption
          icon="📝"
          text={selectedTask.note ? "View note" : "Add note"}
          subText={selectedTask.note || undefined}
          isActive={!!selectedTask.note}
          onPress={() => setNoteVisible(true)}
        />
      </View>

      <View style={rightPanelStyles.taskDetailFooter}>
        <Text style={rightPanelStyles.createdDate}>Created today</Text>
      </View>

      <CalendarPickerModal
        visible={calendarVisible}
        currentDate={selectedTask.dueDate}
        onSelect={handleDateSelect}
        onClose={() => setCalendarVisible(false)}
      />

      <ReminderModal
        visible={reminderVisible}
        currentReminder={selectedTask.reminder}
        dueDate={selectedTask.dueDate}
        onSelect={handleReminderSelect}
        onClose={() => setReminderVisible(false)}
      />

      <RepeatModal
        visible={repeatVisible}
        currentRepeat={selectedTask.repeat}
        onSelect={handleRepeatSelect}
        onClose={() => setRepeatVisible(false)}
      />

      <NoteModal
        visible={noteVisible}
        currentNote={selectedTask.note}
        onSave={handleNoteSave}
        onClose={() => setNoteVisible(false)}
      />
    </View>
  );
};

export default RightPanel;
