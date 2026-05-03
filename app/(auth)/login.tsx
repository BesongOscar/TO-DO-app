/**
 * Login - Email/password and Google authentication screen
 *
 * Uses Formik for form handling and Yup for validation.
 * Supports both email/password and Google OAuth login.
 */

import { maybeCompleteAuthSession } from "expo-web-browser";
maybeCompleteAuthSession();

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  useWindowDimensions,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AuthButton } from "@/components/(auth)/authButton";
import { Link } from "expo-router";
import { useState } from "react";
import { useRouter } from "expo-router";
import * as Yup from "yup";
import { Formik } from "formik";
import { useAuth } from "@/context/AuthContext";
import * as Google from "expo-auth-session/providers/google";
import { loginStyles as styles } from "styles/(auth)/login";
import { GoogleIcon } from "@/components/(auth)/GoogleIcon";

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function Login() {
  const { width } = useWindowDimensions();
  const imageSize = Math.min(width * 0.5, 140);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { login, googleLogin } = useAuth();

  const [request, _response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await login(email, password);
      router.push("/main");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const result = await promptAsync();

      if (result.type === "success") {
        const { id_token } = result.params;
        if (!id_token) throw new Error("No ID token returned");
        const success = await googleLogin(id_token);
        if (success) router.push("/main");
      } else if (result.type === "cancel") {
        console.log("Google Sign-In cancelled");
      } else {
        throw new Error("Google Sign-In failed");
      }
    } catch (error: any) {
      Alert.alert("Google Login Failed", error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
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
          <Ionicons name="log-in" size={imageSize * 0.4} color="#fff" />
        </View>
      </View>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue to your account</Text>

      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={(values) => handleLogin(values.email, values.password)}
        validationSchema={loginValidationSchema}
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
            {/* Email Input */}
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

            {/* Password Input */}
            <View
              style={[
                styles.textInputContainer,
                { justifyContent: "space-between" },
              ]}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              >
                <Ionicons name="lock-closed" size={20} color={"#999"} />
                <TextInput
                  placeholder="Password"
                  style={styles.input}
                  placeholderTextColor="#999"
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  secureTextEntry={!showPassword}
                />
              </View>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={"#999"}
                onPress={() => setShowPassword(!showPassword)}
              />
            </View>
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <TouchableOpacity
              onPress={() => router.push("/forgotPassword")}
              style={{ alignSelf: "flex-end" }}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <AuthButton
              text="Sign In"
              color="#0078d4"
              textColor="white"
              borderColor="#0078d4"
              onPress={handleSubmit}
            />
          </View>
        )}
      </Formik>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <View style={styles.seperator} />
        <Text style={styles.orText}>Or</Text>
        <View style={styles.seperator} />
      </View>

      <AuthButton
        text="Sign In with Google"
        color="#fff"
        textColor="#333"
        borderColor="#ccc"
        onPress={handleGoogleLogin}
        disabled={!request || isLoading}
        icon={<GoogleIcon size={20}/>}
      />

      <Text style={styles.linkText}>
        Don't have an account?{" "}
        <Link href="/signup" style={styles.link}>
          Signup
        </Link>
      </Text>
    </SafeAreaView>
  );
}
