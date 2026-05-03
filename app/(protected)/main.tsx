/**
 * Main - Primary app screen with sidebar, task list, and task details
 *
 * Layout: Header → Sidebar + Main Content + Bottom Sheet
 * Handles task CRUD, search, and list filtering.
 */

import {
  View,
  Animated,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Keyboard,
  TextInput,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import Header from "../../components/Index/header";
import Sidebar from "../../components/SideBar";
import MainContent from "../../components/Index/MainContent";
import BottomPanel from "../../components/Index/BottomPanel";
import BottomSheet from "../../components/Index/BottomSheet";
import CustomListModal from "../../components/CustomListModal";
import { sidebarLists } from "../../constants/Lists";
import { ListItem, Task } from "../../types";
import { useTasks } from "../../context/TasksContext";
import { useCustomLists } from "../../context/CustomListsContext";
import { mainStyles as styles } from "../../styles/app/main";

const App: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    tasks,
    counts,
    loading,
    refreshing,
    addTask,
    toggleTask,
    toggleImportant,
    deleteTask,
    updateTask,
    refreshTasks,
    reorderTasks,
  } = useTasks();
  const { customLists, addList, updateList, deleteList } = useCustomLists();

  const router = useRouter();
  // Default list selection
  const [currentList, setCurrentList] = useState<ListItem>({
    id: "1",
    name: "My Day",
    icon: "☀️",
    color: "#0078d4",
    filterKey: "myDay",
  });
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchVisible, setSearchVisible] = useState<boolean>(false);
  const [editingList, setEditingList] = useState<ListItem | null>(null);
  const [customListModalVisible, setCustomListModalVisible] =
    useState<boolean>(false);

  const sidebarAnimRef = useRef<Animated.Value | null>(null);
  if (!sidebarAnimRef.current) {
    sidebarAnimRef.current = new Animated.Value(-280);
  }

  if (loading) {
    return (
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <View
          style={[
            styles.loadingContainer,
            {
              flex: 1,
              backgroundColor: "#0078d4",
              paddingTop: insets.top,
            },
          ]}
        >
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </View>
    );
  }

  const toggleSidebar = (): void => {
    if (sidebarVisible) {
      Animated.timing(sidebarAnimRef.current!, {
        toValue: -280,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setSidebarVisible(false));
    } else {
      setSidebarVisible(true);
      Animated.timing(sidebarAnimRef.current!, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleAddTask = (text: string): void => {
    const listId =
      currentList.filterKey === "listId" ? currentList.id : undefined;
    addTask(text, currentList.name, listId);
  };

  const handleToggleTask = (taskId: string): void => {
    toggleTask(taskId);
  };

  const handleStarToggle = (taskId: string): void => {
    toggleImportant(taskId);
  };

  const handleSelectTask = (taskId: string): void => {
    setSelectedTaskId(taskId);
  };

  const handleEditTask = (taskId: string, newText: string): void => {
    updateTask(taskId, { text: newText });
  };

  const handleDeleteTask = (taskId: string): void => {
    deleteTask(taskId);
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
  };

  const handleEditList = (list: ListItem) => {
    setEditingList(list);
    setCustomListModalVisible(true);
  };

  const getCount = (list: ListItem): number => {
    switch (list.filterKey) {
      case "myDay":
        return counts.myDay;
      case "important":
        return counts.important;
      case "completed":
        return counts.completed;
      case "all":
        return counts.all;
      case "planned":
        return counts.planned;
      case "tasks":
        return counts.tasks;
      case "listId":
        return tasks.filter((t) => t.listId === list.id && !t.completed).length;
      default:
        return 0;
    }
  };

  const liveSidebarLists: ListItem[] = sidebarLists.map((l) => ({
    ...l,
    count: getCount(l),
  }));
  const liveCustomLists: ListItem[] = customLists.map((l) => {
    const listItem: ListItem = {
      id: l.id,
      name: l.name,
      icon: l.icon,
      color: l.color,
      filterKey: "listId",
    };
    return {
      ...listItem,
      count: getCount(listItem),
    };
  });

  const filteredTasks = searchQuery
    ? tasks.filter((t) =>
        t.text.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : tasks;

  // Sort tasks: pending by order ascending, completed at bottom
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    if (a.completed && b.completed) return 0;
    return (a.order ?? 0) - (b.order ?? 0);
  });

  const selectedTask =
    selectedTaskId != null
      ? (tasks.find((t) => t.id === selectedTaskId) ?? null)
      : null;

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={{ backgroundColor: "#0078d4", paddingTop: insets.top }}>
        {searchVisible ? (
          <View style={styles.searchHeader}>
            <TouchableWithoutFeedback
              onPress={() => {
                setSearchVisible(false);
                setSearchQuery("");
              }}
            >
              <View style={styles.searchBackButton}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </View>
            </TouchableWithoutFeedback>
            <TextInput
              style={styles.searchInput}
              placeholder="Search tasks..."
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>
        ) : (
          <Header
            onMenuPress={toggleSidebar}
            onSearchPress={() => setSearchVisible(true)}
            onProfilePress={() => router.push("/settings")}
          />
        )}
      </View>

      <View style={styles.mainContainer}>
        {sidebarVisible && (
          <TouchableWithoutFeedback onPress={toggleSidebar}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
        )}

        {sidebarVisible && (
          <Animated.View
            style={[
              styles.animatedSidebar,
              {
                transform: [{ translateX: sidebarAnimRef.current! }],
              },
            ]}
          >
            <Sidebar
              sidebarLists={liveSidebarLists}
              customLists={liveCustomLists}
              currentList={currentList}
              onSelectList={(list: ListItem) => {
                setCurrentList(list);
                toggleSidebar();
              }}
              onAddCustomList={() => {
                setCustomListModalVisible(true);
                setEditingList(null);
              }}
              onEditList={handleEditList}
            />
          </Animated.View>
        )}

        <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <MainContent
              currentList={
                searchVisible
                  ? {
                      id: "search",
                      name: "Search Results",
                      icon: "🔍",
                      color: "#0078d4",
                      filterKey: "all",
                    }
                  : currentList
              }
              tasks={sortedTasks}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onSelectTask={handleSelectTask}
              onStarToggle={handleStarToggle}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onReorderTasks={reorderTasks}
              refreshing={refreshing}
              onRefresh={refreshTasks}
            />
          </View>
        </Pressable>

        <BottomSheet
          visible={selectedTask != null}
          onClose={() => setSelectedTaskId(null)}
        >
          {selectedTask != null && (
            <BottomPanel
              selectedTask={selectedTask}
              onClose={() => setSelectedTaskId(null)}
              onUpdateTask={updateTask}
            />
          )}
        </BottomSheet>

        <CustomListModal
          visible={customListModalVisible}
          onClose={() => {
            setCustomListModalVisible(false);
            setEditingList(null);
          }}
          onSave={(name, icon) => {
            if (editingList) {
              // EDIT MODE: update existing list
              updateList(editingList.id, { name, icon });
              setEditingList(null);
            } else {
              // CREATE MODE: add new list
              const created = addList(name, icon);
              setCurrentList({
                id: created.id,
                name: created.name,
                icon: created.icon,
                color: created.color,
                filterKey: "listId",
              });
            }
          }}
          onDelete={
            editingList
              ? () => {
                  deleteList(editingList.id);
                  setCustomListModalVisible(false);
                  setEditingList(null);
                  if (currentList?.id === editingList.id) {
                    setCurrentList({
                      id: "1",
                      name: "My Day",
                      icon: "☀️",
                      color: "#0078d4",
                      filterKey: "myDay",
                    });
                  }
                }
              : undefined
          }
          initialData={
            editingList
              ? {
                  id: editingList.id,
                  name: editingList.name,
                  icon: editingList.icon,
                  color: editingList.color,
                  taskCount: 0,
                  createdAt: Date.now(),
                }
              : undefined
          }
        />
      </View>
    </View>
  );
};

export default App;
