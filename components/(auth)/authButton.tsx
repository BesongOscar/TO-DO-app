/**
 * AuthButton - Reusable button for auth screens
 * 
 * Supports custom colors, icons (like GoogleIcon), and disabled state.
 * Used in login, signup, and other auth flows.
 */

import { TouchableOpacity, Text, View } from "react-native";
import { authButtonStyles as styles } from "../../styles/components/(auth)/authButton";

type AuthButtonProps = {
  text: string;
  color: string;
  textColor: string;
  borderColor: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
};

export const AuthButton = ({
  text,
  color,
  textColor,
  borderColor,
  onPress,
  icon,
  disabled = false,
}: AuthButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: color,
          borderColor: borderColor,
          flexDirection: "row",
        },
        disabled && { opacity: 0.5 },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {icon}
        <Text style={[styles.buttonText, { color: textColor }]}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};
