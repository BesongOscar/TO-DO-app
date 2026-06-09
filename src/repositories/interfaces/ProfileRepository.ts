import { UserProfile } from "../../domain/UserProfile";

export interface ProfileRepository {
  createProfile(userId: string, name: string): Promise<void>;
  getProfile(userId: string): Promise<UserProfile | null>;
  updateProfile(
    userId: string,
    data: Partial<UserProfile>,
  ): Promise<void>;
}
