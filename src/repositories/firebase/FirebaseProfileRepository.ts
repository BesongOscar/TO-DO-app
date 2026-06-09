import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { UserProfile } from "../../domain/UserProfile";
import { ProfileRepository } from "../interfaces/ProfileRepository";

export class FirebaseProfileRepository implements ProfileRepository {
  async createProfile(userId: string, name: string): Promise<void> {
    const userDoc = doc(db, "users", userId);
    await setDoc(userDoc, { name, photoURL: null });
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    const userDoc = doc(db, "users", userId);
    const snapshot = await getDoc(userDoc);
    if (snapshot.exists()) {
      return snapshot.data() as UserProfile;
    }
    return null;
  }

  async updateProfile(
    userId: string,
    data: Partial<UserProfile>,
  ): Promise<void> {
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
  }
}
