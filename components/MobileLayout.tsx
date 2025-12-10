import React from 'react';
import { motion } from 'framer-motion';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4 lg:p-8 font-sans bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black">
      {/* Phone Frame */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[400px] h-[850px] bg-black rounded-[50px] p-[10px] shadow-2xl relative border-[6px] border-slate-800 ring-1 ring-white/10 overflow-hidden"
      >
        {/* Hardware Buttons */}
        <div className="absolute top-24 -left-[8px] w-[2px] h-8 bg-slate-700 rounded-l-md opacity-80"></div>
        <div className="absolute top-36 -left-[8px] w-[2px] h-14 bg-slate-700 rounded-l-md opacity-80"></div>
        <div className="absolute top-28 -right-[8px] w-[2px] h-20 bg-slate-700 rounded-r-md opacity-80"></div>

        {/* Dynamic Island / Notch Area */}
        <div className="absolute top-[18px] left-1/2 transform -translate-x-1/2 w-28 h-7 bg-black rounded-3xl z-50 flex justify-center items-center pointer-events-none">
             <div className="w-16 h-4 bg-black rounded-full relative overflow-hidden">
                <div className="absolute top-1 right-3 w-1.5 h-1.5 bg-indigo-900/50 rounded-full blur-[1px]"></div>
             </div>
        </div>

        {/* Status Bar Info (Visual Only) */}
        <div className="absolute top-[16px] left-[34px] z-50 text-white text-[10px] font-semibold tracking-wide pointer-events-none">9:41</div>
        <div className="absolute top-[18px] right-[34px] z-50 flex gap-1 pointer-events-none">
            <div className="w-3 h-3 border border-white rounded-[2px] opacity-80"></div>
            <div className="w-3 h-3 bg-white rounded-full opacity-80"></div>
        </div>
        
        {/* Screen Content */}
        <div className="w-full h-full rounded-[42px] overflow-hidden bg-slate-950 relative flex flex-col">
          {children}
        </div>
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-50 pointer-events-none"></div>
      </motion.div>
    </div>
  );
};

export const SafeArea: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`w-full h-full flex flex-col pt-12 relative overflow-hidden ${className}`}>
    {children}
  </div>
);