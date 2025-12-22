import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Star, Check, Phone, Mail } from 'lucide-react';
import { SafeArea } from '../components/MobileLayout';
import { useNavigation } from '../context/NavigationContext';
import { Button } from '../components/UI';
import { Service } from '../types';

export const EServiceDetailScreen: React.FC = () => {
  const { navigate, goBack, params } = useNavigation();
  const service: Service = params?.service || {
    id: 'e1',
    title: 'Co-working Space',
    description: 'Espace de travail partagé moderne à Kinshasa avec toutes les commodités',
    category: 'Espace',
    icon: ArrowLeft,
    price: 50000,
    duration: 'Par jour',
    location: 'Kinshasa',
    rating: 4.9
  };

  const handleReserve = () => {
    alert('Réservation effectuée avec succès !');
    navigate('home');
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
            <h1 className="text-xl font-bold text-white">Détails</h1>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                {service.icon && <service.icon size={32} className="text-blue-400" />}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">{service.title}</h2>
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-slate-400 text-sm">{service.rating}/5</span>
                </div>
              </div>
            </div>
            <p className="text-slate-300 text-base leading-relaxed mb-4">{service.description}</p>
            
            <div className="space-y-3">
              {service.location && (
                <div className="flex items-center gap-3 text-slate-400">
                  <MapPin size={18} />
                  <span>{service.location}</span>
                </div>
              )}
              {service.duration && (
                <div className="flex items-center gap-3 text-slate-400">
                  <Clock size={18} />
                  <span>Durée: {service.duration}</span>
                </div>
              )}
              {service.price && (
                <div className="flex items-center gap-3">
                  <span className="text-blue-400 font-bold text-xl">
                    {service.price.toLocaleString()} FC
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4">Avantages</h3>
            <div className="space-y-3">
              {['Service rapide et efficace', 'Support dédié', 'Suivi personnalisé', 'Résultats garantis'].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check size={20} className="text-blue-400 flex-shrink-0" />
                  <span className="text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800/50">
          <Button onClick={handleReserve}>
            Réserver maintenant
          </Button>
        </div>
      </div>
    </SafeArea>
  );
};

