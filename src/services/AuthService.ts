/**
 * AuthService - Business logic for authentication operations
 * 
 * Orchestrates auth and profile repositories for sign-in, sign-up,
 * verification, and profile management.
 */

import { AuthRepository, AuthUser } from "../repositories/interfaces/AuthRepository";
import { ProfileRepository } from "../repositories/interfaces/ProfileRepository";

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly profileRepository: ProfileRepository,
  ) {}

  onAuthStateChanged(
    callback: (user: AuthUser | null) => void,
  ): () => void {
    return this.authRepository.onAuthStateChanged(callback);
  }

  async signIn(email: string, password: string): Promise<AuthUser> {
    return await this.authRepository.signInWithEmail(email, password);
  }

  async signUp(email: string, password: string, name: string): Promise<AuthUser> {
    const user = await this.authRepository.signUp(email, password);
    await this.profileRepository.createProfile(user.uid, name);
    await this.authRepository.sendVerificationEmail();
    return user;
  }

  async signOut(): Promise<void> {
    await this.authRepository.signOut();
  }

  async signInWithGoogle(): Promise<AuthUser> {
    const user = await this.authRepository.signInWithGoogle();
    const existingProfile = await this.profileRepository.getProfile(user.uid);
    if (!existingProfile) {
      await this.profileRepository.createProfile(
        user.uid,
        user.displayName || "User",
      );
    }
    return user;
  }

  async sendVerificationEmail(): Promise<void> {
    await this.authRepository.sendVerificationEmail();
  }

  async reloadUser(): Promise<AuthUser | null> {
    return await this.authRepository.reloadUser();
  }

  async resetPassword(email: string): Promise<void> {
    await this.authRepository.sendPasswordReset(email);
  }

  getCurrentUser(): AuthUser | null {
    return this.authRepository.getCurrentUser();
  }
}
