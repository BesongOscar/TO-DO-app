/**
 * EmptyState - Placeholder shown when a list has no tasks
 * 
 * Displays an image, title, and message to guide the user.
 * Used across different views (My Day, custom lists, search).
 */

import React from "react";
import { View, Text, Image } from "react-native";
import { useThemeStyles } from "../src/hooks/useThemeStyles";
import { createEmptyStateStyles } from "../styles/components/EmptyState";

interface EmptyStateProps {
  title: string;
  message: string;
}
const Placeholder = require("assets/empty.png")

const EmptyState: React.FC<EmptyStateProps> = ({ title, message }) => {
  const styles = useThemeStyles(createEmptyStateStyles);
  return (
    <View style={styles.container}>
      <Image source={Placeholder} style={styles.image}/>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};



export default EmptyState;
