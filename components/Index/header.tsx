import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { headerStyles as styles } from "../../styles/components/Index/header";
import {useAuth} from "@/context/AuthContext";

interface HeaderProps {
  onMenuPress: () => void;
  onSearchPress: () => void;
  onProfilePress: () => void;
  isReorderMode?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onMenuPress,
  onSearchPress,
  onProfilePress,
  isReorderMode = false,
}) => {
  const { userProfile} = useAuth();
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
          {userProfile?.photoURL ? (
              <Image
                source={{ uri: userProfile.photoURL }}
                style={{ width: 30, height: 30, borderRadius: 15 }}
              />
            ) : (
              <View style={{ width: 30, height: 30, alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="person" size={30} color="#fff" />
              </View>
            )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
