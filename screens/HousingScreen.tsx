import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Building, Home, MapPin, Star, Filter, Bed, Bath, Square, Car, Wifi, Users, Calendar, ChevronRight, Hotel, Key, DollarSign } from 'lucide-react';
import { SafeArea } from '../components/MobileLayout';
import { useNavigation } from '../context/NavigationContext';
import { ModuleNavBar } from '../components/ModuleNavBar';

type HousingSection = 'main' | 'hotels' | 'rentals' | 'sales';

interface Listing {
  id: string;
  title: string;
  type: 'hotel' | 'apartment' | 'house' | 'land';
  category: 'hotel' | 'rental' | 'sale';
  price: number;
  priceUnit: string;
  location: string;
  city: string;
  province: string;
  bedrooms?: number;
  bathrooms?: number;
  surface?: number;
  rating?: number;
  amenities: string[];
  available: boolean;
  featured: boolean;
  description: string;
}

const provinces = ['Toutes', 'Kinshasa', 'Haut-Katanga', 'Nord-Kivu', 'Sud-Kivu', 'Kongo-Central'];
const cities: Record<string, string[]> = {
  'Kinshasa': ['Gombe', 'Ngaliema', 'Limete', 'Kintambo', 'Bandalungwa'],
  'Haut-Katanga': ['Lubumbashi', 'Likasi', 'Kolwezi'],
  'Nord-Kivu': ['Goma', 'Butembo', 'Beni'],
  'Sud-Kivu': ['Bukavu', 'Uvira'],
  'Kongo-Central': ['Matadi', 'Boma', 'Muanda'],
};

const listings: Listing[] = [
  // Hotels
  { id: 'h1', title: 'Pullman Kinshasa Grand Hotel', type: 'hotel', category: 'hotel', price: 250000, priceUnit: '/nuit', location: 'Avenue Batetela, Gombe', city: 'Gombe', province: 'Kinshasa', bedrooms: 1, bathrooms: 1, surface: 45, rating: 4.8, amenities: ['Wifi', 'Piscine', 'Restaurant', 'Gym'], available: true, featured: true, description: 'Hôtel 5 étoiles au cœur de Kinshasa.' },
  { id: 'h2', title: 'Fleuve Congo Hotel', type: 'hotel', category: 'hotel', price: 180000, priceUnit: '/nuit', location: 'Boulevard du 30 Juin', city: 'Gombe', province: 'Kinshasa', bedrooms: 1, bathrooms: 1, surface: 38, rating: 4.6, amenities: ['Wifi', 'Vue Fleuve', 'Restaurant'], available: true, featured: true, description: 'Vue imprenable sur le fleuve Congo.' },
  { id: 'h3', title: 'Lubumbashi Grand Hotel', type: 'hotel', category: 'hotel', price: 150000, priceUnit: '/nuit', location: 'Centre-ville', city: 'Lubumbashi', province: 'Haut-Katanga', bedrooms: 1, bathrooms: 1, surface: 35, rating: 4.5, amenities: ['Wifi', 'Parking', 'Restaurant'], available: true, featured: false, description: 'Meilleur hôtel de Lubumbashi.' },
  // Locations
  { id: 'r1', title: 'Appartement Moderne Gombe', type: 'apartment', category: 'rental', price: 1500000, priceUnit: '/mois', location: 'Avenue du Commerce', city: 'Gombe', province: 'Kinshasa', bedrooms: 3, bathrooms: 2, surface: 120, amenities: ['Parking', 'Sécurité', 'Générateur'], available: true, featured: true, description: 'Appartement haut standing meublé.' },
  { id: 'r2', title: 'Villa avec Jardin Ngaliema', type: 'house', category: 'rental', price: 3500000, priceUnit: '/mois', location: 'Quartier Ma Campagne', city: 'Ngaliema', province: 'Kinshasa', bedrooms: 5, bathrooms: 4, surface: 350, amenities: ['Jardin', 'Piscine', 'Gardien'], available: true, featured: true, description: 'Grande villa familiale avec piscine.' },
  { id: 'r3', title: 'Studio Meublé Limete', type: 'apartment', category: 'rental', price: 450000, priceUnit: '/mois', location: 'Avenue Sendwe', city: 'Limete', province: 'Kinshasa', bedrooms: 1, bathrooms: 1, surface: 35, amenities: ['Meublé', 'Wifi'], available: true, featured: false, description: 'Studio idéal pour célibataire.' },
  // Ventes
  { id: 's1', title: 'Terrain Constructible Kintambo', type: 'land', category: 'sale', price: 150000000, priceUnit: '', location: 'Avenue Kasa-Vubu', city: 'Kintambo', province: 'Kinshasa', surface: 500, amenities: ['Titre Foncier', 'Eau', 'Électricité'], available: true, featured: true, description: 'Terrain prêt à construire avec titre.' },
  { id: 's2', title: 'Maison à Vendre Gombe', type: 'house', category: 'sale', price: 450000000, priceUnit: '', location: 'Avenue des Cliniques', city: 'Gombe', province: 'Kinshasa', bedrooms: 6, bathrooms: 5, surface: 400, amenities: ['Jardin', 'Garage', 'Titre'], available: true, featured: true, description: 'Belle maison avec titre de propriété.' },
  { id: 's3', title: 'Appartement Neuf Lubumbashi', type: 'apartment', category: 'sale', price: 120000000, priceUnit: '', location: 'Quartier Golf', city: 'Lubumbashi', province: 'Haut-Katanga', bedrooms: 3, bathrooms: 2, surface: 110, amenities: ['Neuf', 'Parking', 'Sécurité'], available: true, featured: false, description: 'Appartement neuf dans résidence sécurisée.' },
];

export const HousingScreen: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const [section, setSection] = useState<HousingSection>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('Toutes');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<string>('all');

  const getFilteredListings = (category: 'hotel' | 'rental' | 'sale') => {
    return listings.filter(l => {
      const matchesCategory = l.category === category;
      const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           l.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProvince = selectedProvince === 'Toutes' || l.province === selectedProvince;
      return matchesCategory && matchesSearch && matchesProvince;
    });
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) return `${(price / 1000000).toFixed(0)}M FC`;
    if (price >= 1000) return `${(price / 1000).toFixed(0)}k FC`;
    return `${price.toLocaleString()} FC`;
  };

  const handleReserve = (listing: Listing) => {
    navigate('checkout', {
      type: 'housing',
      item: listing,
      price: listing.price
    });
  };

  // Page détails
  if (selectedListing) {
    return (
      <SafeArea className="bg-slate-950 relative pt-0">
        <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
          <div className="p-4 pt-12 flex items-center gap-3 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-800/50">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSelectedListing(null)} className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
              <ArrowLeft size={20} className="text-white" />
            </motion.button>
            <h1 className="text-lg font-bold text-white flex-1">Détails</h1>
          </div>

          <div className="px-4 py-4 space-y-4">
            {/* Image */}
            <div className="aspect-video bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
              {selectedListing.type === 'hotel' ? <Hotel size={60} className="text-amber-400" /> :
               selectedListing.type === 'land' ? <Square size={60} className="text-amber-400" /> :
               <Home size={60} className="text-amber-400" />}
            </div>

            {/* Infos */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-xl font-bold text-white flex-1">{selectedListing.title}</h2>
                {selectedListing.rating && (
                  <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 text-xs font-bold">{selectedListing.rating}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <MapPin size={14} className="text-amber-400" />
                <span className="text-sm">{selectedListing.location}, {selectedListing.city}</span>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
                <span className="text-amber-400 font-bold text-2xl">{formatPrice(selectedListing.price)}</span>
                <span className="text-slate-400 text-sm">{selectedListing.priceUnit}</span>
              </div>
            </div>

            {/* Caractéristiques */}
            {(selectedListing.bedrooms || selectedListing.bathrooms || selectedListing.surface) && (
              <div className="grid grid-cols-3 gap-3">
                {selectedListing.bedrooms && (
                  <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3 text-center">
                    <Bed size={20} className="text-amber-400 mx-auto mb-1" />
                    <p className="text-white font-bold">{selectedListing.bedrooms}</p>
                    <p className="text-slate-400 text-xs">Chambres</p>
                  </div>
                )}
                {selectedListing.bathrooms && (
                  <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3 text-center">
                    <Bath size={20} className="text-amber-400 mx-auto mb-1" />
                    <p className="text-white font-bold">{selectedListing.bathrooms}</p>
                    <p className="text-slate-400 text-xs">SdB</p>
                  </div>
                )}
                {selectedListing.surface && (
                  <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3 text-center">
                    <Square size={20} className="text-amber-400 mx-auto mb-1" />
                    <p className="text-white font-bold">{selectedListing.surface}</p>
                    <p className="text-slate-400 text-xs">m²</p>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3">
              <h3 className="text-white font-bold mb-2 text-sm">Description</h3>
              <p className="text-slate-300 text-sm">{selectedListing.description}</p>
            </div>

            {/* Équipements */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3">
              <h3 className="text-white font-bold mb-2 text-sm">Équipements</h3>
              <div className="flex flex-wrap gap-2">
                {selectedListing.amenities.map((a, i) => (
                  <span key={i} className="text-xs bg-amber-500/10 text-amber-400 px-2 py-1 rounded-full">{a}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Bouton - à l'intérieur du frame */}
          {selectedListing.available && (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/50">
              <button onClick={() => handleReserve(selectedListing)} className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                {selectedListing.category === 'hotel' ? 'Réserver' : selectedListing.category === 'rental' ? 'Contacter' : 'Demander infos'}
              </button>
            </div>
          )}
        </div>
      </SafeArea>
    );
  }

  // Page section (Hotels, Rentals, Sales)
  if (section !== 'main') {
    const categoryMap: Record<string, 'hotel' | 'rental' | 'sale'> = {
      'hotels': 'hotel',
      'rentals': 'rental',
      'sales': 'sale'
    };
    const sectionListings = getFilteredListings(categoryMap[section]);
    const sectionTitle = section === 'hotels' ? 'Hôtels' : section === 'rentals' ? 'Locations' : 'Ventes';
    const sectionColor = section === 'hotels' ? 'amber' : section === 'rentals' ? 'blue' : 'green';

    return (
      <SafeArea className="bg-slate-950 relative pt-0">
        <div className="flex-1 overflow-y-auto pb-16 no-scrollbar">
          <div className="p-4 pt-12 flex items-center gap-3 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-800/50">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSection('main')} className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
              <ArrowLeft size={20} className="text-white" />
            </motion.button>
            <h1 className="text-lg font-bold text-white flex-1">{sectionTitle}</h1>
            <button onClick={() => setShowFilters(!showFilters)} className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
              <Filter size={18} className="text-amber-400" />
            </button>
          </div>

          {/* Search */}
          <div className="px-4 my-3">
            <div className="bg-slate-900/90 rounded-xl p-3 flex items-center gap-3 border border-amber-500/20">
              <Search size={18} className="text-amber-400" />
              <input type="text" placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent w-full text-white outline-none placeholder:text-slate-500 text-sm" />
            </div>
          </div>

          {/* Filtres */}
          {showFilters && (
            <div className="px-4 mb-3">
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3">
                <p className="text-slate-400 text-xs mb-2">Province</p>
                <div className="flex flex-wrap gap-2">
                  {provinces.map(p => (
                    <button key={p} onClick={() => setSelectedProvince(p)} className={`px-3 py-1 rounded-full text-xs ${selectedProvince === p ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Liste */}
          <div className="px-4 space-y-3 pb-4">
            <p className="text-slate-400 text-xs">{sectionListings.length} résultats</p>
            {sectionListings.map((listing, i) => (
              <motion.div key={listing.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => setSelectedListing(listing)} className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden cursor-pointer hover:border-amber-500/50 transition-all">
                <div className="flex">
                  <div className="w-24 aspect-square bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                    {listing.type === 'hotel' ? <Hotel size={32} className="text-amber-400" /> :
                     listing.type === 'land' ? <Square size={32} className="text-amber-400" /> :
                     <Home size={32} className="text-amber-400" />}
                  </div>
                  <div className="flex-1 p-3">
                    <h3 className="font-bold text-white text-sm line-clamp-1 mb-1">{listing.title}</h3>
                    <p className="text-slate-400 text-xs mb-2 flex items-center gap-1"><MapPin size={10} /> {listing.city}</p>
                    {(listing.bedrooms || listing.surface) && (
                      <div className="flex gap-3 mb-2 text-xs text-slate-500">
                        {listing.bedrooms && <span>{listing.bedrooms} ch.</span>}
                        {listing.surface && <span>{listing.surface} m²</span>}
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-amber-400 font-bold text-sm">{formatPrice(listing.price)}{listing.priceUnit}</span>
                      <ChevronRight size={16} className="text-slate-500" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <ModuleNavBar module="housing" activeTab={activeTab} onTabChange={setActiveTab} />
      </SafeArea>
    );
  }

  // Page principale Hébergement
  return (
    <SafeArea className="bg-slate-950 relative pt-0">
      <div className="flex-1 overflow-y-auto pb-16 no-scrollbar">
        {/* Header */}
        <div className="p-4 pt-12 flex items-center gap-3 bg-gradient-to-r from-amber-900/50 to-orange-900/30 backdrop-blur-xl sticky top-0 z-30 border-b border-amber-500/20">
          <motion.button whileTap={{ scale: 0.9 }} onClick={goBack} className="w-10 h-10 rounded-full bg-slate-900/80 flex items-center justify-center border border-amber-500/30">
            <ArrowLeft size={20} className="text-white" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Building size={22} className="text-amber-400" />
              Hébergement
            </h1>
            <p className="text-amber-300 text-xs">Hotels, Locations & Ventes</p>
          </div>
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Section Hôtels */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setSection('hotels')}
            className="w-full bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-2xl p-6 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                <Hotel size={32} className="text-amber-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1">Hôtels</h2>
                <p className="text-slate-400 text-sm">Réservez votre chambre d'hôtel</p>
                <p className="text-amber-400 text-xs mt-1">Filtres: ville, province, prix...</p>
              </div>
              <ChevronRight size={24} className="text-amber-400" />
            </div>
          </motion.button>

          {/* Section Locations */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setSection('rentals')}
            className="w-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-6 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                <Key size={32} className="text-blue-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1">Locations</h2>
                <p className="text-slate-400 text-sm">Appartements, maisons à louer</p>
                <p className="text-blue-400 text-xs mt-1">Meublé, non-meublé, court/long terme</p>
              </div>
              <ChevronRight size={24} className="text-blue-400" />
            </div>
          </motion.button>

          {/* Section Ventes */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setSection('sales')}
            className="w-full bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-6 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center">
                <DollarSign size={32} className="text-green-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1">Ventes</h2>
                <p className="text-slate-400 text-sm">Maisons, appartements, terrains</p>
                <p className="text-green-400 text-xs mt-1">Avec titre de propriété</p>
              </div>
              <ChevronRight size={24} className="text-green-400" />
            </div>
          </motion.button>

          {/* Annonces en vedette */}
          <div className="mt-6">
            <h3 className="text-white font-bold mb-3">⭐ En vedette</h3>
            <div className="space-y-3">
              {listings.filter(l => l.featured).slice(0, 3).map(listing => (
                <div key={listing.id} onClick={() => setSelectedListing(listing)} className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3 cursor-pointer hover:border-amber-500/50 transition-all flex gap-3">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                    {listing.type === 'hotel' ? <Hotel size={24} className="text-amber-400" /> :
                     listing.type === 'land' ? <Square size={24} className="text-amber-400" /> :
                     <Home size={24} className="text-amber-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-sm line-clamp-1">{listing.title}</h4>
                    <p className="text-slate-400 text-xs">{listing.city}</p>
                    <p className="text-amber-400 font-bold text-sm">{formatPrice(listing.price)}{listing.priceUnit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ModuleNavBar module="housing" activeTab={activeTab} onTabChange={setActiveTab} />
    </SafeArea>
  );
};

