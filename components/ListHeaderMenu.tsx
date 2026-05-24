/**
 * ListHeaderMenu - Dropdown menu for list-level actions
 * 
 * Provides sort options (default, name, due date, importance),
 * bulk actions (mark all done, clear completed), and list edit/delete.
 * Uses i18n translations and theme-aware styles.
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useThemeStyles } from "../src/hooks/useThemeStyles";
import { useTheme } from "../context/ThemeContext";
import { createListHeaderMenuStyles } from "../styles/components/ListHeaderMenu";
import { ListItem, SortBy } from "../types";
import { useTranslation } from "react-i18next";

interface ListHeaderMenuProps {
  visible: boolean;
  onClose: () => void;
  currentList: ListItem;
  sortBy: SortBy;
  onSortChange: (sortBy: SortBy) => void;
  onMarkAllComplete: () => void;
  onDeleteCompleted: () => void;
  onEditList?: () => void;
  onDeleteList?: () => void;
  pendingCount: number;
  completedCount: number;
}

const ListHeaderMenu: React.FC<ListHeaderMenuProps> = ({
  visible,
  onClose,
  currentList,
  sortBy,
  onSortChange,
  onMarkAllComplete,
  onDeleteCompleted,
  onEditList,
  onDeleteList,
  pendingCount,
  completedCount,
}) => {
  const styles = useThemeStyles(createListHeaderMenuStyles);
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isCustomList = currentList.filterKey === "listId";

  const SORT_OPTIONS: { key: SortBy; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: "order",     label: t("listMenu.default_order"), icon: "list-outline" },
    { key: "name",      label: t("listMenu.name"),          icon: "text-outline" },
    { key: "dueDate",   label: t("listMenu.due_date"),      icon: "calendar-outline" },
    { key: "important", label: t("listMenu.importance"),    icon: "star-outline" },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />

          <Text style={styles.sectionTitle}>{t("listMenu.sort_by")}</Text>
          {SORT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={styles.menuItem}
              onPress={() => {
                onSortChange(option.key);
                onClose();
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name={option.icon}
                size={18}
                color={theme.text}
                style={styles.menuIcon}
              />
              <Text style={styles.menuItemText}>{option.label}</Text>
              {sortBy === option.key && (
                <Ionicons name="checkmark" size={18} color={theme.primary} style={styles.checkmark} />
              )}
            </TouchableOpacity>
          ))}

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>{t("listMenu.actions")}</Text>

          <TouchableOpacity
            style={[styles.menuItem, pendingCount === 0 && { opacity: 0.4 }]}
            onPress={() => { onMarkAllComplete(); onClose(); }}
            disabled={pendingCount === 0}
            activeOpacity={0.7}
          >
            <Ionicons
              name="checkmark-done-outline"
              size={18}
              color={theme.success}
              style={styles.menuIcon}
            />
            <Text style={styles.menuItemText}>
              {t("listMenu.mark_all_complete", { count: pendingCount })}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, completedCount === 0 && { opacity: 0.4 }]}
            onPress={() => { onDeleteCompleted(); onClose(); }}
            disabled={completedCount === 0}
            activeOpacity={0.7}
          >
            <Ionicons
              name="trash-outline"
              size={18}
              color={theme.error}
              style={styles.menuIcon}
            />
            <Text style={[styles.menuItemText, styles.menuItemDestructive]}>
              {t("listMenu.delete_completed", { count: completedCount })}
            </Text>
          </TouchableOpacity>

          {isCustomList && onEditList && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>{t("listMenu.list")}</Text>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => { onEditList(); onClose(); }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="pencil-outline"
                  size={18}
                  color={theme.text}
                  style={styles.menuIcon}
                />
                <Text style={styles.menuItemText}>{t("listMenu.edit_list")}</Text>
              </TouchableOpacity>

              {onDeleteList && (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => { onDeleteList(); onClose(); }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color={theme.error}
                    style={styles.menuIcon}
                  />
                  <Text style={[styles.menuItemText, styles.menuItemDestructive]}>
                    {t("listMenu.delete_list")}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>{t("listMenu.cancel")}</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ListHeaderMenu;
