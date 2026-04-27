import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { arrowBackStyles as styles } from "styles/components/arrowBack";

type ArrowBackProps = {
  color?: string;
};
export default function ArrowBack({ color = "#000" }: ArrowBackProps) {
  const router = useRouter();
  return (
    <View style={styles.ButtonContainer}>
      <TouchableOpacity onPress={router.back}>
        <Ionicons name="arrow-back" color={color} size={25} />
      </TouchableOpacity>
    </View>
  );
}
