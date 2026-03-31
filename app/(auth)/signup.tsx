import {
  StyleSheet,
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

export const signupValidationSchema = Yup.object().shape({
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
  const imageSize = Math.min(width * 0.5, 140);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { signup, googleLogin } = useAuth();

  const handleSignup = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await signup(email, password);
      router.push("/main");
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      await googleLogin();
      router.push("/main");
    } catch (error: any) {
      Alert.alert("Google Signup Failed", error.message || "An error occurred");
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
      <Text style={styles.subtitle}>
        Please enter the code we just sent to your email
      </Text>

      <Formik
        initialValues={{
          email: "",
          password: "",
          confirmPassword: "",
        }}
        onSubmit={(values) => handleSignup(values.email, values.password)}
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
            {/* Email Input */}
            <View style={styles.TextInputContainer}>
              <Ionicons name="person" size={20} color={"#999"} />
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
                styles.TextInputContainer,
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
                styles.TextInputContainer,
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

      <Text style={styles.orText}>Or</Text>

      <AuthButton
        text="Sign Up with Google"
        color="#fff"
        textColor="#333"
        borderColor="#ccc"
        onPress={handleGoogleSignup}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    position: "relative",
  },
  iconCircle: {
    backgroundColor: "#0078d4",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  image: {
    height: 200,
    width: 200,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 30,
  },
  formContainer: {
    width: "100%",
    marginBottom: 10,
  },
  TextInputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: "#333",
    paddingVertical: 0,
  },
  orText: {
    fontSize: 14,
    color: "#999",
  },
  linkText: {
    flexDirection: "row",
    marginTop: 30,
    color: "#666",
  },
  link: {
    color: "#0078d4",
    fontWeight: "600",
    marginLeft: 4,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 16,
  },
});
