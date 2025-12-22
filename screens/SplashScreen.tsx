import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { SafeArea } from '../components/MobileLayout';
import { useNavigation } from '../context/NavigationContext';
import { useAuthContext } from '../context/AuthContext';
import { Logo } from '../components/Logo';

export const SplashScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const { isAuthenticated, profileSetupCompleted, loading } = useAuthContext();

  useEffect(() => {
    // Attendre que le chargement de l'auth soit terminé
    if (loading) return;

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        // Utilisateur connecté
        if (profileSetupCompleted) {
          // Profil complet -> page d'accueil
          navigate('home');
        } else {
          // Profil incomplet -> page de configuration
          navigate('profile-setup');
        }
      } else {
        // Non connecté -> onboarding
        navigate('onboarding');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated, profileSetupCompleted, loading]);

  return (
    <SafeArea className="items-center justify-center bg-slate-950">
      <div className="relative flex flex-col items-center justify-center">
        {/* Animated Background Blur */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-cyan-500 blur-[80px] rounded-full w-64 h-64 -z-10"
        />
        
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 1.5 
          }}
          className="mb-8 shadow-[0_0_40px_rgba(34,211,238,0.3)]"
        >
          <Logo size="xl" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl font-black tracking-tighter text-white mb-2">PADEC</h1>
          <motion.p 
            initial={{ letterSpacing: "0.1em", opacity: 0 }}
            animate={{ letterSpacing: "0.3em", opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-cyan-400 text-xs font-bold uppercase mb-3"
          >
            Passerelle des Congolais
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-slate-400 text-sm font-medium max-w-xs"
          >
            Votre relai en RD Congo pour les activités privées, associatives ou entrepreneuriales
          </motion.p>
        </motion.div>
      </div>
    </SafeArea>
  );
};