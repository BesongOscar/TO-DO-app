import {
  StyleSheet,
  Text,
  View,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AuthButton } from "@/components/(auth)/authButton";
import { Link } from "expo-router";
import { useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";

export const signupValidationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), "Password must match"], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function Signup() {
  const { width } = useWindowDimensions();
  const imageSize = Math.min(width * 0.5, 140);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          username: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={signupValidationSchema}
        onSubmit={(values) => console.log(values)}
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
            {/* Username Input */}
            <View style={styles.TextInputContainer}>
              <Ionicons name="person" size={20} color={"#999"} />
              <TextInput
                placeholder="Username"
                style={styles.input}
                placeholderTextColor="#999"
                value={values.username}
                onChangeText={handleChange("username")}
              />
              {touched.username && errors.username && (
                <Text style={{ color: "red" }}>{errors.username}</Text>
              )}
            </View>

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
                  secureTextEntry={!showPassword}
                />
                {touched.password && errors.password && (
                  <Text style={{ color: "red" }}>{errors.password}</Text>
                )}
              </View>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={"#999"}
                onPress={() => setShowPassword(!showPassword)}
              />
            </View>

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
                  secureTextEntry={!showConfirmPassword}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={{ color: "red" }}>{errors.confirmPassword}</Text>
                )}
              </View>
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={20}
                color={"#999"}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </View>

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
        onPress={() => console.log("Google Sign Up pressed")}
      />
      <AuthButton
        text="Sign Up with Facebook"
        color="#fff"
        textColor="#333"
        borderColor="#ccc"
        onPress={() => console.log("Facebook Sign Up pressed")}
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
});
