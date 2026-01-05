import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, FileText, Plane, Briefcase, Users, GraduationCap, Building, Filter, Wrench } from 'lucide-react';
import { SafeArea } from '../components/MobileLayout';
import { useNavigation } from '../context/NavigationContext';
import { Service } from '../types';
import { FirestoreService } from '../services/FirestoreService';

// Données de démonstration
const demoServices: Service[] = [
  { id: '1', title: 'Démarches Administratives', description: 'Accompagnement pour toutes vos démarches administratives en RD Congo', category: 'Administratif', icon: FileText, price: 50000, duration: '2-5 jours', location: 'Kinshasa', rating: 4.8 },
  { id: '2', title: 'Assistance Voyages', description: 'Organisation complète de vos voyages et assistance sur place', category: 'Voyage', icon: Plane, price: 100000, duration: 'Sur mesure', location: 'Toute la RDC', rating: 4.9 },
  { id: '3', title: 'Conseil Entrepreneuriat', description: 'Accompagnement pour créer et développer votre entreprise', category: 'Entrepreneuriat', icon: Briefcase, price: 200000, duration: 'Mensuel', location: 'Kinshasa', rating: 4.7 },
  { id: '4', title: 'Mise en Relation', description: 'Connexion avec les bons partenaires et prestataires', category: 'Réseau', icon: Users, price: 75000, duration: 'Ponctuel', location: 'Toute la RDC', rating: 4.6 },
  { id: '5', title: 'Formations Professionnelles', description: 'Formations adaptées à vos besoins professionnels', category: 'Formation', icon: GraduationCap, price: 150000, duration: 'Variable', location: 'Kinshasa', rating: 4.8 },
  { id: '6', title: 'Domiciliation & Hébergement', description: 'Aide à trouver un logement ou installer vos bureaux', category: 'Immobilier', icon: Building, price: 300000, duration: 'Sur mesure', location: 'Kinshasa', rating: 4.5 }
];

export const ServicesScreen: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>(demoServices);
  const [loading, setLoading] = useState(true);

  // Charger les services depuis Firebase
  useEffect(() => {
    const loadServices = async () => {
      try {
        const firebaseServices = await FirestoreService.getCollection<any>('services');
        if (firebaseServices.length > 0) {
          // Mapper les données Firebase vers le format Service
          const mappedServices = firebaseServices.map(s => ({
            ...s,
            icon: Wrench // Icône par défaut pour les services Firebase
          }));
          setServices(mappedServices);
        }
      } catch (error) {
        console.error('Erreur chargement services:', error);
      }
      setLoading(false);
    };
    loadServices();
  }, []);

  const categories = Array.from(new Set(services.map(s => s.category)));
  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeArea className="bg-slate-950 relative pt-0">
      <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        {/* Header */}
        <div className="p-6 pt-14 flex items-center gap-4 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-800/50">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800"
          >
            <ArrowLeft size={20} className="text-white" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">Services à la Demande</h1>
            <p className="text-slate-400 text-xs">Gestion stratégique de vos démarches</p>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 my-4">
          <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 border border-slate-800">
            <Search size={20} className="text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher un service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent w-full text-white outline-none placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="px-6 mb-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === null
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              Tous
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services List */}
        <div className="px-6 space-y-4 pb-6">
          {filteredServices.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate('service-detail', { service })}
                className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 cursor-pointer hover:bg-slate-800/60 transition-colors"
              >
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 flex-shrink-0 overflow-hidden">
                    {service.image ? (
                      <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                    ) : (
                      <Icon size={24} className="text-cyan-400" />
                    )}
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
                      {service.price && (
                        <span className="text-cyan-400 font-bold">
                          {service.price.toLocaleString()} FC
                        </span>
                      )}
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

