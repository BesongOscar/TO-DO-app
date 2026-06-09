/**
 * authStore - Zustand store for authentication state
 * 
 * Manages user auth, profile data, and Firebase Storage operations.
 * Initializes via repository provider on app start.
 */

import { create } from "zustand";
import { Alert } from "react-native";
import { User, GoogleAuthProvider, signInWithCredential, sendEmailVerification } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../firebase/config";
import { getRepositories } from "../repositories/provider";

interface UserProfile {
  name: string;
  photoURL: string | null;
}

interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  initialize: () => () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  reloadUser: () => Promise<void>;
  googleLogin: (idToken: string) => Promise<boolean>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  uploadProfilePhoto: (uri: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  userProfile: null,
  loading: true,

  initialize: () => {
    const { authRepo, profileRepo } = getRepositories();
    const unsubscribe = authRepo.onAuthStateChanged(async (authUser) => {
      try {
        if (authUser) {
          const firebaseUser = auth.currentUser;
          set({ user: firebaseUser });
          const profile = await profileRepo.getProfile(authUser.uid);
          if (profile) {
            set({ userProfile: profile as unknown as UserProfile });
          }
        } else {
          set({ user: null, userProfile: null });
        }
      } catch (error) {
        console.error("Auth state error:", error);
      } finally {
        set({ loading: false });
      }
    });
    return unsubscribe;
  },

  login: async (email: string, password: string) => {
    const { authRepo } = getRepositories();
    await authRepo.signInWithEmail(email, password);
  },

  signup: async (email: string, password: string, name: string) => {
    const { authRepo, profileRepo } = getRepositories();
    const authUser = await authRepo.signUp(email, password);
    await profileRepo.createProfile(authUser.uid, name);
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      await sendEmailVerification(firebaseUser);
    }
  },

  logout: async () => {
    const { authRepo } = getRepositories();
    await authRepo.signOut();
  },

  resetPassword: async (email: string) => {
    const { authRepo } = getRepositories();
    await authRepo.sendPasswordReset(email);
  },

  sendVerificationEmail: async () => {
    const { authRepo } = getRepositories();
    await authRepo.sendVerificationEmail();
  },

  reloadUser: async () => {
    const { authRepo } = getRepositories();
    const authUser = await authRepo.reloadUser();
    if (authUser) {
      set({ user: auth.currentUser ? { ...auth.currentUser } : null });
    }
  },

  googleLogin: async (idToken: string): Promise<boolean> => {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      const firebaseUser = userCredential.user;
      const { profileRepo } = getRepositories();
      const existingProfile = await profileRepo.getProfile(firebaseUser.uid);
      if (!existingProfile) {
        await profileRepo.createProfile(
          firebaseUser.uid,
          firebaseUser.displayName || "User",
        );
      }
      return true;
    } catch (error: unknown) {
      console.error("Google Sign-In Error:", error);
      Alert.alert(
        "Google Sign-In Failed",
        error instanceof Error ? error.message : "An error occurred",
      );
      return false;
    }
  },

  updateUserProfile: async (profile: Partial<UserProfile>) => {
    const { user } = get();
    if (!user) return;
    const { profileRepo } = getRepositories();
    await profileRepo.updateProfile(user.uid, profile);
    set((state) => ({
      userProfile: state.userProfile
        ? { ...state.userProfile, ...profile }
        : { name: profile.name || "", photoURL: profile.photoURL || null },
    }));
  },

  uploadProfilePhoto: async (uri: string) => {
    const { user } = get();
    if (!user) return;
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profilePhotos/${user.uid}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      await get().updateUserProfile({ photoURL: downloadURL });
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      throw error;
    }
  },
}));
