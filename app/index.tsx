/**
 * Index - Root route that handles auth redirects
 * 
 * Checks user auth state and redirects accordingly:
 * - Unverified users -> /emailVerification
 * - Authenticated users -> /main
 * - Unauthenticated -> /login
 */

import { Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { AuthLoadingScreen } from "@/components/AuthLoadingScreen";

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (user && !user.emailVerified) {
    return <Redirect href="/emailVerification" />;
  }

  return <Redirect href={user ? "/main" : "/login"} />;
}