import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, MapPin, Clock, Users, Wifi, Coffee, Monitor, Star, Check, Calendar, Building2, DoorOpen, Presentation } from 'lucide-react';
import { SafeArea } from '../components/MobileLayout';
import { useNavigation } from '../context/NavigationContext';
import { ModuleNavBar } from '../components/ModuleNavBar';
import { Button } from '../components/UI';

interface WorkSpace {
  id: string;
  name: string;
  type: 'coworking' | 'private-office' | 'meeting-room';
  description: string;
  address: string;
  pricePerHour?: number;
  pricePerDay: number;
  pricePerMonth?: number;
  capacity: number;
  rating: number;
  amenities: string[];
  available: boolean;
  openHours: string;
}

const spaceTypes = [
  { id: 'all', name: 'Tous', icon: Building2 },
  { id: 'coworking', name: 'Co-working', icon: Users },
  { id: 'private-office', name: 'Bureau Privé', icon: DoorOpen },
  { id: 'meeting-room', name: 'Salle de Réunion', icon: Presentation },
];

const workspaces: WorkSpace[] = [
  {
    id: 'ws1',
    name: 'PADEC Hub Central',
    type: 'coworking',
    description: 'Espace de coworking moderne au cœur de Kinshasa avec vue panoramique.',
    address: 'Avenue du Commerce, Gombe, Kinshasa',
    pricePerDay: 25000,
    pricePerMonth: 450000,
    capacity: 50,
    rating: 4.9,
    amenities: ['Wifi Haut Débit', 'Café Gratuit', 'Imprimante', 'Climatisation'],
    available: true,
    openHours: '7h - 22h'
  },
  {
    id: 'ws2',
    name: 'Bureau Privé Executive',
    type: 'private-office',
    description: 'Bureau privé équipé pour 2-4 personnes avec services de secrétariat.',
    address: 'Boulevard du 30 Juin, Gombe',
    pricePerDay: 75000,
    pricePerMonth: 1200000,
    capacity: 4,
    rating: 4.8,
    amenities: ['Bureau Meublé', 'Ligne Téléphonique', 'Secrétariat', 'Parking'],
    available: true,
    openHours: '8h - 20h'
  },
  {
    id: 'ws3',
    name: 'Salle Innovation',
    type: 'meeting-room',
    description: 'Salle de réunion high-tech avec écran 75" et système de visioconférence.',
    address: 'Avenue Batetela, Gombe',
    pricePerHour: 50000,
    pricePerDay: 300000,
    capacity: 20,
    rating: 4.7,
    amenities: ['Écran 75"', 'Visioconférence', 'Tableau Blanc', 'Café'],
    available: true,
    openHours: '8h - 21h'
  },
  {
    id: 'ws4',
    name: 'Startup Garage',
    type: 'coworking',
    description: 'Espace créatif pour startups avec événements networking réguliers.',
    address: 'Avenue Kasa-Vubu, Kintambo',
    pricePerDay: 15000,
    pricePerMonth: 250000,
    capacity: 40,
    rating: 4.6,
    amenities: ['Wifi', 'Événements', 'Mentorat', 'Cuisine'],
    available: true,
    openHours: '8h - 22h'
  },
  {
    id: 'ws5',
    name: 'Bureau Solo',
    type: 'private-office',
    description: 'Petit bureau privé idéal pour freelance ou consultant.',
    address: 'Avenue Tombalbaye, Gombe',
    pricePerDay: 35000,
    pricePerMonth: 500000,
    capacity: 1,
    rating: 4.5,
    amenities: ['Bureau', 'Wifi', 'Climatisation', 'Accès 24/7'],
    available: false,
    openHours: '24h/24'
  },
  {
    id: 'ws6',
    name: 'Boardroom Premium',
    type: 'meeting-room',
    description: 'Salle de conseil d\'administration luxueuse pour réunions importantes.',
    address: 'Pullman Kinshasa, Gombe',
    pricePerHour: 100000,
    pricePerDay: 500000,
    capacity: 12,
    rating: 4.9,
    amenities: ['Table de Conférence', 'Écrans Multiples', 'Service Traiteur', 'Parking VIP'],
    available: true,
    openHours: '7h - 23h'
  },
];

export const CoworkingScreen: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSpace, setSelectedSpace] = useState<WorkSpace | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'hour' | 'day' | 'month'>('day');
  const [activeTab, setActiveTab] = useState('home');

  const filteredSpaces = workspaces.filter(space => {
    const matchesSearch = space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         space.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || space.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'coworking': return Users;
      case 'private-office': return DoorOpen;
      case 'meeting-room': return Presentation;
      default: return Building2;
    }
  };

  const getPrice = (space: WorkSpace) => {
    if (selectedPlan === 'hour' && space.pricePerHour) return space.pricePerHour;
    if (selectedPlan === 'month' && space.pricePerMonth) return space.pricePerMonth;
    return space.pricePerDay;
  };

  const handleReserve = (space: WorkSpace) => {
    navigate('checkout', {
      type: 'workspace',
      item: space,
      plan: selectedPlan,
      price: getPrice(space)
    });
  };

  // Page détails
  if (selectedSpace) {
    const Icon = getTypeIcon(selectedSpace.type);

    return (
      <SafeArea className="bg-slate-950 relative pt-0">
        <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
          <div className="p-4 pt-12 flex items-center gap-3 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-800/50">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedSpace(null)}
              className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800"
            >
              <ArrowLeft size={20} className="text-white" />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-white">Détails de l'espace</h1>
            </div>
          </div>

          <div className="px-4 py-4 space-y-4">
            {/* Image */}
            <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center">
              <Icon size={60} className="text-blue-400" />
            </div>

            {/* Infos */}
            <div>
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold text-white">{selectedSpace.name}</h2>
                <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 text-xs font-bold">{selectedSpace.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400 mb-3">
                <MapPin size={14} className="text-blue-400" />
                <span className="text-sm">{selectedSpace.address}</span>
              </div>
              <p className="text-slate-300 text-sm">{selectedSpace.description}</p>
            </div>

            {/* Disponibilité */}
            <div className={`p-3 rounded-xl border ${selectedSpace.available ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <span className={`text-sm font-bold ${selectedSpace.available ? 'text-emerald-400' : 'text-red-400'}`}>
                {selectedSpace.available ? '● Disponible' : '○ Complet'}
              </span>
            </div>

            {/* Infos pratiques */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3">
                <Clock size={20} className="text-blue-400 mb-1" />
                <p className="text-slate-400 text-xs">Horaires</p>
                <p className="text-white font-bold text-sm">{selectedSpace.openHours}</p>
              </div>
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3">
                <Users size={20} className="text-blue-400 mb-1" />
                <p className="text-slate-400 text-xs">Capacité</p>
                <p className="text-white font-bold text-sm">{selectedSpace.capacity} pers.</p>
              </div>
            </div>

            {/* Équipements */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3">
              <h3 className="text-white font-bold mb-2 text-sm">Équipements</h3>
              <div className="flex flex-wrap gap-2">
                {selectedSpace.amenities.map((a, i) => (
                  <span key={i} className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full">{a}</span>
                ))}
              </div>
            </div>

            {/* Forfaits */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3">
              <h3 className="text-white font-bold mb-2 text-sm">Choisir un forfait</h3>
              <div className="flex gap-2">
                {selectedSpace.pricePerHour && (
                  <button
                    onClick={() => setSelectedPlan('hour')}
                    className={`flex-1 p-2 rounded-xl border text-center ${selectedPlan === 'hour' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700'}`}
                  >
                    <p className="text-slate-400 text-xs">Heure</p>
                    <p className="text-white font-bold text-sm">{selectedSpace.pricePerHour.toLocaleString()} FC</p>
                  </button>
                )}
                <button
                  onClick={() => setSelectedPlan('day')}
                  className={`flex-1 p-2 rounded-xl border text-center ${selectedPlan === 'day' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700'}`}
                >
                  <p className="text-slate-400 text-xs">Jour</p>
                  <p className="text-white font-bold text-sm">{selectedSpace.pricePerDay.toLocaleString()} FC</p>
                </button>
                {selectedSpace.pricePerMonth && (
                  <button
                    onClick={() => setSelectedPlan('month')}
                    className={`flex-1 p-2 rounded-xl border text-center ${selectedPlan === 'month' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700'}`}
                  >
                    <p className="text-slate-400 text-xs">Mois</p>
                    <p className="text-white font-bold text-sm">{(selectedSpace.pricePerMonth / 1000).toFixed(0)}k FC</p>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bouton Réserver - à l'intérieur du frame */}
          {selectedSpace.available && (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/50">
              <button
                onClick={() => handleReserve(selectedSpace)}
                className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
              >
                <Calendar size={18} />
                Réserver maintenant
              </button>
            </div>
          )}
        </div>
      </SafeArea>
    );
  }

  return (
    <SafeArea className="bg-slate-950 relative pt-0">
      <div className="flex-1 overflow-y-auto pb-16 no-scrollbar">
        {/* Header */}
        <div className="p-4 pt-12 flex items-center gap-3 bg-gradient-to-r from-blue-900/50 to-cyan-900/30 backdrop-blur-xl sticky top-0 z-30 border-b border-blue-500/20">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-slate-900/80 flex items-center justify-center border border-blue-500/30"
          >
            <ArrowLeft size={20} className="text-white" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Building2 size={22} className="text-blue-400" />
              Espace de Travail
            </h1>
            <p className="text-blue-300 text-xs">Co-working, Bureaux & Salles</p>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 my-3">
          <div className="bg-slate-900/90 backdrop-blur-md rounded-xl p-3 flex items-center gap-3 border border-blue-500/20">
            <Search size={18} className="text-blue-400" />
            <input
              type="text"
              placeholder="Rechercher un espace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent w-full text-white outline-none placeholder:text-slate-500 text-sm"
            />
          </div>
        </div>

        {/* Types d'espaces */}
        <div className="px-4 mb-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {spaceTypes.map(type => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      : 'bg-slate-900/60 text-slate-400 border border-slate-800'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-xs font-medium">{type.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Liste des espaces */}
        <div className="px-4 space-y-3 pb-4">
          {filteredSpaces.map((space, i) => {
            const Icon = getTypeIcon(space.type);
            return (
              <motion.div
                key={space.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedSpace(space)}
                className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all"
              >
                <div className="flex">
                  <div className="w-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                    <Icon size={32} className="text-blue-400" />
                  </div>
                  <div className="flex-1 p-3">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-white text-sm">{space.name}</h3>
                      <div className="flex items-center gap-1 bg-yellow-500/10 px-1.5 py-0.5 rounded-full">
                        <Star size={10} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-400 text-xs">{space.rating}</span>
                      </div>
                    </div>
                    <p className="text-slate-400 text-xs mb-2 flex items-center gap-1">
                      <MapPin size={10} /> {space.address}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-400 font-bold text-sm">{space.pricePerDay.toLocaleString()} FC/jour</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        space.available ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {space.available ? 'Dispo' : 'Complet'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Barre de navigation */}
      <ModuleNavBar module="coworking" activeTab={activeTab} onTabChange={setActiveTab} />
    </SafeArea>
  );
};

