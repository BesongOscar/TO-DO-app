import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { suggestionBannerStyles } from "../styles/components/SuggestionBanner";

interface SuggestionsBannerProps {
  message: string;
  onClose: () => void;
}

const SuggestionsBanner: React.FC<SuggestionsBannerProps> = ({ message, onClose }) => {
  return (
    <View style={suggestionBannerStyles.suggestionsBanner}>
      <View style={suggestionBannerStyles.suggestionsLeft}>
        <Text style={suggestionBannerStyles.suggestionsIcon}>💡</Text>
        <Text style={suggestionBannerStyles.suggestionsText}>{message}</Text>
      </View>

      <TouchableOpacity
        style={suggestionBannerStyles.suggestionsCloseButton}
        onPress={onClose}
        activeOpacity={0.7}
      >
        <Text style={suggestionBannerStyles.suggestionsCloseText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SuggestionsBanner;
