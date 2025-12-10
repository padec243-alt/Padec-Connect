import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MobileLayout } from './components/MobileLayout';
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { AuthScreen } from './screens/AuthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ScreenName } from './types';

export default function App() {
  const [screen, setScreen] = useState<ScreenName>('splash');

  const pageVariants = {
    initial: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 1.05, filter: 'blur(10px)' }
  };

  return (
    <MobileLayout>
      <AnimatePresence mode="wait">
        {screen === 'splash' && (
          <motion.div key="splash" {...pageVariants} className="w-full h-full">
            <SplashScreen onFinish={() => setScreen('onboarding')} />
          </motion.div>
        )}
        
        {screen === 'onboarding' && (
          <motion.div key="onboarding" {...pageVariants} transition={{ duration: 0.4 }} className="w-full h-full">
            <OnboardingScreen onFinish={() => setScreen('auth')} />
          </motion.div>
        )}
        
        {screen === 'auth' && (
          <motion.div key="auth" {...pageVariants} transition={{ duration: 0.4 }} className="w-full h-full">
            <AuthScreen onLogin={() => setScreen('home')} />
          </motion.div>
        )}
        
        {screen === 'home' && (
          <motion.div key="home" {...pageVariants} transition={{ duration: 0.5 }} className="w-full h-full">
            <HomeScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </MobileLayout>
  );
}