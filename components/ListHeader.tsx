import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useThemeStyles } from "../src/hooks/useThemeStyles";
import { createListHeaderStyles } from "../styles/components/ListHeader";

interface ListHeaderProps {
  title: string;
  date: string;
  onMoreOptions?: () => void;
}

const ListHeader: React.FC<ListHeaderProps> = ({ title, date, onMoreOptions }) => {
  const styles = useThemeStyles(createListHeaderStyles);
  return (
    <View style={styles.listHeader}>
      <View style={styles.listTitleSection}>
        <Text style={styles.listTitle}>{title}</Text>
        <Text style={styles.listDate}>{date}</Text>
      </View>
      <TouchableOpacity style={styles.moreOptionsButton} onPress={onMoreOptions}>
        <Text style={styles.moreOptionsIcon}>⋯</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ListHeader;
