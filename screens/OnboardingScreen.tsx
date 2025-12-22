import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, 
  Briefcase, 
  ShoppingBag, 
  ChevronRight,
  Plane,
  GraduationCap,
  Stethoscope,
  Globe,
  HomeIcon,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import { SafeArea } from '../components/MobileLayout';
import { Button } from '../components/UI';
import { SlideData } from '../types';
import { useNavigation } from '../context/NavigationContext';

const slides: SlideData[] = [
  {
    id: 1,
    title: "Services à la Demande",
    desc: "Démarches administratives, voyages, entrepreneuriat, gestion de projets, formations et bien plus. Gestion stratégique de vos démarches.",
    icon: ClipboardList,
    color: "text-cyan-400",
    bgGradient: "from-cyan-500/20 to-blue-500/5"
  },
  {
    id: 2,
    title: "E-Services",
    desc: "Co-working, soins médicaux, visas congolais, aide à la famille et événementiel. Simplifiez vos démarches administratives et sociales.",
    icon: Zap,
    color: "text-blue-400",
    bgGradient: "from-blue-500/20 to-indigo-500/5"
  },
  {
    id: 3,
    title: "Market Hub",
    desc: "Boutique en ligne moderne et répertoire des entrepreneurs. E-commerce complet et annuaire des acteurs économiques en RD Congo.",
    icon: ShoppingBag,
    color: "text-purple-400",
    bgGradient: "from-purple-500/20 to-pink-500/5"
  }
];

export const OnboardingScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    if (step < slides.length - 1) {
      setDirection(1);
      setStep(step + 1);
    } else {
      // Show register form by default after onboarding
      navigate('auth', { mode: 'register' });
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9
    })
  };

  const currentSlide = slides[step];
  const Icon = currentSlide.icon;

  return (
    <SafeArea className="justify-between p-6 bg-slate-950">
      <div className="w-full flex justify-end pt-4 z-20">
        <button onClick={() => navigate('auth', { mode: 'register' })} className="text-slate-500 text-sm font-medium hover:text-white transition-colors">Passer</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="flex flex-col items-center text-center w-full max-w-xs"
          >
            <div className={`w-[280px] h-[280px] rounded-[40px] flex items-center justify-center mb-12 relative overflow-hidden bg-gradient-to-tr ${currentSlide.bgGradient}`}>
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-0"></div>
              <motion.div
                 initial={{ scale: 0.5, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 transition={{ delay: 0.2 }}
                 className="relative z-10"
              >
                <Icon size={100} className={`${currentSlide.color} drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]`} strokeWidth={1.5} />
              </motion.div>
            </div>
            
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold mb-4 px-2 leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400"
            >
              {currentSlide.title}
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-400 text-lg leading-relaxed"
            >
              {currentSlide.desc}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full pb-8 z-20">
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <div key={i} className="relative">
                {i === step && (
                    <motion.div 
                        layoutId="active-dot" 
                        className="absolute inset-0 bg-cyan-400 rounded-full"
                    />
                )}
                <div className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8' : 'w-2 bg-slate-800'}`} />
            </div>
          ))}
        </div>
        <Button onClick={handleNext} className="group">
          <span className="flex items-center gap-2">
            {step === slides.length - 1 ? 'Commencer' : 'Suivant'}
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </Button>
      </div>
    </SafeArea>
  );
};