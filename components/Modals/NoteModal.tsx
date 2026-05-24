/**
 * NoteModal - Bottom sheet for adding or editing a task note
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
} from "react-native";
import { useThemeStyles } from "../../src/hooks/useThemeStyles";
import { useTheme } from "../../context/ThemeContext";
import { createNoteModalStyles } from "../../styles/components/Modals/NoteModal";
import { useTranslation } from "react-i18next";

interface NoteModalProps {
  visible: boolean;
  currentNote: string | undefined;
  onSave: (note: string) => void;
  onClose: () => void;
}

const NoteModal: React.FC<NoteModalProps> = ({
  visible,
  currentNote,
  onSave,
  onClose,
}) => {
  const styles = useThemeStyles(createNoteModalStyles);
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [noteText, setNoteText] = useState<string>(currentNote || "");

  /**
   * Two triggers cover all cases:
   *   1. `currentNote` changes — different task selected while modal stays
   *      mounted.
   *   2. `visible` flips to true — modal re-opens, possibly for a different
   *      task, so reset to whatever `currentNote` is at that moment.
   */
  useEffect(() => {
    if (visible) {
      setNoteText(currentNote || "");
    }
  }, [visible, currentNote]);

  const handleSave = () => {
    onSave(noteText.trim());
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
          <Text style={styles.title}>{t("note.title")}</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder={t("note.placeholder")}
              placeholderTextColor={theme.placeholderTextColor}
              value={noteText}
              onChangeText={setNoteText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              autoFocus
            />
          </View>

          {noteText.length > 0 && (
            <Text style={styles.charCount}>
              {t("note.characters", { count: noteText.length })}
            </Text>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>{t("common.cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveButton,
                !noteText.trim() && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={!noteText.trim()}
            >
              <Text
                style={[
                  styles.saveText,
                  !noteText.trim() && styles.saveTextDisabled,
                ]}
              >
                {t("common.save")}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default NoteModal;
