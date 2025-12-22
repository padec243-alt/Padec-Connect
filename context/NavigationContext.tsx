import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ScreenName } from '../types';

interface NavigationContextType {
  currentScreen: ScreenName;
  navigate: (screen: ScreenName, params?: any) => void;
  goBack: () => void;
  params: any;
  history: ScreenName[];
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('splash');
  const [history, setHistory] = useState<ScreenName[]>(['splash']);
  const [params, setParams] = useState<any>({});

  const navigate = (screen: ScreenName, navigationParams?: any) => {
    setHistory(prev => [...prev, currentScreen]);
    setCurrentScreen(screen);
    setParams(navigationParams || {});
  };

  const goBack = () => {
    if (history.length > 1) {
      const previousScreen = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentScreen(previousScreen);
      setParams({});
    }
  };

  return (
    <NavigationContext.Provider value={{ currentScreen, navigate, goBack, params, history }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

