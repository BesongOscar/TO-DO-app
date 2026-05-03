import { maybeCompleteAuthSession } from "expo-web-browser";
maybeCompleteAuthSession();

import {
  Text,
  View,
  TextInput,
  useWindowDimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AuthButton } from "@/components/(auth)/authButton";
import { Link } from "expo-router";
import { useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import * as Google from "expo-auth-session/providers/google";
import { signupStyles as styles } from "styles/(auth)/signup";
import { GoogleIcon } from "@/components/(auth)/GoogleIcon";

/**
 * Signup - New user registration screen
 *
 * Uses Formik for form handling and Yup for validation.
 * Requires name, email, and matching password/confirmation.
 */

export const signupValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function Signup() {
  const { width } = useWindowDimensions();
  const imageSize = Math.min(width * 0.3, 140);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const { signup, googleLogin } = useAuth();

  const [request, _response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  const handleSignup = async (
    email: string,
    password: string,
    name: string,
  ) => {
    try {
      await signup(email, password, name);
      router.push("/emailVerification");
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message || "An error occurred");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await promptAsync();

      if (result.type === "success") {
        const { id_token } = result.params;
        if (!id_token) throw new Error("No ID token returned");
        const success = await googleLogin(id_token);
        if (success) {
          router.push("/main");
        }
      } else if (result.type === "cancel") {
        console.log("Google Sign-Up cancelled");
      } else {
        throw new Error("Google Sign-Up failed");
      }
    } catch (error: any) {
      Alert.alert("Google Signup Failed", error.message || "An error occurred");
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
      <Text style={styles.subtitle}>Create an account to sync your tasks</Text>

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
              <Ionicons name="person" size={20} color={"#999"} />
              <TextInput
                placeholder="Name"
                style={styles.input}
                placeholderTextColor="#999"
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
                <Ionicons name="lock-closed" size={20} color={"#999"} />
                <TextInput
                  placeholder="Confirm Password"
                  style={styles.input}
                  value={values.confirmPassword}
                  placeholderTextColor="#999"
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  secureTextEntry={!showConfirmPassword}
                />
              </View>
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={20}
                color={"#999"}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </View>
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}

            <AuthButton
              text="Sign Up"
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
        text="Sign Up with Google"
        color="#fff"
        textColor="#333"
        borderColor="#ccc"
        onPress={handleGoogleSignup}
        icon={<GoogleIcon size={20}/>}
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
