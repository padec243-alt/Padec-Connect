import { LucideIcon } from 'lucide-react';

export type ScreenName = 
  | 'splash' 
  | 'onboarding' 
  | 'auth' 
  | 'profile-setup'
  | 'home'
  | 'services'
  | 'service-detail'
  | 'eservices'
  | 'eservice-detail'
  | 'market'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'repertoire'
  | 'actor-detail'
  | 'profile'
  | 'search'
  | 'projects'
  | 'assistance'
  | 'coworking'
  | 'health'
  | 'visa'
  | 'family-help'
  | 'events'
  | 'housing'
  | 'admin';

export interface SlideData {
  id: number;
  title: string;
  desc: string;
  icon: LucideIcon;
  color: string;
  bgGradient: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: LucideIcon;
  price?: number;
  duration?: string;
  location?: string;
  rating?: number;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image?: string;
  images?: string[];
  category: string;
  inStock: boolean;
  rating?: number;
}

export interface Actor {
  id: string;
  name: string;
  category: string;
  location: string;
  verified: boolean;
  description?: string;
  services?: string[];
  rating?: number;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}