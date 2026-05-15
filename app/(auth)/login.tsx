/**
 * Login - Email/password and Google authentication screen
 *
 * Uses Formik for form handling and Yup for validation.
 * Supports both email/password and Google OAuth login.
 */

import {
  Text,
  View,
  TextInput,
  useWindowDimensions,
  Alert,
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
import { useTheme } from "../../context/ThemeContext";
import { useThemeStyles } from "../../hooks/useThemeStyles";
import { useAuth } from "@/context/AuthContext";
import { createLoginStyles } from "@/styles/app/(auth)/login";
import { GoogleIcon } from "@/components/(auth)/GoogleIcon";
import {
  signInWithGoogle,
  getGoogleSignInErrorMessage,
} from "@/src/auth/googleAuth";

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
  const styles = useThemeStyles(createLoginStyles);
  const { theme } = useTheme();

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await login(email, password);
    } catch (error: unknown) {
      Alert.alert("Login Failed", error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const { idToken } = await signInWithGoogle();
      const success = await googleLogin(idToken);
      if (success) router.replace("/(protected)/myDay");
    } catch (error) {
      const message = getGoogleSignInErrorMessage(error);
      // SIGN_IN_CANCELLED is not an error worth alerting
      if (message !== "Sign-in was cancelled") {
        Alert.alert("Google Login Failed", message);
      }
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
      <Text style={styles.subtitle}>Sign in to have access to your account</Text>

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
              <Ionicons name="mail" size={20} color={theme.textMuted} />
              <TextInput
                placeholder="Email Address"
                style={styles.input}
                placeholderTextColor={theme.placeholderTextColor}
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
                <Ionicons name="lock-closed" size={20} color={theme.textMuted} />
                <TextInput
                  placeholder="Password"
                  style={styles.input}
                  placeholderTextColor={theme.placeholderTextColor}
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  secureTextEntry={!showPassword}
                />
              </View>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={theme.textMuted}
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
              color={theme.primary}
              textColor="white"
              borderColor={theme.primary}
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
        color={theme.surface}
        textColor={theme.text}
        borderColor={theme.border}
        onPress={handleGoogleLogin}
        disabled={isLoading}
        icon={<GoogleIcon size={20} />}
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
