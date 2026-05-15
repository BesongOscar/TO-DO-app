/**
 * Index - Root route that handles auth + onboarding redirects.
 *
 * Priority order:
 *   1. Auth still loading          → show spinner
 *   2. First-time user (no key)    → /welcome  (onboarding)
 *   3. Logged in, unverified email → /emailVerification
 *   4. Logged in, verified         → /(protected)/myDay
 *   5. Not logged in               → /login
 */

import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";
import { AuthLoadingScreen } from "@/components/AuthLoadingScreen";
import { ONBOARDING_KEY } from "./(auth)/welcome";

export default function Index() {
  const { user, loading: authLoading } = useAuth();

  // null = not checked yet, true/false = result from AsyncStorage
  const [onboardingSeen, setOnboardingSeen] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((value) => {
      setOnboardingSeen(value === "true");
    });
  }, []);

  // Still resolving auth or AsyncStorage
  if (authLoading || onboardingSeen === null) return <AuthLoadingScreen />;

  if (!onboardingSeen) return <Redirect href="/welcome" />;

  if (user && !user.emailVerified) return <Redirect href="/emailVerification" />;

  return <Redirect href={user ? "/(protected)/myDay" : "/login"} />;
}