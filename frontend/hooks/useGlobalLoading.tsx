'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import VisibleLoadingScreen from '@/components/VisibleLoadingScreen';

// Type definitions
interface GlobalLoadingContextType {
  isLoading: boolean;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
}

// Create context
const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined);

// Provider component
export const GlobalLoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('Đang tải...');
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Reset loading state when navigation completes
  useEffect(() => {
    stopLoading();
  }, [pathname, searchParams]);

  // Functions to start and stop loading
  const startLoading = useCallback((newMessage?: string) => {
    if (newMessage) {
      setMessage(newMessage);
    }
    
    console.log('Loading started:', newMessage || 'Đang tải...');
    setIsLoading(true);
    
    // Force browser to reflow
    document.body.classList.add('loading');
  }, []);

  const stopLoading = useCallback(() => {
    console.log('Loading stopped');
    setIsLoading(false);
    document.body.classList.remove('loading');
    
    // Reset message to default after a small delay
    setTimeout(() => {
      setMessage('Đang tải...');
    }, 300);
  }, []);

  return (
    <GlobalLoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
      {isLoading && <VisibleLoadingScreen message={message} />}
    </GlobalLoadingContext.Provider>
  );
};

// Hook for component use
export const useGlobalLoading = () => {
  const context = useContext(GlobalLoadingContext);
  if (context === undefined) {
    throw new Error('useGlobalLoading must be used within a GlobalLoadingProvider');
  }
  return context;
}; 