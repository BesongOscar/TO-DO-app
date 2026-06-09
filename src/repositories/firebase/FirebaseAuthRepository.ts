import {
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
import { auth } from "../../firebase/config";
import { signInWithGoogle as googleSignIn } from "../../auth/googleAuth";
import { AuthRepository, AuthUser } from "../interfaces/AuthRepository";

const toAuthUser = (firebaseUser: import("firebase/auth").User): AuthUser => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  displayName: firebaseUser.displayName,
  photoURL: firebaseUser.photoURL,
  emailVerified: firebaseUser.emailVerified,
});

export class FirebaseAuthRepository implements AuthRepository {
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(auth, (firebaseUser) => {
      callback(firebaseUser ? toAuthUser(firebaseUser) : null);
    });
  }

  async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return toAuthUser(cred.user);
  }

  async signUp(email: string, password: string): Promise<AuthUser> {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return toAuthUser(cred.user);
  }

  async signOut(): Promise<void> {
    const { signOutGoogle } = await import("../../auth/googleAuth");
    await signOutGoogle();
    await signOut(auth);
  }

  async sendVerificationEmail(): Promise<void> {
    const u = auth.currentUser;
    if (!u) throw new Error("No signed-in user");
    await sendEmailVerification(u);
  }

  async reloadUser(): Promise<AuthUser | null> {
    const u = auth.currentUser;
    if (!u) return null;
    await reload(u);
    const refreshed = auth.currentUser;
    return refreshed ? toAuthUser(refreshed) : null;
  }

  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }

  async signInWithGoogle(): Promise<AuthUser> {
    const { idToken } = await googleSignIn();
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);
    return toAuthUser(userCredential.user);
  }

  getCurrentUser(): AuthUser | null {
    const u = auth.currentUser;
    return u ? toAuthUser(u) : null;
  }
}
