import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Apple, Smartphone } from 'lucide-react';
import { SafeArea } from '../components/MobileLayout';
import { Button, Input } from '../components/UI';

interface Props {
  onLogin: () => void;
}

export const AuthScreen: React.FC<Props> = ({ onLogin }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <SafeArea className="p-6 justify-center bg-slate-950">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full flex flex-col h-full justify-center"
      >
        <motion.div variants={itemVariants} className="mb-10">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">Bienvenue.</h1>
          <p className="text-slate-400 text-lg">Connectez-vous à votre espace PADEC.</p>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Input icon={Mail} placeholder="Email ou ID Partenaire" type="email" />
          <Input icon={Lock} placeholder="Mot de passe" type="password" />
          <div className="flex justify-end mb-6">
            <button className="text-cyan-400 text-sm font-medium hover:text-cyan-300 transition-colors">Mot de passe oublié ?</button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button onClick={onLogin} className="mb-6">
            Se Connecter
          </Button>
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
          <div className="h-px bg-slate-800 flex-1"></div>
          <span className="text-slate-600 text-sm font-medium">Ou continuer avec</span>
          <div className="h-px bg-slate-800 flex-1"></div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
          <Button variant="secondary" className="py-3 text-sm gap-2">
            <span className="font-bold text-lg">G</span> Google
          </Button>
          <Button variant="secondary" className="py-3 text-sm gap-2">
            <Apple size={18} fill="white" /> Apple
          </Button>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-auto pt-6 text-center pb-4">
          <p className="text-slate-500">Pas encore de compte ? <button className="text-cyan-400 font-bold hover:underline">S'inscrire</button></p>
        </motion.div>
      </motion.div>
    </SafeArea>
  );
};