import {
  StyleSheet,
  Text,
  View,
  TextInput,
  useWindowDimensions,
  Alert,
  ActivityIndicator,
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
      await googleLogin();
      router.push("/main");
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

      <Text style={styles.orText}>Or</Text>

      <AuthButton
        text="Sign In with Google"
        color="#fff"
        textColor="#333"
        borderColor="#ccc"
        onPress={handleGoogleLogin}
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
