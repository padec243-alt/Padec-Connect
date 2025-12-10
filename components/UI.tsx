import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = "", 
  ...props 
}) => {
  const baseStyle = "w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center relative overflow-hidden";
  
  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_4px_20px_rgba(6,182,212,0.4)]",
    secondary: "bg-slate-800 text-white border border-slate-700",
    ghost: "bg-transparent text-slate-400 hover:text-white",
    glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white"
  };

  return (
    <motion.button 
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.01 }}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
}

export const Input: React.FC<InputProps> = ({ icon: Icon, ...props }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative w-full mb-4 group"
  >
    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors z-10">
      <Icon size={20} />
    </div>
    <input 
      {...props}
      className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-cyan-500 focus:bg-slate-900 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all placeholder:text-slate-600"
    />
  </motion.div>
);