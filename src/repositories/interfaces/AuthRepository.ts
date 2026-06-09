export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface AuthRepository {
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void;
  signInWithEmail(email: string, password: string): Promise<AuthUser>;
  signUp(email: string, password: string): Promise<AuthUser>;
  signOut(): Promise<void>;
  sendVerificationEmail(): Promise<void>;
  reloadUser(): Promise<AuthUser | null>;
  sendPasswordReset(email: string): Promise<void>;
  signInWithGoogle(): Promise<AuthUser>;
  getCurrentUser(): AuthUser | null;
}
