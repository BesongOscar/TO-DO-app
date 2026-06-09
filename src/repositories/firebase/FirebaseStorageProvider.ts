import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/config";
import { StorageProvider } from "../interfaces/StorageProvider";

export class FirebaseStorageProvider implements StorageProvider {
  async uploadFile(uri: string, destinationPath: string): Promise<string> {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, destinationPath);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  }

  async getDownloadURL(path: string): Promise<string> {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  }
}
