import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, Building, Calendar, Users, Droplet } from 'lucide-react';
import { SafeArea } from '../components/MobileLayout';
import { useNavigation } from '../context/NavigationContext';

const projects = [
  {
    id: 'p1',
    title: 'Projets d\'Adduction d\'Eau Potable',
    description: 'Amélioration de l\'accès à l\'eau potable dans plusieurs régions de la RDC',
    location: 'RDC',
    type: 'Infrastructure',
    icon: Droplet,
    bgClass: 'bg-blue-500/10',
    borderClass: 'border-blue-500/20',
    iconClass: 'text-blue-400',
    status: 'En cours'
  },
  {
    id: 'p2',
    title: 'Concession N\'sele',
    description: 'Projet immobilier d\'envergure pour l\'accès au logement',
    location: 'Kinshasa',
    type: 'Immobilier',
    icon: Building,
    bgClass: 'bg-cyan-500/10',
    borderClass: 'border-cyan-500/20',
    iconClass: 'text-cyan-400',
    status: 'En cours'
  },
  {
    id: 'p3',
    title: 'Coopération Chine-RD Congo',
    description: 'Partenariats économiques et projets de développement',
    location: 'RDC',
    type: 'Coopération',
    icon: Globe,
    bgClass: 'bg-purple-500/10',
    borderClass: 'border-purple-500/20',
    iconClass: 'text-purple-400',
    status: 'Actif'
  },
  {
    id: 'p4',
    title: 'Salon des PME & PMI',
    description: 'Événement annuel pour promouvoir les petites et moyennes entreprises',
    location: 'Kinshasa-Chine',
    type: 'Événementiel',
    icon: Calendar,
    bgClass: 'bg-pink-500/10',
    borderClass: 'border-pink-500/20',
    iconClass: 'text-pink-400',
    status: 'À venir'
  }
];

export const ProjectsScreen: React.FC = () => {
  const { navigate, goBack } = useNavigation();

  return (
    <SafeArea className="bg-slate-950 relative pt-0">
      <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        <div className="p-6 pt-14 flex items-center gap-4 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-800/50">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800"
          >
            <ArrowLeft size={20} className="text-white" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">Projets en Vedette</h1>
            <p className="text-slate-400 text-xs">Réalisations et projets PADEC</p>
          </div>
        </div>

        <div className="px-6 py-6 space-y-4">
          {projects.map((project, i) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 cursor-pointer hover:bg-slate-800/60 transition-colors"
              >
                <div className="flex gap-4">
                  <div className={`w-14 h-14 rounded-xl ${project.bgClass} flex items-center justify-center border ${project.borderClass} flex-shrink-0`}>
                    <Icon size={24} className={project.iconClass} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-white text-lg">{project.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'En cours' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        project.status === 'Actif' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{project.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>{project.location}</span>
                      <span>•</span>
                      <span>{project.type}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="px-6 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-6 text-center"
          >
            <Users size={32} className="text-cyan-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Rejoignez nos projets</h3>
            <p className="text-slate-400 text-sm mb-4">
              Participez aux projets PADEC et contribuez au développement de la RDC
            </p>
            <button className="px-6 py-3 bg-cyan-500 rounded-xl text-white font-bold hover:bg-cyan-600 transition-colors">
              En savoir plus
            </button>
          </motion.div>
        </div>
      </div>
    </SafeArea>
  );
};

