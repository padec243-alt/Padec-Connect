import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Search, Wrench, ShoppingBag, Grid, Home, User, 
  ArrowRight, Package, Truck, Zap, Plus 
} from 'lucide-react';
import { SafeArea } from '../components/MobileLayout';

export const HomeScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <SafeArea className="bg-slate-950 relative pt-0">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pb-28 no-scrollbar scroll-smooth">
        
        {/* Header - Sticky behavior simulated */}
        <div className="p-6 pt-14 flex justify-between items-center bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-800/50">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1 font-medium">Bon retour,</p>
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              Alexandre <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            </h2>
          </motion.div>
          <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             whileTap={{ scale: 0.9 }}
             className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-700 relative shadow-lg"
          >
            <Bell size={20} className="text-slate-300" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900"></span>
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-6 my-4 sticky top-28 z-20"
        >
          <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 border border-slate-800 shadow-xl group focus-within:border-cyan-500/50 transition-colors">
            <Search size={20} className="text-slate-500 group-focus-within:text-cyan-400" />
            <input type="text" placeholder="Rechercher services, produits..." className="bg-transparent w-full text-white outline-none placeholder:text-slate-600" />
          </div>
        </motion.div>

        {/* Bento Grid Switcher */}
        <div className="px-6 mb-8">
          <div className="grid grid-cols-2 gap-4">
            {/* Services Card */}
            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 rounded-[28px] p-5 relative overflow-hidden h-52 flex flex-col justify-between text-left shadow-lg border border-blue-500/20"
            >
              <div className="absolute top-[-20px] right-[-20px] p-4 opacity-10 rotate-12">
                <Wrench size={100} />
              </div>
              <div className="bg-white/10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10">
                <Wrench size={20} className="text-white" />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-1 text-white">Services</h3>
                <p className="text-blue-200 text-xs mb-3 leading-relaxed">Interventions,<br/>Réparations & Audits</p>
                <div className="bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 w-fit border border-white/5">
                  Explorer <ArrowRight size={12} />
                </div>
              </div>
            </motion.button>

            {/* Market Card */}
            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-purple-600 via-purple-700 to-slate-900 rounded-[28px] p-5 relative overflow-hidden h-52 flex flex-col justify-between text-left shadow-lg border border-purple-500/20"
            >
              <div className="absolute top-[-20px] right-[-20px] p-4 opacity-10 rotate-12">
                <ShoppingBag size={100} />
              </div>
              <div className="bg-white/10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10">
                <ShoppingBag size={20} className="text-white" />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-1 text-white">Market</h3>
                <p className="text-purple-200 text-xs mb-3 leading-relaxed">Équipements,<br/>Pièces & Hub B2B</p>
                <div className="bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 w-fit border border-white/5">
                  Boutique <ArrowRight size={12} />
                </div>
              </div>
            </motion.button>
          </div>
          
          {/* Third Bento Item - Logistics */}
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 bg-slate-900 border border-slate-800 p-5 rounded-[28px] flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Truck size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white">Suivi Logistique</h3>
                <p className="text-xs text-slate-500">2 commandes en cours</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-colors">
              <ArrowRight size={16} />
            </div>
          </motion.button>
        </div>

        {/* Featured Section */}
        <div className="px-6 mb-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-between items-end mb-4"
          >
            <h3 className="text-lg font-bold text-white">Populaire</h3>
            <button className="text-cyan-400 text-xs font-bold hover:text-cyan-300">Voir tout</button>
          </motion.div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((item, i) => (
              <motion.div 
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex gap-4 items-center hover:bg-slate-800/60 transition-colors"
              >
                <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 shadow-inner">
                  {i === 0 ? <Zap size={24} className="text-yellow-500" /> : <Package size={24} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-200">Pack Solaire Home {item}</h4>
                    <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-medium border border-emerald-500/20">Stock</span>
                  </div>
                  <p className="text-slate-500 text-xs mt-1">Kit complet autonomie 3kW</p>
                  <div className="mt-2 text-sm font-bold text-cyan-400 flex items-center gap-1">
                    $450.00 <span className="text-slate-600 text-[10px] line-through font-normal">$520.00</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-40">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.4)] border-4 border-slate-950 group"
        >
           <Plus size={32} className="text-slate-900 group-hover:rotate-90 transition-transform duration-300" strokeWidth={3} />
        </motion.button>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800/50 flex justify-around items-start pt-4 z-30 px-2 rounded-t-[30px]">
        <NavIcon icon={Home} label="Accueil" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavIcon icon={Wrench} label="Services" active={activeTab === 'services'} onClick={() => setActiveTab('services')} />
        <div className="w-12"></div> {/* Spacer for FAB */}
        <NavIcon icon={ShoppingBag} label="Shop" active={activeTab === 'shop'} onClick={() => setActiveTab('shop')} />
        <NavIcon icon={User} label="Compte" active={activeTab === 'account'} onClick={() => setActiveTab('account')} />
      </div>
    </SafeArea>
  );
};

const NavIcon = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button onClick={onClick} className="relative flex flex-col items-center justify-center w-16 gap-1 group">
    <div className={`p-1.5 rounded-xl transition-all duration-300 ${active ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    </div>
    <span className={`text-[10px] font-medium transition-colors ${active ? 'text-cyan-400' : 'text-slate-500'}`}>{label}</span>
    {active && (
      <motion.div 
        layoutId="nav-dot"
        className="absolute -bottom-2 w-1 h-1 bg-cyan-400 rounded-full"
      />
    )}
  </button>
);