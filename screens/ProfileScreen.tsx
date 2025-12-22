import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Bell, CreditCard, FileText, Settings, LogOut, Heart, ShoppingBag, Package, Mail, Phone, MapPin } from 'lucide-react';
import { SafeArea } from '../components/MobileLayout';
import { useNavigation } from '../context/NavigationContext';
import { useAuthContext } from '../context/AuthContext';
import { AuthService } from '../services/AuthService';

export const ProfileScreen: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const { user, userProfile } = useAuthContext();

  // Formater la date d'inscription
  const formatMemberSince = () => {
    if (user?.metadata?.creationTime) {
      const date = new Date(user.metadata.creationTime);
      const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
      return `Membre depuis ${date.toLocaleDateString('fr-FR', options)}`;
    }
    return 'Membre PADEC Connect';
  };

  // Obtenir le nom d'affichage
  const getDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (userProfile?.phone) return userProfile.phone;
    if (user?.email) return user.email.split('@')[0];
    return 'Utilisateur PADEC';
  };

  // Gérer la déconnexion
  const handleLogout = async () => {
    try {
      await AuthService.logout();
      navigate('auth', { mode: 'login' });
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  const menuItems = [
    { icon: Heart, label: 'Mes favoris', action: () => {} },
    { icon: ShoppingBag, label: 'Mes commandes', action: () => navigate('market') },
    { icon: Package, label: 'Mes réservations', action: () => navigate('services') },
    { icon: Bell, label: 'Notifications', action: () => {} },
    { icon: CreditCard, label: 'Moyens de paiement', action: () => {} },
    { icon: FileText, label: 'Documents', action: () => {} },
    { icon: Settings, label: 'Paramètres', action: () => {} }
  ];

  return (
    <SafeArea className="bg-slate-950 relative pt-0">
      <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        <div className="p-6 pt-14 flex items-center gap-4 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-800/50">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800"
          >
            <ArrowLeft size={20} className="text-white" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">Mon Compte</h1>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Profile Header */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              {/* Photo de profil */}
              {userProfile?.profilePictureUrl ? (
                <img
                  src={userProfile.profilePictureUrl}
                  alt="Photo de profil"
                  className="w-20 h-20 rounded-full object-cover border-2 border-cyan-500"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <User size={40} className="text-white" />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1">{getDisplayName()}</h2>
                <p className="text-slate-400 text-sm">{formatMemberSince()}</p>
              </div>
            </div>

            {/* Informations de contact */}
            <div className="space-y-3 mb-4">
              {user?.email && (
                <div className="flex items-center gap-3 text-slate-400">
                  <Mail size={16} className="text-cyan-400" />
                  <span className="text-sm">{user.email}</span>
                </div>
              )}
              {userProfile?.phone && (
                <div className="flex items-center gap-3 text-slate-400">
                  <Phone size={16} className="text-cyan-400" />
                  <span className="text-sm">{userProfile.phone}</span>
                </div>
              )}
              {(userProfile?.city || userProfile?.country) && (
                <div className="flex items-center gap-3 text-slate-400">
                  <MapPin size={16} className="text-cyan-400" />
                  <span className="text-sm">
                    {[userProfile.city, userProfile.country].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('profile-setup')}
              className="w-full py-3 bg-slate-800/50 rounded-xl text-white font-medium hover:bg-slate-800 transition-colors"
            >
              Modifier le profil
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-1">0</div>
              <div className="text-slate-400 text-xs">Commandes</div>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">0</div>
              <div className="text-slate-400 text-xs">Réservations</div>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">0</div>
              <div className="text-slate-400 text-xs">Favoris</div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden">
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  onClick={item.action}
                  className="w-full flex items-center gap-4 p-4 hover:bg-slate-800/50 transition-colors border-b border-slate-800/50 last:border-0"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center">
                    <Icon size={20} className="text-cyan-400" />
                  </div>
                  <span className="flex-1 text-left text-white font-medium">{item.label}</span>
                  <ArrowLeft size={20} className="text-slate-500 rotate-180" />
                </button>
              );
            })}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl hover:bg-red-500/20 transition-colors"
          >
            <LogOut size={20} className="text-red-400" />
            <span className="flex-1 text-left text-red-400 font-medium">Déconnexion</span>
          </button>
        </div>
      </div>
    </SafeArea>
  );
};
