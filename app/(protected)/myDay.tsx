import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useTasks } from "../../context/TasksContext";
import ListScreens from "../../components/ListScreens";
import { ListItem } from "../../types";

const myDayList: ListItem = {
  id: "1",
  name: "My Day",
  icon: "☀️",
  color: "#0078d4",
  filterKey: "myDay",
};

export default function MyDayScreen() {
  const { userProfile } = useAuth();
  const { tasks, addTask } = useTasks();
  const greeting =
    "Hi " + (userProfile?.name?.split(" ")[0] || "there") + " 👋";

  return (
    <ListScreens
      currentList={myDayList}
      tasks={tasks}
      headerTitle={greeting}
      onAddTask={(text) => addTask(text, "My Day")}
    />
  );
}
