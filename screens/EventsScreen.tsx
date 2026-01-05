import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Calendar, MapPin, Clock, Star, Filter, Ticket, Music, Briefcase, GraduationCap, Heart, PartyPopper, ChevronRight, Check } from 'lucide-react';
import { SafeArea } from '../components/MobileLayout';
import { useNavigation } from '../context/NavigationContext';
import { ModuleNavBar } from '../components/ModuleNavBar';
import { FirestoreService } from '../services/FirestoreService';

interface Event {
  id: string;
  name: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  address: string;
  price: number;
  vipPrice?: number;
  availableTickets: number;
  totalTickets: number;
  organizer: string;
  rating: number;
  featured: boolean;
  image?: string;
  images?: string[];
}

const eventCategories = [
  { id: 'all', name: 'Tous', icon: Calendar },
  { id: 'music', name: 'Musique', icon: Music },
  { id: 'business', name: 'Business', icon: Briefcase },
  { id: 'education', name: 'Formation', icon: GraduationCap },
  { id: 'culture', name: 'Culture', icon: Heart },
  { id: 'party', name: 'Fête', icon: PartyPopper },
];

// Données de démonstration
const demoEvents: Event[] = [
  { id: 'ev1', name: 'Salon PME & PMI Kinshasa-Chine 2025', description: 'Le plus grand salon d\'affaires RDC-Chine.', category: 'business', date: '2025-02-15', time: '09:00', location: 'Pullman Kinshasa', address: 'Avenue Batetela, Gombe', price: 50000, vipPrice: 150000, availableTickets: 450, totalTickets: 500, organizer: 'PADEC Events', rating: 4.9, featured: true },
  { id: 'ev2', name: 'Concert Fally Ipupa Live', description: 'Le Dicap la Merveille en concert exclusif.', category: 'music', date: '2025-01-20', time: '20:00', location: 'Stade des Martyrs', address: 'Avenue de la Libération', price: 25000, vipPrice: 100000, availableTickets: 8500, totalTickets: 10000, organizer: 'Fally Events', rating: 4.8, featured: true },
  { id: 'ev3', name: 'Formation Marketing Digital', description: 'Stratégies marketing avec certification.', category: 'education', date: '2025-01-25', time: '09:00', location: 'PADEC Hub', address: 'Avenue du Commerce', price: 75000, availableTickets: 25, totalTickets: 30, organizer: 'PADEC Academy', rating: 4.7, featured: false },
];

export const EventsScreen: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedTicketType, setSelectedTicketType] = useState<string>('standard');
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('home');
  const [events, setEvents] = useState<Event[]>(demoEvents);
  const [loading, setLoading] = useState(true);

  // Charger les événements depuis Firebase
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const firebaseEvents = await FirestoreService.getCollection<Event>('events');
        if (firebaseEvents.length > 0) {
          setEvents(firebaseEvents);
        }
      } catch (error) {
        console.error('Erreur chargement événements:', error);
      }
      setLoading(false);
    };
    loadEvents();
  }, []);

  const featuredEvents = events.filter(e => e.featured);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const getTicketPrice = (event: Event) => {
    return selectedTicketType === 'vip' && event.vipPrice ? event.vipPrice : event.price;
  };

  const handlePurchase = () => {
    if (!selectedEvent) return;
    const price = getTicketPrice(selectedEvent) * ticketQuantity;
    navigate('checkout', {
      type: 'event',
      item: { event: selectedEvent, ticketType: selectedTicketType, quantity: ticketQuantity },
      price
    });
  };

  // Page détails événement
  if (selectedEvent) {
    const ticketPrice = getTicketPrice(selectedEvent);
    const totalPrice = ticketPrice * ticketQuantity;

    return (
      <SafeArea className="bg-slate-950 relative pt-0">
        <div className="flex-1 overflow-y-auto pb-28 no-scrollbar">
          <div className="p-4 pt-12 flex items-center gap-3 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-800/50">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSelectedEvent(null)} className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
              <ArrowLeft size={20} className="text-white" />
            </motion.button>
            <h1 className="text-lg font-bold text-white flex-1">Détails</h1>
          </div>

          <div className="px-4 py-4 space-y-4">
            {/* Image */}
            <div className="aspect-video bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
              {selectedEvent.image ? (
                <img src={selectedEvent.image} alt={selectedEvent.name} className="w-full h-full object-cover" />
              ) : (
                <Calendar size={60} className="text-pink-400" />
              )}
              {selectedEvent.featured && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-500 px-2 py-1 rounded-full">
                  <span className="text-white text-xs font-bold">⭐ En vedette</span>
                </div>
              )}
            </div>

            {/* Galerie photos */}
            {selectedEvent.images && selectedEvent.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {selectedEvent.images.map((img, i) => (
                  <div key={i} className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Infos */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-xl font-bold text-white flex-1">{selectedEvent.name}</h2>
                <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 text-xs font-bold">{selectedEvent.rating}</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-2">Par {selectedEvent.organizer}</p>
              <p className="text-slate-300 text-sm">{selectedEvent.description}</p>
            </div>

            {/* Détails pratiques */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3">
                <Calendar size={20} className="text-pink-400 mb-1" />
                <p className="text-slate-400 text-xs">Date</p>
                <p className="text-white font-bold text-sm">{formatDate(selectedEvent.date)}</p>
              </div>
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3">
                <Clock size={20} className="text-pink-400 mb-1" />
                <p className="text-slate-400 text-xs">Heure</p>
                <p className="text-white font-bold text-sm">{selectedEvent.time}</p>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3">
              <MapPin size={20} className="text-pink-400 mb-1" />
              <p className="text-slate-400 text-xs">Lieu</p>
              <p className="text-white font-bold text-sm">{selectedEvent.location}</p>
              <p className="text-slate-500 text-xs">{selectedEvent.address}</p>
            </div>

            {/* Disponibilité */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-sm">Places disponibles</span>
                <span className="text-white font-bold text-sm">{selectedEvent.availableTickets} / {selectedEvent.totalTickets}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full" style={{ width: `${(selectedEvent.availableTickets / selectedEvent.totalTickets) * 100}%` }} />
              </div>
            </div>

            {/* Sélection billet */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3">
              <h3 className="text-white font-bold mb-2 text-sm">Type de billet</h3>
              <div className="flex gap-2">
                <button onClick={() => setSelectedTicketType('standard')} className={`flex-1 p-3 rounded-xl border text-center ${selectedTicketType === 'standard' ? 'border-pink-500 bg-pink-500/10' : 'border-slate-700'}`}>
                  <p className="text-white font-bold text-sm">Standard</p>
                  <p className="text-pink-400 font-bold text-sm">{selectedEvent.price.toLocaleString()} FC</p>
                </button>
                {selectedEvent.vipPrice && (
                  <button onClick={() => setSelectedTicketType('vip')} className={`flex-1 p-3 rounded-xl border text-center ${selectedTicketType === 'vip' ? 'border-pink-500 bg-pink-500/10' : 'border-slate-700'}`}>
                    <p className="text-white font-bold text-sm">VIP</p>
                    <p className="text-pink-400 font-bold text-sm">{selectedEvent.vipPrice.toLocaleString()} FC</p>
                  </button>
                )}
              </div>
            </div>

            {/* Quantité */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3">
              <h3 className="text-white font-bold mb-2 text-sm">Nombre de billets</h3>
              <div className="flex items-center justify-center gap-4">
                <button onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-white font-bold">-</button>
                <span className="text-2xl font-bold text-white">{ticketQuantity}</span>
                <button onClick={() => setTicketQuantity(Math.min(10, ticketQuantity + 1))} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-white font-bold">+</button>
              </div>
            </div>
          </div>

          {/* Bouton d'achat - à l'intérieur du frame */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/50">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-slate-400 text-xs">Total</p>
                <p className="text-white font-bold text-lg">{totalPrice.toLocaleString()} FC</p>
              </div>
              <p className="text-slate-500 text-xs">{ticketQuantity} x {selectedTicketType}</p>
            </div>
            <button onClick={handlePurchase} className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              <Ticket size={18} />
              Acheter les billets
            </button>
          </div>
        </div>
      </SafeArea>
    );
  }

  return (
    <SafeArea className="bg-slate-950 relative pt-0">
      <div className="flex-1 overflow-y-auto pb-16 no-scrollbar">
        {/* Header */}
        <div className="p-4 pt-12 flex items-center gap-3 bg-gradient-to-r from-pink-900/50 to-purple-900/30 backdrop-blur-xl sticky top-0 z-30 border-b border-pink-500/20">
          <motion.button whileTap={{ scale: 0.9 }} onClick={goBack} className="w-10 h-10 rounded-full bg-slate-900/80 flex items-center justify-center border border-pink-500/30">
            <ArrowLeft size={20} className="text-white" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar size={22} className="text-pink-400" />
              Événements
            </h1>
            <p className="text-pink-300 text-xs">Billetterie & Réservations</p>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 my-3">
          <div className="bg-slate-900/90 rounded-xl p-3 flex items-center gap-3 border border-pink-500/20">
            <Search size={18} className="text-pink-400" />
            <input type="text" placeholder="Rechercher un événement..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent w-full text-white outline-none placeholder:text-slate-500 text-sm" />
          </div>
        </div>

        {/* En vedette */}
        <div className="mb-4">
          <div className="px-4 mb-2">
            <h2 className="text-white font-bold text-sm">🔥 En vedette</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
            {featuredEvents.map(event => (
              <div key={event.id} onClick={() => setSelectedEvent(event)} className="flex-shrink-0 w-56 bg-gradient-to-br from-pink-600/20 to-purple-600/20 border border-pink-500/30 rounded-xl overflow-hidden cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-pink-500/30 to-purple-500/30 flex items-center justify-center relative">
                  <Calendar size={36} className="text-pink-400" />
                  <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-0.5 rounded-full">
                    <span className="text-white text-xs font-bold">{formatDate(event.date)}</span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-white text-sm mb-1 line-clamp-1">{event.name}</h3>
                  <p className="text-slate-400 text-xs mb-1 flex items-center gap-1"><MapPin size={10} /> {event.location}</p>
                  <span className="text-pink-400 font-bold text-sm">{event.price.toLocaleString()} FC</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Catégories */}
        <div className="px-4 mb-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {eventCategories.map(cat => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`flex items-center gap-2 px-3 py-2 rounded-xl whitespace-nowrap ${isSelected ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-slate-900/60 text-slate-400 border border-slate-800'}`}>
                  <Icon size={16} />
                  <span className="text-xs font-medium">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Liste */}
        <div className="px-4 space-y-3 pb-4">
          <p className="text-slate-400 text-xs">{filteredEvents.length} événements</p>
          {filteredEvents.map((event, i) => (
            <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => setSelectedEvent(event)} className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden cursor-pointer hover:border-pink-500/50 transition-all">
              <div className="flex">
                <div className="w-20 bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex flex-col items-center justify-center p-2">
                  <span className="text-pink-400 text-xl font-bold">{new Date(event.date).getDate()}</span>
                  <span className="text-slate-400 text-xs uppercase">{new Date(event.date).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                </div>
                <div className="flex-1 p-3">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-white text-sm line-clamp-1 flex-1">{event.name}</h3>
                    <div className="flex items-center gap-1 bg-yellow-500/10 px-1.5 py-0.5 rounded-full ml-2">
                      <Star size={10} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-yellow-400 text-xs">{event.rating}</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs mb-2 flex items-center gap-1"><MapPin size={10} /> {event.location} • {event.time}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-pink-400 font-bold text-sm">{event.price.toLocaleString()} FC</span>
                    <ChevronRight size={16} className="text-slate-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Barre de navigation Événements */}
      <ModuleNavBar module="events" activeTab={activeTab} onTabChange={setActiveTab} />
    </SafeArea>
  );
};

