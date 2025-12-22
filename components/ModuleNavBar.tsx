import React from 'react';
import { Home, Search, Heart, ShoppingBag, User, ArrowLeft } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

interface ModuleNavBarProps {
  module: 'market' | 'health' | 'coworking' | 'events' | 'housing';
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const moduleConfigs = {
  market: {
    title: 'PADEC Market',
    color: 'purple',
    tabs: [
      { id: 'home', label: 'Accueil', icon: Home },
      { id: 'search', label: 'Recherche', icon: Search },
      { id: 'favorites', label: 'Favoris', icon: Heart },
      { id: 'cart', label: 'Panier', icon: ShoppingBag },
      { id: 'profile', label: 'Compte', icon: User },
    ]
  },
  health: {
    title: 'Santé & Médecine',
    color: 'red',
    tabs: [
      { id: 'home', label: 'Accueil', icon: Home },
      { id: 'search', label: 'Recherche', icon: Search },
      { id: 'favorites', label: 'Favoris', icon: Heart },
      { id: 'profile', label: 'Compte', icon: User },
    ]
  },
  coworking: {
    title: 'Espace de Travail',
    color: 'blue',
    tabs: [
      { id: 'home', label: 'Accueil', icon: Home },
      { id: 'search', label: 'Recherche', icon: Search },
      { id: 'favorites', label: 'Favoris', icon: Heart },
      { id: 'profile', label: 'Compte', icon: User },
    ]
  },
  events: {
    title: 'Événementiel',
    color: 'pink',
    tabs: [
      { id: 'home', label: 'Accueil', icon: Home },
      { id: 'search', label: 'Recherche', icon: Search },
      { id: 'tickets', label: 'Billets', icon: ShoppingBag },
      { id: 'profile', label: 'Compte', icon: User },
    ]
  },
  housing: {
    title: 'Hébergement',
    color: 'amber',
    tabs: [
      { id: 'home', label: 'Accueil', icon: Home },
      { id: 'search', label: 'Recherche', icon: Search },
      { id: 'favorites', label: 'Favoris', icon: Heart },
      { id: 'profile', label: 'Compte', icon: User },
    ]
  }
};

export const ModuleNavBar: React.FC<ModuleNavBarProps> = ({ module, activeTab = 'home', onTabChange }) => {
  const { navigate } = useNavigation();
  const config = moduleConfigs[module];

  const getColorClasses = (isActive: boolean) => {
    const colors: Record<string, { active: string; inactive: string }> = {
      purple: { active: 'text-purple-400', inactive: 'text-slate-500' },
      red: { active: 'text-red-400', inactive: 'text-slate-500' },
      blue: { active: 'text-blue-400', inactive: 'text-slate-500' },
      pink: { active: 'text-pink-400', inactive: 'text-slate-500' },
      amber: { active: 'text-amber-400', inactive: 'text-slate-500' },
    };
    return isActive ? colors[config.color].active : colors[config.color].inactive;
  };

  const handleTabClick = (tabId: string) => {
    if (tabId === 'cart') {
      navigate('cart');
    } else if (tabId === 'profile') {
      navigate('profile');
    } else if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/50">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center py-2">
          {config.tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex flex-col items-center gap-1 p-2 min-w-[60px] transition-colors ${getColorClasses(isActive)}`}
              >
                <Icon size={22} className={isActive ? 'scale-110' : ''} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

