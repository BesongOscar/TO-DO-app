import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { listHeaderStyles } from "../styles/components/ListHeader";

interface ListHeaderProps {
  title: string;
  date: string;
}

const ListHeader: React.FC<ListHeaderProps> = ({ title, date }) => {
  return (
    <View style={listHeaderStyles.listHeader}>
      <View style={listHeaderStyles.listTitleSection}>
        <Text style={listHeaderStyles.listTitle}>{title}</Text>
        <Text style={listHeaderStyles.listDate}>{date}</Text>
      </View>
      <TouchableOpacity style={listHeaderStyles.moreOptionsButton}>
        <Text style={listHeaderStyles.moreOptionsIcon}>⋯</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ListHeader;
