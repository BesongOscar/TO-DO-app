import { UserProfile } from "../domain/UserProfile";
import { ProfileRepository } from "../repositories/interfaces/ProfileRepository";
import { StorageProvider } from "../repositories/interfaces/StorageProvider";

export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly storageProvider: StorageProvider,
  ) {}

  async getProfile(userId: string): Promise<UserProfile | null> {
    return await this.profileRepository.getProfile(userId);
  }

  async updateProfile(
    userId: string,
    data: Partial<UserProfile>,
  ): Promise<void> {
    await this.profileRepository.updateProfile(userId, data);
  }

  async uploadProfilePhoto(
    userId: string,
    uri: string,
  ): Promise<string> {
    const downloadURL = await this.storageProvider.uploadFile(
      uri,
      `profilePhotos/${userId}`,
    );
    await this.profileRepository.updateProfile(userId, {
      photoURL: downloadURL,
    });
    return downloadURL;
  }
}
