import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, FileText, Upload, Check, CreditCard, User, Mail, Phone, MapPin, Calendar, Flag } from 'lucide-react';
import { SafeArea } from '../components/MobileLayout';
import { useNavigation } from '../context/NavigationContext';
import { Button } from '../components/UI';

interface VisaFormData {
  // Informations personnelles
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  birthDate: string;
  birthPlace: string;
  passportNumber: string;
  passportExpiry: string;

  // Informations du voyage
  visaType: string;
  entryType: string;
  arrivalDate: string;
  departureDate: string;
  purpose: string;
  accommodationAddress: string;

  // Documents
  passportCopy: boolean;
  photo: boolean;
  invitation: boolean;
}

const visaTypes = [
  { id: 'tourist', name: 'Visa Touristique', price: 150000, duration: '30 jours' },
  { id: 'business', name: 'Visa d\'Affaires', price: 250000, duration: '90 jours' },
  { id: 'transit', name: 'Visa de Transit', price: 75000, duration: '7 jours' },
  { id: 'work', name: 'Visa de Travail', price: 500000, duration: '1 an' },
  { id: 'student', name: 'Visa Étudiant', price: 200000, duration: '1 an' },
];

const entryTypes = [
  { id: 'single', name: 'Entrée unique' },
  { id: 'multiple', name: 'Entrées multiples' },
];

export const VisaScreen: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<VisaFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    birthDate: '',
    birthPlace: '',
    passportNumber: '',
    passportExpiry: '',
    visaType: 'tourist',
    entryType: 'single',
    arrivalDate: '',
    departureDate: '',
    purpose: '',
    accommodationAddress: '',
    passportCopy: false,
    photo: false,
    invitation: false,
  });

  const selectedVisa = visaTypes.find(v => v.id === formData.visaType);
  const totalSteps = 4;

  const updateField = (field: keyof VisaFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    navigate('checkout', {
      type: 'visa',
      item: {
        name: selectedVisa?.name,
        ...formData
      },
      price: selectedVisa?.price || 0
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
    field: keyof VisaFormData;
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
          value={formData[field] as string}
          onChange={(e) => updateField(field, e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-green-500 transition-colors placeholder:text-slate-600"
        />
      </div>
    </div>
  );

  return (
    <SafeArea className="bg-slate-950 relative pt-0">
      <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
        {/* Header */}
        <div className="p-6 pt-14 flex items-center gap-4 bg-gradient-to-r from-green-900/50 to-emerald-900/30 backdrop-blur-xl sticky top-0 z-30 border-b border-green-500/20">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={step > 1 ? handleBack : goBack}
            className="w-10 h-10 rounded-full bg-slate-900/80 flex items-center justify-center border border-green-500/30"
          >
            <ArrowLeft size={20} className="text-white" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Globe size={24} className="text-green-400" />
              Visa Congolais
            </h1>
            <p className="text-green-300 text-xs">Étape {step} sur {totalSteps}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4">
          <div className="w-full bg-slate-800 rounded-full h-2">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full"
            />
          </div>
          <div className="flex justify-between mt-2">
            {['Infos', 'Voyage', 'Documents', 'Paiement'].map((label, i) => (
              <span key={i} className={`text-xs ${i + 1 <= step ? 'text-green-400' : 'text-slate-600'}`}>
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="px-6 py-4">
          {/* Step 1: Informations personnelles */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 mb-6">
                <h2 className="text-lg font-bold text-white mb-4">Informations personnelles</h2>

                <InputField icon={User} label="Prénom" field="firstName" placeholder="Votre prénom" />
                <InputField icon={User} label="Nom" field="lastName" placeholder="Votre nom de famille" />
                <InputField icon={Mail} label="Email" field="email" type="email" placeholder="votre@email.com" />
                <InputField icon={Phone} label="Téléphone" field="phone" type="tel" placeholder="+243 XXX XXX XXX" />
                <InputField icon={Flag} label="Nationalité" field="nationality" placeholder="Ex: Française" />
                <InputField icon={Calendar} label="Date de naissance" field="birthDate" type="date" />
                <InputField icon={MapPin} label="Lieu de naissance" field="birthPlace" placeholder="Ville, Pays" />
              </div>

              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4">
                <h2 className="text-lg font-bold text-white mb-4">Informations du passeport</h2>

                <InputField icon={FileText} label="Numéro de passeport" field="passportNumber" placeholder="N° de passeport" />
                <InputField icon={Calendar} label="Date d'expiration" field="passportExpiry" type="date" />
              </div>
            </motion.div>
          )}

          {/* Step 2: Informations du voyage */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 mb-6">
                <h2 className="text-lg font-bold text-white mb-4">Type de visa</h2>

                <div className="space-y-3">
                  {visaTypes.map(visa => (
                    <button
                      key={visa.id}
                      onClick={() => updateField('visaType', visa.id)}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                        formData.visaType === visa.id
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-slate-700 bg-slate-800/50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-bold">{visa.name}</p>
                          <p className="text-slate-400 text-sm">Durée: {visa.duration}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-bold">{visa.price.toLocaleString()} FC</p>
                          {formData.visaType === visa.id && (
                            <Check size={20} className="text-green-400 ml-auto" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 mb-6">
                <h2 className="text-lg font-bold text-white mb-4">Type d'entrée</h2>

                <div className="grid grid-cols-2 gap-3">
                  {entryTypes.map(entry => (
                    <button
                      key={entry.id}
                      onClick={() => updateField('entryType', entry.id)}
                      className={`p-4 rounded-2xl border-2 text-center transition-all ${
                        formData.entryType === entry.id
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-slate-700 bg-slate-800/50'
                      }`}
                    >
                      <p className="text-white font-medium">{entry.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4">
                <h2 className="text-lg font-bold text-white mb-4">Dates du voyage</h2>

                <InputField icon={Calendar} label="Date d'arrivée prévue" field="arrivalDate" type="date" />
                <InputField icon={Calendar} label="Date de départ prévue" field="departureDate" type="date" />
                <InputField icon={MapPin} label="Adresse d'hébergement en RDC" field="accommodationAddress" placeholder="Hôtel ou adresse" />

                <div className="mb-4">
                  <label className="block text-slate-400 text-sm font-medium mb-2">Motif du voyage</label>
                  <textarea
                    value={formData.purpose}
                    onChange={(e) => updateField('purpose', e.target.value)}
                    placeholder="Décrivez le motif de votre voyage..."
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl py-4 px-4 text-white outline-none focus:border-green-500 transition-colors placeholder:text-slate-600 min-h-[100px]"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Documents */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4">
                <h2 className="text-lg font-bold text-white mb-4">Documents requis</h2>
                <p className="text-slate-400 text-sm mb-6">Veuillez confirmer que vous avez les documents suivants :</p>

                {[
                  { field: 'passportCopy' as keyof VisaFormData, label: 'Copie du passeport (pages d\'identité)', required: true },
                  { field: 'photo' as keyof VisaFormData, label: 'Photo d\'identité récente (fond blanc)', required: true },
                  { field: 'invitation' as keyof VisaFormData, label: 'Lettre d\'invitation (si applicable)', required: false },
                ].map((doc, i) => (
                  <button
                    key={i}
                    onClick={() => updateField(doc.field, !formData[doc.field])}
                    className={`w-full p-4 rounded-2xl border-2 mb-3 flex items-center gap-4 transition-all ${
                      formData[doc.field]
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-slate-700 bg-slate-800/50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
                      formData[doc.field]
                        ? 'border-green-500 bg-green-500'
                        : 'border-slate-600'
                    }`}>
                      {formData[doc.field] && <Check size={16} className="text-white" />}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-white">{doc.label}</p>
                      {doc.required && <p className="text-slate-500 text-xs">Obligatoire</p>}
                    </div>
                  </button>
                ))}

                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
                  <p className="text-blue-400 text-sm">
                    📎 Vous pourrez télécharger vos documents après le paiement dans votre espace personnel.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Récapitulatif et paiement */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4">
                <h2 className="text-lg font-bold text-white mb-4">Récapitulatif de votre demande</h2>

                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-800/50">
                    <span className="text-slate-400">Type de visa</span>
                    <span className="text-white font-medium">{selectedVisa?.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800/50">
                    <span className="text-slate-400">Durée</span>
                    <span className="text-white font-medium">{selectedVisa?.duration}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800/50">
                    <span className="text-slate-400">Type d'entrée</span>
                    <span className="text-white font-medium">
                      {entryTypes.find(e => e.id === formData.entryType)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800/50">
                    <span className="text-slate-400">Demandeur</span>
                    <span className="text-white font-medium">{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800/50">
                    <span className="text-slate-400">Date d'arrivée</span>
                    <span className="text-white font-medium">{formData.arrivalDate || 'Non spécifiée'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-slate-400 text-sm">Total à payer</p>
                    <p className="text-white font-bold text-2xl">{selectedVisa?.price.toLocaleString()} FC</p>
                  </div>
                  <CreditCard size={32} className="text-green-400" />
                </div>
              </div>

              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4">
                <h3 className="text-white font-bold mb-2">Délai de traitement</h3>
                <p className="text-slate-400 text-sm">
                  Votre demande sera traitée dans un délai de 5 à 15 jours ouvrables après réception des documents complets.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Boutons de navigation - à l'intérieur du frame */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/50">
        {step < totalSteps ? (
          <button onClick={handleNext} className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            Continuer
          </button>
        ) : (
          <button onClick={handleSubmit} className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CreditCard size={18} />
            Procéder au paiement
          </button>
        )}
      </div>
    </SafeArea>
  );
};

