import {
  Text,
  View,
  TextInput,
  useWindowDimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AuthButton } from "../../features/auth/components/authButton";
import { Link } from "expo-router";
import { useState } from "react";
import { Formik } from "formik";
import { useTheme } from "../../context/ThemeContext";
import { useThemeStyles } from "../../src/hooks/useThemeStyles";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { createSignupStyles } from "@/styles/app/(auth)/signup";
import { GoogleIcon } from "../../features/auth/components/GoogleIcon";
import {
  signInWithGoogle,
  getGoogleSignInErrorMessage,
} from "@/src/auth/googleAuth";
import { signupValidationSchema } from "../../src/utils/validationSchemas";

/**
 * Signup - New user registration screen
 *
 * Uses Formik for form handling and Yup for validation.
 * Requires name, email, and matching password/confirmation.
 */

export default function Signup() {
  const { width } = useWindowDimensions();
  const imageSize = Math.min(width * 0.3, 140);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { signup, googleLogin } = useAuth();
  const styles = useThemeStyles(createSignupStyles);
  const { theme } = useTheme();

  const handleSignup = async (
    email: string,
    password: string,
    name: string,
  ) => {
    try {
      await signup(email, password, name);
      router.push("/emailVerification");
    } catch (error: unknown) {
      Alert.alert(
        "Signup Failed",
        error instanceof Error ? error.message : "An error occurred",
      );
    }
  };

  const handleGoogleSignup = async () => {
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
          <Ionicons name="person-add" size={imageSize * 0.4} color="#fff" />
        </View>
      </View>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Create an account to get started</Text>

      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        onSubmit={(values) =>
          handleSignup(values.email, values.password, values.name)
        }
        validationSchema={signupValidationSchema}
      >
        {({
          handleChange,
          handleSubmit,
          handleBlur,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.formContainer}>
            <View style={styles.textInputContainer}>
              <Ionicons name="person" size={20} color={theme.textMuted} />
                <TextInput
                  testID="signup-name-input"
                  placeholder="Name"
                  style={styles.input}
                  placeholderTextColor={theme.placeholderTextColor}
                  value={values.name}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                />
            </View>
            {touched.name && errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}
            {/* Email Input */}
            <View style={styles.textInputContainer}>
              <Ionicons name="mail" size={20} color={theme.textMuted} />
                <TextInput
                  testID="signup-email-input"
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
                <Ionicons
                  name="lock-closed"
                  size={20}
                  color={theme.textMuted}
                />
                <TextInput
                  testID="signup-password-input"
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

            {/* Confirm Password Input */}
            <View
              style={[
                styles.textInputContainer,
                { justifyContent: "space-between" },
              ]}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              >
                <Ionicons
                  name="lock-closed"
                  size={20}
                  color={theme.textMuted}
                />
                <TextInput
                  testID="signup-confirm-password-input"
                  placeholder="Confirm Password"
                  style={styles.input}
                  value={values.confirmPassword}
                  placeholderTextColor={theme.placeholderTextColor}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  secureTextEntry={!showConfirmPassword}
                />
              </View>
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={20}
                color={theme.textMuted}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </View>
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}

            <AuthButton
              testID="signup-submit-button"
              text="Sign Up"
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
        testID="google-signup-button"
        text="Sign Up with Google"
        color={theme.surface}
        textColor={theme.text}
        borderColor={theme.border}
        onPress={handleGoogleSignup}
        icon={<GoogleIcon size={20} />}
      />

      <Text style={styles.linkText}>
        Already have an account?{" "}
        <Link href="/login" style={styles.link}>
          Login
        </Link>
      </Text>
    </SafeAreaView>
  );
}
