import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useThemeStyles } from "../../../src/hooks/useThemeStyles";
import { createDetailOptionStyles } from "../../../styles/components/DetailOption";

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
  const styles = useThemeStyles(createDetailOptionStyles);
  return (
    <TouchableOpacity style={styles.detailOption} onPress={onPress}>
      <Text style={[isActive ? styles.detailIconActive : styles.detailIcon]}>
        {icon}
      </Text>
      <View style={{}}>
        <Text style={[isActive ? styles.detailTextActive : styles.detailText]}>
          {text}
        </Text>
        {activeValue ? (
          <Text style={[styles.detailSubText]}>{activeValue}</Text>
        ) : null}
      </View>
      {isActive && <Text style={styles.detailActiveIndicator}>&gt;</Text>}
    </TouchableOpacity>
  );
};

export default DetailOption;
