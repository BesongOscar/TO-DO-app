/**
 * ListHeaderMenu - Sort and action menu for task lists
 * 
 * Drop-up modal with sort options (order, name, due date, importance),
 * bulk actions (mark all complete, delete completed), and custom list
 * management (edit/delete list).
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
import { listHeaderMenuStyles as styles } from "../styles/components/ListHeaderMenu";
import { ListItem, SortBy } from "../types";

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

const SORT_OPTIONS: { key: SortBy; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "order",     label: "Default order",  icon: "list-outline" },
  { key: "name",      label: "Name",            icon: "text-outline" },
  { key: "dueDate",   label: "Due date",        icon: "calendar-outline" },
  { key: "important", label: "Importance",      icon: "star-outline" },
];

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
  const isCustomList = currentList.filterKey === "listId";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          {/* Drag handle visual */}
          <View style={styles.handle} />

          {/* Sort section */}
          <Text style={styles.sectionTitle}>Sort by</Text>
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
                color="#323130"
                style={styles.menuIcon}
              />
              <Text style={styles.menuItemText}>{option.label}</Text>
              {sortBy === option.key && (
                <Ionicons name="checkmark" size={18} color="#0078d4" style={styles.checkmark} />
              )}
            </TouchableOpacity>
          ))}

          {/* Divider + Actions section */}
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Actions</Text>

          <TouchableOpacity
            style={[styles.menuItem, pendingCount === 0 && { opacity: 0.4 }]}
            onPress={() => { onMarkAllComplete(); onClose(); }}
            disabled={pendingCount === 0}
            activeOpacity={0.7}
          >
            <Ionicons
              name="checkmark-done-outline"
              size={18}
              color="#107c10"
              style={styles.menuIcon}
            />
            <Text style={styles.menuItemText}>
              Mark all complete ({pendingCount})
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
              color="#d13438"
              style={styles.menuIcon}
            />
            <Text style={[styles.menuItemText, styles.menuItemDestructive]}>
              Delete completed ({completedCount})
            </Text>
          </TouchableOpacity>

          {/* Custom list management section */}
          {isCustomList && onEditList && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>List</Text>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => { onEditList(); onClose(); }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="pencil-outline"
                  size={18}
                  color="#323130"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuItemText}>Edit list</Text>
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
                    color="#d13438"
                    style={styles.menuIcon}
                  />
                  <Text style={[styles.menuItemText, styles.menuItemDestructive]}>
                    Delete list
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {/* Cancel */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ListHeaderMenu;