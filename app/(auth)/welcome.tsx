import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthButton } from "@/components/(auth)/authButton";
import { welcomeStyles } from "../../styles/(auth)/welcome";
import { useRouter } from "expo-router";

const placeholder = require("../../assets/getStarted.png")

export default function Welcome() {
  const router = useRouter();
  return (
    <SafeAreaView edges={["top", "bottom"]} style={welcomeStyles.container}>
      <Image source={placeholder} style={welcomeStyles.image} />
      <View style={welcomeStyles.textContainer}>
        <Text style={welcomeStyles.title}>Lets Get Started</Text>
        <Text style={welcomeStyles.subtitle}>
          Reliable and Efficient task management Application
        </Text>
      </View>
      <View style={welcomeStyles.buttonContainer}>
        <AuthButton
          text="Login"
          color="#0078d4"
          textColor="#fff"
          onPress={() => {
            router.push("/(auth)/login");
          }}
          borderColor="transparent"
        />
        <AuthButton
          text="Signup"
          color="#fff"
          textColor="#666"
          onPress={() => {
            router.push("/(auth)/signup");
          }}
          borderColor="#666"
        />
      </View>
    </SafeAreaView>
  );
}
