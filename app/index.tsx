import { View, Animated, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useRef } from "react";
import styles from "../styles/styles";
import Header from "../components/Index/header";
import Sidebar from "../components/SideBar";
import MainContent from "../components/Index/MainContent";
import RightPanel from "../components/Index/RightPanel";
import { sidebarLists, customLists } from "../constants/Lists";
import { ListItem } from "../types";
import { useTasks } from "../context/TasksContext";

const App: React.FC = () => {
  const {
    tasks,
    counts,
    addTask,
    toggleTask,
    toggleImportant,
    deleteTask,
    updateTask,
  } = useTasks();

  const [currentList, setCurrentList] = useState<ListItem>(
    { id: "1", name: "My Day", icon: "☀️", color: "#0078d4", filterKey: "myDay" }
  );
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);

  const selectedTask = tasks.find((task) => task.id === selectedTaskId);

  const sidebarAnim = useRef(new Animated.Value(-280)).current;

  const toggleSidebar = (): void => {
    if (sidebarVisible) {
      Animated.timing(sidebarAnim, {
        toValue: -280,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setSidebarVisible(false));
    } else {
      setSidebarVisible(true);
      Animated.timing(sidebarAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleAddTask = (text: string): void => {
    addTask(text, currentList.name);
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
  const liveCustomLists: ListItem[] = customLists.map((l) => ({
    ...l,
    count: getCount(l),
  }));

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onMenuPress={toggleSidebar}
        onSearchPress={() => console.log("Search pressed")}
        onProfilePress={() => console.log("Profile pressed")}
      />

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
              { transform: [{ translateX: sidebarAnim }] },
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
            />
          </Animated.View>
        )}

        <MainContent
          currentList={currentList}
          tasks={tasks}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
          onSelectTask={handleSelectTask}
          onStarToggle={handleStarToggle}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />

        {selectedTaskId && tasks.find((t) => t.id === selectedTaskId) && (
          <RightPanel
            selectedTask={tasks.find((t) => t.id === selectedTaskId)!}
            onClose={() => setSelectedTaskId(null)}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default App;
