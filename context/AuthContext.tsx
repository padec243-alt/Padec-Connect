import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth, AuthUser, UserProfile } from '../hooks/useAuth';

interface AuthContextType {
  user: AuthUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  profileSetupCompleted: boolean | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, userProfile, loading, error, isAuthenticated, profileSetupCompleted } = useAuth();

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    error,
    isAuthenticated,
    profileSetupCompleted,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
