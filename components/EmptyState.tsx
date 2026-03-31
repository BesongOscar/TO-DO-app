import React from "react";
import { View, Text, StyleSheet,Image } from "react-native";

interface EmptyStateProps {
  title: string;
  message: string;
}
const Placeholder = require("assets/empty.png")

const EmptyState: React.FC<EmptyStateProps> = ({ title, message }) => {
  return (
    <View style={styles.container}>
      <Image source={Placeholder} style={styles.image}/>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#323130",
    marginBottom: 8,
    marginTop: 20,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#605e5c",
    textAlign: "center",
  },
  image: {
    height: 250,
    width: 250
  }
});

export default EmptyState;
