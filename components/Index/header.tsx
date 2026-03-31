import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles/styles";

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
    <View style={styles.topHeader}>
      {/* Left side: Menu + App Title */}
      <View style={styles.headerLeft}>
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress} accessibilityLabel="Open menu" accessibilityRole="button">
          <Ionicons name="menu" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.appTitle}>To Do</Text>
      </View>

      {/* Right side: Search + Profile */}
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.iconButton} onPress={onSearchPress} accessibilityLabel="Search tasks" accessibilityRole="button">
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onProfilePress} accessibilityLabel="Profile" accessibilityRole="button">
          <Ionicons name="person-circle" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
