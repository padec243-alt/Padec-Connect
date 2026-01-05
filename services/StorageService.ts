import {
  ref,
  uploadBytes,
  uploadString,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * Service pour Firebase Storage
 * Gestion des uploads, téléchargements et suppression de fichiers
 */
export class StorageService {
  /**
   * Upload un fichier vers Firebase Storage
   */
  static async uploadFile(
    filePath: string,
    file: File
  ): Promise<string> {
    try {
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (error) {
      console.error(`Error uploading file to ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Upload une image base64 vers Firebase Storage
   */
  static async uploadBase64(
    filePath: string,
    base64String: string,
    format: string = 'jpeg'
  ): Promise<string> {
    try {
      const storageRef = ref(storage, filePath);
      await uploadString(storageRef, base64String, 'base64', {
        contentType: `image/${format}`,
      });
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (error) {
      console.error(`Error uploading base64 to ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Télécharger l'URL d'un fichier
   */
  static async getFileUrl(filePath: string): Promise<string> {
    try {
      const storageRef = ref(storage, filePath);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error(`Error getting URL for ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Supprimer un fichier de Firebase Storage
   */
  static async deleteFile(filePath: string): Promise<void> {
    try {
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);
    } catch (error) {
      console.error(`Error deleting file at ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Lister tous les fichiers d'un dossier
   */
  static async listFiles(folderPath: string): Promise<string[]> {
    try {
      const folderRef = ref(storage, folderPath);
      const result = await listAll(folderRef);
      return result.items.map((item) => item.fullPath);
    } catch (error) {
      console.error(`Error listing files in ${folderPath}:`, error);
      throw error;
    }
  }
}
