import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, ShoppingBag, Wrench, Grid, Building2,
  Hotel, MessageCircle, Settings, Plus, FileText, CreditCard,
  TrendingUp, Package, Calendar, Bell, Search, Menu, X,
  ChevronRight, UserPlus, Store, Briefcase, Heart, Globe,
  BarChart3, PieChart, Activity, DollarSign, ShoppingCart,
  ClipboardList, Zap, LogOut, Home, Clock
} from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { useAuthContext } from '../../context/AuthContext';
import { FirestoreService } from '../../services/FirestoreService';
import { auth } from '../../config/firebase';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalServices: number;
  totalOrders: number;
  totalRevenue: number;
  pendingRequests: number;
}

export const AdminDashboard: React.FC = () => {
  const { navigate } = useNavigation();
  const { user, userProfile } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalServices: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingRequests: 0
  });

  const handleLogout = async () => {
    await auth.signOut();
    navigate('auth');
  };

  const menuItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'products', label: 'Produits', icon: Package },
    { id: 'services', label: 'Services à la Demande', icon: Wrench },
    { id: 'eservices', label: 'E-Services', icon: Grid },
    { id: 'market', label: 'Market Hub', icon: Store },
    { id: 'orders', label: 'Commandes', icon: ShoppingCart },
    { id: 'reservations', label: 'Réservations', icon: Calendar },
    { id: 'requests', label: 'Demandes', icon: ClipboardList },
    { id: 'actors', label: 'Répertoire Acteurs', icon: Briefcase },
    { id: 'hotels', label: 'Hôtels', icon: Hotel },
    { id: 'enterprises', label: 'Entreprises', icon: Building2 },
    { id: 'finance', label: 'Finance', icon: CreditCard },
    { id: 'messages', label: 'Messagerie', icon: MessageCircle },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const quickActions = [
    { label: 'Ajouter Produit', icon: Package, color: 'from-cyan-500 to-blue-600', action: () => setActiveSection('products') },
    { label: 'Ajouter Service', icon: Wrench, color: 'from-purple-500 to-pink-600', action: () => setActiveSection('services') },
    { label: 'Ajouter Offre', icon: Zap, color: 'from-orange-500 to-red-600', action: () => setActiveSection('offers') },
    { label: 'Ajouter Hôtel', icon: Hotel, color: 'from-emerald-500 to-teal-600', action: () => setActiveSection('hotels') },
    { label: 'Ajouter Entreprise', icon: Building2, color: 'from-blue-500 to-indigo-600', action: () => setActiveSection('enterprises') },
    { label: 'Ajouter Client', icon: UserPlus, color: 'from-pink-500 to-rose-600', action: () => setActiveSection('users') },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className={`fixed lg:relative z-50 h-screen w-72 bg-slate-900 border-r border-slate-800 flex flex-col ${sidebarOpen ? '' : 'lg:w-20'}`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <LayoutDashboard size={20} className="text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-lg font-bold text-white">PADEC Admin</h1>
                <p className="text-xs text-slate-500">Tableau de bord</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center overflow-hidden">
              {userProfile?.profilePictureUrl ? (
                <img src={userProfile.profilePictureUrl} alt="Admin" className="w-full h-full object-cover" />
              ) : (
                <Users size={18} className="text-white" />
              )}
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{user?.displayName || 'Admin'}</p>
                <p className="text-xs text-slate-500">Administrateur</p>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('home')}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 text-sm transition-colors"
            >
              <Home size={16} />
              {sidebarOpen && 'App'}
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 text-sm transition-colors"
            >
              <LogOut size={16} />
              {sidebarOpen && 'Déconnexion'}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {menuItems.find(m => m.id === activeSection)?.label || 'Vue d\'ensemble'}
                </h2>
                <p className="text-sm text-slate-500">Bienvenue dans votre espace d'administration</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-cyan-500 w-64"
                />
              </div>
              <button className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {activeSection === 'overview' && <OverviewSection stats={stats} quickActions={quickActions} />}
          {activeSection === 'users' && <UsersSection />}
          {activeSection === 'products' && <ProductsSection />}
          {activeSection === 'services' && <ServicesSection />}
          {activeSection === 'eservices' && <EServicesSection />}
          {activeSection === 'market' && <MarketSection />}
          {activeSection === 'orders' && <OrdersSection />}
          {activeSection === 'reservations' && <ReservationsSection />}
          {activeSection === 'requests' && <RequestsSection />}
          {activeSection === 'actors' && <ActorsSection />}
          {activeSection === 'hotels' && <HotelsSection />}
          {activeSection === 'enterprises' && <EnterprisesSection />}
          {activeSection === 'finance' && <FinanceSection />}
          {activeSection === 'messages' && <MessagesSection />}
          {activeSection === 'settings' && <SettingsSection />}
        </div>
      </main>
    </div>
  );
};


// Overview Section
const OverviewSection: React.FC<{ stats: DashboardStats; quickActions: any[] }> = ({ stats, quickActions }) => {
  const statCards = [
    { label: 'Utilisateurs', value: stats.totalUsers, icon: Users, color: 'from-cyan-500 to-blue-600', change: '+12%' },
    { label: 'Produits', value: stats.totalProducts, icon: Package, color: 'from-purple-500 to-pink-600', change: '+8%' },
    { label: 'Services', value: stats.totalServices, icon: Wrench, color: 'from-orange-500 to-red-600', change: '+15%' },
    { label: 'Commandes', value: stats.totalOrders, icon: ShoppingCart, color: 'from-emerald-500 to-teal-600', change: '+23%' },
    { label: 'Revenus', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'from-yellow-500 to-orange-600', change: '+18%' },
    { label: 'Demandes en attente', value: stats.pendingRequests, icon: ClipboardList, color: 'from-red-500 to-pink-600', change: '-5%' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon size={24} className="text-white" />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-slate-500 text-sm">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                onClick={action.action}
                className={`p-4 rounded-xl bg-gradient-to-br ${action.color} hover:opacity-90 transition-opacity flex flex-col items-center gap-2`}
              >
                <Icon size={24} className="text-white" />
                <span className="text-xs font-medium text-white text-center">{action.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Activity size={20} className="text-cyan-400" />
            Activité Récente
          </h3>
          <div className="space-y-4">
            {[
              { text: 'Nouvelle commande #1234', time: 'Il y a 5 min', type: 'order' },
              { text: 'Nouvel utilisateur inscrit', time: 'Il y a 15 min', type: 'user' },
              { text: 'Demande de service reçue', time: 'Il y a 30 min', type: 'request' },
              { text: 'Paiement confirmé', time: 'Il y a 1h', type: 'payment' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">{activity.text}</p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-purple-400" />
            Performance
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Taux de conversion', value: 68, color: 'bg-cyan-500' },
              { label: 'Satisfaction client', value: 92, color: 'bg-emerald-500' },
              { label: 'Temps de réponse', value: 85, color: 'bg-purple-500' },
              { label: 'Objectif mensuel', value: 74, color: 'bg-orange-500' },
            ].map((metric, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">{metric.label}</span>
                  <span className="text-white font-medium">{metric.value}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${metric.color} rounded-full`} style={{ width: `${metric.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


// Users Section
const UsersSection: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersData = await FirestoreService.getCollection('users');
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'client' | 'adm') => {
    try {
      await FirestoreService.updateDocument('users', userId, { role: newRole });
      loadUsers();
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Gestion des Utilisateurs</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white text-sm font-medium hover:opacity-90">
          <UserPlus size={18} />
          Ajouter Client
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Utilisateur</th>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Email</th>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Téléphone</th>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Rôle</th>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">Chargement...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">Aucun utilisateur</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-t border-slate-800 hover:bg-slate-800/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden">
                        {user.profilePictureUrl ? (
                          <img src={user.profilePictureUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Users size={18} className="text-slate-500" />
                          </div>
                        )}
                      </div>
                      <span className="text-white font-medium">{user.displayName || 'Sans nom'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-400">{user.email}</td>
                  <td className="p-4 text-slate-400">{user.phone || '-'}</td>
                  <td className="p-4">
                    {editingUser === user.id ? (
                      <select
                        defaultValue={user.role || 'client'}
                        onChange={(e) => updateUserRole(user.id, e.target.value as 'client' | 'adm')}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-white text-sm"
                      >
                        <option value="client">Client</option>
                        <option value="adm">Admin</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'adm' ? 'bg-purple-500/20 text-purple-400' : 'bg-cyan-500/20 text-cyan-400'
                      }`}>
                        {user.role === 'adm' ? 'Admin' : 'Client'}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setEditingUser(editingUser === user.id ? null : user.id)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 text-sm"
                    >
                      {editingUser === user.id ? 'Annuler' : 'Modifier'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// Generic CRUD Section Component
const CrudSection: React.FC<{
  title: string;
  collection: string;
  fields: { key: string; label: string; type: string }[];
  icon: React.ReactNode;
}> = ({ title, collection, fields, icon }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await FirestoreService.getCollection(collection);
      setItems(data);
    } catch (error) {
      console.error(`Error loading ${collection}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await FirestoreService.updateDocument(collection, editingId, {
          ...formData,
          updatedAt: new Date().toISOString()
        });
      } else {
        const id = Date.now().toString();
        await FirestoreService.setDocument(collection, id, {
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      loadItems();
      setShowForm(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      try {
        await FirestoreService.deleteDocument(collection, id);
        loadItems();
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setEditingId(item.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          {icon}
          {title}
        </h3>
        <button
          onClick={() => { setShowForm(true); setFormData({}); setEditingId(null); }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white text-sm font-medium hover:opacity-90"
        >
          <Plus size={18} />
          Ajouter
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
          >
            <h4 className="text-lg font-bold text-white mb-4">
              {editingId ? 'Modifier' : 'Ajouter'} {title.slice(0, -1)}
            </h4>
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm text-slate-400 mb-1">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-cyan-500"
                      rows={3}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-cyan-500"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-cyan-500"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowForm(false); setFormData({}); setEditingId(null); }}
                className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-medium"
              >
                {editingId ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Items List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Chargement...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Aucun élément</div>
        ) : (
          <div className="divide-y divide-slate-800">
            {items.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-800/30">
                <div>
                  <h4 className="text-white font-medium">{item.name || item.title || item.id}</h4>
                  <p className="text-sm text-slate-500">{item.description?.slice(0, 50) || '-'}...</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-cyan-400 text-sm"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 text-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


// Products Section
const ProductsSection: React.FC = () => (
  <CrudSection
    title="Produits"
    collection="products"
    fields={[
      { key: 'name', label: 'Nom du produit', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'price', label: 'Prix', type: 'number' },
      { key: 'category', label: 'Catégorie', type: 'text' },
      { key: 'stock', label: 'Stock', type: 'number' },
      { key: 'status', label: 'Statut', type: 'select' },
    ]}
    icon={<Package size={20} className="text-cyan-400" />}
  />
);

// Services Section
const ServicesSection: React.FC = () => (
  <CrudSection
    title="Services à la Demande"
    collection="services"
    fields={[
      { key: 'name', label: 'Nom du service', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'price', label: 'Prix', type: 'number' },
      { key: 'category', label: 'Catégorie', type: 'text' },
      { key: 'duration', label: 'Durée estimée', type: 'text' },
      { key: 'status', label: 'Statut', type: 'select' },
    ]}
    icon={<Wrench size={20} className="text-purple-400" />}
  />
);

// E-Services Section
const EServicesSection: React.FC = () => (
  <CrudSection
    title="E-Services"
    collection="eservices"
    fields={[
      { key: 'name', label: 'Nom du e-service', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'price', label: 'Prix', type: 'number' },
      { key: 'type', label: 'Type', type: 'text' },
      { key: 'status', label: 'Statut', type: 'select' },
    ]}
    icon={<Grid size={20} className="text-blue-400" />}
  />
);

// Market Section
const MarketSection: React.FC = () => (
  <CrudSection
    title="Market Hub"
    collection="market"
    fields={[
      { key: 'name', label: 'Nom', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'category', label: 'Catégorie', type: 'text' },
      { key: 'status', label: 'Statut', type: 'select' },
    ]}
    icon={<Store size={20} className="text-orange-400" />}
  />
);

// Orders Section
const OrdersSection: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await FirestoreService.getCollection('orders');
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await FirestoreService.updateDocument('orders', orderId, { status });
      loadOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <ShoppingCart size={20} className="text-emerald-400" />
        Gestion des Commandes
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">ID</th>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Client</th>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Montant</th>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Date</th>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Statut</th>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-slate-500">Chargement...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-slate-500">Aucune commande</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-t border-slate-800 hover:bg-slate-800/30">
                  <td className="p-4 text-white font-mono text-sm">#{order.id.slice(0, 8)}</td>
                  <td className="p-4 text-slate-400">{order.customerName || '-'}</td>
                  <td className="p-4 text-white font-medium">${order.total || 0}</td>
                  <td className="p-4 text-slate-400">{order.createdAt?.slice(0, 10) || '-'}</td>
                  <td className="p-4">
                    <select
                      value={order.status || 'pending'}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white"
                    >
                      <option value="pending">En attente</option>
                      <option value="processing">En cours</option>
                      <option value="shipped">Expédié</option>
                      <option value="delivered">Livré</option>
                      <option value="cancelled">Annulé</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-cyan-400 text-sm">
                      Détails
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Reservations Section
const ReservationsSection: React.FC = () => (
  <CrudSection
    title="Réservations"
    collection="reservations"
    fields={[
      { key: 'serviceName', label: 'Service', type: 'text' },
      { key: 'customerName', label: 'Client', type: 'text' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'time', label: 'Heure', type: 'time' },
      { key: 'status', label: 'Statut', type: 'select' },
    ]}
    icon={<Calendar size={20} className="text-pink-400" />}
  />
);

// Requests Section
const RequestsSection: React.FC = () => (
  <CrudSection
    title="Demandes"
    collection="requests"
    fields={[
      { key: 'type', label: 'Type de demande', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'customerName', label: 'Client', type: 'text' },
      { key: 'status', label: 'Statut', type: 'select' },
    ]}
    icon={<ClipboardList size={20} className="text-yellow-400" />}
  />
);

// Actors Section
const ActorsSection: React.FC = () => (
  <CrudSection
    title="Répertoire des Acteurs"
    collection="actors"
    fields={[
      { key: 'name', label: 'Nom', type: 'text' },
      { key: 'category', label: 'Catégorie', type: 'text' },
      { key: 'location', label: 'Localisation', type: 'text' },
      { key: 'phone', label: 'Téléphone', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'status', label: 'Statut', type: 'select' },
    ]}
    icon={<Briefcase size={20} className="text-indigo-400" />}
  />
);

// Hotels Section
const HotelsSection: React.FC = () => (
  <CrudSection
    title="Hôtels"
    collection="hotels"
    fields={[
      { key: 'name', label: 'Nom de l\'hôtel', type: 'text' },
      { key: 'location', label: 'Localisation', type: 'text' },
      { key: 'address', label: 'Adresse', type: 'text' },
      { key: 'pricePerNight', label: 'Prix/nuit', type: 'number' },
      { key: 'rating', label: 'Note (1-5)', type: 'number' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'status', label: 'Statut', type: 'select' },
    ]}
    icon={<Hotel size={20} className="text-teal-400" />}
  />
);

// Enterprises Section
const EnterprisesSection: React.FC = () => (
  <CrudSection
    title="Entreprises"
    collection="enterprises"
    fields={[
      { key: 'name', label: 'Nom de l\'entreprise', type: 'text' },
      { key: 'sector', label: 'Secteur d\'activité', type: 'text' },
      { key: 'location', label: 'Localisation', type: 'text' },
      { key: 'phone', label: 'Téléphone', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'status', label: 'Statut', type: 'select' },
    ]}
    icon={<Building2 size={20} className="text-rose-400" />}
  />
);


// Finance Section
const FinanceSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <CreditCard size={20} className="text-green-400" />
        Finance & Paiements
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Revenus du mois', value: '$12,450', change: '+18%', icon: DollarSign, color: 'from-emerald-500 to-teal-600' },
          { label: 'Transactions', value: '234', change: '+12%', icon: Activity, color: 'from-blue-500 to-indigo-600' },
          { label: 'En attente', value: '$2,340', change: '-5%', icon: Clock, color: 'from-orange-500 to-red-600' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon size={24} className="text-white" />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-slate-500 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h4 className="text-white font-bold mb-4">Transactions Récentes</h4>
        <div className="space-y-3">
          {[
            { id: 'TXN001', type: 'Paiement', amount: '+$150', status: 'completed', date: '2024-01-05' },
            { id: 'TXN002', type: 'Remboursement', amount: '-$45', status: 'pending', date: '2024-01-04' },
            { id: 'TXN003', type: 'Paiement', amount: '+$320', status: 'completed', date: '2024-01-04' },
            { id: 'TXN004', type: 'Paiement', amount: '+$89', status: 'completed', date: '2024-01-03' },
          ].map((txn, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  txn.amount.startsWith('+') ? 'bg-emerald-500/10' : 'bg-red-500/10'
                }`}>
                  <DollarSign size={18} className={txn.amount.startsWith('+') ? 'text-emerald-400' : 'text-red-400'} />
                </div>
                <div>
                  <p className="text-white font-medium">{txn.type}</p>
                  <p className="text-xs text-slate-500">{txn.id} • {txn.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${txn.amount.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{txn.amount}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  txn.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'
                }`}>
                  {txn.status === 'completed' ? 'Complété' : 'En attente'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Messages Section
const MessagesSection: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await FirestoreService.getCollection('messages');
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <MessageCircle size={20} className="text-blue-400" />
        Messagerie
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm outline-none"
            />
          </div>
          <div className="divide-y divide-slate-800 max-h-96 overflow-y-auto">
            {[
              { name: 'Jean Dupont', message: 'Bonjour, j\'ai une question...', time: '10:30', unread: 2 },
              { name: 'Marie Claire', message: 'Merci pour votre réponse', time: '09:15', unread: 0 },
              { name: 'Paul Martin', message: 'Le service est excellent !', time: 'Hier', unread: 0 },
            ].map((conv, i) => (
              <div key={i} className="p-4 hover:bg-slate-800/50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white font-medium">{conv.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="text-white font-medium truncate">{conv.name}</h4>
                      <span className="text-xs text-slate-500">{conv.time}</span>
                    </div>
                    <p className="text-sm text-slate-500 truncate">{conv.message}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-cyan-500 text-white text-xs flex items-center justify-center">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-medium">J</span>
            </div>
            <div>
              <h4 className="text-white font-medium">Jean Dupont</h4>
              <p className="text-xs text-emerald-400">En ligne</p>
            </div>
          </div>
          <div className="flex-1 p-4 space-y-4 min-h-64">
            <div className="flex justify-start">
              <div className="bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-2 max-w-xs">
                <p className="text-white text-sm">Bonjour, j'ai une question concernant ma commande</p>
                <span className="text-xs text-slate-500">10:30</span>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl rounded-br-sm px-4 py-2 max-w-xs">
                <p className="text-white text-sm">Bonjour ! Bien sûr, je suis là pour vous aider.</p>
                <span className="text-xs text-cyan-100">10:32</span>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-slate-800">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Écrivez votre message..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-medium">
                Envoyer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings Section
const SettingsSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <Settings size={20} className="text-slate-400" />
        Paramètres de l'Application
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h4 className="text-white font-bold mb-4">Paramètres Généraux</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Nom de l'application</label>
              <input
                type="text"
                defaultValue="PADEC Connect"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Email de contact</label>
              <input
                type="email"
                defaultValue="contact@padec-connect.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Téléphone</label>
              <input
                type="tel"
                defaultValue="+243 XXX XXX XXX"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h4 className="text-white font-bold mb-4">Notifications</h4>
          <div className="space-y-4">
            {[
              { label: 'Nouvelles commandes', enabled: true },
              { label: 'Nouveaux utilisateurs', enabled: true },
              { label: 'Demandes de service', enabled: false },
              { label: 'Messages clients', enabled: true },
            ].map((notif, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                <span className="text-slate-300">{notif.label}</span>
                <button className={`w-12 h-6 rounded-full transition-colors ${
                  notif.enabled ? 'bg-cyan-500' : 'bg-slate-700'
                }`}>
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    notif.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}></div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h4 className="text-white font-bold mb-4">Sécurité</h4>
          <div className="space-y-4">
            <button className="w-full p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-left text-slate-300 flex items-center justify-between">
              <span>Changer le mot de passe</span>
              <ChevronRight size={18} className="text-slate-500" />
            </button>
            <button className="w-full p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-left text-slate-300 flex items-center justify-between">
              <span>Authentification à deux facteurs</span>
              <ChevronRight size={18} className="text-slate-500" />
            </button>
            <button className="w-full p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-left text-slate-300 flex items-center justify-between">
              <span>Sessions actives</span>
              <ChevronRight size={18} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-6">
          <h4 className="text-red-400 font-bold mb-4">Zone Dangereuse</h4>
          <div className="space-y-4">
            <button className="w-full p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-400 flex items-center justify-between">
              <span>Réinitialiser les données</span>
              <ChevronRight size={18} />
            </button>
            <button className="w-full p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-400 flex items-center justify-between">
              <span>Supprimer toutes les données</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-medium">
          Sauvegarder les modifications
        </button>
      </div>
    </div>
  );
};
