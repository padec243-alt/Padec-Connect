import React, { useState } from 'react';
import { Mail, Loader, Apple, User } from 'lucide-react';
import { SafeArea } from '../components/MobileLayout';
import { Button, Input } from '../components/UI';
import { PasswordInput } from '../components/PasswordInput';
import { useNavigation } from '../context/NavigationContext';
import { AuthService } from '../services/AuthService';
import { FirestoreService } from '../services/FirestoreService';

type AuthMode = 'login' | 'register';

interface UserProfile {
  profileSetupCompleted?: boolean;
}

export const AuthScreen: React.FC = () => {
  const { navigate, params } = useNavigation();

  // Initialiser le mode à partir des params de navigation (si fourni)
  const getInitialMode = (): AuthMode => {
    if (params?.mode === 'register') return 'register';
    if (params?.mode === 'login') return 'login';
    return 'login';
  };

  const [mode, setMode] = useState<AuthMode>(getInitialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);


  const handleLogin = async () => {
    setError(null);
    setSuccess(false);

    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await AuthService.login({ email, password });
      setSuccess(true);

      // Vérifier si le profil est complet
      const profile = await FirestoreService.getDocument<UserProfile>('users', userCredential.uid);

      if (profile?.profileSetupCompleted) {
        setTimeout(() => navigate('home'), 1000);
      } else {
        // Profil non complet, rediriger vers profile-setup
        setTimeout(() => navigate('profile-setup'), 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError(null);
    setSuccess(false);

    if (!email || !password || !displayName) {
      setError('Veuillez remplir tous les champs requis');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      await AuthService.register({
        email,
        password,
        displayName,
        phone: phone || undefined,
      });
      setSuccess(true);
      setError(null);
      setTimeout(() => navigate('profile-setup'), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const user = await AuthService.loginWithGoogle();
      setSuccess(true);

      // Vérifier si le profil est complet
      const profile = await FirestoreService.getDocument<UserProfile>('users', user.uid);

      if (profile?.profileSetupCompleted) {
        setTimeout(() => navigate('home'), 1000);
      } else {
        // Profil non complet, rediriger vers profile-setup
        setTimeout(() => navigate('profile-setup'), 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeArea className="p-6 justify-center bg-slate-950">
      <div className="w-full flex flex-col h-full justify-center">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
            {mode === 'login' ? 'Bienvenue' : 'Créer un compte'}
          </h1>
          <p className="text-slate-400 text-lg mb-1">
            {mode === 'login' ? 'Connectez-vous à votre espace' : 'Rejoignez la communauté'}
          </p>
          <p className="text-cyan-400 text-xl font-bold">PADEC Connect</p>
          <p className="text-slate-500 text-sm mt-2">Votre relai en RD Congo</p>
        </div>

        {/* Erreur */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Succès */}
        {success && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
            ✓ Succès ! Redirection en cours...
          </div>
        )}

        {/* Formulaire de Connexion */}
        {mode === 'login' ? (
          <div className="w-full space-y-3 mb-6">
            <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-800">
              <h2 className="text-lg font-bold mb-4 text-cyan-400">Se connecter</h2>
              <Input 
                icon={Mail} 
                placeholder="Email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <PasswordInput 
                placeholder="Mot de passe" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="flex justify-end mb-3">
              <button className="text-cyan-400 text-sm font-medium hover:text-cyan-300 transition-colors">
                Mot de passe oublié ?
              </button>
            </div>
            <Button 
              onClick={handleLogin} 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader size={18} className="animate-spin" /> Connexion...
                </span>
              ) : (
                'Se Connecter'
              )}
            </Button>
          </div>
        ) : (
          <div className="w-full space-y-3 mb-6">
            <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-800">
              <h2 className="text-lg font-bold mb-4 text-cyan-400">Créer un compte</h2>
              <Input 
                icon={Mail} 
                placeholder="Email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <Input 
                icon={User}
                placeholder="Nom complet"
                type="text" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={loading}
              />
              <PasswordInput 
                placeholder="Mot de passe (min. 6 caractères)" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button 
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader size={18} className="animate-spin" /> Inscription...
                </span>
              ) : (
                "S'inscrire"
              )}
            </Button>
          </div>
        )}

        {/* Séparateur */}
        <div className="flex items-center gap-4 my-4">
          <div className="h-px bg-slate-800 flex-1"></div>
          <span className="text-slate-600 text-sm font-medium">Ou continuer avec</span>
          <div className="h-px bg-slate-800 flex-1"></div>
        </div>

        {/* Boutons sociaux */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            variant="secondary" 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="py-3 text-sm"
          >
            <span className="font-bold text-lg">G</span> Google
          </Button>
          <Button variant="secondary" className="py-3 text-sm opacity-50 cursor-not-allowed">
            <Apple size={18} fill="white" /> Apple
          </Button>
        </div>

        {/* Toggle mode */}
        <div className="text-center pb-4 mt-auto">
          {mode === 'login' ? (
            <p className="text-slate-500">
              Pas encore de compte ? {' '}
              <button 
                onClick={() => {
                  setMode('register');
                  setError(null);
                  setSuccess(false);
                }} 
                className="text-cyan-400 font-bold hover:underline"
              >
                S'inscrire
              </button>
            </p>
          ) : (
            <p className="text-slate-500">
              Déjà un compte ? {' '}
              <button 
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccess(false);
                }} 
                className="text-cyan-400 font-bold hover:underline"
              >
                Se connecter
              </button>
            </p>
          )}
        </div>
      </div>
    </SafeArea>
  );
};