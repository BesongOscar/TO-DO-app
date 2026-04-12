import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { headerStyles } from "../../styles/components/Index/header";

interface HeaderProps {
  onMenuPress: () => void;
  onSearchPress: () => void;
  onProfilePress: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onMenuPress,
  onSearchPress,
  onProfilePress,
}) => {
  return (
    <View style={headerStyles.topHeader}>
      <View style={headerStyles.headerLeft}>
        <TouchableOpacity style={headerStyles.menuButton} onPress={onMenuPress} accessibilityLabel="Open menu" accessibilityRole="button">
          <Ionicons name="menu" size={28} color="white" />
        </TouchableOpacity>
        <Text style={headerStyles.appTitle}>To Do</Text>
      </View>

      <View style={headerStyles.headerRight}>
        <TouchableOpacity style={headerStyles.iconButton} onPress={onSearchPress} accessibilityLabel="Search tasks" accessibilityRole="button">
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={headerStyles.iconButton} onPress={onProfilePress} accessibilityLabel="Profile" accessibilityRole="button">
          <Ionicons name="person-circle" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
