import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, MapPin, Star, CheckCircle, Phone, Mail, MessageCircle } from 'lucide-react';
import { SafeArea } from '../components/MobileLayout';
import { useNavigation } from '../context/NavigationContext';
import { Button } from '../components/UI';
import { Actor } from '../types';

export const ActorDetailScreen: React.FC = () => {
  const { navigate, goBack, params } = useNavigation();
  const actor: Actor = params?.actor || {
    id: 'a1',
    name: 'Tech Solutions RDC',
    category: 'Technologie',
    location: 'Kinshasa',
    verified: true,
    description: 'Solutions technologiques innovantes pour entreprises',
    services: ['Développement', 'Consulting', 'Formation'],
    rating: 4.8
  };

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
            <h1 className="text-xl font-bold text-white">Profil</h1>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/20 overflow-hidden">
                {actor.image ? (
                  <img src={actor.image} alt={actor.name} className="w-full h-full object-cover" />
                ) : (
                  <Users size={40} className="text-cyan-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-white">{actor.name}</h2>
                  {actor.verified && (
                    <CheckCircle size={24} className="text-cyan-400" />
                  )}
                </div>
                <p className="text-slate-400 mb-2">{actor.category}</p>
                {actor.rating && (
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-slate-400 text-sm">{actor.rating}/5</span>
                  </div>
                )}
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed">{actor.description}</p>
          </motion.div>

          {actor.services && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Services</h3>
              <div className="flex flex-wrap gap-2">
                {actor.services.map((service, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4">Contact</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors">
                <Phone size={20} className="text-cyan-400" />
                <span className="text-white">+243 XXX XXX XXX</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors">
                <Mail size={20} className="text-cyan-400" />
                <span className="text-white">contact@example.com</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors">
                <MessageCircle size={20} className="text-cyan-400" />
                <span className="text-white">Envoyer un message</span>
              </button>
            </div>
          </motion.div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800/50">
          <Button onClick={() => alert('Mise en relation initiée !')}>
            Contacter
          </Button>
        </div>
      </div>
    </SafeArea>
  );
};

