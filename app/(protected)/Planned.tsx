import React from "react";
import { useTasks } from "../../context/TasksContext";
import ListScreens from "../../components/ListScreens";
import { ListItem } from "../../types";

const plannedList: ListItem = {
  id: "3",
  name: "Planned",
  icon: "📅",
  color: "#107c10",
  filterKey: "planned",
};

export default function PlannedScreen() {
  const { tasks, addTask } = useTasks();

  return (
    <ListScreens
      currentList={plannedList}
      tasks={tasks}
      headerTitle="Scheduled Tasks"
      onAddTask={addTask}
    />
  );
}
