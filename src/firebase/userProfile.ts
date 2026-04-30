import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";

export interface UserProfile {
  name: string;
  photoURL: string | null;
}

export const createUserProfile = async (userId: string, name: string) => {
  // Create a user profile document in Firestore when a new user registers, with default values for name and photoURL
  const userDoc = doc(db, "users", userId);
  await setDoc(userDoc, { name, photoURL: null });
};

export const getUserProfile = async (
  userId: string,
): Promise<UserProfile | null> => {
  // Fetch a user's profile document from Firestore, returns null if it doesn't exist (e.g. if user is new and hasn't been created in Firestore yet)
  const userDoc = doc(db, "users", userId);
  const snapshot = await getDoc(userDoc);
  if (snapshot.exists()) {
    return snapshot.data() as UserProfile;
  }
  return null;
};

export const updateUserProfileDoc = async (
  userId: string,
  data: Partial<UserProfile>,
) => {
  // Update a user's profile document in Firestore with new data (e.g. when they change their display name or profile picture), creates the document if it doesn't exist yet
  const userDoc = doc(db, "users", userId);
  const snapshot = await getDoc(userDoc);
  if (snapshot.exists()) {
    await updateDoc(userDoc, data);
  } else {
    await setDoc(userDoc, {
      name: data.name || "",
      photoURL: data.photoURL || null,
    });
  }
};
