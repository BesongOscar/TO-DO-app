import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStyles } from "../../../src/hooks/useThemeStyles";
import { useTheme } from "../../../context/ThemeContext";
import { createArrowBackStyles } from "../../../styles/components/arrowBack";

type ArrowBackProps = {
  color?: string;
};
export default function ArrowBack({ color }: ArrowBackProps) {
  const styles = useThemeStyles(createArrowBackStyles);
  const { theme } = useTheme();
  const router = useRouter();
  return (
    <View style={styles.ButtonContainer}>
      <TouchableOpacity onPress={router.back}>
        <Ionicons name="arrow-back" color={color || theme.text} size={25} />
      </TouchableOpacity>
    </View>
  );
}
