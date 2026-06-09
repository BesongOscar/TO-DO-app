import { TouchableOpacity, Text, View } from "react-native";
import { useThemeStyles } from "../../../src/hooks/useThemeStyles";
import { createAuthButtonStyles } from "../../../styles/components/(auth)/authButton";

type AuthButtonProps = {
  text: string;
  color: string;
  textColor: string;
  borderColor: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  testID?: string;
};

export const AuthButton = ({
  text,
  color,
  textColor,
  borderColor,
  onPress,
  icon,
  disabled = false,
  testID,
}: AuthButtonProps) => {
  const styles = useThemeStyles(createAuthButtonStyles);
  return (
    <TouchableOpacity
      testID={testID}
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
