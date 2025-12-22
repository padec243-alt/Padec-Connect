import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, X, Wrench, ShoppingBag, Users, Grid } from 'lucide-react';
import { SafeArea } from '../components/MobileLayout';
import { useNavigation } from '../context/NavigationContext';

const recentSearches = ['Démarches administratives', 'Pack solaire', 'Formation IT', 'Co-working'];
const suggestions = [
  { icon: Wrench, label: 'Services', category: 'services', bgClass: 'bg-cyan-500/10', borderClass: 'border-cyan-500/20', iconClass: 'text-cyan-400' },
  { icon: ShoppingBag, label: 'Produits', category: 'market', bgClass: 'bg-purple-500/10', borderClass: 'border-purple-500/20', iconClass: 'text-purple-400' },
  { icon: Users, label: 'Entrepreneurs', category: 'repertoire', bgClass: 'bg-blue-500/10', borderClass: 'border-blue-500/20', iconClass: 'text-blue-400' },
  { icon: Grid, label: 'E-Services', category: 'eservices', bgClass: 'bg-indigo-500/10', borderClass: 'border-indigo-500/20', iconClass: 'text-indigo-400' }
];

export const SearchScreen: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (query.trim()) {
      setHasSearched(true);
      // Ici on pourrait faire une vraie recherche
    }
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
          <div className="flex-1 relative">
            <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 border border-slate-800">
              <Search size={20} className="text-slate-500" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-transparent w-full text-white outline-none placeholder:text-slate-600"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center"
                >
                  <X size={14} className="text-slate-400" />
                </button>
              )}
            </div>
          </div>
        </div>

        {!hasSearched ? (
          <div className="px-6 py-6 space-y-6">
            {/* Suggestions */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Catégories</h3>
              <div className="grid grid-cols-2 gap-3">
                {suggestions.map((suggestion, i) => {
                  const Icon = suggestion.icon;
                  return (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => navigate(suggestion.category as any)}
                      className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-slate-800/60 transition-colors"
                    >
                      <div className={`w-12 h-12 rounded-xl ${suggestion.bgClass} flex items-center justify-center border ${suggestion.borderClass}`}>
                        <Icon size={24} className={suggestion.iconClass} />
                      </div>
                      <span className="text-white font-medium text-sm">{suggestion.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Recherches récentes</h3>
                <div className="space-y-2">
                  {recentSearches.map((search, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => {
                        setQuery(search);
                        handleSearch();
                      }}
                      className="w-full flex items-center gap-3 p-3 bg-slate-900/40 border border-slate-800/80 rounded-xl hover:bg-slate-800/60 transition-colors text-left"
                    >
                      <Search size={18} className="text-slate-400" />
                      <span className="text-slate-300">{search}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="px-6 py-6">
            <p className="text-slate-400 text-center">Résultats de recherche pour "{query}"</p>
            <div className="mt-6 space-y-4">
              <p className="text-slate-500 text-sm text-center">Aucun résultat trouvé</p>
            </div>
          </div>
        )}
      </div>
    </SafeArea>
  );
};

