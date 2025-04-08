import React from 'react';
import BaseLoadingSpinner from './BaseLoadingSpinner';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Đang tải...' }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm z-[9999]">
      <BaseLoadingSpinner size="lg" className="text-primary" />
      <p className="mt-6 text-xl font-medium text-primary">{message}</p>
    </div>
  );
};

export default LoadingScreen; 