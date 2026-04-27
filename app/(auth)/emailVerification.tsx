import {
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { emailVerfificationStyles as styles } from "styles/(auth)/emailVerification";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { Redirect, useRouter, router as expoRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/firebase/config";
import { FirebaseError } from "firebase/app";
import { AuthLoadingScreen } from "@/components/AuthLoadingScreen";
import ArrowBack from "@/components/arrowBack";

export default function EmailVerification() {
  const { width } = useWindowDimensions();
  const imageSize = Math.min(width * 0.5, 140);
  const router = useRouter();
  const { user, loading, sendVerificationEmail, reloadUser, logout } =
    useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleContinue = useCallback(async () => {
    setIsChecking(true);
    try {
      await reloadUser();
      if (auth.currentUser?.emailVerified) {
        router.replace("/main");
      } else {
        Alert.alert(
          "Not verified yet",
          "Open the link in the email we sent you, then try again.",
        );
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Could not refresh status";
      Alert.alert("Error", message);
    } finally {
      setIsChecking(false);
    }
  }, [reloadUser, router]);

  const handleResend = async () => {
    setIsResending(true);
    try {
      await sendVerificationEmail();
      Alert.alert("Sent", "Check your inbox for a new verification link.");
    } catch (error: unknown) {
      const message =
        error instanceof FirebaseError
          ? error.message
          : "Failed to resend email";
      Alert.alert("Error", message);
    } finally {
      setIsResending(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      expoRouter.dismissTo("/login");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Could not sign out";
      Alert.alert("Error", message);
    }
  };

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (user.emailVerified) {
    return <Redirect href="/main" />;
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
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
          <Ionicons name="mail-open" size={imageSize * 0.4} color="#fff" />
        </View>
      </View>

      <Text style={styles.title}>Verify your email</Text>
      <Text style={styles.subtitle}>
        We sent a link to{" "}
        <Text style={styles.emailHighlight}>{user.email}</Text>. Open it on this
        device or any device, then tap the button below to continue.
      </Text>

      {isChecking ? (
        <ActivityIndicator size="large" color="#0078d4" style={styles.button} />
      ) : (
        <TouchableOpacity style={styles.verifyButton} onPress={handleContinue}>
          <Text style={styles.verifyButtonText}>I verified my email</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={handleResend}
        disabled={isResending}
      >
        {isResending ? (
          <ActivityIndicator size="small" color="#0078d4" />
        ) : (
          <Text style={styles.secondaryButtonText}>Resend email</Text>
        )}
      </TouchableOpacity>

      <View style={styles.resendRow}>
        <TouchableOpacity onPress={handleSignOut}>
          <Text style={styles.signOutLink}>Use a different account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
