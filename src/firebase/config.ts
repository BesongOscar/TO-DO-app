import { initializeApp, type FirebaseOptions } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

function requireEnv(value: string | undefined, label: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(
      `Missing ${label}. Copy .env.example to .env and set your Firebase web app values.`,
    );
  }
  return value.trim();
}

const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.EXPO_PUBLIC_FIREBASE_APP_ID;

const firebaseConfig: FirebaseOptions = {
  apiKey: requireEnv(apiKey, "EXPO_PUBLIC_FIREBASE_API_KEY"),
  authDomain: requireEnv(authDomain, "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: requireEnv(projectId, "EXPO_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: requireEnv(storageBucket, "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: requireEnv(
    messagingSenderId,
    "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  ),
  appId: requireEnv(appId, "EXPO_PUBLIC_FIREBASE_APP_ID"),
};

const app = initializeApp(firebaseConfig);   // Initialize Firebase app with the provided configuration, throws error if any required config value is missing
export const db = getFirestore(app);  // Initialize Firestore database instance for use in other modules
export const auth = initializeAuth(app, {  // Initialize Firebase Authentication with React Native persistence using AsyncStorage, so that user stays logged in across app restarts
  persistence: getReactNativePersistence(AsyncStorage),
});