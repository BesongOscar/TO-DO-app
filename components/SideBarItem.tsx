import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useThemeStyles } from "../src/hooks/useThemeStyles";
import { createSideBarItemStyles } from "../styles/components/SideBarItem";
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
  const styles = useThemeStyles(createSideBarItemStyles);
  if (!item) return null;

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selected]}
      onPress={() => onSelectList(item)}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <Text style={styles.iconText}>{item.icon}</Text>
        <Text style={styles.itemText}>{item.name}</Text>
      </View>

      {item.count !== undefined && (
        <Text style={styles.count}>{item.count}</Text>
      )}
    </TouchableOpacity>
  );
};
