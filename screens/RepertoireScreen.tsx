import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Users, MapPin, CheckCircle } from 'lucide-react';
import { SafeArea } from '../components/MobileLayout';
import { useNavigation } from '../context/NavigationContext';
import { Actor } from '../types';

const actors: Actor[] = [
  {
    id: 'a1',
    name: 'Tech Solutions RDC',
    category: 'Technologie',
    location: 'Kinshasa',
    verified: true,
    description: 'Solutions technologiques innovantes pour entreprises',
    services: ['Développement', 'Consulting', 'Formation'],
    rating: 4.8
  },
  {
    id: 'a2',
    name: 'Immobilier Pro',
    category: 'Immobilier',
    location: 'Lubumbashi',
    verified: true,
    description: 'Expert en immobilier commercial et résidentiel',
    services: ['Vente', 'Location', 'Conseil'],
    rating: 4.7
  },
  {
    id: 'a3',
    name: 'Formation Excellence',
    category: 'Formation',
    location: 'Kinshasa',
    verified: false,
    description: 'Formations professionnelles certifiées',
    services: ['Formation IT', 'Management', 'Langues'],
    rating: 4.6
  },
  {
    id: 'a4',
    name: 'Consulting Business',
    category: 'Consulting',
    location: 'Kinshasa',
    verified: true,
    description: 'Accompagnement stratégique pour entreprises',
    services: ['Stratégie', 'Finance', 'Marketing'],
    rating: 4.9
  }
];

export const RepertoireScreen: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(actors.map(a => a.category)));
  const filteredActors = actors.filter(actor => {
    const matchesSearch = actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         actor.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || actor.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            <h1 className="text-2xl font-bold text-white">Répertoire des Acteurs</h1>
            <p className="text-slate-400 text-xs">Entrepreneurs et prestataires</p>
          </div>
        </div>

        <div className="px-6 my-4">
          <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 border border-slate-800">
            <Search size={20} className="text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher un acteur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent w-full text-white outline-none placeholder:text-slate-600"
            />
          </div>
        </div>

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

        <div className="px-6 space-y-4 pb-6">
          {filteredActors.map((actor, i) => (
            <motion.div
              key={actor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate('actor-detail', { actor })}
              className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 cursor-pointer hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/20 flex-shrink-0">
                  <Users size={28} className="text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white text-lg">{actor.name}</h3>
                    {actor.verified && (
                      <CheckCircle size={18} className="text-cyan-400" />
                    )}
                  </div>
                  <p className="text-slate-400 text-sm mb-2">{actor.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {actor.location}
                    </span>
                    {actor.rating && (
                      <span>★ {actor.rating}</span>
                    )}
                  </div>
                  {actor.services && (
                    <div className="flex flex-wrap gap-2">
                      {actor.services.slice(0, 3).map((service, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded-full border border-cyan-500/20"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SafeArea>
  );
};

