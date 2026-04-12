import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { sideBarStyles } from "../styles/components/SideBar";
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
      style={[sideBarStyles.sidebarItem, isSelected && sideBarStyles.sidebarItemSelected]}
      onPress={() => onSelectList(item)}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={sideBarStyles.sidebarItemLeft}>
        <Text style={sideBarStyles.sidebarIconText}>{item.icon}</Text>
        <Text style={sideBarStyles.sidebarItemText}>{item.name}</Text>
      </View>
      {item.count !== undefined && (
        <Text style={sideBarStyles.sidebarCount}>{item.count}</Text>
      )}
    </TouchableOpacity>
  );
};
