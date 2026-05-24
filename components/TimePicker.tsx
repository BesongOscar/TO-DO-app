/**
 * TimePicker - Platform-specific time selection component
 * 
 * Uses @react-native-community/datetimepicker.
 * iOS: spinner style within a container
 * Android: native dialog (auto-displayed on press)
 */

import React from "react";
import { Platform, View } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useTheme } from "../context/ThemeContext";
import { useThemeStyles } from "../src/hooks/useThemeStyles";
import { createTimePickerStyles } from "../styles/components/TimePicker";

interface TimePickerProps {
  value: Date;
  onChange: (hour: number, minute: number) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const { theme } = useTheme();
  const styles = useThemeStyles(createTimePickerStyles);
  const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      onChange(selectedDate.getHours(), selectedDate.getMinutes());
    }
  };

  if (Platform.OS === "ios") {
    return (
      <View style={styles.iosContainer}>
        <DateTimePicker
          value={value}
          mode="time"
          display="spinner"
          onChange={handleChange}
          style={styles.iosPicker}
        />
      </View>
    );
  }

  // Android: show the native dialog-style picker
  return (
    <DateTimePicker
      value={value}
      mode="time"
      display="default"
      onChange={handleChange}
      accentColor={theme.primary}
    />
  );
};

export default TimePicker;