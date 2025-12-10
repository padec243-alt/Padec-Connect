import { LucideIcon } from 'lucide-react';

export type ScreenName = 'splash' | 'onboarding' | 'auth' | 'home';

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