/**
 * Sidebar - Left navigation panel showing default and custom lists
 *
 * Uses SectionList to group preset lists (My Day, Important, etc.)
 * with user-created custom lists. Handles list selection.
 */

import React from "react";
import { View, SectionList, TouchableOpacity, Text } from "react-native";
import { sideBarStyles as styles } from "../styles/components/SideBar";
import { SidebarItem } from "./SideBarItem";
import { ListItem } from "../types";

interface SidebarProps {
  sidebarLists: ListItem[];
  customLists: ListItem[];
  currentList: ListItem | null;
  onSelectList: (item: ListItem) => void;
  onAddCustomList?: () => void;
  onEditList?: (item: ListItem) => void;
}

type SidebarSection = {
  key: "preset" | "custom";
  data: ListItem[];
};

const Sidebar: React.FC<SidebarProps> = ({
  sidebarLists,
  customLists,
  currentList,
  onSelectList,
  onAddCustomList,
  onEditList,
}) => {
  const sections: SidebarSection[] = [
    { key: "preset", data: sidebarLists },
    { key: "custom", data: customLists },
  ];

  return (
    <View style={styles.sidebar}>
      <SectionList<ListItem, SidebarSection>
        contentContainerStyle={styles.sidebarContainer}
        style={styles.sidebarList}
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section }) =>
          section.key === "custom" ? (
            <View style={styles.listsSection}>
              <View style={styles.listsSectionHeader}>
                <Text style={styles.listsSectionTitle}>Custom Lists</Text>
                <TouchableOpacity onPress={() => onAddCustomList?.()}>
                  <Text style={styles.addListButton}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.listsSection}>
              <View style={styles.listsSectionHeader}>
                <Text style={styles.listsSectionTitle}>Default Lists</Text>
              </View>
            </View>
          )
        }
        renderItem={({ item, section }) => (
          <SidebarItem
            item={item}
            isSelected={currentList?.id === item.id}
            onSelectList={onSelectList}
            onLongPress={
              section.key === "custom" ? () => onEditList?.(item) : undefined
            }
          />
        )}
      />
    </View>
  );
};

export default Sidebar;
