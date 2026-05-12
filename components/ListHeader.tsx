import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useThemeStyles } from "../hooks/useThemeStyles";
import { createListHeaderStyles } from "../styles/components/ListHeader";

interface ListHeaderProps {
  title: string;
  date: string;
}

const ListHeader: React.FC<ListHeaderProps> = ({ title, date}) => {
  const styles = useThemeStyles(createListHeaderStyles);
  return (
    <View style={styles.listHeader}>
      <View style={styles.listTitleSection}>
        <Text style={styles.listTitle}>{title}</Text>
        <Text style={styles.listDate}>{date}</Text>
      </View>
    </View>
  );
};

export default ListHeader;
