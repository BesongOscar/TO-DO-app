/**
 * DetailOption - Option row in BottomPanel
 * 
 * Displays an icon, label, and optional active value.
 * Used for due date, reminder, repeat, and note options.
 */

import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { detailOptionStyles as styles } from "../styles/components/DetailOption";

interface DetailOptionProps {
  icon: string;
  text: string;
  activeValue?: string;
  isActive?: boolean;
  onPress?: () => void;
}

const DetailOption: React.FC<DetailOptionProps> = ({
  icon,
  text,
  activeValue,
  isActive = false,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.detailOption} onPress={onPress}>
      {/* Icon */}
      <Text style={[styles.detailIcon, isActive && styles.detailIcon]}>
        {icon}
      </Text>
      {/* Label + Optional current-value subtitle */}
      <View>
        <Text style={[styles.detailText, isActive && styles.detailText]}>
          {text}
        </Text>
        {activeValue ? (
          <Text style={styles.detailSubText}>{activeValue}</Text>
        ) : null}
      </View>
      {/* chevron indicator when a value is set */}
      {isActive && <Text style={styles.detailActiveIndicator}>›</Text>}
    </TouchableOpacity>
  );
};

export default DetailOption;
