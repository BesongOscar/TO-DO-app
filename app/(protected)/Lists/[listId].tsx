/**
 * [listId] - Dynamic list detail screen
 * 
 * Renders tasks for a specific list (default or custom).
 * Supports editing/deleting custom lists and adding tasks.
 * Uses ListScreens shared component for task display.
 */

import React, { useMemo, useState, useCallback } from "react";
import { View, Text, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { sidebarLists } from "../../../constants/Lists";
import { useCustomLists } from "../../../context/CustomListsContext";
import { useTasks } from "../../../context/TasksContext";
import ListScreens from "../../../components/ListScreens";
import CustomListModal from "../../../components/CustomListModal";
import { ListItem } from "../../../types";

export default function ListDetailScreen() {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { tasks, addTask } = useTasks();
  const { customLists, updateList, deleteList } = useCustomLists();
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

  const handleAddTask = (text: string) => {
    if (!currentList) return;
    if (currentList.filterKey === "listId") {
      addTask(text, currentList.name, currentList.id);
    } else if (currentList.name === "My Day") {
      addTask(text, "My Day");
    } else {
      addTask(text, currentList.name);
    }
  };

  if (!currentList) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: insets.top }}>
        <Text>List not found</Text>
      </View>
    );
  }

  return (
    <>
      <ListScreens
        currentList={currentList}
        tasks={tasks}
        headerTitle={""}
        onAddTask={handleAddTask}
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
            createdAt: Date.now(),
          }}
        />
      )}
    </>
  );
}
