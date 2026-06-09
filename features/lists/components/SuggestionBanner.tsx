import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useThemeStyles } from "../../../src/hooks/useThemeStyles";
import { createSuggestionBannerStyles } from "../../../styles/components/SuggestionBanner";4
import { Ionicons } from "@expo/vector-icons";

interface SuggestionsBannerProps {
  message: string;
  onClose: () => void;
}

const SuggestionsBanner: React.FC<SuggestionsBannerProps> = ({
  message,
  onClose,
}) => {
  const styles = useThemeStyles(createSuggestionBannerStyles);
  return (
    <View style={styles.suggestionsBanner}>
      <View style={styles.suggestionsLeft}>
        <Text style={styles.suggestionsIcon}>🌟</Text>
        <Text style={styles.suggestionsText}>{message}</Text>
      </View>

      <TouchableOpacity
        style={styles.suggestionsCloseButton}
        onPress={onClose}
        activeOpacity={0.7}
      >
        <Ionicons style={styles.suggestionsCloseText} name="close"/>
      </TouchableOpacity>
    </View>
  );
};

export default SuggestionsBanner;
