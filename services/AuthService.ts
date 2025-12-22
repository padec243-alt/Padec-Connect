import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  User,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { FirestoreService } from './FirestoreService';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  displayName: string;
  phone?: string;
}

/**
 * Service d'authentification Firebase
 * Gère la création de compte, connexion, et déconnexion
 */
export class AuthService {
  /**
   * Créer un nouveau compte utilisateur
   */
  static async register(data: RegisterData): Promise<User> {
    try {
      // Créer l'utilisateur Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = userCredential.user;

      // Mettre à jour le profil avec le displayName
      await updateProfile(user, {
        displayName: data.displayName,
      });

      // Créer un document utilisateur dans Firestore
      await FirestoreService.setDocument('users', user.uid, {
        email: data.email,
        displayName: data.displayName,
        phone: data.phone || null,
        profilePictureUrl: null,
        location: '',
        role: 'customer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return user;
    } catch (error) {
      const message = this.getErrorMessage(error);
      console.error('Registration error:', error);
      throw new Error(message);
    }
  }

  /**
   * Connexion avec email et mot de passe
   */
  static async login(credentials: AuthCredentials): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      return userCredential.user;
    } catch (error) {
      const message = this.getErrorMessage(error);
      console.error('Login error:', error);
      throw new Error(message);
    }
  }

  /**
   * Connexion avec Google
   */
  static async loginWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Vérifier si l'utilisateur existe dans Firestore
      const existingUser = await FirestoreService.getDocument('users', user.uid);

      // Si nouvel utilisateur, créer son profil
      if (!existingUser) {
        await FirestoreService.setDocument('users', user.uid, {
          email: user.email,
          displayName: user.displayName,
          phone: null,
          profilePictureUrl: user.photoURL || null,
          location: '',
          role: 'customer',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      return user;
    } catch (error) {
      const message = this.getErrorMessage(error);
      console.error('Google login error:', error);
      throw new Error(message);
    }
  }

  /**
   * Déconnexion
   */
  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Traduire les erreurs Firebase en messages lisibles
   */
  private static getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      const code = (error as any).code;

      const errorMessages: { [key: string]: string } = {
        'auth/email-already-in-use':
          "Cet email est déjà utilisé. Essayez de vous connecter.",
        'auth/weak-password':
          "Le mot de passe doit contenir au moins 6 caractères.",
        'auth/invalid-email':
          "Format d'email invalide.",
        'auth/user-not-found':
          "Aucun compte trouvé avec cet email.",
        'auth/wrong-password':
          "Mot de passe incorrect.",
        'auth/too-many-requests':
          "Trop de tentatives de connexion. Essayez plus tard.",
        'auth/operation-not-allowed':
          "Cette opération n'est pas autorisée.",
        'auth/popup-closed-by-user':
          "Connexion annulée.",
      };

      return errorMessages[code] || error.message;
    }

    return "Une erreur s'est produite. Veuillez réessayer.";
  }
}
