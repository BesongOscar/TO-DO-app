export interface StorageProvider {
  uploadFile(uri: string, destinationPath: string): Promise<string>;
  getDownloadURL(path: string): Promise<string>;
}
