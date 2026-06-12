import React, { useState, useLayoutEffect, useMemo } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ListItem, SortBy, Task } from "../types";
import { useNavigation } from "expo-router";
import { useThemeStyles } from "../src/hooks/useThemeStyles";
import { createListScreensStyles } from "../styles/components/ListScreens";
import { useTasks } from "../context/TasksContext";
import MainContent from "./Index/MainContent";

interface ListScreenProps {
  currentList: ListItem;
  tasks: Task[];
  headerTitle: string;
  onAddTask: (text: string) => void;
  onEditList?: () => void;
  onDeleteList?: () => void;
  editModal?: React.ReactNode;
}

export default function ListScreens({
  currentList,
  tasks,
  headerTitle,
  onAddTask,
  onEditList,
  onDeleteList,
  editModal,
}: ListScreenProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const styles = useThemeStyles(createListScreensStyles);
  const {
    toggleTask,
    toggleImportant,
    deleteTask,
    updateTask,
    reorderTasks,
    refreshing,
    refreshTasks,
    setSelectedTaskId,
    loading,
  } = useTasks();

  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("order");

  useLayoutEffect(() => {
    if (searchMode) {
      navigation.setOptions({ headerShown: false });
    } else {
      navigation.setOptions({
        headerShown: true,
        headerTitle,
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
          </View>
        ),
      });
    }
  }, [searchMode, navigation, headerTitle]);

  const displayedTasks = useMemo(() => {
    if (!searchMode || !searchQuery.trim()) return tasks;
    const q = searchQuery.toLowerCase().trim();
    return tasks.filter((t) => t.text.toLowerCase().includes(q));
  }, [tasks, searchMode, searchQuery]);

  return (
    <View style={{ flex: 1 }}>
      {searchMode ? (
        <View style={[styles.searchBar, { paddingTop: insets.top }]}>
          <Ionicons name="search" size={20} color="#fff" />
            <TextInput
              testID="search-tasks-input"
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
        currentList={currentList}
        tasks={displayedTasks}
        onAddTask={onAddTask}
        onToggleTask={toggleTask}
        onSelectTask={(id: string) => setSelectedTaskId(id)}
        onStarToggle={toggleImportant}
        onEdit={(id: string, text: string) => updateTask(id, { text })}
        onDelete={deleteTask}
        onReorderTasks={reorderTasks}
        refreshing={refreshing}
        onRefresh={refreshTasks}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onEditList={onEditList}
        onDeleteList={onDeleteList}
        loading={loading}
      />

      {editModal}
    </View>
  );
}
