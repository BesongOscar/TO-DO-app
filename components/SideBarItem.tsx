import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { sideBarStyles as styles } from "../styles/components/SideBar";
import { ListItem } from "../types";

interface SidebarItemProps {
  item: ListItem;
  isSelected: boolean;
  onSelectList: (item: ListItem) => void;
  onLongPress?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  onSelectList,
  isSelected,
  onLongPress,
}) => {
  if (!item) return null;

  return (
    <TouchableOpacity
      style={[styles.sidebarItem, isSelected && styles.sidebarItemSelected]}
      onPress={() => onSelectList(item)}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.sidebarItemLeft}>
        <Text style={styles.sidebarIconText}>{item.icon}</Text>
        <Text style={styles.sidebarItemText}>{item.name}</Text>
      </View>

      {item.count !== undefined && (
        <Text style={styles.sidebarCount}>{item.count}</Text>
      )}
    </TouchableOpacity>
  );
};
