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
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import { mainStyles } from "../styles/app/main";
import Header from "../components/Index/header";
import Sidebar from "../components/SideBar";
import MainContent from "../components/Index/MainContent";
import RightPanel from "../components/Index/RightPanel";
import BottomSheet from "../components/Index/BottomSheet";
import { sidebarLists } from "../constants/Lists";
import { ListItem } from "../types";
import { useTasks } from "../context/TasksContext";
import { useAuth } from "../src/context/AuthContext";
import { useCustomLists } from "../context/CustomListsContext";

const App: React.FC = () => {
  const {
    tasks,
    counts,
    loading,
    refreshing,
    addTask,
    toggleTask,
    toggleImportant,
    deleteTask,
    deleteTasksByListId,
    updateTask,
    refreshTasks,
  } = useTasks();

  const { customLists, deleteList } = useCustomLists();

  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

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

  const sidebarAnimRef = useRef<Animated.Value>(new Animated.Value(-280));

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user]);

  if (authLoading || !user) {
    return (
      <SafeAreaView style={mainStyles.container}>
        <View style={mainStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#0078d4" />
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={mainStyles.container}>
        <View style={mainStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#0078d4" />
        </View>
      </SafeAreaView>
    );
  }

  const selectedTask = tasks.find((task) => task.id === selectedTaskId);

  const toggleSidebar = (): void => {
    if (sidebarVisible) {
      Animated.timing(sidebarAnimRef.current, {
        toValue: -280,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setSidebarVisible(false));
    } else {
      setSidebarVisible(true);
      Animated.timing(sidebarAnimRef.current, {
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

  const handleDeleteListWithTasks = (listId: string): void => {
    deleteTasksByListId(listId);
    deleteList(listId);
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

  const filteredTasks = searchQuery
    ? tasks.filter((t) =>
        t.text.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : tasks;

  return (
    <SafeAreaView style={mainStyles.container}>
      {searchVisible ? (
        <View style={mainStyles.searchHeader}>
          <TouchableWithoutFeedback
            onPress={() => {
              setSearchVisible(false);
              setSearchQuery("");
            }}
          >
            <View style={mainStyles.searchBackButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </View>
          </TouchableWithoutFeedback>
          <TextInput
            style={mainStyles.searchInput}
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

      <View style={mainStyles.mainContainer}>
        {sidebarVisible && (
          <TouchableWithoutFeedback onPress={toggleSidebar}>
            <View style={mainStyles.overlay} />
          </TouchableWithoutFeedback>
        )}

        {sidebarVisible && (
          <Animated.View
            style={[
              mainStyles.animatedSidebar,
              { transform: [{ translateX: sidebarAnimRef.current! }] },
            ]}
          >
            <Sidebar
              sidebarLists={liveSidebarLists}
              customLists={customLists}
              currentList={currentList}
              onSelectList={(list: ListItem) => {
                setCurrentList(list);
                toggleSidebar();
              }}
              onDeleteList={handleDeleteListWithTasks}
            />
          </Animated.View>
        )}

        <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
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
            tasks={searchVisible ? filteredTasks : tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onSelectTask={handleSelectTask}
            onStarToggle={handleStarToggle}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            refreshing={refreshing}
            onRefresh={refreshTasks}
          />

          <BottomSheet
            visible={!!selectedTaskId}
            onClose={() => setSelectedTaskId(null)}
          >
            {selectedTask && (
              <RightPanel
                selectedTask={selectedTask}
                onClose={() => setSelectedTaskId(null)}
                onUpdateTask={updateTask}
              />
            )}
          </BottomSheet>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default App;
