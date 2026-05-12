/**
 * ListsIndexScreen - All lists overview
 *
 * Shows default lists (My Day, Important, etc.) and custom lists
 * in a FlatList. Navigates to list detail on tap.
 * Replaces the sidebar from the old main monolithic layout.
 */

import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useNavigation } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { sidebarLists } from "../../../constants/Lists";
import { useCustomLists } from "../../../context/CustomListsContext";
import { useTasks } from "../../../context/TasksContext";
import { CustomList, TaskCounts } from "../../../types";
import CustomListModal from "../../../components/CustomListModal";
import { useThemeStyles } from "../../../hooks/useThemeStyles";

interface ListEntry {
  key: string;
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
  isCustom: boolean;
}

export default function ListsIndexScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const navigation = useNavigation();
  const { counts } = useTasks();
  const { customLists, addList } = useCustomLists();
  const [modalVisible, setModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons
            name="add"
            size={28}
            color="#fff"
            style={{ marginRight: 16 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const defaultLists: ListEntry[] = sidebarLists.map((list) => ({
    key: `default-${list.id}`,
    id: list.id,
    name: list.name,
    icon: list.icon,
    color: list.color,
    count: counts[list.filterKey as keyof TaskCounts] ?? 0,
    isCustom: false,
  }));

  const customListEntries: ListEntry[] = customLists.map((list) => ({
    key: `custom-${list.id}`,
    id: list.id,
    name: list.name,
    icon: list.icon,
    color: list.color,
    count: list.taskCount,
    isCustom: true,
  }));

  const allLists = [...defaultLists, ...customListEntries];

  const styles = useThemeStyles(createListsIndexStyles);

  const handleSelectList = (entry: ListEntry) => {
    router.push(`/(protected)/Lists/${entry.id}`);
  };

  const handleAddCustomList = (name: string, icon: string) => {
    addList(name, icon);
    setModalVisible(false);
  };

  const renderItem = ({ item }: { item: ListEntry }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => handleSelectList(item)}
      activeOpacity={0.6}
    >
      <View
        style={[styles.iconContainer, { backgroundColor: item.color + "20" }]}
      >
        <Text style={styles.icon}>{item.icon}</Text>
      </View>
      <View style={styles.listInfo}>
        <Text style={styles.listName}>{item.name}</Text>
      </View>
      <View style={styles.countContainer}>
        <Text style={styles.count}>{item.count}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container]}>
      <FlatList
        data={allLists}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.list}
      />
      <CustomListModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddCustomList}
      />
    </View>
  );
}

import { createListsIndexStyles } from "../../../styles/app/(protected)/Lists/index";
