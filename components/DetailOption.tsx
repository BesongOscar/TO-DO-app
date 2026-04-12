import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { detailOptionStyles } from "../styles/components/DetailOption";

interface DetailOptionProps {
  icon: string;
  text: string;
  subText?: string;
  isActive?: boolean;
  onPress: () => void;
}

const DetailOption: React.FC<DetailOptionProps> = ({
  icon,
  text,
  subText,
  isActive,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[detailOptionStyles.detailOption, isActive && detailOptionStyles.detailOptionActive]}
      onPress={onPress}
    >
      <Text style={detailOptionStyles.detailIcon}>{icon}</Text>
      <View style={detailOptionStyles.detailContent}>
        <Text style={[detailOptionStyles.detailText, isActive && detailOptionStyles.detailTextActive]}>
          {text}
        </Text>
        {subText && (
          <Text style={detailOptionStyles.detailSubText}>{subText}</Text>
        )}
      </View>
      {isActive && subText && (
        <Text style={detailOptionStyles.detailActiveIndicator}>✓</Text>
      )}
    </TouchableOpacity>
  );
};

export default DetailOption;
