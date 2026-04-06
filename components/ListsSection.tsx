import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import styles from "../styles/styles";
import { SidebarItem } from "./SideBarItem";
import { ListItem, CustomList } from "../types";
import CustomListModal from "./CustomListModal";
import { useCustomLists } from "../context/CustomListsContext";

interface ListsSectionProps {
  customLists: CustomList[];
  currentList: ListItem | null;
  onSelectList: (item: ListItem) => void;
  onDeleteList?: (listId: string) => void;
}

const ListsSection: React.FC<ListsSectionProps> = ({
  customLists,
  currentList,
  onSelectList,
  onDeleteList,
}) => {
  const { addList, updateList } = useCustomLists();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingList, setEditingList] = useState<CustomList | null>(null);

  const handleAddPress = () => {
    setEditingList(null);
    setModalVisible(true);
  };

  const handleLongPress = (list: CustomList) => {
    setEditingList(list);
    setModalVisible(true);
  };

  const handleSave = (name: string, icon: string) => {
    if (editingList) {
      updateList(editingList.id, { name, icon });
    } else {
      addList(name, icon);
    }
  };

  const handleDelete = () => {
    if (editingList && onDeleteList) {
      onDeleteList(editingList.id);
    }
  };

  return (
    <View style={styles.listsSection}>
      <View style={styles.listsSectionHeader}>
        <Text style={styles.listsSectionTitle}>Lists</Text>
        <TouchableOpacity onPress={handleAddPress}>
          <Text style={styles.addListButton}>+</Text>
        </TouchableOpacity>
      </View>

      {customLists.map((list) => (
        <SidebarItem
          key={list.id}
          item={{
            id: list.id,
            name: list.name,
            icon: list.icon,
            filterKey: "listId",
          }}
          isSelected={currentList?.id === list.id}
          onSelectList={onSelectList}
          onLongPress={() => handleLongPress(list)}
        />
      ))}

      <CustomListModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        onDelete={editingList && onDeleteList ? handleDelete : undefined}
        initialData={editingList}
      />
    </View>
  );
};

export default ListsSection;
