import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Heart, Home, GraduationCap, ShoppingBag, Stethoscope, Phone, Mail, MapPin, User, CreditCard, Check } from 'lucide-react';
import { SafeArea } from '../components/MobileLayout';
import { useNavigation } from '../context/NavigationContext';
import { Button } from '../components/UI';

interface ServiceType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  basePrice: number;
}

const serviceTypes: ServiceType[] = [
  { id: 'financial', name: 'Aide Financière', description: 'Envoi d\'argent et gestion des fonds pour votre famille', icon: CreditCard, basePrice: 25000 },
  { id: 'medical', name: 'Assistance Médicale', description: 'Prise en charge des soins de santé de vos proches', icon: Stethoscope, basePrice: 50000 },
  { id: 'education', name: 'Frais Scolaires', description: 'Paiement des frais de scolarité et fournitures', icon: GraduationCap, basePrice: 35000 },
  { id: 'housing', name: 'Logement', description: 'Paiement de loyer et charges du domicile familial', icon: Home, basePrice: 30000 },
  { id: 'food', name: 'Provisions & Courses', description: 'Achat et livraison de provisions alimentaires', icon: ShoppingBag, basePrice: 20000 },
  { id: 'emergency', name: 'Urgence Familiale', description: 'Intervention rapide en cas de situation urgente', icon: Heart, basePrice: 75000 },
];

interface FormData {
  // Informations du demandeur
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderCountry: string;

  // Informations du bénéficiaire
  beneficiaryName: string;
  beneficiaryRelation: string;
  beneficiaryPhone: string;
  beneficiaryAddress: string;
  beneficiaryCity: string;

  // Service demandé
  serviceType: string;
  amount: string;
  frequency: string;
  details: string;
}

export const FamilyHelpScreen: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [formData, setFormData] = useState<FormData>({
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    senderCountry: '',
    beneficiaryName: '',
    beneficiaryRelation: '',
    beneficiaryPhone: '',
    beneficiaryAddress: '',
    beneficiaryCity: '',
    serviceType: '',
    amount: '',
    frequency: 'once',
    details: '',
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service);
    updateField('serviceType', service.id);
    setStep(2);
  };

  const handleSubmit = () => {
    const totalPrice = selectedService ? selectedService.basePrice + parseInt(formData.amount || '0') : 0;
    navigate('checkout', {
      type: 'family-help',
      item: {
        service: selectedService?.name,
        ...formData
      },
      price: totalPrice
    });
  };

  const InputField = ({
    icon: Icon,
    label,
    field,
    type = 'text',
    placeholder
  }: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    field: keyof FormData;
    type?: string;
    placeholder?: string;
  }) => (
    <div className="mb-4">
      <label className="block text-slate-400 text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Icon size={20} className="text-slate-500" />
        </div>
        <input
          type={type}
          value={formData[field]}
          onChange={(e) => updateField(field, e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-orange-500 transition-colors placeholder:text-slate-600"
        />
      </div>
    </div>
  );

  // Étape 1: Sélection du service
  if (step === 1) {
    return (
      <SafeArea className="bg-slate-950 relative pt-0">
        <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
          {/* Header */}
          <div className="p-6 pt-14 flex items-center gap-4 bg-gradient-to-r from-orange-900/50 to-amber-900/30 backdrop-blur-xl sticky top-0 z-30 border-b border-orange-500/20">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={goBack}
              className="w-10 h-10 rounded-full bg-slate-900/80 flex items-center justify-center border border-orange-500/30"
            >
              <ArrowLeft size={20} className="text-white" />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Users size={24} className="text-orange-400" />
                Aide à la Famille
              </h1>
              <p className="text-orange-300 text-xs">Soutenez vos proches en RDC</p>
            </div>
          </div>

          {/* Introduction */}
          <div className="px-6 py-4">
            <div className="bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 rounded-2xl p-4 mb-6">
              <h3 className="text-white font-bold mb-2">💝 Comment ça marche ?</h3>
              <p className="text-orange-200 text-sm">
                Choisissez le type d'aide, fournissez les informations de votre famille, et nous nous occupons du reste.
                Suivi en temps réel et confirmation de livraison.
              </p>
            </div>
          </div>

          {/* Services disponibles */}
          <div className="px-6 pb-6">
            <h2 className="text-lg font-bold text-white mb-4">Choisissez un type d'aide</h2>

            <div className="space-y-4">
              {serviceTypes.map((service, i) => {
                const Icon = service.icon;
                return (
                  <motion.button
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => handleServiceSelect(service)}
                    className="w-full bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 cursor-pointer hover:border-orange-500/50 transition-all text-left"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                        <Icon size={28} className="text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white mb-1">{service.name}</h3>
                        <p className="text-slate-400 text-sm">{service.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-orange-400 font-bold text-sm">À partir de</p>
                        <p className="text-white font-bold">{service.basePrice.toLocaleString()} FC</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </SafeArea>
    );
  }

  // Étapes 2-4: Formulaire
  return (
    <SafeArea className="bg-slate-950 relative pt-0">
        <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
        {/* Header */}
        <div className="p-6 pt-14 flex items-center gap-4 bg-gradient-to-r from-orange-900/50 to-amber-900/30 backdrop-blur-xl sticky top-0 z-30 border-b border-orange-500/20">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => step > 2 ? setStep(step - 1) : setStep(1)}
            className="w-10 h-10 rounded-full bg-slate-900/80 flex items-center justify-center border border-orange-500/30"
          >
            <ArrowLeft size={20} className="text-white" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">{selectedService?.name}</h1>
            <p className="text-orange-300 text-xs">Étape {step - 1} sur 3</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4">
          <div className="w-full bg-slate-800 rounded-full h-2">
            <motion.div
              animate={{ width: `${((step - 1) / 3) * 100}%` }}
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full"
            />
          </div>
        </div>

        <div className="px-6">
          {/* Step 2: Informations du demandeur */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 mb-4">
                <h2 className="text-lg font-bold text-white mb-4">Vos informations</h2>

                <InputField icon={User} label="Votre nom complet" field="senderName" placeholder="Nom et prénom" />
                <InputField icon={Mail} label="Email" field="senderEmail" type="email" placeholder="votre@email.com" />
                <InputField icon={Phone} label="Téléphone" field="senderPhone" type="tel" placeholder="+33 6 XX XX XX XX" />
                <InputField icon={MapPin} label="Pays de résidence" field="senderCountry" placeholder="France, Belgique, etc." />
              </div>
            </motion.div>
          )}

          {/* Step 3: Informations du bénéficiaire */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 mb-4">
                <h2 className="text-lg font-bold text-white mb-4">Informations du bénéficiaire</h2>

                <InputField icon={User} label="Nom du bénéficiaire" field="beneficiaryName" placeholder="Nom complet" />

                <div className="mb-4">
                  <label className="block text-slate-400 text-sm font-medium mb-2">Lien de parenté</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Parent', 'Enfant', 'Conjoint', 'Frère/Sœur', 'Oncle/Tante', 'Autre'].map(relation => (
                      <button
                        key={relation}
                        onClick={() => updateField('beneficiaryRelation', relation)}
                        className={`p-3 rounded-xl text-sm transition-all ${
                          formData.beneficiaryRelation === relation
                            ? 'bg-orange-500 text-white'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {relation}
                      </button>
                    ))}
                  </div>
                </div>

                <InputField icon={Phone} label="Téléphone du bénéficiaire" field="beneficiaryPhone" type="tel" placeholder="+243 XXX XXX XXX" />
                <InputField icon={MapPin} label="Adresse complète" field="beneficiaryAddress" placeholder="Quartier, avenue, numéro" />
                <InputField icon={MapPin} label="Ville" field="beneficiaryCity" placeholder="Kinshasa, Lubumbashi, etc." />
              </div>
            </motion.div>
          )}

          {/* Step 4: Détails de l'aide */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 mb-4">
                <h2 className="text-lg font-bold text-white mb-4">Détails de l'aide</h2>

                <div className="mb-4">
                  <label className="block text-slate-400 text-sm font-medium mb-2">Montant à envoyer (FC)</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <CreditCard size={20} className="text-slate-500" />
                    </div>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => updateField('amount', e.target.value)}
                      placeholder="Ex: 100000"
                      className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-orange-500 transition-colors placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-slate-400 text-sm font-medium mb-2">Fréquence</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'once', label: 'Une fois' },
                      { id: 'monthly', label: 'Mensuel' },
                      { id: 'weekly', label: 'Hebdo' },
                    ].map(freq => (
                      <button
                        key={freq.id}
                        onClick={() => updateField('frequency', freq.id)}
                        className={`p-3 rounded-xl text-sm transition-all ${
                          formData.frequency === freq.id
                            ? 'bg-orange-500 text-white'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {freq.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-slate-400 text-sm font-medium mb-2">Instructions particulières</label>
                  <textarea
                    value={formData.details}
                    onChange={(e) => updateField('details', e.target.value)}
                    placeholder="Ex: Acheter des médicaments spécifiques, payer le loyer au propriétaire M. X..."
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl py-4 px-4 text-white outline-none focus:border-orange-500 transition-colors placeholder:text-slate-600 min-h-[120px]"
                  />
                </div>
              </div>

              {/* Récapitulatif */}
              <div className="bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 rounded-2xl p-4">
                <h3 className="text-white font-bold mb-3">Récapitulatif</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Service</span>
                    <span className="text-white">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bénéficiaire</span>
                    <span className="text-white">{formData.beneficiaryName || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ville</span>
                    <span className="text-white">{formData.beneficiaryCity || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Frais de service</span>
                    <span className="text-white">{selectedService?.basePrice.toLocaleString()} FC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Montant à envoyer</span>
                    <span className="text-white">{parseInt(formData.amount || '0').toLocaleString()} FC</span>
                  </div>
                  <div className="border-t border-orange-500/30 pt-2 mt-2 flex justify-between">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-orange-400 font-bold text-lg">
                      {((selectedService?.basePrice || 0) + parseInt(formData.amount || '0')).toLocaleString()} FC
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bouton suivant - à l'intérieur du frame */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/50">
        {step < 4 ? (
          <button onClick={() => setStep(step + 1)} className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-orange-500 to-amber-500 text-white">
            Continuer
          </button>
        ) : (
          <button onClick={handleSubmit} className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
            <Heart size={18} />
            Confirmer et payer
          </button>
        )}
      </div>
    </SafeArea>
  );
};

