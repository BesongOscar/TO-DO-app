import React, { useState, useLayoutEffect, useMemo } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useThemeStyles } from "../../hooks/useThemeStyles";
import { createMyDayStyles } from "../../styles/app/(protected)/myDay";
import { useTasks } from "../../context/TasksContext";
import MainContent from "../../components/Index/MainContent";
import { ListItem } from "../../types";

const myDayList: ListItem = {
  id: "1",
  name: "My Day",
  icon: "☀️",
  color: "#0078d4",
  filterKey: "myDay",
};

export default function MyDayScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user } = useAuth();
  const {
    tasks,
    addTask,
    toggleTask,
    toggleImportant,
    deleteTask,
    updateTask,
    reorderTasks,
    refreshing,
    refreshTasks,
    setSelectedTaskId,
  } = useTasks();
  const { theme } = useTheme();
  const styles = useThemeStyles(createMyDayStyles);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useLayoutEffect(() => {
    if (searchMode) {
      navigation.setOptions({ headerShown: false });
    } else {
      navigation.setOptions({
        headerShown: true,
        headerTitle:
          "Hi " + (user?.displayName?.split(" ")[0] || "there") + " 👋",
        headerRight: () => (
          <View style={styles.headerRightRow}>
            <TouchableOpacity onPress={() => setSearchMode(true)}>
              <Ionicons
                name="search"
                size={24}
                color="#fff"
                style={styles.headerIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // Placeholder for more options
              }}
            >
              <Ionicons
                name="ellipsis-vertical"
                size={24}
                color="#fff"
                style={styles.headerIcon}
              />
            </TouchableOpacity>
          </View>
        ),
      });
    }
  }, [searchMode, navigation, user]);

  const displayedTasks = useMemo(() => {
    if (!searchMode || !searchQuery.trim()) return tasks;
    const q = searchQuery.toLowerCase().trim();
    return tasks.filter((t) => t.text.toLowerCase().includes(q));
  }, [tasks, searchMode, searchQuery]);

  return (
    <View style={styles.container}>
      {searchMode ? (
        <View
          style={[
            styles.searchBar,
            { paddingTop: insets.top },
          ]}
        >
          <Ionicons name="search" size={20} color="#fff" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            placeholder="Search tasks..."
            placeholderTextColor="rgba(255,255,255,0.6)"
          />
          <TouchableOpacity
            onPress={() => {
              setSearchMode(false);
              setSearchQuery("");
            }}
          >
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <MainContent
        currentList={myDayList}
        tasks={displayedTasks}
        onAddTask={(text) => addTask(text, "My Day")}
        onToggleTask={toggleTask}
        onSelectTask={(id: string) => setSelectedTaskId(id)}
        onStarToggle={toggleImportant}
        onEdit={(id: string, text: string) => updateTask(id, { text })}
        onDelete={deleteTask}
        onReorderTasks={reorderTasks}
        refreshing={refreshing}
        onRefresh={refreshTasks}
      />
    </View>
  );
}
