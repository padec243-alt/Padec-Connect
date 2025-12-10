import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { SafeArea } from '../components/MobileLayout';

interface Props {
  onFinish: () => void;
}

export const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <SafeArea className="items-center justify-center bg-slate-950">
      <div className="relative flex flex-col items-center justify-center">
        {/* Animated Background Blur */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-cyan-500 blur-[80px] rounded-full w-64 h-64 -z-10"
        />
        
        <motion.div 
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 45 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 1.5 
          }}
          className="w-24 h-24 border-4 border-cyan-400 rounded-3xl flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(34,211,238,0.3)] bg-slate-900/50 backdrop-blur-sm"
        >
          <motion.div 
            animate={{ rotate: -45 }}
            transition={{ duration: 1.5 }}
            className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center"
          >
            <span className="text-3xl font-black text-slate-950">P</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl font-black tracking-tighter text-white mb-2">PADEC</h1>
          <motion.p 
            initial={{ letterSpacing: "0.1em", opacity: 0 }}
            animate={{ letterSpacing: "0.4em", opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-cyan-400 text-xs font-bold uppercase"
          >
            Connect Ecosystem
          </motion.p>
        </motion.div>
      </div>
    </SafeArea>
  );
};