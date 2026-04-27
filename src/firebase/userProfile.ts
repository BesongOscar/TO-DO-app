import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";

export interface UserProfile {
  name: string;
  photoURL: string | null;
}

export const createUserProfile = async (userId: string, name: string) => {
  const userDoc = doc(db, "users", userId);
  await setDoc(userDoc, { name, photoURL: null });
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const userDoc = doc(db, "users", userId);
  const snapshot = await getDoc(userDoc);
  if (snapshot.exists()) {
    return snapshot.data() as UserProfile;
  }
  return null;
};

export const updateUserProfileDoc = async (userId: string, data: Partial<UserProfile>) => {
  const userDoc = doc(db, "users", userId);
  const snapshot = await getDoc(userDoc);
  if (snapshot.exists()) {
    await updateDoc(userDoc, data);
  } else {
    await setDoc(userDoc, { name: data.name || "", photoURL: data.photoURL || null });
  }
};