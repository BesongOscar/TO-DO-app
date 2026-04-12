import React from "react";
import { View, Text, Image } from "react-native";
import { emptyStateStyles } from "../styles/components/EmptyState";

interface EmptyStateProps {
  title: string;
  message: string;
}
const Placeholder = require("assets/empty.png")

const EmptyState: React.FC<EmptyStateProps> = ({ title, message }) => {
  return (
    <View style={emptyStateStyles.container}>
      <Image source={Placeholder} style={emptyStateStyles.image}/>
      <Text style={emptyStateStyles.title}>{title}</Text>
      <Text style={emptyStateStyles.message}>{message}</Text>
    </View>
  );
};

export default EmptyState;
