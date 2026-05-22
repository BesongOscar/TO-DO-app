import React, { useMemo, useLayoutEffect, useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../../context/ThemeContext";
import { useThemeStyles } from "../../../hooks/useThemeStyles";
import { createListDetailStyles } from "../../../styles/app/(protected)/Lists/listIdStyles";
import { sidebarLists } from "../../../constants/Lists";
import { useCustomLists } from "../../../context/CustomListsContext";
import { useTasks } from "../../../context/TasksContext";
import MainContent from "../../../components/Index/MainContent";
import CustomListModal from "../../../components/CustomListModal";
import { ListItem, SortBy } from "../../../types";

export default function ListDetailScreen() {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();
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
  const { customLists, updateList, deleteList } = useCustomLists();
  const { theme } = useTheme();
  const styles = useThemeStyles(createListDetailStyles);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("order");
  const [editModalVisible, setEditModalVisible] = useState(false);

  const currentList = useMemo<ListItem | null>(() => {
    const sidebar = sidebarLists.find((l) => l.id === listId);
    if (sidebar) return sidebar;

    const custom = customLists.find((l) => l.id === listId);
    if (custom) {
      return {
        id: custom.id,
        name: custom.name,
        icon: custom.icon,
        color: custom.color,
        filterKey: "listId" as const,
      };
    }
    return null;
  }, [listId, customLists]);

  useLayoutEffect(() => {
    if (searchMode) {
      navigation.setOptions({ headerShown: false });
    } else {
      navigation.setOptions({
        headerShown: true,
        // headerTitle: currentList?.name ?? "",
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
  }, [searchMode, navigation, currentList]);

  const displayedTasks = useMemo(() => {
    if (!searchMode || !searchQuery.trim()) return tasks;
    const q = searchQuery.toLowerCase().trim();
    return tasks.filter((t) => t.text.toLowerCase().includes(q));
  }, [tasks, searchMode, searchQuery]);

  const isCustomList = currentList?.filterKey === "listId";

  const handleEditList = useCallback(() => {
    if (!currentList) return;
    setEditModalVisible(true);
  }, [currentList]);

  const handleDeleteList = useCallback(() => {
    if (!currentList) return;
    Alert.alert(
      "Delete List",
      "This will also delete all tasks in this list. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteList(currentList.id);
            router.back();
          },
        },
      ],
    );
  }, [currentList, deleteList, router]);

  const handleSaveList = useCallback(
    (name: string, icon: string) => {
      if (!currentList) return;
      updateList(currentList.id, { name, icon });
      setEditModalVisible(false);
    },
    [currentList, updateList],
  );

  if (!currentList) {
    return (
      <View
        style={[
          styles.notFoundContainer,
          { paddingTop: insets.top },
        ]}
      >
        <Text>List not found</Text>
      </View>
    );
  }

  const handleAddTask = (text: string) => {
    if (currentList.filterKey === "listId") {
      addTask(text, currentList.name, currentList.id);
    } else if (currentList.name === "My Day") {
      addTask(text, "My Day");
    } else {
      addTask(text, currentList.name);
    }
  };

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
        currentList={currentList}
        tasks={displayedTasks}
        onAddTask={handleAddTask}
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
        onEditList={isCustomList ? handleEditList : undefined}
        onDeleteList={isCustomList ? handleDeleteList : undefined}
      />

      {isCustomList && (
        <CustomListModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          onSave={handleSaveList}
          onDelete={handleDeleteList}
          initialData={{
            id: currentList.id,
            name: currentList.name,
            icon: currentList.icon,
            color: currentList.color,
            taskCount: 0,
            createdAt: Date.now(),
          }}
        />
      )}
    </View>
  );
}
