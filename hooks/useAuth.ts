import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../config/firebase';
import { FirestoreService } from '../services/FirestoreService';

// Utiliser directement User de Firebase
export type AuthUser = User;

export interface UserProfile {
  profileSetupCompleted?: boolean;
  phone?: string;
  country?: string;
  city?: string;
  nationality?: string;
  profilePictureUrl?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileSetupCompleted, setProfileSetupCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        try {
          setUser(currentUser as AuthUser | null);
          setError(null);

          // Vérifier si le profil est complet dans Firestore
          if (currentUser) {
            try {
              const profile = await FirestoreService.getDocument<UserProfile>('users', currentUser.uid);
              setUserProfile(profile);
              setProfileSetupCompleted(profile?.profileSetupCompleted === true);
            } catch (profileError) {
              console.error('Error fetching user profile:', profileError);
              setProfileSetupCompleted(false);
            }
          } else {
            setUserProfile(null);
            setProfileSetupCompleted(null);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Auth error');
          setUser(null);
          setProfileSetupCompleted(null);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return {
    user,
    userProfile,
    loading,
    error,
    isAuthenticated: !!user,
    profileSetupCompleted
  };
};
