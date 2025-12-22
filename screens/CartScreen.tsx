import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { SafeArea } from '../components/MobileLayout';
import { useNavigation } from '../context/NavigationContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/UI';

export const CartScreen: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const { items, removeFromCart, updateQuantity, total, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <SafeArea className="bg-slate-950 relative pt-0">
        <div className="flex-1 overflow-y-auto pb-24 no-scrollbar flex flex-col items-center justify-center">
          <div className="p-6 pt-14 flex items-center gap-4 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-800/50 w-full">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={goBack}
              className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800"
            >
              <ArrowLeft size={20} className="text-white" />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">Panier</h1>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 p-6">
            <ShoppingBag size={64} className="text-slate-600" />
            <h2 className="text-xl font-bold text-white">Votre panier est vide</h2>
            <p className="text-slate-400 text-center">Ajoutez des produits pour commencer</p>
            <Button onClick={() => navigate('market')}>
              Parcourir les produits
            </Button>
          </div>
        </div>
      </SafeArea>
    );
  }

  return (
    <SafeArea className="bg-slate-950 relative pt-0">
      <div className="flex-1 overflow-y-auto pb-32 no-scrollbar">
        <div className="p-6 pt-14 flex items-center gap-4 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-800/50">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800"
          >
            <ArrowLeft size={20} className="text-white" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">Panier</h1>
            <p className="text-slate-400 text-xs">{itemCount} article(s)</p>
          </div>
        </div>

        <div className="px-6 py-6 space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={item.product.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4"
            >
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShoppingBag size={32} className="text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white mb-1">{item.product.name}</h3>
                  <p className="text-purple-400 font-bold mb-3">
                    {item.product.price.toLocaleString()} FC
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-800 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center"
                      >
                        <Minus size={16} className="text-white" />
                      </button>
                      <span className="text-white font-bold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center"
                      >
                        <Plus size={16} className="text-white" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800/50">
        <div className="flex justify-between items-center mb-4">
          <span className="text-slate-400">Total</span>
          <span className="text-2xl font-bold text-white">{total.toLocaleString()} FC</span>
        </div>
        <Button onClick={() => navigate('checkout')}>
          Passer la commande
        </Button>
      </div>
    </SafeArea>
  );
};

