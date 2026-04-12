import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { modalCommonStyles } from "../styles/modals/common";
import { customListModalStyles } from "../styles/components/CustomListModal";
import { CustomList } from "../types";

const EMOJI_OPTIONS = [
  "📋", "🏠", "💼", "🎯", "📚", "🎮", "🎨", "🎵",
  "🏋️", "🛒", "💰", "✈️", "🍕", "💊", "📞", "🔧",
  "🌟", "❤️", "🔥", "💡", "📷", "🎬", "🏆", "🎁",
];

interface CustomListModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, icon: string) => void;
  onDelete?: () => void;
  initialData?: CustomList | null;
}

const CustomListModal: React.FC<CustomListModalProps> = ({
  visible,
  onClose,
  onSave,
  onDelete,
  initialData,
}) => {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(EMOJI_OPTIONS[0]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setIcon(initialData.icon);
    } else {
      setName("");
      setIcon(EMOJI_OPTIONS[0]);
    }
  }, [initialData, visible]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Error", "List name is required");
      return;
    }
    onSave(name.trim(), icon);
    onClose();
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete List",
      "This will also delete all tasks in this list. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            onDelete?.();
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={modalCommonStyles.modalOverlay}>
        <View style={modalCommonStyles.modalContent}>
          <View style={modalCommonStyles.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <Text style={modalCommonStyles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={modalCommonStyles.modalTitle}>
              {initialData ? "Edit List" : "New List"}
            </Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={modalCommonStyles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={modalCommonStyles.modalBody}>
            <View style={customListModalStyles.listPreview}>
              <Text style={customListModalStyles.listPreviewIcon}>{icon}</Text>
              <Text style={customListModalStyles.listPreviewName}>{name || "List Name"}</Text>
            </View>

            <Text style={customListModalStyles.inputLabel}>Name</Text>
            <TextInput
              style={customListModalStyles.listNameInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter list name"
              placeholderTextColor="#8a8886"
              maxLength={50}
            />

            <Text style={customListModalStyles.inputLabel}>Icon</Text>
            <View style={customListModalStyles.emojiGrid}>
              {EMOJI_OPTIONS.map((emoji, i) => (
                <TouchableOpacity
                  key={i}
                  style={[customListModalStyles.emojiOption, icon === emoji && customListModalStyles.emojiOptionSelected]}
                  onPress={() => setIcon(emoji)}
                >
                  <Text style={customListModalStyles.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {initialData && onDelete && (
              <TouchableOpacity style={customListModalStyles.deleteListButton} onPress={handleDelete}>
                <Text style={customListModalStyles.deleteListText}>Delete List</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CustomListModal;
