import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { bottomPanelStyles as styles } from "../../styles/components/Index/BottomPanel";
import DetailOption from "../DetailOption";
import { Task } from "../../types";
import CalendarPickerModal from "../Modals/CalendarPickerModal";
import ReminderModal from "../Modals/ReminderModal";
import RepeatModal from "../Modals/RepeatModal";
import NoteModal from "../Modals/NoteModal";

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
  const [modalType, setModalType] = useState<string | null>(null);

  if (!selectedTask) return null;

  const handleOptionPress = (text: string) => {
    if (text === "Add due date") setModalType("calendar");
    else if (text === "Remind me") setModalType("reminder");
    else if (text === "Repeat") setModalType("repeat");
    else if (text === "Add note") setModalType("note");
  };

  const closeModal = () => setModalType(null);

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
        {DETAIL_OPTIONS.map((option) => (
          <DetailOption
            key={option.text}
            icon={option.icon}
            text={option.text}
            onPress={() => handleOptionPress(option.text)}
          />
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.taskDetailFooter}>
        <Text style={styles.createdDate}>Created today</Text>
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
