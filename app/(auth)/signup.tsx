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
import * as Yup from "yup";
import { Formik } from "formik";
import { useAuth } from "src/context/AuthContext";
import { useRouter } from "expo-router";
import { signupStyles } from "../../styles/(auth)/signup";

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
  const imageSize = Math.min(width * 0.5, 140);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { signup, googleLogin, user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/main");
    }
  }, [authLoading, user]);
   
   if (authLoading){
     return (
       <SafeAreaView style={signupStyles.container}>
         <ActivityIndicator size="large" color="#0078d4" />
       </SafeAreaView>
     );
    }

  const handleSignup = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      await signup(email, password, name);
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
    <SafeAreaView edges={["top", "bottom"]} style={signupStyles.container}>
      <View style={signupStyles.imageContainer}>
        <View
          style={[
            signupStyles.iconCircle,
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
      <Text style={signupStyles.title}>Sign Up</Text>
      <Text style={signupStyles.subtitle}>
        Let's Get Started, fill with your credentials
      </Text>

      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        onSubmit={(values) => handleSignup(values.email, values.password, values.name)}
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
          <View style={signupStyles.formContainer}>
            <View style={signupStyles.textInputContainer}>
              <Ionicons name="person" size={20} color={"#999"} />
              <TextInput
                placeholder="Name"
                style={signupStyles.input}
                placeholderTextColor="#999"
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
              />
            </View>
            {touched.name && errors.name && (
              <Text style={signupStyles.errorText}>{errors.name}</Text>
            )}

            <View style={signupStyles.textInputContainer}>
              <Ionicons name="mail" size={20} color={"#999"} />
              <TextInput
                placeholder="Email"
                style={signupStyles.input}
                placeholderTextColor="#999"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {touched.email && errors.email && (
              <Text style={signupStyles.errorText}>{errors.email}</Text>
            )}

            <View
              style={[
                signupStyles.textInputContainer,
                { justifyContent: "space-between" },
              ]}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              >
                <Ionicons name="lock-closed" size={20} color={"#999"} />
                <TextInput
                  placeholder="Password"
                  style={signupStyles.input}
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
              <Text style={signupStyles.errorText}>{errors.password}</Text>
            )}

            <View
              style={[
                signupStyles.textInputContainer,
                { justifyContent: "space-between" },
              ]}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              >
                <Ionicons name="lock-closed" size={20} color={"#999"} />
                <TextInput
                  placeholder="Confirm Password"
                  style={signupStyles.input}
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
              <Text style={signupStyles.errorText}>{errors.confirmPassword}</Text>
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

      <Text style={signupStyles.orText}>Or</Text>

      <AuthButton
        text="Sign Up with Google"
        color="#fff"
        textColor="#333"
        borderColor="#ccc"
        onPress={handleGoogleSignup}
      />

      <Text style={signupStyles.linkText}>
        Already have an account?{" "}
        <Link href="/login" style={signupStyles.link}>
          Login
        </Link>
      </Text>
    </SafeAreaView>
  );
}