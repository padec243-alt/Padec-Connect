import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Heart, MapPin, Phone, Clock, Star, Building2, Stethoscope, Syringe, Truck, MessageCircle } from 'lucide-react';
import { SafeArea } from '../components/MobileLayout';
import { useNavigation } from '../context/NavigationContext';
import { ModuleNavBar } from '../components/ModuleNavBar';

interface HealthService {
  id: string;
  name: string;
  type: 'hospital' | 'doctor' | 'nurse' | 'advisor' | 'ambulance';
  specialty?: string;
  address: string;
  distance?: string;
  rating: number;
  available: boolean;
  phone: string;
  openHours: string;
  price?: number;
  description: string;
}

const healthCategories = [
  { id: 'all', name: 'Tous', icon: Heart },
  { id: 'hospital', name: 'Hôpitaux', icon: Building2 },
  { id: 'doctor', name: 'Médecins', icon: Stethoscope },
  { id: 'nurse', name: 'Infirmiers', icon: Syringe },
  { id: 'advisor', name: 'Conseillers', icon: MessageCircle },
  { id: 'ambulance', name: 'Ambulances', icon: Truck },
];

const healthServices: HealthService[] = [
  { id: 'h1', name: 'Hôpital Général de Kinshasa', type: 'hospital', specialty: 'Urgences, Chirurgie', address: 'Avenue de l\'Hôpital, Gombe', distance: '2.5 km', rating: 4.5, available: true, phone: '+243 81 234 5678', openHours: '24h/24', description: 'Centre hospitalier de référence.' },
  { id: 'h2', name: 'Clinique Ngaliema', type: 'hospital', specialty: 'Cardiologie', address: 'Avenue des Cliniques, Ngaliema', distance: '4.2 km', rating: 4.8, available: true, phone: '+243 81 345 6789', openHours: '24h/24', description: 'Clinique spécialisée en cardiologie.' },
  { id: 'd1', name: 'Dr. Jean-Pierre Mbuyi', type: 'doctor', specialty: 'Médecine Générale', address: 'Cabinet Médical Limete', distance: '1.8 km', rating: 4.9, available: true, phone: '+243 82 123 4567', openHours: '8h - 18h', price: 50000, description: '15 ans d\'expérience.' },
  { id: 'd2', name: 'Dr. Marie Kabongo', type: 'doctor', specialty: 'Pédiatrie', address: 'Centre Médical Gombe', distance: '3.1 km', rating: 4.7, available: false, phone: '+243 82 234 5678', openHours: '9h - 17h', price: 75000, description: 'Spécialiste pédiatrique.' },
  { id: 'n1', name: 'Service Infirmier Express', type: 'nurse', specialty: 'Soins à domicile', address: 'Tout Kinshasa', rating: 4.6, available: true, phone: '+243 83 123 4567', openHours: '24h/24', price: 25000, description: 'Injections, pansements à domicile.' },
  { id: 'a1', name: 'Conseil Santé PADEC', type: 'advisor', specialty: 'Orientation médicale', address: 'Service en ligne', rating: 4.9, available: true, phone: '+243 84 123 4567', openHours: '8h - 22h', price: 15000, description: 'Orientation et conseils santé.' },
  { id: 'am1', name: 'Ambulance Urgence Plus', type: 'ambulance', address: 'Intervention Kinshasa', distance: '10 min', rating: 4.7, available: true, phone: '+243 85 999 999', openHours: '24h/24', price: 150000, description: 'Ambulance équipée.' },
];

export const HealthScreen: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<HealthService | null>(null);
  const [activeTab, setActiveTab] = useState('home');

  const filteredServices = healthServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.specialty?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hospital': return Building2;
      case 'doctor': return Stethoscope;
      case 'nurse': return Syringe;
      case 'advisor': return MessageCircle;
      case 'ambulance': return Truck;
      default: return Heart;
    }
  };

  const handleContact = (service: HealthService) => {
    window.location.href = `tel:${service.phone}`;
  };

  const handleReserve = (service: HealthService) => {
    navigate('checkout', { type: 'health', item: service, price: service.price || 0 });
  };

  // Page détails
  if (selectedService) {
    const Icon = getTypeIcon(selectedService.type);

    return (
      <SafeArea className="bg-slate-950 relative pt-0">
        <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
          <div className="p-4 pt-12 flex items-center gap-3 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-800/50">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSelectedService(null)} className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
              <ArrowLeft size={20} className="text-white" />
            </motion.button>
            <h1 className="text-lg font-bold text-white flex-1">Détails</h1>
          </div>

          <div className="px-4 py-4 space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500/20 to-pink-600/10 border border-red-500/30">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <Icon size={28} className="text-red-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-white mb-1">{selectedService.name}</h2>
                  {selectedService.specialty && <p className="text-slate-400 text-sm">{selectedService.specialty}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                      <Star size={10} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-yellow-400 text-xs font-bold">{selectedService.rating}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${selectedService.available ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {selectedService.available ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3">
              <h3 className="text-white font-bold mb-2 text-sm">À propos</h3>
              <p className="text-slate-300 text-sm">{selectedService.description}</p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3 space-y-3">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-blue-400" />
                <div><p className="text-slate-400 text-xs">Adresse</p><p className="text-white text-sm">{selectedService.address}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-green-400" />
                <div><p className="text-slate-400 text-xs">Horaires</p><p className="text-white text-sm">{selectedService.openHours}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-purple-400" />
                <div><p className="text-slate-400 text-xs">Téléphone</p><p className="text-white text-sm">{selectedService.phone}</p></div>
              </div>
              {selectedService.price && (
                <div className="flex items-center gap-3">
                  <Heart size={18} className="text-pink-400" />
                  <div><p className="text-slate-400 text-xs">Tarif</p><p className="text-white font-bold text-sm">{selectedService.price.toLocaleString()} FC</p></div>
                </div>
              )}
            </div>
          </div>

          {/* Boutons d'action - à l'intérieur du frame */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/50">
            <div className="flex gap-2">
              <button onClick={() => handleContact(selectedService)} className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-slate-800 text-white border border-slate-700">
                <Phone size={16} /> Appeler
              </button>
              {selectedService.available && selectedService.price && (
                <button onClick={() => handleReserve(selectedService)} className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white">
                  Réserver
                </button>
              )}
            </div>
          </div>
        </div>
      </SafeArea>
    );
  }

  return (
    <SafeArea className="bg-slate-950 relative pt-0">
      <div className="flex-1 overflow-y-auto pb-16 no-scrollbar">
        {/* Header */}
        <div className="p-4 pt-12 flex items-center gap-3 bg-gradient-to-r from-red-900/50 to-pink-900/30 backdrop-blur-xl sticky top-0 z-30 border-b border-red-500/20">
          <motion.button whileTap={{ scale: 0.9 }} onClick={goBack} className="w-10 h-10 rounded-full bg-slate-900/80 flex items-center justify-center border border-red-500/30">
            <ArrowLeft size={20} className="text-white" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Heart size={22} className="text-red-400" />
              Santé & Médecine
            </h1>
            <p className="text-red-300 text-xs">Trouvez les soins adaptés</p>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 my-3">
          <div className="bg-slate-900/90 rounded-xl p-3 flex items-center gap-3 border border-red-500/20">
            <Search size={18} className="text-red-400" />
            <input type="text" placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent w-full text-white outline-none placeholder:text-slate-500 text-sm" />
          </div>
        </div>

        {/* Urgence */}
        <div className="px-4 mb-3">
          <div className="bg-gradient-to-r from-red-600/30 to-orange-600/30 border border-red-500/30 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
              <Phone size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Urgence ?</p>
              <p className="text-red-200 text-xs">+243 85 999 999</p>
            </div>
          </div>
        </div>

        {/* Catégories */}
        <div className="px-4 mb-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {healthCategories.map(cat => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`flex items-center gap-2 px-3 py-2 rounded-xl whitespace-nowrap ${isSelected ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' : 'bg-slate-900/60 text-slate-400 border border-slate-800'}`}>
                  <Icon size={16} />
                  <span className="text-xs font-medium">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Liste */}
        <div className="px-4 space-y-3 pb-4">
          {filteredServices.map((service, i) => {
            const Icon = getTypeIcon(service.type);
            return (
              <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => setSelectedService(service)} className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3 cursor-pointer hover:border-red-500/50 transition-all">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                    <Icon size={22} className="text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-white text-sm">{service.name}</h3>
                      <div className="flex items-center gap-1 bg-yellow-500/10 px-1.5 py-0.5 rounded-full">
                        <Star size={10} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-400 text-xs">{service.rating}</span>
                      </div>
                    </div>
                    {service.specialty && <p className="text-slate-400 text-xs mb-1">{service.specialty}</p>}
                    <div className="flex justify-between items-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${service.available ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {service.available ? '● Dispo' : '○ Indispo'}
                      </span>
                      {service.price && <span className="text-red-400 font-bold text-xs">{service.price.toLocaleString()} FC</span>}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Barre de navigation Santé */}
      <ModuleNavBar module="health" activeTab={activeTab} onTabChange={setActiveTab} />
    </SafeArea>
  );
};

