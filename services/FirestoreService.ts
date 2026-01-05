import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  Query,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Service générique pour Firestore
 * Respecte le pattern Repository pour éviter la redondance
 */
export class FirestoreService {
  /**
   * Récupérer un document par ID
   */
  static async getDocument<T = DocumentData>(
    collectionName: string,
    docId: string
  ): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as T) : null;
    } catch (error) {
      console.error(`Error getting document from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Récupérer tous les documents d'une collection
   */
  static async getCollection<T = DocumentData>(
    collectionName: string
  ): Promise<T[]> {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as T));
    } catch (error) {
      console.error(`Error getting collection ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Requête personnalisée avec contraintes (where, orderBy, etc.)
   */
  static async queryCollection<T = DocumentData>(
    collectionName: string,
    constraints: QueryConstraint[]
  ): Promise<T[]> {
    try {
      const q: Query<DocumentData> = query(
        collection(db, collectionName),
        ...constraints
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as T));
    } catch (error) {
      console.error(`Error querying ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Créer ou remplacer un document
   */
  static async setDocument<T extends DocumentData>(
    collectionName: string,
    docId: string,
    data: T,
    merge = false
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, data, { merge });
    } catch (error) {
      console.error(`Error setting document in ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Mettre à jour un document partiellement
   */
  static async updateDocument<T extends DocumentData = DocumentData>(
    collectionName: string,
    docId: string,
    data: Partial<T>
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, data as any);
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Supprimer un document
   */
  static async deleteDocument(
    collectionName: string,
    docId: string
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Ajouter un nouveau document avec ID auto-généré
   */
  static async addDocument<T extends DocumentData>(
    collectionName: string,
    data: T
  ): Promise<string> {
    try {
      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, data);
      return docRef.id;
    } catch (error) {
      console.error(`Error adding document to ${collectionName}:`, error);
      throw error;
    }
  }
}
