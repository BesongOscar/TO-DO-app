/**
 * AuthContext - Firebase authentication and user profile management
 *
 * Handles email/password auth, verification emails, and profile CRUD.
 * Provides useAuth hook for accessing auth state throughout the app.
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  reload,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth, storage } from "../firebase/config";
import {
  createUserProfile,
  getUserProfile,
  updateUserProfileDoc,
} from "@/firebase/userProfile";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  /** Forces re-render after `reload()`; Firebase mutates the User in place. */
  const [, bumpUserRefresh] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      try {
        setUser(nextUser);
        if (nextUser) {
          const profile = await getUserProfile(nextUser.uid);
          if (profile) {
            setUserProfile(profile);
          }
        } else {
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Auth state error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfile(cred.user.uid, name);
    await sendEmailVerification(cred.user);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const sendVerificationEmail = async () => {
    const u = auth.currentUser;
    if (!u) {
      throw new Error("No signed-in user");
    }
    await sendEmailVerification(u);
  };

  const reloadUser = async () => {
    const u = auth.currentUser;
    if (!u) return;
    await reload(u);
    bumpUserRefresh((t) => t + 1);
  };

  // Google Sign-In: verifies ID token and creates profile if new user
  const googleLogin = async (idToken: string): Promise<boolean> => {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;

      const existingProfile = await getUserProfile(user.uid);
      if (!existingProfile) {
        await createUserProfile(user.uid, user.displayName || "User");
      }
      return true;
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      Alert.alert(
        "Google Sign-In Failed",
        error.message || "An error occurred",
      );
      return false;
    }
  };

  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    if (!user) return;
    await updateUserProfileDoc(user.uid, profile);
    setUserProfile((prev) => {
      if (!prev) {
        return { name: profile.name || "", photoURL: profile.photoURL || null };
      }
      return { ...prev, ...profile };
    });
  };

  // Upload profile photo to Firebase Storage and update user profile
  const uploadProfilePhoto = async (uri: string) => {
    if (!user) return;
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profilePhotos/${user.uid}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      await updateUserProfile({ photoURL: downloadURL });
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      throw error;
    }
  };

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
