import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Building2, Heart, Globe, Calendar, Users, Building } from 'lucide-react';
import { SafeArea } from '../components/MobileLayout';
import { useNavigation } from '../context/NavigationContext';
import { Service, ScreenName } from '../types';

interface EService extends Service {
  screen: ScreenName;
}

const eservices: EService[] = [
  {
    id: 'e1',
    title: 'Espace de Travail',
    description: 'Co-working, bureaux privés, salles de réunion à Kinshasa',
    category: 'Espace',
    icon: Building2,
    price: 50000,
    duration: 'Par jour',
    location: 'Kinshasa',
    rating: 4.9,
    screen: 'coworking'
  },
  {
    id: 'e2',
    title: 'Santé & Médecine',
    description: 'Hôpitaux, médecins, infirmiers à domicile, ambulances et conseillers santé',
    category: 'Santé',
    icon: Heart,
    price: 75000,
    duration: 'Sur mesure',
    location: 'Kinshasa',
    rating: 4.8,
    screen: 'health'
  },
  {
    id: 'e3',
    title: 'Visas Congolais',
    description: 'Assistance complète pour l\'obtention de votre visa ou passeport congolais',
    category: 'Administratif',
    icon: Globe,
    price: 150000,
    duration: '15-30 jours',
    location: 'Kinshasa',
    rating: 4.7,
    screen: 'visa'
  },
  {
    id: 'e4',
    title: 'Aide à la Famille',
    description: 'Services d\'aide et de soutien pour votre famille en RD Congo',
    category: 'Social',
    icon: Users,
    price: 100000,
    duration: 'Mensuel',
    location: 'Toute la RDC',
    rating: 4.6,
    screen: 'family-help'
  },
  {
    id: 'e5',
    title: 'Événementiel',
    description: 'Billetterie et réservations pour événements, concerts et salons',
    category: 'Événement',
    icon: Calendar,
    price: 500000,
    duration: 'Sur mesure',
    location: 'Kinshasa',
    rating: 4.9,
    screen: 'events'
  },
  {
    id: 'e6',
    title: 'Hébergement',
    description: 'Hôtels, appartements à louer, maisons et terrains à vendre',
    category: 'Immobilier',
    icon: Building,
    price: 150000,
    duration: 'Variable',
    location: 'Toute la RDC',
    rating: 4.8,
    screen: 'housing'
  }
];

export const EServicesScreen: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = eservices.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleServiceClick = (service: EService) => {
    navigate(service.screen);
  };

  return (
    <SafeArea className="bg-slate-950 relative pt-0">
      <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        {/* Header */}
        <div className="p-6 pt-14 flex items-center gap-4 bg-gradient-to-r from-blue-900/50 to-indigo-900/30 backdrop-blur-xl sticky top-0 z-30 border-b border-blue-500/20">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-slate-900/80 flex items-center justify-center border border-blue-500/30"
          >
            <ArrowLeft size={20} className="text-white" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">E-Services</h1>
            <p className="text-blue-300 text-xs">Simplifiez vos démarches</p>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 my-4">
          <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 border border-blue-500/20">
            <Search size={20} className="text-blue-400" />
            <input
              type="text"
              placeholder="Rechercher un e-service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent w-full text-white outline-none placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="px-6 space-y-4 pb-6">
          {filteredServices.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleServiceClick(service)}
                className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 cursor-pointer hover:border-blue-500/50 transition-all"
              >
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 flex-shrink-0">
                    <Icon size={24} className="text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-white text-lg">{service.title}</h3>
                      {service.rating && (
                        <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-full">
                          <span className="text-emerald-400 text-xs font-bold">★ {service.rating}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm mb-3 line-clamp-2">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        {service.location && <span>{service.location}</span>}
                        {service.duration && <span>• {service.duration}</span>}
                      </div>
                      <span className="text-blue-400 text-sm font-medium">Voir →</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SafeArea>
  );
};

