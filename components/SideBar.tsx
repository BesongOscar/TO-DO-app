import React from "react";
import { View, FlatList, ScrollView } from "react-native";
import { sideBarStyles } from "../styles/components/SideBar";
import ListsSection from "./ListsSection";
import { SidebarItem } from "./SideBarItem";
import { ListItem, CustomList } from "../types";

interface SidebarProps {
  sidebarLists: ListItem[];
  customLists: CustomList[];
  currentList: ListItem | null;
  onSelectList: (item: ListItem) => void;
  onDeleteList?: (listId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarLists,
  customLists,
  currentList,
  onSelectList,
  onDeleteList,
}) => {
  return (
    <View style={sideBarStyles.sidebar}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={sidebarLists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SidebarItem
              item={item}
              isSelected={currentList?.name === item.name}
              onSelectList={onSelectList}
            />
          )}
          scrollEnabled={false}
        />

        <ListsSection
          customLists={customLists}
          currentList={currentList}
          onSelectList={onSelectList}
          onDeleteList={onDeleteList}
        />
      </ScrollView>
    </View>
  );
};

export default Sidebar;
