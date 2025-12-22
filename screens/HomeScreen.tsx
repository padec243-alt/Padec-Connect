import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Search, Wrench, ShoppingBag, Grid, Home, User, 
  ArrowRight, Package, Truck, Zap, MessageCircle, FileText, Plane,
  Briefcase, Users, GraduationCap, Building, Heart,
  Calendar, Globe, Store, BookOpen, MapPin
} from 'lucide-react';
import { SafeArea } from '../components/MobileLayout';
import { useNavigation } from '../context/NavigationContext';
import { useAuthContext } from '../context/AuthContext';

export const HomeScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const { user, userProfile } = useAuthContext();
  const [activeTab, setActiveTab] = useState('home');

  // Obtenir le prénom ou le nom d'affichage
  const getDisplayName = () => {
    if (user?.displayName) {
      // Prendre juste le prénom (premier mot)
      return user.displayName.split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Utilisateur';
  };

  // Obtenir la localisation
  const getLocation = () => {
    if (userProfile?.city || userProfile?.country) {
      return [userProfile.city, userProfile.country].filter(Boolean).join(', ');
    }
    return null;
  };

  return (
    <SafeArea className="bg-slate-950 relative pt-0">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pb-28 no-scrollbar scroll-smooth">
        
        {/* Header - Sticky behavior simulated */}
        <div className="p-6 pt-14 flex justify-between items-center bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-800/50">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1 font-medium">Bon retour,</p>
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              {getDisplayName()} <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            </h2>
            {getLocation() && (
              <p className="text-slate-500 text-xs flex items-center gap-1 mt-1">
                <MapPin size={12} className="text-cyan-400" />
                {getLocation()}
              </p>
            )}
          </motion.div>
          <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             whileTap={{ scale: 0.9 }}
             onClick={() => navigate('profile')}
             className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-700 relative shadow-lg cursor-pointer overflow-hidden"
          >
            {userProfile?.profilePictureUrl ? (
              <img
                src={userProfile.profilePictureUrl}
                alt="Profil"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <Bell size={20} className="text-slate-300" />
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900"></span>
              </>
            )}
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-6 my-4 sticky top-28 z-20"
        >
          <div 
            onClick={() => navigate('search')}
            className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 border border-slate-800 shadow-xl group focus-within:border-cyan-500/50 transition-colors cursor-pointer"
          >
            <Search size={20} className="text-slate-500 group-focus-within:text-cyan-400" />
            <input 
              type="text" 
              placeholder="Rechercher services, produits, entrepreneurs..." 
              className="bg-transparent w-full text-white outline-none placeholder:text-slate-600 cursor-pointer"
              readOnly
            />
          </div>
        </motion.div>

        {/* Modules PADEC */}
        <div className="px-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <h3 className="text-lg font-bold text-white">Nos Modules</h3>
            <p className="text-slate-500 text-xs">Accédez à tous les services PADEC</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Services à la Demande */}
            <motion.button 
              onClick={() => navigate('services')}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-cyan-600 via-cyan-700 to-slate-900 rounded-[28px] p-5 relative overflow-hidden h-48 flex flex-col justify-between text-left shadow-lg border border-cyan-500/20"
            >
              <div className="absolute top-[-20px] right-[-20px] p-4 opacity-10 rotate-12">
                <Wrench size={100} />
              </div>
              <div className="bg-white/10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10">
                <Wrench size={20} className="text-white" />
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-1 text-white">Services à la Demande</h3>
                <p className="text-cyan-200 text-xs mb-3 leading-relaxed">Démarches, voyages, entrepreneuriat, formations...</p>
                <div className="bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 w-fit border border-white/5">
                  Explorer <ArrowRight size={12} />
                </div>
              </div>
            </motion.button>

            {/* E-Services */}
            <motion.button 
              onClick={() => navigate('eservices')}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 rounded-[28px] p-5 relative overflow-hidden h-48 flex flex-col justify-between text-left shadow-lg border border-blue-500/20"
            >
              <div className="absolute top-[-20px] right-[-20px] p-4 opacity-10 rotate-12">
                <Grid size={100} />
              </div>
              <div className="bg-white/10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10">
                <Grid size={20} className="text-white" />
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-1 text-white">E-Services</h3>
                <p className="text-blue-200 text-xs mb-3 leading-relaxed">Co-working, soins, visas, événementiel...</p>
                <div className="bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 w-fit border border-white/5">
                  Découvrir <ArrowRight size={12} />
                </div>
              </div>
            </motion.button>
          </div>

          {/* Market Hub */}
          <motion.button 
            onClick={() => navigate('market')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-br from-purple-600 via-purple-700 to-slate-900 border border-purple-500/20 p-5 rounded-[28px] flex items-center justify-between group shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                <ShoppingBag size={24} className="text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white text-lg">Market Hub</h3>
                <p className="text-xs text-purple-200">E-commerce & Répertoire des acteurs</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-colors border border-white/5">
              <ArrowRight size={16} />
            </div>
          </motion.button>
        </div>

        {/* Services Rapides */}
        <div className="px-6 mb-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-between items-end mb-4"
          >
            <h3 className="text-lg font-bold text-white">Services Rapides</h3>
            <button className="text-cyan-400 text-xs font-bold hover:text-cyan-300">Voir tout</button>
          </motion.div>
          
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: FileText, label: "Démarches", bgClass: "bg-cyan-500/10", borderClass: "border-cyan-500/20", iconClass: "text-cyan-400" },
              { icon: Plane, label: "Voyages", bgClass: "bg-blue-500/10", borderClass: "border-blue-500/20", iconClass: "text-blue-400" },
              { icon: Briefcase, label: "Entrepreneuriat", bgClass: "bg-purple-500/10", borderClass: "border-purple-500/20", iconClass: "text-purple-400" },
              { icon: GraduationCap, label: "Formations", bgClass: "bg-yellow-500/10", borderClass: "border-yellow-500/20", iconClass: "text-yellow-400" },
              { icon: Building, label: "Hébergement", bgClass: "bg-emerald-500/10", borderClass: "border-emerald-500/20", iconClass: "text-emerald-400" },
              { icon: Heart, label: "Soins", bgClass: "bg-red-500/10", borderClass: "border-red-500/20", iconClass: "text-red-400" },
              { icon: Globe, label: "Visas", bgClass: "bg-indigo-500/10", borderClass: "border-indigo-500/20", iconClass: "text-indigo-400" },
              { icon: Calendar, label: "Événements", bgClass: "bg-pink-500/10", borderClass: "border-pink-500/20", iconClass: "text-pink-400" }
            ].map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + (i * 0.05) }}
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center gap-2 p-3 bg-slate-900/40 border border-slate-800/80 rounded-2xl hover:bg-slate-800/60 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl ${service.bgClass} flex items-center justify-center border ${service.borderClass}`}>
                    <Icon size={20} className={service.iconClass} />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium text-center leading-tight">{service.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Répertoire des Acteurs */}
        <div className="px-6 mb-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex justify-between items-end mb-4"
          >
            <h3 className="text-lg font-bold text-white">Répertoire des Acteurs</h3>
            <button onClick={() => navigate('repertoire')} className="text-cyan-400 text-xs font-bold hover:text-cyan-300">Voir tout</button>
          </motion.div>
          
          <div className="space-y-4">
            {[
              { name: "Entrepreneur Tech", category: "Technologie", location: "Kinshasa", verified: true },
              { name: "Consultant Immobilier", category: "Immobilier", location: "Lubumbashi", verified: true },
              { name: "Formateur Professionnel", category: "Formation", location: "Kinshasa", verified: false }
            ].map((actor, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + (i * 0.1) }}
                onClick={() => navigate('actor-detail', { actor })}
                className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex gap-4 items-center hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-cyan-500/20">
                  <Users size={24} className="text-cyan-400" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-200 flex items-center gap-2">
                      {actor.name}
                      {actor.verified && (
                        <span className="w-4 h-4 rounded-full bg-cyan-500 flex items-center justify-center">
                          <span className="text-[8px] text-white">✓</span>
                        </span>
                      )}
                    </h4>
                  </div>
                  <p className="text-slate-500 text-xs mt-1">{actor.category}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-cyan-400 text-xs font-medium">{actor.location}</span>
                    <span className="text-slate-600 text-xs">•</span>
                    <span className="text-cyan-400 text-xs font-bold">Voir profil</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Projets en Vedette */}
        <div className="px-6 mb-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-between items-end mb-4"
          >
            <h3 className="text-lg font-bold text-white">Projets en Vedette</h3>
            <button onClick={() => navigate('projects')} className="text-cyan-400 text-xs font-bold hover:text-cyan-300">Voir tout</button>
          </motion.div>
          
          <div className="space-y-3">
            {[
              { title: "Adduction d'Eau Potable", location: "RDC", type: "Infrastructure" },
              { title: "Concession N'sele", location: "Kinshasa", type: "Immobilier" },
              { title: "Salon PME & PMI", location: "Kinshasa-Chine", type: "Événementiel" }
            ].map((project, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + (i * 0.1) }}
                className="bg-gradient-to-r from-slate-900/60 to-slate-800/40 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3 hover:border-cyan-500/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                  <Globe size={18} className="text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-200 text-sm">{project.title}</h4>
                  <p className="text-slate-500 text-xs">{project.location} • {project.type}</p>
                </div>
                <ArrowRight size={16} className="text-slate-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button (FAB) - Assistance */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-40">
        <motion.button 
          onClick={() => navigate('assistance')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.4)] border-4 border-slate-950 group"
        >
           <MessageCircle size={28} className="text-slate-900" strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800/50 flex justify-around items-start pt-4 z-30 px-2 rounded-t-[30px]">
        <NavIcon icon={Home} label="Accueil" active={activeTab === 'home'} onClick={() => { setActiveTab('home'); navigate('home'); }} />
        <NavIcon icon={Grid} label="Services" active={activeTab === 'services'} onClick={() => { setActiveTab('services'); navigate('services'); }} />
        <div className="w-12"></div> {/* Spacer for FAB */}
        <NavIcon icon={Store} label="Market" active={activeTab === 'shop'} onClick={() => { setActiveTab('shop'); navigate('market'); }} />
        <NavIcon icon={User} label="Compte" active={activeTab === 'account'} onClick={() => { setActiveTab('account'); navigate('profile'); }} />
      </div>
    </SafeArea>
  );
};

const NavIcon = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button onClick={onClick} className="relative flex flex-col items-center justify-center w-16 gap-1 group">
    <div className={`p-1.5 rounded-xl transition-all duration-300 ${active ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    </div>
    <span className={`text-[10px] font-medium transition-colors ${active ? 'text-cyan-400' : 'text-slate-500'}`}>{label}</span>
    {active && (
      <motion.div 
        layoutId="nav-dot"
        className="absolute -bottom-2 w-1 h-1 bg-cyan-400 rounded-full"
      />
    )}
  </button>
);