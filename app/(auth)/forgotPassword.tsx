import {
  View,
  Text,
  useWindowDimensions,
  TextInput,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { forgotPasswordStyles as styles } from "styles/(auth)/forgotPassword";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { useState } from "react";
import ArrowBack from "@/components/arrowBack";
import { useAuth } from "@/context/AuthContext";

export const forgotPasswordValidationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function ForgotPassword() {
  const { width } = useWindowDimensions();
  const imageSize = Math.min(width * 0.5, 140);
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      await resetPassword(email);
      Alert.alert(
        "Reset Link Sent",
        "Check your email for password reset instructions.",
        [
          {
            text: "OK",
            onPress: () => router.push("/login"),
          },
        ],
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ArrowBack/>
      <View style={styles.imageContainer}>
        <View
          style={[
            styles.iconCircle,
            {
              width: imageSize,
              height: imageSize,
              borderRadius: imageSize / 2,
            },
          ]}
        >
          <Ionicons name="key" size={imageSize * 0.4} color="#fff" />
        </View>
      </View>
      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.subtitle}>
        Enter your email to receive reset instructions
      </Text>
      <Formik
        initialValues={{ email: "" }}
        onSubmit={(values) => handleResetPassword(values.email)}
        validationSchema={forgotPasswordValidationSchema}
      >
        {({
          handleChange,
          handleSubmit,
          handleBlur,
          values,
          touched,
          errors,
        }) => (
          <View style={styles.formContainer}>
            <View style={styles.textInputContainer}>
              <Ionicons name="mail" size={20} color={"#999"} />
              <TextInput
                placeholder="Email"
                style={styles.input}
                placeholderTextColor="#999"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
            {isLoading ? (
              <ActivityIndicator size="large" color="#0078d4" />
            ) : (
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => handleSubmit()}
              >
                <Text style={styles.buttonText}>Send Reset Link</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
}
