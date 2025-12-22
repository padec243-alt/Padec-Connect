import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, ShoppingBag, Filter, Star, Heart, Shirt, Footprints, Sparkles, Scissors, Leaf, Cpu, Home, Palette, Watch, Gift } from 'lucide-react';
import { SafeArea } from '../components/MobileLayout';
import { useNavigation } from '../context/NavigationContext';
import { useCart } from '../context/CartContext';
import { ModuleNavBar } from '../components/ModuleNavBar';
import { Product } from '../types';

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}

const categories: Category[] = [
  { id: 'all', name: 'Tous', icon: ShoppingBag, color: 'purple' },
  { id: 'mode', name: 'Mode', icon: Shirt, color: 'pink' },
  { id: 'vetements', name: 'Vêtements', icon: Shirt, color: 'blue' },
  { id: 'chaussures', name: 'Chaussures', icon: Footprints, color: 'orange' },
  { id: 'parfums', name: 'Parfums', icon: Sparkles, color: 'purple' },
  { id: 'esthetique', name: 'Esthétique', icon: Palette, color: 'pink' },
  { id: 'bricolage', name: 'Bricolage', icon: Scissors, color: 'yellow' },
  { id: 'agriculture', name: 'Agriculture', icon: Leaf, color: 'green' },
  { id: 'tech', name: 'Tech', icon: Cpu, color: 'cyan' },
  { id: 'maison', name: 'Maison', icon: Home, color: 'amber' },
  { id: 'montres', name: 'Montres', icon: Watch, color: 'slate' },
  { id: 'cadeaux', name: 'Cadeaux', icon: Gift, color: 'red' },
];

const products: Product[] = [
  { id: 'p1', name: 'Costume Homme Élégant', description: 'Costume 3 pièces haute couture', price: 250000, originalPrice: 320000, category: 'vetements', inStock: true, rating: 4.8 },
  { id: 'p2', name: 'Robe de Soirée', description: 'Robe élégante pour occasions spéciales', price: 180000, category: 'mode', inStock: true, rating: 4.9 },
  { id: 'p3', name: 'Ensemble Wax Africain', description: 'Tenue traditionnelle moderne', price: 95000, category: 'vetements', inStock: true, rating: 4.7 },
  { id: 'p4', name: 'Chaussures Cuir Italien', description: 'Chaussures de luxe en cuir véritable', price: 150000, originalPrice: 200000, category: 'chaussures', inStock: true, rating: 4.8 },
  { id: 'p5', name: 'Sneakers Premium', description: 'Baskets tendance haute qualité', price: 85000, category: 'chaussures', inStock: true, rating: 4.6 },
  { id: 'p6', name: 'Escarpins Femme', description: 'Talons hauts élégants', price: 75000, category: 'chaussures', inStock: false, rating: 4.5 },
  { id: 'p7', name: 'Parfum Homme Luxe', description: 'Eau de parfum 100ml - Notes boisées', price: 120000, category: 'parfums', inStock: true, rating: 4.9 },
  { id: 'p8', name: 'Parfum Femme Élégance', description: 'Fragrance florale 50ml', price: 95000, category: 'parfums', inStock: true, rating: 4.8 },
  { id: 'p9', name: 'Kit Soins Visage', description: 'Ensemble complet de soins beauté', price: 65000, category: 'esthetique', inStock: true, rating: 4.7 },
  { id: 'p10', name: 'Coffret Maquillage Pro', description: 'Palette professionnelle complète', price: 85000, category: 'esthetique', inStock: true, rating: 4.6 },
  { id: 'p11', name: 'Perceuse Sans Fil', description: 'Perceuse professionnelle 18V', price: 120000, category: 'bricolage', inStock: true, rating: 4.8 },
  { id: 'p12', name: 'Boîte à Outils Complète', description: '150 pièces professionnelles', price: 180000, category: 'bricolage', inStock: true, rating: 4.9 },
  { id: 'p13', name: 'Semences Bio Premium', description: 'Pack de semences variées', price: 25000, category: 'agriculture', inStock: true, rating: 4.5 },
  { id: 'p14', name: 'Système Irrigation Goutte', description: 'Kit irrigation automatique', price: 350000, category: 'agriculture', inStock: true, rating: 4.7 },
  { id: 'p15', name: 'Smartphone Dernière Génération', description: '256GB, Double SIM, 5G', price: 850000, originalPrice: 950000, category: 'tech', inStock: true, rating: 4.9 },
  { id: 'p16', name: 'Pack Solaire Home 3kW', description: 'Kit complet autonomie énergétique', price: 450000, originalPrice: 520000, category: 'tech', inStock: true, rating: 4.8 },
  { id: 'p17', name: 'Ordinateur Portable Pro', description: 'PC haute performance 16GB RAM', price: 750000, category: 'tech', inStock: true, rating: 4.7 },
  { id: 'p18', name: 'Écouteurs Bluetooth', description: 'Son premium, réduction de bruit', price: 95000, category: 'tech', inStock: true, rating: 4.6 },
  { id: 'p19', name: 'Canapé 3 Places', description: 'Canapé moderne en cuir synthétique', price: 450000, category: 'maison', inStock: true, rating: 4.8 },
  { id: 'p20', name: 'Lit King Size', description: 'Lit avec matelas orthopédique', price: 650000, category: 'maison', inStock: true, rating: 4.9 },
  { id: 'p21', name: 'Montre Automatique Luxe', description: 'Mouvement suisse, bracelet cuir', price: 380000, category: 'montres', inStock: true, rating: 4.9 },
  { id: 'p22', name: 'Smartwatch Sport', description: 'Montre connectée étanche', price: 125000, category: 'montres', inStock: true, rating: 4.7 },
  { id: 'p23', name: 'Coffret Cadeau Premium', description: 'Assortiment luxe pour toutes occasions', price: 150000, category: 'cadeaux', inStock: true, rating: 4.8 },
  { id: 'p24', name: 'Panier Gourmand', description: 'Sélection de produits fins', price: 75000, category: 'cadeaux', inStock: true, rating: 4.6 },
];

const sponsoredProducts = products.filter(p => p.originalPrice || (p.rating && p.rating >= 4.8)).slice(0, 8);

export const MarketScreen: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const { itemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('home');
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition(prev => prev + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeArea className="bg-slate-950 relative pt-0">
      <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
        {/* Header PADEC Market */}
        <div className="p-4 pt-12 flex items-center gap-3 bg-gradient-to-r from-purple-900/50 to-pink-900/30 backdrop-blur-xl sticky top-0 z-30 border-b border-purple-500/20">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-slate-900/80 flex items-center justify-center border border-purple-500/30"
          >
            <ArrowLeft size={20} className="text-white" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <ShoppingBag size={22} className="text-purple-400" />
              PADEC Market
            </h1>
            <p className="text-purple-300 text-xs">Votre marketplace préférée</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('cart')}
            className="relative w-10 h-10 rounded-full bg-slate-900/80 flex items-center justify-center border border-purple-500/30"
          >
            <ShoppingBag size={20} className="text-white" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </motion.button>
        </div>

        {/* Search Bar */}
        <div className="px-4 my-3">
          <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3 border border-purple-500/20">
            <Search size={18} className="text-purple-400" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent w-full text-white outline-none placeholder:text-slate-500 text-sm"
            />
            <Filter size={18} className="text-purple-400" />
          </div>
        </div>

        {/* Bannière Publicitaire Défilante */}
        <div className="mb-4 overflow-hidden">
          <motion.div
            className="flex gap-3 px-4"
            animate={{ x: -scrollPosition % (sponsoredProducts.length * 160) }}
            transition={{ duration: 0, ease: "linear" }}
          >
            {[...sponsoredProducts, ...sponsoredProducts].map((product, i) => (
              <div
                key={`${product.id}-${i}`}
                onClick={() => navigate('product-detail', { product })}
                className="flex-shrink-0 w-36 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-2 cursor-pointer"
              >
                <div className="aspect-square bg-slate-800/50 rounded-lg flex items-center justify-center mb-2">
                  <ShoppingBag size={28} className="text-purple-400" />
                </div>
                <p className="text-white text-xs font-bold truncate">{product.name}</p>
                <p className="text-purple-400 text-xs font-bold">{product.price.toLocaleString()} FC</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Categories */}
        <div className="px-4 mb-3">
          <h3 className="text-white font-bold mb-2 text-sm">Catégories</h3>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl min-w-[65px] transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                      : 'bg-slate-900/60 text-slate-400 border border-slate-800'
                  }`}
                >
                  <Icon size={20} className={isSelected ? 'text-white' : 'text-slate-400'} />
                  <span className="text-[10px] font-medium whitespace-nowrap">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Résultats */}
        <div className="px-4 mb-3">
          <p className="text-slate-400 text-xs">{filteredProducts.length} produits trouvés</p>
        </div>

        {/* Products Grid */}
        <div className="px-4 grid grid-cols-2 gap-3 pb-4">
          {filteredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => navigate('product-detail', { product })}
              className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden cursor-pointer hover:border-purple-500/50 transition-all group"
            >
              <div className="aspect-square bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative">
                <ShoppingBag size={40} className="text-slate-600 group-hover:text-purple-400 transition-colors" />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">Rupture</span>
                  </div>
                )}
                {product.originalPrice && (
                  <div className="absolute top-1 left-1 bg-pink-500 px-1.5 py-0.5 rounded-full">
                    <span className="text-white text-[10px] font-bold">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  </div>
                )}
                <button className="absolute top-1 right-1 w-6 h-6 rounded-full bg-slate-900/80 flex items-center justify-center border border-slate-700">
                  <Heart size={12} className="text-pink-400" />
                </button>
              </div>
              <div className="p-2">
                <h3 className="font-bold text-white text-xs mb-1 line-clamp-1">{product.name}</h3>
                <div className="flex items-center gap-1 mb-1">
                  <Star size={10} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-slate-400 text-[10px]">{product.rating}</span>
                </div>
                <span className="text-purple-400 font-bold text-xs">
                  {product.price.toLocaleString()} FC
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bannière Promo */}
        <div className="px-4 pb-4">
          <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/30 rounded-xl p-3">
            <h3 className="text-white font-bold text-sm mb-1">🔥 Offres Spéciales</h3>
            <p className="text-purple-200 text-xs mb-2">Jusqu'à -30% sur une sélection !</p>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1.5 rounded-full text-white text-xs font-bold">
              Voir les offres
            </button>
          </div>
        </div>
      </div>

      {/* Barre de navigation Market */}
      <ModuleNavBar module="market" activeTab={activeTab} onTabChange={setActiveTab} />
    </SafeArea>
  );
};

