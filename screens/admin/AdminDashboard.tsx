import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, Wrench, Grid, Building2,
  Hotel, MessageCircle, Settings, Package, Calendar, Bell, Search, Menu, X,
  UserPlus, Briefcase, Heart,
  ShoppingCart, ClipboardList, LogOut, Home, Clock, MapPin, Star,
  Wifi, Coffee, Bed, Bath, Square, Phone,
  Music, GraduationCap, Ticket, Plus, Edit, Trash2, Save, Eye, CreditCard,
  TrendingUp, DollarSign, CheckCircle, XCircle, AlertCircle, Image, Upload
} from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { useAuthContext } from '../../context/AuthContext';
import { FirestoreService } from '../../services/FirestoreService';
import { StorageService } from '../../services/StorageService';
import { auth } from '../../config/firebase';

// ============ INTERFACES ============
interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalServices: number;
  totalOrders: number;
  totalRevenue: number;
  pendingRequests: number;
}

// Product - exactement comme MarketScreen (1 image)
interface AdminProduct {
  id?: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'mode' | 'vetements' | 'chaussures' | 'parfums' | 'esthetique' | 'bricolage' | 'agriculture' | 'tech' | 'maison' | 'montres' | 'cadeaux';
  inStock: boolean;
  rating: number;
  image?: string; // 1 image principale
}

// Service - exactement comme ServicesScreen (1 image)
interface AdminService {
  id?: string;
  title: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  location: string;
  rating: number;
  image?: string; // 1 image
}

// Workspace - exactement comme CoworkingScreen (plusieurs images)
interface AdminWorkspace {
  id?: string;
  name: string;
  type: 'coworking' | 'private-office' | 'meeting-room';
  description: string;
  address: string;
  pricePerHour?: number;
  pricePerDay: number;
  pricePerMonth?: number;
  capacity: number;
  rating: number;
  amenities: string[];
  available: boolean;
  openHours: string;
  images: string[]; // Plusieurs photos de l'espace
}

// Health - exactement comme HealthScreen (1 image)
interface AdminHealth {
  id?: string;
  name: string;
  type: 'hospital' | 'doctor' | 'nurse' | 'advisor' | 'ambulance';
  specialty?: string;
  address: string;
  distance?: string;
  rating: number;
  available: boolean;
  phone: string;
  openHours: string;
  price?: number;
  description: string;
  image?: string; // 1 image (photo médecin, logo hôpital, etc.)
}

// Housing - exactement comme HousingScreen (plusieurs images pour immobilier)
interface AdminHousing {
  id?: string;
  title: string;
  type: 'hotel' | 'apartment' | 'house' | 'land';
  category: 'hotel' | 'rental' | 'sale';
  price: number;
  priceUnit: string;
  location: string;
  city: string;
  province: string;
  bedrooms?: number;
  bathrooms?: number;
  surface?: number;
  rating?: number;
  amenities: string[];
  available: boolean;
  featured: boolean;
  description: string;
  images: string[]; // Plusieurs photos (immobilier nécessite plusieurs photos)
}

// Event - exactement comme EventsScreen (1 image affiche + galerie optionnelle)
interface AdminEvent {
  id?: string;
  name: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  address: string;
  price: number;
  vipPrice?: number;
  availableTickets: number;
  totalTickets: number;
  organizer: string;
  rating: number;
  featured: boolean;
  image?: string; // Affiche principale
  images?: string[]; // Galerie optionnelle
}

// Actor - exactement comme RepertoireScreen (1 logo/photo)
interface AdminActor {
  id?: string;
  name: string;
  category: string;
  location: string;
  verified: boolean;
  description: string;
  services: string[];
  rating: number;
  image?: string; // Logo ou photo de l'entreprise/personne
}

// User
interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: 'client' | 'adm';
  profileComplete: boolean;
  createdAt?: string;
}

const productCategories = ['mode', 'vetements', 'chaussures', 'parfums', 'esthetique', 'bricolage', 'agriculture', 'tech', 'maison', 'montres', 'cadeaux'];
const serviceCategories = ['Administratif', 'Voyage', 'Entrepreneuriat', 'Réseau', 'Formation', 'Immobilier'];
const workspaceTypes = ['coworking', 'private-office', 'meeting-room'];
const healthTypes = ['hospital', 'doctor', 'nurse', 'advisor', 'ambulance'];

// ============ IMAGE UPLOAD COMPONENT ============
interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  folder: string;
}

const SingleImageUpload: React.FC<ImageUploadProps> = ({ label, value, onChange, folder }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      // Générer un chemin unique pour le fichier
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`;
      const filePath = `${folder}/${fileName}`;
      const url = await StorageService.uploadFile(filePath, file);
      onChange(url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erreur lors de l\'upload: ' + (error as Error).message);
    }
    setUploading(false);
  };

  return (
    <div>
      <label className="text-slate-400 text-sm">{label}</label>
      <div className="mt-1 flex items-center gap-3">
        {value ? (
          <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-700">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button onClick={() => onChange('')} className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">×</button>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500 transition-colors"
          >
            {uploading ? (
              <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Upload size={20} className="text-slate-500" />
                <span className="text-slate-500 text-xs mt-1">Photo</span>
              </>
            )}
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </div>
    </div>
  );
};

interface MultiImageUploadProps {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
  folder: string;
  maxImages?: number;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({ label, values, onChange, folder, maxImages = 10 }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      // Générer un chemin unique pour le fichier
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`;
      const filePath = `${folder}/${fileName}`;
      const url = await StorageService.uploadFile(filePath, file);
      onChange([...values, url]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erreur lors de l\'upload: ' + (error as Error).message);
    }
    setUploading(false);
  };

  const removeImage = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="text-slate-400 text-sm">{label} ({values.length}/{maxImages})</label>
      <div className="mt-1 flex flex-wrap gap-2">
        {values.map((url, i) => (
          <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-700">
            <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
            <button onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">×</button>
          </div>
        ))}
        {values.length < maxImages && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500 transition-colors"
          >
            {uploading ? (
              <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Plus size={18} className="text-slate-500" />
            )}
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </div>
    </div>
  );
};
const housingTypes = ['hotel', 'apartment', 'house', 'land'];
const housingCategories = ['hotel', 'rental', 'sale'];
const eventCategories = ['music', 'business', 'education', 'culture', 'party'];
const provinces = ['Kinshasa', 'Haut-Katanga', 'Nord-Kivu', 'Sud-Kivu', 'Kongo-Central'];

// ============ MAIN COMPONENT ============
export const AdminDashboard: React.FC = () => {
  const { navigate } = useNavigation();
  const { user, userProfile } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0, totalProducts: 0, totalServices: 0, totalOrders: 0, totalRevenue: 0, pendingRequests: 0
  });

  const handleLogout = async () => {
    await auth.signOut();
    navigate('auth');
  };

  useEffect(() => {
    // Load stats
    const loadStats = async () => {
      try {
        const users = await FirestoreService.getCollection('users');
        const products = await FirestoreService.getCollection('products');
        const services = await FirestoreService.getCollection('services');
        const orders = await FirestoreService.getCollection('orders');
        setStats({
          totalUsers: users.length,
          totalProducts: products.length,
          totalServices: services.length,
          totalOrders: orders.length,
          totalRevenue: orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0),
          pendingRequests: orders.filter((o: any) => o.status === 'pending').length
        });
      } catch (e) { console.log('Stats loading error', e); }
    };
    loadStats();
  }, [activeSection]);

  const menuItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'products', label: 'Produits (Market)', icon: Package },
    { id: 'services', label: 'Services à la Demande', icon: Wrench },
    { id: 'eservices', label: 'E-Services', icon: Grid },
    { id: 'coworking', label: 'Espaces de Travail', icon: Building2 },
    { id: 'health', label: 'Santé & Médecine', icon: Heart },
    { id: 'housing', label: 'Hébergement', icon: Hotel },
    { id: 'events', label: 'Événements', icon: Calendar },
    { id: 'actors', label: 'Répertoire Acteurs', icon: Briefcase },
    { id: 'orders', label: 'Commandes', icon: ShoppingCart },
    { id: 'reservations', label: 'Réservations', icon: ClipboardList },
    { id: 'finance', label: 'Finance', icon: CreditCard },
    { id: 'messages', label: 'Messagerie', icon: MessageCircle },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const quickActions = [
    { label: 'Ajouter Produit', icon: Package, color: 'from-purple-500 to-pink-600', action: () => setActiveSection('products') },
    { label: 'Ajouter Service', icon: Wrench, color: 'from-cyan-500 to-blue-600', action: () => setActiveSection('services') },
    { label: 'Ajouter Hôtel', icon: Hotel, color: 'from-amber-500 to-orange-600', action: () => setActiveSection('housing') },
    { label: 'Ajouter Événement', icon: Calendar, color: 'from-pink-500 to-rose-600', action: () => setActiveSection('events') },
    { label: 'Ajouter Espace', icon: Building2, color: 'from-blue-500 to-indigo-600', action: () => setActiveSection('coworking') },
    { label: 'Ajouter Acteur', icon: UserPlus, color: 'from-emerald-500 to-teal-600', action: () => setActiveSection('actors') },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className={`fixed lg:relative z-50 h-screen w-72 bg-slate-900 border-r border-slate-800 flex flex-col`}
      >
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <LayoutDashboard size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">PADEC Admin</h1>
              <p className="text-xs text-slate-500">Tableau de bord</p>
            </div>
          </div>
        </div>

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
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center overflow-hidden">
              {userProfile?.profilePictureUrl ? (
                <img src={userProfile.profilePictureUrl} alt="Admin" className="w-full h-full object-cover" />
              ) : (
                <Users size={18} className="text-white" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{user?.displayName || 'Admin'}</p>
              <p className="text-xs text-slate-500">Administrateur</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('home')} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 text-sm transition-colors">
              <Home size={16} /> App
            </button>
            <button onClick={handleLogout} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 text-sm transition-colors">
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400">
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div>
                <h2 className="text-xl font-bold text-white">{menuItems.find(m => m.id === activeSection)?.label || 'Vue d\'ensemble'}</h2>
                <p className="text-sm text-slate-500">Gestion complète de l'application</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="text" placeholder="Rechercher..." className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-cyan-500 w-64" />
              </div>
              <button className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {activeSection === 'overview' && <OverviewSection stats={stats} quickActions={quickActions} />}
          {activeSection === 'users' && <UsersSection />}
          {activeSection === 'products' && <ProductsSection />}
          {activeSection === 'services' && <ServicesSection />}
          {activeSection === 'eservices' && <EServicesSection />}
          {activeSection === 'coworking' && <CoworkingSection />}
          {activeSection === 'health' && <HealthSection />}
          {activeSection === 'housing' && <HousingSection />}
          {activeSection === 'events' && <EventsSection />}
          {activeSection === 'actors' && <ActorsSection />}
          {activeSection === 'orders' && <OrdersSection />}
          {activeSection === 'reservations' && <ReservationsSection />}
          {activeSection === 'finance' && <FinanceSection />}
          {activeSection === 'messages' && <MessagesSection />}
          {activeSection === 'settings' && <SettingsSection />}
        </div>
      </main>
    </div>
  );
};

// ============ OVERVIEW SECTION ============
const OverviewSection: React.FC<{ stats: DashboardStats; quickActions: any[] }> = ({ stats, quickActions }) => {
  const statCards = [
    { label: 'Utilisateurs', value: stats.totalUsers, icon: Users, color: 'cyan' },
    { label: 'Produits', value: stats.totalProducts, icon: Package, color: 'purple' },
    { label: 'Services', value: stats.totalServices, icon: Wrench, color: 'blue' },
    { label: 'Commandes', value: stats.totalOrders, icon: ShoppingCart, color: 'green' },
    { label: 'Revenus', value: `${(stats.totalRevenue / 1000).toFixed(0)}k FC`, icon: DollarSign, color: 'amber' },
    { label: 'En attente', value: stats.pendingRequests, icon: AlertCircle, color: 'red' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`bg-slate-900/40 border border-slate-800 rounded-xl p-4`}>
              <Icon size={24} className={`text-${stat.color}-400 mb-2`} />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-slate-400 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-white font-bold mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <button key={i} onClick={action.action} className={`bg-gradient-to-br ${action.color} p-4 rounded-xl text-white text-center hover:opacity-90 transition-opacity`}>
                <Icon size={24} className="mx-auto mb-2" />
                <p className="text-sm font-medium">{action.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
        <h3 className="text-white font-bold mb-4">Activité Récente</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <TrendingUp size={18} className="text-cyan-400" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">Nouvelle commande #{1000 + i}</p>
                <p className="text-slate-500 text-xs">Il y a {i * 5} minutes</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============ USERS SECTION ============
const UsersSection: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await FirestoreService.getCollection('users');
      setUsers(data as AdminUser[]);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const updateUserRole = async (userId: string, role: 'client' | 'adm') => {
    try {
      await FirestoreService.setDocument('users', userId, { role }, true);
      loadUsers();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-bold">Gestion des Utilisateurs</h3>
        <p className="text-slate-400 text-sm">{users.length} utilisateurs</p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-400">Chargement...</div>
      ) : (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="text-left p-4 text-slate-400 text-sm font-medium">Utilisateur</th>
                <th className="text-left p-4 text-slate-400 text-sm font-medium">Email</th>
                <th className="text-left p-4 text-slate-400 text-sm font-medium">Rôle</th>
                <th className="text-left p-4 text-slate-400 text-sm font-medium">Profil</th>
                <th className="text-left p-4 text-slate-400 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-t border-slate-800">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <Users size={18} className="text-cyan-400" />
                      </div>
                      <span className="text-white">{user.displayName || 'Sans nom'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-400">{user.email}</td>
                  <td className="p-4">
                    <select
                      value={user.role || 'client'}
                      onChange={(e) => updateUserRole(user.id, e.target.value as 'client' | 'adm')}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-white text-sm"
                    >
                      <option value="client">Client</option>
                      <option value="adm">Admin</option>
                    </select>
                  </td>
                  <td className="p-4">
                    {user.profileComplete ? (
                      <span className="text-emerald-400 flex items-center gap-1"><CheckCircle size={16} /> Complet</span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1"><AlertCircle size={16} /> Incomplet</span>
                    )}
                  </td>
                  <td className="p-4">
                    <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};


// ============ PRODUCTS SECTION (Market) ============
const ProductsSection: React.FC = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [formData, setFormData] = useState<AdminProduct>({
    name: '', description: '', price: 0, originalPrice: undefined, category: 'mode', inStock: true, rating: 4.5, image: ''
  });

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    try {
      const data = await FirestoreService.getCollection('products');
      setProducts(data as AdminProduct[]);
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async () => {
    try {
      if (editingProduct?.id) {
        await FirestoreService.setDocument('products', editingProduct.id, formData, true);
      } else {
        await FirestoreService.addDocument('products', formData);
      }
      setShowForm(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: 0, category: 'mode', inStock: true, rating: 4.5, image: '' });
      loadProducts();
    } catch (e) { console.error(e); }
  };

  const handleEdit = (product: AdminProduct) => {
    setEditingProduct(product);
    setFormData(product);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer ce produit ?')) {
      await FirestoreService.deleteDocument('products', id);
      loadProducts();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-bold">Produits Market Hub</h3>
        <button onClick={() => { setShowForm(true); setEditingProduct(null); setFormData({ name: '', description: '', price: 0, category: 'mode', inStock: true, rating: 4.5, image: '' }); }} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white text-sm font-medium">
          <Plus size={18} /> Ajouter Produit
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-white font-bold text-lg mb-4">{editingProduct ? 'Modifier' : 'Ajouter'} un Produit</h3>
            <div className="space-y-4">
              {/* Image du produit */}
              <SingleImageUpload 
                label="Photo du produit" 
                value={formData.image} 
                onChange={(url) => setFormData({...formData, image: url})} 
                folder="products" 
              />
              <div>
                <label className="text-slate-400 text-sm">Nom *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
              </div>
              <div>
                <label className="text-slate-400 text-sm">Description *</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Prix (FC) *</label>
                  <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Prix Original (FC)</label>
                  <input type="number" value={formData.originalPrice || ''} onChange={e => setFormData({...formData, originalPrice: e.target.value ? Number(e.target.value) : undefined})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm">Catégorie *</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white">
                  {productCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">En Stock</label>
                  <select value={formData.inStock ? 'true' : 'false'} onChange={e => setFormData({...formData, inStock: e.target.value === 'true'})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white">
                    <option value="true">Oui</option>
                    <option value="false">Non</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Note (0-5)</label>
                  <input type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: Number(e.target.value)})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 bg-slate-800 rounded-xl text-slate-400">Annuler</button>
              <button onClick={handleSubmit} className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium flex items-center justify-center gap-2">
                <Save size={18} /> Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Package size={24} className="text-purple-400" />
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(product)} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400"><Edit size={16} /></button>
                <button onClick={() => handleDelete(product.id!)} className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-red-400"><Trash2 size={16} /></button>
              </div>
            </div>
            <h4 className="text-white font-bold mb-1">{product.name}</h4>
            <p className="text-slate-400 text-sm mb-2 line-clamp-2">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-purple-400 font-bold">{product.price.toLocaleString()} FC</span>
              <span className={`text-xs px-2 py-1 rounded-full ${product.inStock ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {product.inStock ? 'En stock' : 'Rupture'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============ SERVICES SECTION ============
const ServicesSection: React.FC = () => {
  const [services, setServices] = useState<AdminService[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<AdminService | null>(null);
  const [formData, setFormData] = useState<AdminService>({
    title: '', description: '', category: 'Administratif', price: 0, duration: '', location: '', rating: 4.5, image: ''
  });

  useEffect(() => { loadServices(); }, []);

  const loadServices = async () => {
    try {
      const data = await FirestoreService.getCollection('services');
      setServices(data as AdminService[]);
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async () => {
    try {
      if (editingService?.id) {
        await FirestoreService.setDocument('services', editingService.id, formData, true);
      } else {
        await FirestoreService.addDocument('services', formData);
      }
      setShowForm(false);
      setEditingService(null);
      setFormData({ title: '', description: '', category: 'Administratif', price: 0, duration: '', location: '', rating: 4.5, image: '' });
      loadServices();
    } catch (e) { console.error(e); }
  };

  const handleEdit = (service: AdminService) => {
    setEditingService(service);
    setFormData(service);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer ce service ?')) {
      await FirestoreService.deleteDocument('services', id);
      loadServices();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-bold">Services à la Demande</h3>
        <button onClick={() => { setShowForm(true); setEditingService(null); setFormData({ title: '', description: '', category: 'Administratif', price: 0, duration: '', location: '', rating: 4.5, image: '' }); }} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white text-sm font-medium">
          <Plus size={18} /> Ajouter Service
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-white font-bold text-lg mb-4">{editingService ? 'Modifier' : 'Ajouter'} un Service</h3>
            <div className="space-y-4">
              {/* Image du service */}
              <SingleImageUpload 
                label="Image du service" 
                value={formData.image} 
                onChange={(url) => setFormData({...formData, image: url})} 
                folder="services" 
              />
              <div>
                <label className="text-slate-400 text-sm">Titre *</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
              </div>
              <div>
                <label className="text-slate-400 text-sm">Description *</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" rows={3} />
              </div>
              <div>
                <label className="text-slate-400 text-sm">Catégorie *</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white">
                  {serviceCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Prix (FC)</label>
                  <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Durée</label>
                  <input type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="Ex: 2-5 jours" className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Localisation</label>
                  <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Note (0-5)</label>
                  <input type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: Number(e.target.value)})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 bg-slate-800 rounded-xl text-slate-400">Annuler</button>
              <button onClick={handleSubmit} className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white font-medium flex items-center justify-center gap-2">
                <Save size={18} /> Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map(service => (
          <div key={service.id} className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Wrench size={24} className="text-cyan-400" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(service)} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400"><Edit size={16} /></button>
                <button onClick={() => handleDelete(service.id!)} className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-red-400"><Trash2 size={16} /></button>
              </div>
            </div>
            <h4 className="text-white font-bold mb-1">{service.title}</h4>
            <p className="text-slate-400 text-sm mb-2 line-clamp-2">{service.description}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <span>{service.category}</span>
              {service.location && <><span>•</span><span>{service.location}</span></>}
              {service.duration && <><span>•</span><span>{service.duration}</span></>}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-cyan-400 font-bold">{service.price?.toLocaleString()} FC</span>
              <span className="text-yellow-400 text-sm">★ {service.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// ============ E-SERVICES SECTION ============
const EServicesSection: React.FC = () => {
  const eserviceScreens = ['coworking', 'health', 'visa', 'family-help', 'events', 'housing'];
  
  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold">E-Services</h3>
      <p className="text-slate-400 text-sm">Les E-Services sont gérés dans leurs sections respectives :</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { name: 'Espaces de Travail', icon: Building2, color: 'blue', section: 'coworking' },
          { name: 'Santé & Médecine', icon: Heart, color: 'red', section: 'health' },
          { name: 'Hébergement', icon: Hotel, color: 'amber', section: 'housing' },
          { name: 'Événements', icon: Calendar, color: 'pink', section: 'events' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className={`bg-slate-900/40 border border-slate-800 rounded-xl p-4 text-center`}>
              <Icon size={32} className={`text-${item.color}-400 mx-auto mb-2`} />
              <p className="text-white font-medium">{item.name}</p>
              <p className="text-slate-500 text-xs">Section: {item.section}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============ COWORKING SECTION ============
const CoworkingSection: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<AdminWorkspace[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<AdminWorkspace | null>(null);
  const [formData, setFormData] = useState<AdminWorkspace>({
    name: '', type: 'coworking', description: '', address: '', pricePerDay: 0, capacity: 10, rating: 4.5, amenities: [], available: true, openHours: '8h - 20h', images: []
  });
  const [amenityInput, setAmenityInput] = useState('');

  useEffect(() => { loadWorkspaces(); }, []);

  const loadWorkspaces = async () => {
    try {
      const data = await FirestoreService.getCollection('workspaces');
      setWorkspaces(data as AdminWorkspace[]);
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async () => {
    try {
      if (editingWorkspace?.id) {
        await FirestoreService.setDocument('workspaces', editingWorkspace.id, formData, true);
      } else {
        await FirestoreService.addDocument('workspaces', formData);
      }
      setShowForm(false);
      setEditingWorkspace(null);
      setFormData({ name: '', type: 'coworking', description: '', address: '', pricePerDay: 0, capacity: 10, rating: 4.5, amenities: [], available: true, openHours: '8h - 20h', images: [] });
      loadWorkspaces();
    } catch (e) { console.error(e); }
  };

  const handleEdit = (workspace: AdminWorkspace) => {
    setEditingWorkspace(workspace);
    setFormData({...workspace, images: workspace.images || []});
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cet espace ?')) {
      await FirestoreService.deleteDocument('workspaces', id);
      loadWorkspaces();
    }
  };

  const addAmenity = () => {
    if (amenityInput.trim()) {
      setFormData({...formData, amenities: [...formData.amenities, amenityInput.trim()]});
      setAmenityInput('');
    }
  };

  const removeAmenity = (index: number) => {
    setFormData({...formData, amenities: formData.amenities.filter((_, i) => i !== index)});
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-bold">Espaces de Travail</h3>
        <button onClick={() => { setShowForm(true); setEditingWorkspace(null); setFormData({ name: '', type: 'coworking', description: '', address: '', pricePerDay: 0, capacity: 10, rating: 4.5, amenities: [], available: true, openHours: '8h - 20h', images: [] }); }} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white text-sm font-medium">
          <Plus size={18} /> Ajouter Espace
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-white font-bold text-lg mb-4">{editingWorkspace ? 'Modifier' : 'Ajouter'} un Espace</h3>
            <div className="space-y-4">
              {/* Photos de l'espace (plusieurs) */}
              <MultiImageUpload 
                label="Photos de l'espace" 
                values={formData.images} 
                onChange={(urls) => setFormData({...formData, images: urls})} 
                folder="workspaces" 
                maxImages={8}
              />
              <div>
                <label className="text-slate-400 text-sm">Nom *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
              </div>
              <div>
                <label className="text-slate-400 text-sm">Type *</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white">
                  <option value="coworking">Co-working</option>
                  <option value="private-office">Bureau Privé</option>
                  <option value="meeting-room">Salle de Réunion</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-sm">Description *</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" rows={3} />
              </div>
              <div>
                <label className="text-slate-400 text-sm">Adresse *</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Prix/Heure (FC)</label>
                  <input type="number" value={formData.pricePerHour || ''} onChange={e => setFormData({...formData, pricePerHour: e.target.value ? Number(e.target.value) : undefined})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Prix/Jour (FC) *</label>
                  <input type="number" value={formData.pricePerDay} onChange={e => setFormData({...formData, pricePerDay: Number(e.target.value)})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Prix/Mois (FC)</label>
                  <input type="number" value={formData.pricePerMonth || ''} onChange={e => setFormData({...formData, pricePerMonth: e.target.value ? Number(e.target.value) : undefined})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Capacité *</label>
                  <input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Horaires</label>
                  <input type="text" value={formData.openHours} onChange={e => setFormData({...formData, openHours: e.target.value})} placeholder="Ex: 8h - 20h" className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Disponible</label>
                  <select value={formData.available ? 'true' : 'false'} onChange={e => setFormData({...formData, available: e.target.value === 'true'})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white">
                    <option value="true">Oui</option>
                    <option value="false">Non</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Note (0-5)</label>
                  <input type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: Number(e.target.value)})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm">Équipements</label>
                <div className="flex gap-2 mt-1">
                  <input type="text" value={amenityInput} onChange={e => setAmenityInput(e.target.value)} placeholder="Ex: Wifi, Café..." className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                  <button onClick={addAmenity} className="px-4 py-2 bg-blue-500 rounded-xl text-white">+</button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.amenities.map((a, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm flex items-center gap-1">
                      {a} <button onClick={() => removeAmenity(i)} className="text-red-400">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 bg-slate-800 rounded-xl text-slate-400">Annuler</button>
              <button onClick={handleSubmit} className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white font-medium flex items-center justify-center gap-2">
                <Save size={18} /> Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workspaces.map(workspace => (
          <div key={workspace.id} className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Building2 size={24} className="text-blue-400" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(workspace)} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400"><Edit size={16} /></button>
                <button onClick={() => handleDelete(workspace.id!)} className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-red-400"><Trash2 size={16} /></button>
              </div>
            </div>
            <h4 className="text-white font-bold mb-1">{workspace.name}</h4>
            <p className="text-slate-400 text-sm mb-2">{workspace.type} • {workspace.capacity} pers.</p>
            <p className="text-slate-500 text-xs mb-2 flex items-center gap-1"><MapPin size={12} /> {workspace.address}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {workspace.amenities.slice(0, 3).map((a, i) => (
                <span key={i} className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">{a}</span>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-400 font-bold">{workspace.pricePerDay.toLocaleString()} FC/jour</span>
              <span className={`text-xs px-2 py-1 rounded-full ${workspace.available ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {workspace.available ? 'Dispo' : 'Complet'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// ============ HEALTH SECTION ============
const HealthSection: React.FC = () => {
  const [healthServices, setHealthServices] = useState<AdminHealth[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHealth, setEditingHealth] = useState<AdminHealth | null>(null);
  const [formData, setFormData] = useState<AdminHealth>({
    name: '', type: 'hospital', specialty: '', address: '', rating: 4.5, available: true, phone: '', openHours: '8h - 18h', price: undefined, description: '', image: ''
  });

  useEffect(() => { loadHealthServices(); }, []);

  const loadHealthServices = async () => {
    try {
      const data = await FirestoreService.getCollection('health');
      setHealthServices(data as AdminHealth[]);
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async () => {
    try {
      if (editingHealth?.id) {
        await FirestoreService.setDocument('health', editingHealth.id, formData, true);
      } else {
        await FirestoreService.addDocument('health', formData);
      }
      setShowForm(false);
      setEditingHealth(null);
      setFormData({ name: '', type: 'hospital', specialty: '', address: '', rating: 4.5, available: true, phone: '', openHours: '8h - 18h', price: undefined, description: '', image: '' });
      loadHealthServices();
    } catch (e) { console.error(e); }
  };

  const handleEdit = (health: AdminHealth) => {
    setEditingHealth(health);
    setFormData(health);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer ce service de santé ?')) {
      await FirestoreService.deleteDocument('health', id);
      loadHealthServices();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-bold">Santé & Médecine</h3>
        <button onClick={() => { setShowForm(true); setEditingHealth(null); setFormData({ name: '', type: 'hospital', specialty: '', address: '', rating: 4.5, available: true, phone: '', openHours: '8h - 18h', price: undefined, description: '', image: '' }); }} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white text-sm font-medium">
          <Plus size={18} /> Ajouter Service Santé
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-white font-bold text-lg mb-4">{editingHealth ? 'Modifier' : 'Ajouter'} un Service Santé</h3>
            <div className="space-y-4">
              {/* Photo (logo hôpital, photo médecin, etc.) */}
              <SingleImageUpload 
                label="Photo / Logo" 
                value={formData.image} 
                onChange={(url) => setFormData({...formData, image: url})} 
                folder="health" 
              />
              <div>
                <label className="text-slate-400 text-sm">Nom *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
              </div>
              <div>
                <label className="text-slate-400 text-sm">Type *</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white">
                  <option value="hospital">Hôpital</option>
                  <option value="doctor">Médecin</option>
                  <option value="nurse">Infirmier</option>
                  <option value="advisor">Conseiller</option>
                  <option value="ambulance">Ambulance</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-sm">Spécialité</label>
                <input type="text" value={formData.specialty || ''} onChange={e => setFormData({...formData, specialty: e.target.value})} placeholder="Ex: Cardiologie, Pédiatrie..." className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
              </div>
              <div>
                <label className="text-slate-400 text-sm">Description *</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" rows={3} />
              </div>
              <div>
                <label className="text-slate-400 text-sm">Adresse *</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Téléphone *</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+243 XX XXX XXXX" className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Horaires</label>
                  <input type="text" value={formData.openHours} onChange={e => setFormData({...formData, openHours: e.target.value})} placeholder="Ex: 8h - 18h" className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Prix (FC)</label>
                  <input type="number" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value ? Number(e.target.value) : undefined})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Distance</label>
                  <input type="text" value={formData.distance || ''} onChange={e => setFormData({...formData, distance: e.target.value})} placeholder="Ex: 2.5 km" className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Disponible</label>
                  <select value={formData.available ? 'true' : 'false'} onChange={e => setFormData({...formData, available: e.target.value === 'true'})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white">
                    <option value="true">Oui</option>
                    <option value="false">Non</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Note (0-5)</label>
                  <input type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: Number(e.target.value)})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 bg-slate-800 rounded-xl text-slate-400">Annuler</button>
              <button onClick={handleSubmit} className="flex-1 py-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white font-medium flex items-center justify-center gap-2">
                <Save size={18} /> Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {healthServices.map(health => (
          <div key={health.id} className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <Heart size={24} className="text-red-400" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(health)} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400"><Edit size={16} /></button>
                <button onClick={() => handleDelete(health.id!)} className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-red-400"><Trash2 size={16} /></button>
              </div>
            </div>
            <h4 className="text-white font-bold mb-1">{health.name}</h4>
            <p className="text-slate-400 text-sm mb-1">{health.type} {health.specialty && `• ${health.specialty}`}</p>
            <p className="text-slate-500 text-xs mb-2 flex items-center gap-1"><Phone size={12} /> {health.phone}</p>
            <div className="flex justify-between items-center">
              {health.price ? <span className="text-red-400 font-bold">{health.price.toLocaleString()} FC</span> : <span className="text-slate-500">-</span>}
              <span className={`text-xs px-2 py-1 rounded-full ${health.available ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {health.available ? 'Dispo' : 'Indispo'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// ============ HOUSING SECTION ============
const HousingSection: React.FC = () => {
  const [listings, setListings] = useState<AdminHousing[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingListing, setEditingListing] = useState<AdminHousing | null>(null);
  const [formData, setFormData] = useState<AdminHousing>({
    title: '', type: 'hotel', category: 'hotel', price: 0, priceUnit: '/nuit', location: '', city: '', province: 'Kinshasa', bedrooms: 1, bathrooms: 1, surface: undefined, rating: 4.5, amenities: [], available: true, featured: false, description: '', images: []
  });
  const [amenityInput, setAmenityInput] = useState('');

  useEffect(() => { loadListings(); }, []);

  const loadListings = async () => {
    try {
      const data = await FirestoreService.getCollection('housing');
      setListings(data as AdminHousing[]);
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async () => {
    try {
      if (editingListing?.id) {
        await FirestoreService.setDocument('housing', editingListing.id, formData, true);
      } else {
        await FirestoreService.addDocument('housing', formData);
      }
      setShowForm(false);
      setEditingListing(null);
      setFormData({ title: '', type: 'hotel', category: 'hotel', price: 0, priceUnit: '/nuit', location: '', city: '', province: 'Kinshasa', bedrooms: 1, bathrooms: 1, surface: undefined, rating: 4.5, amenities: [], available: true, featured: false, description: '', images: [] });
      loadListings();
    } catch (e) { console.error(e); }
  };

  const handleEdit = (listing: AdminHousing) => {
    setEditingListing(listing);
    setFormData({...listing, images: listing.images || []});
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cette annonce ?')) {
      await FirestoreService.deleteDocument('housing', id);
      loadListings();
    }
  };

  const addAmenity = () => {
    if (amenityInput.trim()) {
      setFormData({...formData, amenities: [...formData.amenities, amenityInput.trim()]});
      setAmenityInput('');
    }
  };

  const removeAmenity = (index: number) => {
    setFormData({...formData, amenities: formData.amenities.filter((_, i) => i !== index)});
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-bold">Hébergement (Hôtels, Locations, Ventes)</h3>
        <button onClick={() => { setShowForm(true); setEditingListing(null); setFormData({ title: '', type: 'hotel', category: 'hotel', price: 0, priceUnit: '/nuit', location: '', city: '', province: 'Kinshasa', bedrooms: 1, bathrooms: 1, surface: undefined, rating: 4.5, amenities: [], available: true, featured: false, description: '', images: [] }); }} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white text-sm font-medium">
          <Plus size={18} /> Ajouter Annonce
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-white font-bold text-lg mb-4">{editingListing ? 'Modifier' : 'Ajouter'} une Annonce</h3>
            <div className="space-y-4">
              {/* Photos du bien (plusieurs pour immobilier) */}
              <MultiImageUpload 
                label="Photos du bien" 
                values={formData.images} 
                onChange={(urls) => setFormData({...formData, images: urls})} 
                folder="housing" 
                maxImages={10}
              />
              <div>
                <label className="text-slate-400 text-sm">Titre *</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Type *</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white">
                    <option value="hotel">Hôtel</option>
                    <option value="apartment">Appartement</option>
                    <option value="house">Maison</option>
                    <option value="land">Terrain</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Catégorie *</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white">
                    <option value="hotel">Hôtel</option>
                    <option value="rental">Location</option>
                    <option value="sale">Vente</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm">Description *</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Prix (FC) *</label>
                  <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Unité Prix</label>
                  <select value={formData.priceUnit} onChange={e => setFormData({...formData, priceUnit: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white">
                    <option value="/nuit">/nuit</option>
                    <option value="/mois">/mois</option>
                    <option value="">(vente)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm">Adresse *</label>
                <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Ville *</label>
                  <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Province *</label>
                  <select value={formData.province} onChange={e => setFormData({...formData, province: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white">
                    {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Chambres</label>
                  <input type="number" value={formData.bedrooms || ''} onChange={e => setFormData({...formData, bedrooms: e.target.value ? Number(e.target.value) : undefined})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Salles de bain</label>
                  <input type="number" value={formData.bathrooms || ''} onChange={e => setFormData({...formData, bathrooms: e.target.value ? Number(e.target.value) : undefined})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Surface (m²)</label>
                  <input type="number" value={formData.surface || ''} onChange={e => setFormData({...formData, surface: e.target.value ? Number(e.target.value) : undefined})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Disponible</label>
                  <select value={formData.available ? 'true' : 'false'} onChange={e => setFormData({...formData, available: e.target.value === 'true'})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white">
                    <option value="true">Oui</option>
                    <option value="false">Non</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">En vedette</label>
                  <select value={formData.featured ? 'true' : 'false'} onChange={e => setFormData({...formData, featured: e.target.value === 'true'})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white">
                    <option value="false">Non</option>
                    <option value="true">Oui</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Note (0-5)</label>
                  <input type="number" step="0.1" min="0" max="5" value={formData.rating || ''} onChange={e => setFormData({...formData, rating: e.target.value ? Number(e.target.value) : undefined})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm">Équipements</label>
                <div className="flex gap-2 mt-1">
                  <input type="text" value={amenityInput} onChange={e => setAmenityInput(e.target.value)} placeholder="Ex: Wifi, Piscine..." className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                  <button onClick={addAmenity} className="px-4 py-2 bg-amber-500 rounded-xl text-white">+</button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.amenities.map((a, i) => (
                    <span key={i} className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm flex items-center gap-1">
                      {a} <button onClick={() => removeAmenity(i)} className="text-red-400">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 bg-slate-800 rounded-xl text-slate-400">Annuler</button>
              <button onClick={handleSubmit} className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white font-medium flex items-center justify-center gap-2">
                <Save size={18} /> Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map(listing => (
          <div key={listing.id} className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center overflow-hidden">
                {listing.images && listing.images.length > 0 ? (
                  <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                ) : (
                  <Hotel size={24} className="text-amber-400" />
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(listing)} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400"><Edit size={16} /></button>
                <button onClick={() => handleDelete(listing.id!)} className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-red-400"><Trash2 size={16} /></button>
              </div>
            </div>
            {listing.images && listing.images.length > 1 && (
              <div className="flex gap-1 mb-2">
                {listing.images.slice(1, 4).map((img, i) => (
                  <div key={i} className="w-8 h-8 rounded overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
                {listing.images.length > 4 && (
                  <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400 text-xs">+{listing.images.length - 4}</div>
                )}
              </div>
            )}
            <h4 className="text-white font-bold mb-1">{listing.title}</h4>
            <p className="text-slate-400 text-sm mb-1">{listing.type} • {listing.category}</p>
            <p className="text-slate-500 text-xs mb-2 flex items-center gap-1"><MapPin size={12} /> {listing.city}, {listing.province}</p>
            <div className="flex gap-2 mb-2 text-xs text-slate-500">
              {listing.bedrooms && <span className="flex items-center gap-1"><Bed size={12} /> {listing.bedrooms}</span>}
              {listing.bathrooms && <span className="flex items-center gap-1"><Bath size={12} /> {listing.bathrooms}</span>}
              {listing.surface && <span className="flex items-center gap-1"><Square size={12} /> {listing.surface}m²</span>}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-amber-400 font-bold">{listing.price >= 1000000 ? `${(listing.price/1000000).toFixed(0)}M` : listing.price.toLocaleString()} FC{listing.priceUnit}</span>
              {listing.featured && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">⭐ Vedette</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// ============ EVENTS SECTION ============
const EventsSection: React.FC = () => {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
  const [formData, setFormData] = useState<AdminEvent>({
    name: '', description: '', category: 'business', date: '', time: '', location: '', address: '', price: 0, vipPrice: undefined, availableTickets: 100, totalTickets: 100, organizer: '', rating: 4.5, featured: false, image: '', images: []
  });

  useEffect(() => { loadEvents(); }, []);

  const loadEvents = async () => {
    try {
      const data = await FirestoreService.getCollection('events');
      setEvents(data as AdminEvent[]);
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async () => {
    try {
      if (editingEvent?.id) {
        await FirestoreService.setDocument('events', editingEvent.id, formData, true);
      } else {
        await FirestoreService.addDocument('events', formData);
      }
      setShowForm(false);
      setEditingEvent(null);
      setFormData({ name: '', description: '', category: 'business', date: '', time: '', location: '', address: '', price: 0, vipPrice: undefined, availableTickets: 100, totalTickets: 100, organizer: '', rating: 4.5, featured: false, image: '', images: [] });
      loadEvents();
    } catch (e) { console.error(e); }
  };

  const handleEdit = (event: AdminEvent) => {
    setEditingEvent(event);
    setFormData({...event, image: event.image || '', images: event.images || []});
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cet événement ?')) {
      await FirestoreService.deleteDocument('events', id);
      loadEvents();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-bold">Événements</h3>
        <button onClick={() => { setShowForm(true); setEditingEvent(null); setFormData({ name: '', description: '', category: 'business', date: '', time: '', location: '', address: '', price: 0, vipPrice: undefined, availableTickets: 100, totalTickets: 100, organizer: '', rating: 4.5, featured: false, image: '', images: [] }); }} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white text-sm font-medium">
          <Plus size={18} /> Ajouter Événement
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-white font-bold text-lg mb-4">{editingEvent ? 'Modifier' : 'Ajouter'} un Événement</h3>
            <div className="space-y-4">
              {/* Affiche principale de l'événement */}
              <SingleImageUpload 
                label="Affiche de l'événement" 
                value={formData.image} 
                onChange={(url) => setFormData({...formData, image: url})} 
                folder="events" 
              />
              {/* Galerie photos optionnelle */}
              <MultiImageUpload 
                label="Galerie photos (optionnel)" 
                values={formData.images || []} 
                onChange={(urls) => setFormData({...formData, images: urls})} 
                folder="events" 
                maxImages={6}
              />
              <div>
                <label className="text-slate-400 text-sm">Nom *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
              </div>
              <div>
                <label className="text-slate-400 text-sm">Description *</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Catégorie *</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white">
                    {eventCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Organisateur *</label>
                  <input type="text" value={formData.organizer} onChange={e => setFormData({...formData, organizer: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Date *</label>
                  <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Heure *</label>
                  <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm">Lieu *</label>
                <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Ex: Pullman Kinshasa" className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
              </div>
              <div>
                <label className="text-slate-400 text-sm">Adresse *</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Prix Standard (FC) *</label>
                  <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Prix VIP (FC)</label>
                  <input type="number" value={formData.vipPrice || ''} onChange={e => setFormData({...formData, vipPrice: e.target.value ? Number(e.target.value) : undefined})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Places Disponibles *</label>
                  <input type="number" value={formData.availableTickets} onChange={e => setFormData({...formData, availableTickets: Number(e.target.value)})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Total Places *</label>
                  <input type="number" value={formData.totalTickets} onChange={e => setFormData({...formData, totalTickets: Number(e.target.value)})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">En vedette</label>
                  <select value={formData.featured ? 'true' : 'false'} onChange={e => setFormData({...formData, featured: e.target.value === 'true'})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white">
                    <option value="false">Non</option>
                    <option value="true">Oui</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Note (0-5)</label>
                  <input type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: Number(e.target.value)})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 bg-slate-800 rounded-xl text-slate-400">Annuler</button>
              <button onClick={handleSubmit} className="flex-1 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-medium flex items-center justify-center gap-2">
                <Save size={18} /> Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map(event => (
          <div key={event.id} className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center overflow-hidden">
                {event.image ? (
                  <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                ) : (
                  <Calendar size={24} className="text-pink-400" />
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(event)} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400"><Edit size={16} /></button>
                <button onClick={() => handleDelete(event.id!)} className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-red-400"><Trash2 size={16} /></button>
              </div>
            </div>
            <h4 className="text-white font-bold mb-1">{event.name}</h4>
            <p className="text-slate-400 text-sm mb-1">{event.category} • {event.organizer}</p>
            <p className="text-slate-500 text-xs mb-2 flex items-center gap-1">
              <Calendar size={12} /> {event.date} à {event.time}
            </p>
            <p className="text-slate-500 text-xs mb-2 flex items-center gap-1">
              <MapPin size={12} /> {event.location}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-pink-400 font-bold">{event.price.toLocaleString()} FC</span>
              <span className="text-slate-500 text-xs">{event.availableTickets}/{event.totalTickets} places</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============ ACTORS SECTION ============
const ActorsSection: React.FC = () => {
  const [actors, setActors] = useState<AdminActor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingActor, setEditingActor] = useState<AdminActor | null>(null);
  const [formData, setFormData] = useState<AdminActor>({
    name: '', category: '', location: '', verified: false, description: '', services: [], rating: 4.5, image: ''
  });
  const [serviceInput, setServiceInput] = useState('');

  useEffect(() => { loadActors(); }, []);

  const loadActors = async () => {
    try {
      const data = await FirestoreService.getCollection('actors');
      setActors(data as AdminActor[]);
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async () => {
    try {
      if (editingActor?.id) {
        await FirestoreService.setDocument('actors', editingActor.id, formData, true);
      } else {
        await FirestoreService.addDocument('actors', formData);
      }
      setShowForm(false);
      setEditingActor(null);
      setFormData({ name: '', category: '', location: '', verified: false, description: '', services: [], rating: 4.5, image: '' });
      loadActors();
    } catch (e) { console.error(e); }
  };

  const handleEdit = (actor: AdminActor) => {
    setEditingActor(actor);
    setFormData({...actor, image: actor.image || ''});
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cet acteur ?')) {
      await FirestoreService.deleteDocument('actors', id);
      loadActors();
    }
  };

  const addService = () => {
    if (serviceInput.trim()) {
      setFormData({...formData, services: [...formData.services, serviceInput.trim()]});
      setServiceInput('');
    }
  };

  const removeService = (index: number) => {
    setFormData({...formData, services: formData.services.filter((_, i) => i !== index)});
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-bold">Répertoire des Acteurs</h3>
        <button onClick={() => { setShowForm(true); setEditingActor(null); setFormData({ name: '', category: '', location: '', verified: false, description: '', services: [], rating: 4.5, image: '' }); }} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white text-sm font-medium">
          <Plus size={18} /> Ajouter Acteur
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-white font-bold text-lg mb-4">{editingActor ? 'Modifier' : 'Ajouter'} un Acteur</h3>
            <div className="space-y-4">
              {/* Logo ou photo de l'acteur */}
              <SingleImageUpload 
                label="Logo / Photo" 
                value={formData.image} 
                onChange={(url) => setFormData({...formData, image: url})} 
                folder="actors" 
              />
              <div>
                <label className="text-slate-400 text-sm">Nom *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
              </div>
              <div>
                <label className="text-slate-400 text-sm">Catégorie *</label>
                <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Ex: Technologie, Immobilier..." className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
              </div>
              <div>
                <label className="text-slate-400 text-sm">Localisation *</label>
                <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
              </div>
              <div>
                <label className="text-slate-400 text-sm">Description *</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Vérifié</label>
                  <select value={formData.verified ? 'true' : 'false'} onChange={e => setFormData({...formData, verified: e.target.value === 'true'})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white">
                    <option value="false">Non</option>
                    <option value="true">Oui</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Note (0-5)</label>
                  <input type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: Number(e.target.value)})} className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm">Services proposés</label>
                <div className="flex gap-2 mt-1">
                  <input type="text" value={serviceInput} onChange={e => setServiceInput(e.target.value)} placeholder="Ex: Développement, Consulting..." className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                  <button onClick={addService} className="px-4 py-2 bg-emerald-500 rounded-xl text-white">+</button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.services.map((s, i) => (
                    <span key={i} className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm flex items-center gap-1">
                      {s} <button onClick={() => removeService(i)} className="text-red-400">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 bg-slate-800 rounded-xl text-slate-400">Annuler</button>
              <button onClick={handleSubmit} className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-medium flex items-center justify-center gap-2">
                <Save size={18} /> Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actors.map(actor => (
          <div key={actor.id} className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center overflow-hidden">
                {actor.image ? (
                  <img src={actor.image} alt={actor.name} className="w-full h-full object-cover" />
                ) : (
                  <Briefcase size={24} className="text-emerald-400" />
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(actor)} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400"><Edit size={16} /></button>
                <button onClick={() => handleDelete(actor.id!)} className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-red-400"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-white font-bold">{actor.name}</h4>
              {actor.verified && <CheckCircle size={16} className="text-cyan-400" />}
            </div>
            <p className="text-slate-400 text-sm mb-1">{actor.category}</p>
            <p className="text-slate-500 text-xs mb-2 flex items-center gap-1"><MapPin size={12} /> {actor.location}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {actor.services.slice(0, 3).map((s, i) => (
                <span key={i} className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">{s}</span>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-yellow-400 text-sm">★ {actor.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// ============ ORDERS SECTION ============
const OrdersSection: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const data = await FirestoreService.getCollection('orders');
      setOrders(data);
    } catch (e) { console.error(e); }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await FirestoreService.setDocument('orders', orderId, { status }, true);
      loadOrders();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold">Commandes</h3>
      
      {orders.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center">
          <ShoppingCart size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Aucune commande pour le moment</p>
        </div>
      ) : (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="text-left p-4 text-slate-400 text-sm font-medium">ID</th>
                <th className="text-left p-4 text-slate-400 text-sm font-medium">Client</th>
                <th className="text-left p-4 text-slate-400 text-sm font-medium">Total</th>
                <th className="text-left p-4 text-slate-400 text-sm font-medium">Statut</th>
                <th className="text-left p-4 text-slate-400 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-t border-slate-800">
                  <td className="p-4 text-white">#{order.id?.slice(0, 8)}</td>
                  <td className="p-4 text-slate-400">{order.customerName || order.userId}</td>
                  <td className="p-4 text-cyan-400 font-bold">{(order.total || 0).toLocaleString()} FC</td>
                  <td className="p-4">
                    <select
                      value={order.status || 'pending'}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-white text-sm"
                    >
                      <option value="pending">En attente</option>
                      <option value="confirmed">Confirmée</option>
                      <option value="processing">En cours</option>
                      <option value="shipped">Expédiée</option>
                      <option value="delivered">Livrée</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ============ RESERVATIONS SECTION ============
const ReservationsSection: React.FC = () => {
  const [reservations, setReservations] = useState<any[]>([]);

  useEffect(() => { loadReservations(); }, []);

  const loadReservations = async () => {
    try {
      const data = await FirestoreService.getCollection('reservations');
      setReservations(data);
    } catch (e) { console.error(e); }
  };

  const updateStatus = async (resId: string, status: string) => {
    try {
      await FirestoreService.setDocument('reservations', resId, { status }, true);
      loadReservations();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold">Réservations</h3>
      
      {reservations.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center">
          <ClipboardList size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Aucune réservation pour le moment</p>
        </div>
      ) : (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="text-left p-4 text-slate-400 text-sm font-medium">ID</th>
                <th className="text-left p-4 text-slate-400 text-sm font-medium">Type</th>
                <th className="text-left p-4 text-slate-400 text-sm font-medium">Client</th>
                <th className="text-left p-4 text-slate-400 text-sm font-medium">Date</th>
                <th className="text-left p-4 text-slate-400 text-sm font-medium">Statut</th>
                <th className="text-left p-4 text-slate-400 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(res => (
                <tr key={res.id} className="border-t border-slate-800">
                  <td className="p-4 text-white">#{res.id?.slice(0, 8)}</td>
                  <td className="p-4 text-slate-400">{res.type || 'N/A'}</td>
                  <td className="p-4 text-slate-400">{res.customerName || res.userId}</td>
                  <td className="p-4 text-slate-400">{res.date || 'N/A'}</td>
                  <td className="p-4">
                    <select
                      value={res.status || 'pending'}
                      onChange={(e) => updateStatus(res.id, e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-white text-sm"
                    >
                      <option value="pending">En attente</option>
                      <option value="confirmed">Confirmée</option>
                      <option value="cancelled">Annulée</option>
                      <option value="completed">Terminée</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ============ FINANCE SECTION ============
const FinanceSection: React.FC = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, pendingPayments: 0, completedPayments: 0 });

  useEffect(() => {
    const loadFinance = async () => {
      try {
        const orders = await FirestoreService.getCollection('orders');
        const completed = orders.filter((o: any) => o.status === 'delivered');
        const pending = orders.filter((o: any) => o.status !== 'delivered' && o.status !== 'cancelled');
        setStats({
          totalRevenue: orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0),
          completedPayments: completed.reduce((sum: number, o: any) => sum + (o.total || 0), 0),
          pendingPayments: pending.reduce((sum: number, o: any) => sum + (o.total || 0), 0),
        });
      } catch (e) { console.error(e); }
    };
    loadFinance();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold">Finance</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
          <DollarSign size={32} className="text-emerald-400 mb-2" />
          <p className="text-3xl font-bold text-white">{(stats.totalRevenue / 1000).toFixed(0)}k FC</p>
          <p className="text-slate-400">Revenus Totaux</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
          <CheckCircle size={32} className="text-cyan-400 mb-2" />
          <p className="text-3xl font-bold text-white">{(stats.completedPayments / 1000).toFixed(0)}k FC</p>
          <p className="text-slate-400">Paiements Complétés</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
          <Clock size={32} className="text-amber-400 mb-2" />
          <p className="text-3xl font-bold text-white">{(stats.pendingPayments / 1000).toFixed(0)}k FC</p>
          <p className="text-slate-400">En Attente</p>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
        <h4 className="text-white font-bold mb-4">Graphique des Revenus</h4>
        <div className="h-48 flex items-end justify-around gap-2">
          {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'].map((month, i) => (
            <div key={month} className="flex flex-col items-center gap-2">
              <div className="w-12 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-lg" style={{ height: `${20 + Math.random() * 100}px` }} />
              <span className="text-slate-400 text-xs">{month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============ MESSAGES SECTION ============
const MessagesSection: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await FirestoreService.getCollection('messages');
        setMessages(data);
      } catch (e) { console.error(e); }
    };
    loadMessages();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold">Messagerie</h3>
      
      {messages.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center">
          <MessageCircle size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Aucun message pour le moment</p>
          <p className="text-slate-500 text-sm mt-2">Les messages des clients apparaîtront ici</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Users size={18} className="text-cyan-400" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-white font-medium">{msg.senderName || 'Client'}</p>
                    <span className="text-slate-500 text-xs">{msg.createdAt || 'Récent'}</span>
                  </div>
                  <p className="text-slate-400 text-sm mt-1">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============ SETTINGS SECTION ============
const SettingsSection: React.FC = () => {
  const [settings, setSettings] = useState({
    appName: 'PADEC Connect',
    currency: 'FC',
    language: 'fr',
    maintenanceMode: false
  });

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold">Paramètres de l'Application</h3>
      
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 space-y-6">
        <div>
          <label className="text-slate-400 text-sm">Nom de l'Application</label>
          <input
            type="text"
            value={settings.appName}
            onChange={e => setSettings({...settings, appName: e.target.value})}
            className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-slate-400 text-sm">Devise</label>
            <select
              value={settings.currency}
              onChange={e => setSettings({...settings, currency: e.target.value})}
              className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
            >
              <option value="FC">Franc Congolais (FC)</option>
              <option value="USD">Dollar US ($)</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 text-sm">Langue</label>
            <select
              value={settings.language}
              onChange={e => setSettings({...settings, language: e.target.value})}
              className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
          <div>
            <p className="text-white font-medium">Mode Maintenance</p>
            <p className="text-slate-400 text-sm">Désactiver l'accès public à l'application</p>
          </div>
          <button
            onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
            className={`w-14 h-7 rounded-full transition-colors ${settings.maintenanceMode ? 'bg-red-500' : 'bg-slate-700'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.maintenanceMode ? 'translate-x-8' : 'translate-x-1'}`} />
          </button>
        </div>

        <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white font-medium flex items-center justify-center gap-2">
          <Save size={18} /> Sauvegarder les Paramètres
        </button>
      </div>
    </div>
  );
};
