import React, { useState } from 'react';
import { Phone, MapPin, Globe, User, Upload, CheckCircle, Loader, X } from 'lucide-react';
import { SafeArea } from '../components/MobileLayout';
import { Button, Input } from '../components/UI';
import { useNavigation } from '../context/NavigationContext';
import { useAuthContext } from '../context/AuthContext';
import { FirestoreService } from '../services/FirestoreService';
import { StorageService } from '../services/StorageService';
import { getCountriesList, NATIONALITIES } from '../data/geographicData';

export const ProfileSetupScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const { user, refreshProfile } = useAuthContext();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('cd'); // RDC par défaut
  const [city, setCity] = useState('');
  const [nationality, setNationality] = useState('Congolaise (RDC)');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Get countries and cities
  const countries = getCountriesList();
  const selectedCountry = countries.find((c) => c.id === country);
  const cities = selectedCountry ? selectedCountry.cities : [];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('La photo doit faire moins de 5 MB');
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    setError(null);
    
    if (step === 1) {
      if (!phone.trim()) {
        setError('Veuillez entrer votre numéro de téléphone');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!country || !city) {
        setError('Veuillez sélectionner votre pays et ville');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!nationality) {
        setError('Veuillez sélectionner votre nationalité');
        return;
      }
      setStep(4);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('Utilisateur non trouvé');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      let profilePictureUrl = null;

      // Upload profile picture if selected
      if (profileImage) {
        profilePictureUrl = await StorageService.uploadFile(
          `profiles/${user.uid}/avatar.jpg`,
          profileImage
        );
      }

      // Create or update user profile in Firestore (using setDocument with merge to handle new users)
      await FirestoreService.setDocument('users', user.uid, {
        email: user.email,
        displayName: user.displayName || '',
        phone,
        country,
        city,
        nationality,
        profilePictureUrl,
        profileSetupCompleted: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, true);

      // Rafraîchir le profil dans le contexte
      await refreshProfile();

      // Navigate to home immediately
      navigate('home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeArea className="p-6 justify-between bg-slate-950">
      <div className="w-full flex flex-col h-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
            Complétez votre profil
          </h1>
          <p className="text-slate-400 text-sm">
            Étape {step} sur 4
          </p>
          <div className="w-full bg-slate-800 rounded-full h-1 mt-4">
            <div
              style={{ width: `${(step / 4) * 100}%` }}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full transition-all duration-300"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Phone */}
        {step === 1 && (
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20">
              <Phone size={48} className="text-cyan-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-center mb-4 text-white">Numéro de téléphone</h2>
              <Input
                icon={Phone}
                type="tel"
                placeholder="+243 (ex: +243812345678)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
              />
              <p className="text-slate-500 text-center text-sm">
                Nous utiliserons ce numéro pour vous contacter
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="flex-1 flex flex-col justify-center space-y-4">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20">
              <MapPin size={48} className="text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-center mb-6 text-white">Votre localisation</h2>

              <label className="block text-slate-400 text-sm font-medium mb-2">Pays</label>
              <select
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setCity('');
                }}
                disabled={loading}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl py-4 px-4 text-white outline-none focus:border-blue-500 focus:bg-slate-900 transition-all mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <label className="block text-slate-400 text-sm font-medium mb-2">Ville</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={loading || cities.length === 0}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl py-4 px-4 text-white outline-none focus:border-blue-500 focus:bg-slate-900 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="">Sélectionner une ville</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Nationality */}
        {step === 3 && (
          <div className="flex-1 flex flex-col justify-center">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20">
              <Globe size={48} className="text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-center mb-6 text-white">Nationalité</h2>

              <select
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                disabled={loading}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl py-4 px-4 text-white outline-none focus:border-purple-500 focus:bg-slate-900 transition-all disabled:opacity-60 disabled:cursor-not-allowed max-h-60"
              >
                {NATIONALITIES.map((nat) => (
                  <option key={nat} value={nat}>
                    {nat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 4: Profile Picture */}
        {step === 4 && (
          <div className="flex-1 flex flex-col justify-center">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20">
              <User size={48} className="text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-center mb-6 text-white">Photo de profil</h2>

              {imagePreview ? (
                <div className="mb-6 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-2xl"
                  />
                  <button
                    onClick={() => {
                      setProfileImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 rounded-full p-2 transition-colors"
                  >
                    <X size={20} className="text-white" />
                  </button>
                </div>
              ) : (
                <label className="mb-6 flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-700 rounded-2xl cursor-pointer hover:border-green-500/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload size={40} className="text-green-400 mb-2" />
                    <p className="text-sm text-slate-400">
                      Cliquez pour télécharger une photo
                    </p>
                    <p className="text-xs text-slate-600">JPG, PNG (max 5MB)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    disabled={loading}
                    className="hidden"
                  />
                </label>
              )}

              <p className="text-slate-500 text-center text-sm">
                Votre photo de profil sera visible par les autres utilisateurs
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <Button
              variant="secondary"
              onClick={() => setStep(step - 1)}
              disabled={loading}
              className="flex-1"
            >
              Retour
            </Button>
          )}

          {step < 4 ? (
            <Button
              onClick={handleNext}
              disabled={loading}
              className="flex-1"
            >
              Suivant
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader size={18} className="animate-spin" /> Confirmation...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle size={18} /> Terminer
                </span>
              )}
            </Button>
          )}
        </div>
      </div>
    </SafeArea>
  );
};
