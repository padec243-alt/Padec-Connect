import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, CreditCard, MapPin, Phone } from 'lucide-react';
import { SafeArea } from '../components/MobileLayout';
import { useNavigation } from '../context/NavigationContext';
import { useCart } from '../context/CartContext';
import { Button, Input } from '../components/UI';

export const CheckoutScreen: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const { items, total, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  });
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');

  const handleSubmit = () => {
    if (step === 'info') {
      setStep('payment');
    } else if (step === 'payment') {
      setStep('success');
      clearCart();
      setTimeout(() => {
        navigate('home');
      }, 3000);
    }
  };

  if (step === 'success') {
    return (
      <SafeArea className="bg-slate-950 relative pt-0">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6"
          >
            <CheckCircle size={48} className="text-emerald-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Commande confirmée !</h2>
          <p className="text-slate-400 text-center mb-8">
            Votre commande a été enregistrée. Vous recevrez un email de confirmation.
          </p>
          <Button onClick={() => navigate('home')}>
            Retour à l'accueil
          </Button>
        </div>
      </SafeArea>
    );
  }

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
            <h1 className="text-xl font-bold text-white">
              {step === 'info' ? 'Informations' : 'Paiement'}
            </h1>
          </div>
        </div>

        {step === 'info' ? (
          <div className="px-6 py-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Input
                icon={Phone}
                placeholder="Nom complet"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                icon={Phone}
                placeholder="Téléphone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <Input
                icon={MapPin}
                placeholder="Adresse"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              <Input
                icon={MapPin}
                placeholder="Ville"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4"
            >
              <h3 className="font-bold text-white mb-3">Récapitulatif</h3>
              <div className="space-y-2 text-sm">
                {items.map(item => (
                  <div key={item.product.id} className="flex justify-between text-slate-300">
                    <span>{item.product.name} x{item.quantity}</span>
                    <span>{(item.product.price * item.quantity).toLocaleString()} FC</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-white">
                  <span>Total</span>
                  <span>{total.toLocaleString()} FC</span>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="px-6 py-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <CreditCard size={32} className="text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Méthode de paiement</h3>
              </div>
              <div className="space-y-3">
                {['Mobile Money', 'Virement Bancaire', 'Espèces à la livraison'].map((method, i) => (
                  <button
                    key={i}
                    className="w-full p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-cyan-500 transition-colors text-left"
                  >
                    <span className="text-white font-medium">{method}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800/50">
          <Button onClick={handleSubmit}>
            {step === 'info' ? 'Continuer' : 'Confirmer le paiement'}
          </Button>
        </div>
      </div>
    </SafeArea>
  );
};

