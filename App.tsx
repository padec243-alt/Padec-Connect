import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MobileLayout } from './components/MobileLayout';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { AuthScreen } from './screens/AuthScreen';
import { ProfileSetupScreen } from './screens/ProfileSetupScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ServicesScreen } from './screens/ServicesScreen';
import { ServiceDetailScreen } from './screens/ServiceDetailScreen';
import { EServicesScreen } from './screens/EServicesScreen';
import { EServiceDetailScreen } from './screens/EServiceDetailScreen';
import { MarketScreen } from './screens/MarketScreen';
import { ProductDetailScreen } from './screens/ProductDetailScreen';
import { CartScreen } from './screens/CartScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { RepertoireScreen } from './screens/RepertoireScreen';
import { ActorDetailScreen } from './screens/ActorDetailScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SearchScreen } from './screens/SearchScreen';
import { ProjectsScreen } from './screens/ProjectsScreen';
import { AssistanceScreen } from './screens/AssistanceScreen';
import { CoworkingScreen } from './screens/CoworkingScreen';
import { HealthScreen } from './screens/HealthScreen';
import { VisaScreen } from './screens/VisaScreen';
import { FamilyHelpScreen } from './screens/FamilyHelpScreen';
import { EventsScreen } from './screens/EventsScreen';
import { HousingScreen } from './screens/HousingScreen';

function AppContent() {
  const { currentScreen, navigate } = useNavigation();
  const { isAuthenticated, profileSetupCompleted, loading } = useAuthContext();

  // Rediriger vers profile-setup si l'utilisateur est connecté mais n'a pas terminé la configuration
  useEffect(() => {
    // Attendre que le chargement soit terminé
    if (loading) return;

    // Si l'utilisateur est authentifié mais n'a pas terminé le setup du profil
    if (isAuthenticated && profileSetupCompleted === false) {
      // Ne pas rediriger si on est déjà sur profile-setup, auth ou splash/onboarding
      if (currentScreen !== 'profile-setup' &&
          currentScreen !== 'auth' &&
          currentScreen !== 'splash' &&
          currentScreen !== 'onboarding') {
        navigate('profile-setup');
      }
    }
  }, [isAuthenticated, profileSetupCompleted, loading, currentScreen, navigate]);

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <MobileLayout>
      <AnimatePresence mode="wait">
        {currentScreen === 'splash' && (
          <motion.div key="splash" {...pageVariants} className="w-full h-full">
            <SplashScreen />
          </motion.div>
        )}
        
        {currentScreen === 'onboarding' && (
          <motion.div key="onboarding" {...pageVariants} className="w-full h-full">
            <OnboardingScreen />
          </motion.div>
        )}
        
        {currentScreen === 'auth' && (
          <motion.div key="auth" {...pageVariants} className="w-full h-full">
            <AuthScreen />
          </motion.div>
        )}
        
        {currentScreen === 'profile-setup' && (
          <motion.div key="profile-setup" {...pageVariants} className="w-full h-full">
            <ProfileSetupScreen />
          </motion.div>
        )}
        
        {currentScreen === 'home' && (
          <motion.div key="home" {...pageVariants} className="w-full h-full">
            <HomeScreen />
          </motion.div>
        )}

        {currentScreen === 'services' && (
          <motion.div key="services" {...pageVariants} className="w-full h-full">
            <ServicesScreen />
          </motion.div>
        )}

        {currentScreen === 'service-detail' && (
          <motion.div key="service-detail" {...pageVariants} className="w-full h-full">
            <ServiceDetailScreen />
          </motion.div>
        )}

        {currentScreen === 'eservices' && (
          <motion.div key="eservices" {...pageVariants} className="w-full h-full">
            <EServicesScreen />
          </motion.div>
        )}

        {currentScreen === 'eservice-detail' && (
          <motion.div key="eservice-detail" {...pageVariants} className="w-full h-full">
            <EServiceDetailScreen />
          </motion.div>
        )}

        {currentScreen === 'market' && (
          <motion.div key="market" {...pageVariants} className="w-full h-full">
            <MarketScreen />
          </motion.div>
        )}

        {currentScreen === 'product-detail' && (
          <motion.div key="product-detail" {...pageVariants} className="w-full h-full">
            <ProductDetailScreen />
          </motion.div>
        )}

        {currentScreen === 'cart' && (
          <motion.div key="cart" {...pageVariants} className="w-full h-full">
            <CartScreen />
          </motion.div>
        )}

        {currentScreen === 'checkout' && (
          <motion.div key="checkout" {...pageVariants} className="w-full h-full">
            <CheckoutScreen />
          </motion.div>
        )}

        {currentScreen === 'repertoire' && (
          <motion.div key="repertoire" {...pageVariants} className="w-full h-full">
            <RepertoireScreen />
          </motion.div>
        )}

        {currentScreen === 'actor-detail' && (
          <motion.div key="actor-detail" {...pageVariants} className="w-full h-full">
            <ActorDetailScreen />
          </motion.div>
        )}

        {currentScreen === 'profile' && (
          <motion.div key="profile" {...pageVariants} className="w-full h-full">
            <ProfileScreen />
          </motion.div>
        )}

        {currentScreen === 'search' && (
          <motion.div key="search" {...pageVariants} className="w-full h-full">
            <SearchScreen />
          </motion.div>
        )}

        {currentScreen === 'projects' && (
          <motion.div key="projects" {...pageVariants} className="w-full h-full">
            <ProjectsScreen />
          </motion.div>
        )}

        {currentScreen === 'assistance' && (
          <motion.div key="assistance" {...pageVariants} className="w-full h-full">
            <AssistanceScreen />
          </motion.div>
        )}

        {currentScreen === 'coworking' && (
          <motion.div key="coworking" {...pageVariants} className="w-full h-full">
            <CoworkingScreen />
          </motion.div>
        )}

        {currentScreen === 'health' && (
          <motion.div key="health" {...pageVariants} className="w-full h-full">
            <HealthScreen />
          </motion.div>
        )}

        {currentScreen === 'visa' && (
          <motion.div key="visa" {...pageVariants} className="w-full h-full">
            <VisaScreen />
          </motion.div>
        )}

        {currentScreen === 'family-help' && (
          <motion.div key="family-help" {...pageVariants} className="w-full h-full">
            <FamilyHelpScreen />
          </motion.div>
        )}

        {currentScreen === 'events' && (
          <motion.div key="events" {...pageVariants} className="w-full h-full">
            <EventsScreen />
          </motion.div>
        )}

        {currentScreen === 'housing' && (
          <motion.div key="housing" {...pageVariants} className="w-full h-full">
            <HousingScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </MobileLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </NavigationProvider>
    </AuthProvider>
  );
}