import {
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
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import * as Yup from "yup";
import { Formik } from "formik";
import { useAuth } from "src/context/AuthContext";
import { loginStyles } from "../../styles/(auth)/login";

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
  const { login, googleLogin, user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/main");
    }
  }, [authLoading, user]);

  if (authLoading){
    return (
      <SafeAreaView style={loginStyles.container}>
        <ActivityIndicator size={"large"} color={"#0078d4"}/>
      </SafeAreaView>
    )
  }

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
    <SafeAreaView edges={["top", "bottom"]} style={loginStyles.container}>
      <View style={loginStyles.imageContainer}>
        <View
          style={[
            loginStyles.iconCircle,
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
      <Text style={loginStyles.title}>Welcome Back</Text>
      <Text style={loginStyles.subtitle}>Sign in to continue to your account</Text>

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
          <View style={loginStyles.formContainer}>
            <View style={loginStyles.textInputContainer}>
              <Ionicons name="mail" size={20} color={"#999"} />
              <TextInput
                placeholder="Email"
                style={loginStyles.input}
                placeholderTextColor="#999"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {touched.email && errors.email && (
              <Text style={loginStyles.errorText}>{errors.email}</Text>
            )}

            <View
              style={[
                loginStyles.textInputContainer,
                { justifyContent: "space-between" },
              ]}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              >
                <Ionicons name="lock-closed" size={20} color={"#999"} />
                <TextInput
                  placeholder="Password"
                  style={loginStyles.input}
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
              <Text style={loginStyles.errorText}>{errors.password}</Text>
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

      <Text style={loginStyles.orText}>Or</Text>

      <AuthButton
        text="Sign In with Google"
        color="#fff"
        textColor="#333"
        borderColor="#ccc"
        onPress={handleGoogleLogin}
      />

      <Text style={loginStyles.linkText}>
        Don't have an account?{" "}
        <Link href="/signup" style={loginStyles.link}>
          Signup
        </Link>
      </Text>
    </SafeAreaView>
  );
}