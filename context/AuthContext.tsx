import React, { createContext, useContext, useEffect } from "react";
import { User } from "firebase/auth";
import { useAuthStore } from "../src/store/authStore";

interface UserProfile {
  name: string;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  reloadUser: () => Promise<void>;
  googleLogin: (idToken: string) => Promise<boolean>;
  userProfile: UserProfile | null;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  uploadProfilePhoto: (uri: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const userProfile = useAuthStore((s) => s.userProfile);
  const login = useAuthStore((s) => s.login);
  const signup = useAuthStore((s) => s.signup);
  const logout = useAuthStore((s) => s.logout);
  const resetPassword = useAuthStore((s) => s.resetPassword);
  const sendVerificationEmail = useAuthStore((s) => s.sendVerificationEmail);
  const reloadUser = useAuthStore((s) => s.reloadUser);
  const googleLogin = useAuthStore((s) => s.googleLogin);
  const updateUserProfile = useAuthStore((s) => s.updateUserProfile);
  const uploadProfilePhoto = useAuthStore((s) => s.uploadProfilePhoto);

  useEffect(() => {
    const unsubscribe = useAuthStore.getState().initialize();
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        resetPassword,
        sendVerificationEmail,
        reloadUser,
        googleLogin,
        userProfile,
        updateUserProfile,
        uploadProfilePhoto,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
