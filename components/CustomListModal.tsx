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
import { useThemeStyles } from "../src/hooks/useThemeStyles";
import { useTheme } from "../context/ThemeContext";
import {
  createModalCommonStyles,
  createCustomListModalStyles,
} from "../styles/components/CustomListModal";
import { EMOJI_OPTIONS, customListColors } from "../constants/customList";
import { CustomList } from "../types";
import { useTranslation } from "react-i18next";

interface CustomListModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, icon: string, color: string) => void;
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
  const modalCommonStyles = useThemeStyles(createModalCommonStyles);
  const customListModalStyles = useThemeStyles(createCustomListModalStyles);
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(EMOJI_OPTIONS[0]);
  const [color, setColor] = useState(customListColors[0]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setIcon(initialData.icon);
      setColor(initialData.color);
    } else {
      setName("");
      setIcon(EMOJI_OPTIONS[0]);
      setColor(customListColors[0]);
    }
  }, [initialData, visible]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert(t("errors.something_wrong"), t("lists.list_name_required"));
      return;
    }
    onSave(name.trim(), icon, color);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={modalCommonStyles.modalOverlay}>
        <View style={modalCommonStyles.modalContent}>
          <View style={modalCommonStyles.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <Text style={modalCommonStyles.modalCancelText}>
                {t("common.cancel")}
              </Text>
            </TouchableOpacity>
            <Text style={modalCommonStyles.modalTitle}>
              {initialData ? t("lists.edit_list") : t("lists.new_list")}
            </Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={modalCommonStyles.modalSaveText}>
                {t("common.save")}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={modalCommonStyles.modalBody}>
            <View style={customListModalStyles.listPreview}>
              <View
                style={[
                  customListModalStyles.listPreviewColor,
                  { backgroundColor: color },
                ]}
              />
              <Text style={customListModalStyles.listPreviewIcon}>{icon}</Text>
              <Text style={customListModalStyles.listPreviewName}>
                {name || t("lists.list_name")}
              </Text>
            </View>

            <Text style={customListModalStyles.inputLabel}>
              {t("lists.list_name")}
            </Text>
            <TextInput
              style={customListModalStyles.listNameInput}
              value={name}
              onChangeText={setName}
              placeholder={t("lists.list_name_placeholder")}
              placeholderTextColor={theme.placeholderTextColor}
              maxLength={50}
            />

            <Text style={customListModalStyles.inputLabel}>
              {t("lists.list_icon")}
            </Text>
            <View style={customListModalStyles.emojiGrid}>
              {EMOJI_OPTIONS.map((emoji, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    customListModalStyles.emojiOption,
                    icon === emoji && customListModalStyles.emojiOptionSelected,
                  ]}
                  onPress={() => setIcon(emoji)}
                >
                  <Text style={customListModalStyles.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={customListModalStyles.inputLabel}>
              {t("lists.list_color")}
            </Text>
            <View style={customListModalStyles.colorGrid}>
              {customListColors.map((colorOption, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    customListModalStyles.colorOption,
                    { backgroundColor: colorOption },
                    color === colorOption &&
                      customListModalStyles.colorOptionSelected,
                  ]}
                  onPress={() => setColor(colorOption)}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CustomListModal;
