import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Star, Plus, Minus, ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { SafeArea } from '../components/MobileLayout';
import { useNavigation } from '../context/NavigationContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/UI';
import { Product } from '../types';

// Images simulées pour le produit
const productImages = [
  { id: 1, color: 'from-purple-500/20 to-pink-500/20' },
  { id: 2, color: 'from-blue-500/20 to-cyan-500/20' },
  { id: 3, color: 'from-green-500/20 to-emerald-500/20' },
  { id: 4, color: 'from-orange-500/20 to-yellow-500/20' },
];

export const ProductDetailScreen: React.FC = () => {
  const { navigate, goBack, params } = useNavigation();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const product: Product = params?.product || {
    id: 'p1',
    name: 'Pack Solaire Home 3kW',
    description: 'Kit complet autonomie énergétique pour maison. Inclut panneaux solaires, onduleur, batteries et système de monitoring. Installation professionnelle disponible.',
    price: 450000,
    originalPrice: 520000,
    category: 'tech',
    inStock: true,
    rating: 4.8
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate('checkout');
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  return (
    <SafeArea className="bg-slate-950 relative pt-0">
      <div className="flex-1 overflow-y-auto pb-28 no-scrollbar">
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
            <h1 className="text-xl font-bold text-white">Détails du produit</h1>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800"
          >
            <Share2 size={20} className="text-white" />
          </motion.button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Galerie d'images défilante */}
          <div className="relative">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className={`aspect-square bg-gradient-to-br ${productImages[currentImageIndex].color} rounded-3xl flex items-center justify-center relative overflow-hidden`}
            >
              <ShoppingBag size={120} className="text-slate-400" />

              {/* Indicateur de promotion */}
              {product.originalPrice && (
                <div className="absolute top-4 left-4 bg-pink-500 px-3 py-1 rounded-full">
                  <span className="text-white text-sm font-bold">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                </div>
              )}
            </motion.div>

            {/* Boutons navigation images */}
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 flex items-center justify-center border border-slate-700"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 flex items-center justify-center border border-slate-700"
            >
              <ChevronRight size={20} className="text-white" />
            </button>

            {/* Indicateurs de pagination */}
            <div className="flex justify-center gap-2 mt-4">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex 
                      ? 'w-6 bg-purple-500' 
                      : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>

            {/* Miniatures défilantes */}
            <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
              {productImages.map((img, index) => (
                <button
                  key={img.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br ${img.color} flex items-center justify-center border-2 transition-all ${
                    index === currentImageIndex 
                      ? 'border-purple-500 scale-110' 
                      : 'border-transparent'
                  }`}
                >
                  <ShoppingBag size={24} className="text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 text-sm font-bold">{product.rating}</span>
                  </div>
                  <span className="text-slate-600">•</span>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    product.inStock 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {product.inStock ? '✓ En stock' : '✗ Rupture'}
                  </span>
                </div>
              </div>

              {/* Bouton Enregistrer */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSave}
                className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                  isSaved 
                    ? 'bg-pink-500 border-pink-500' 
                    : 'bg-slate-900 border-slate-700'
                }`}
              >
                <Heart
                  size={24}
                  className={isSaved ? 'text-white fill-white' : 'text-slate-400'}
                />
              </motion.button>
            </div>

            {/* Prix */}
            <div className="flex items-center gap-3 p-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
              <span className="text-purple-400 font-bold text-3xl">
                {product.price.toLocaleString()} FC
              </span>
              {product.originalPrice && (
                <span className="text-slate-500 text-xl line-through">
                  {product.originalPrice.toLocaleString()} FC
                </span>
              )}
            </div>

            {/* Description */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4">
              <h3 className="text-lg font-bold text-white mb-2">Description</h3>
              <p className="text-slate-300 leading-relaxed">{product.description}</p>
            </div>
          </div>

          {/* Quantity Selector */}
          {product.inStock && (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4">
              <h3 className="text-lg font-bold text-white mb-4">Quantité</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 active:scale-95 transition-transform"
                >
                  <Minus size={20} className="text-white" />
                </button>
                <span className="text-3xl font-bold text-white flex-1 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 active:scale-95 transition-transform"
                >
                  <Plus size={20} className="text-white" />
                </button>
              </div>
              <p className="text-slate-500 text-center mt-3 text-sm">
                Total: <span className="text-purple-400 font-bold">{(product.price * quantity).toLocaleString()} FC</span>
              </p>
            </div>
          )}

          {/* Caractéristiques */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4">
            <h3 className="text-lg font-bold text-white mb-3">Caractéristiques</h3>
            <div className="space-y-3">
              {[
                { label: 'Catégorie', value: product.category },
                { label: 'Qualité', value: 'Garantie Premium' },
                { label: 'Livraison', value: 'Express disponible' },
                { label: 'Retour', value: '30 jours satisfait ou remboursé' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-800/50 last:border-0">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="text-white font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Buttons - inside the frame */}
      {product.inStock && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/50 space-y-2">
          {/* Notification ajouté au panier */}
          {addedToCart && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 justify-center p-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl"
            >
              <Check size={14} className="text-emerald-400" />
              <span className="text-emerald-400 text-xs font-medium">Ajouté au panier !</span>
            </motion.div>
          )}

          <div className="flex gap-2">
            {/* Bouton Ajouter au panier */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-slate-800 text-white border border-slate-700"
            >
              <ShoppingCart size={18} />
              Panier
            </motion.button>

            {/* Bouton Acheter maintenant */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBuyNow}
              className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              Acheter
            </motion.button>
          </div>
        </div>
      )}
    </SafeArea>
  );
};

