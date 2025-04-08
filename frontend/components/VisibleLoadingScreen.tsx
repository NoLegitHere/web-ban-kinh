import React from 'react';

interface VisibleLoadingScreenProps {
  message?: string;
}

const VisibleLoadingScreen: React.FC<VisibleLoadingScreenProps> = ({ 
  message = 'Đang tải...' 
}) => {
  return (
    <div className="fixed inset-0 bg-white/90 dark:bg-black/90 z-[9999] flex flex-col items-center justify-center">
      <div className="loading-spinner"></div>
      <p className="mt-6 text-xl font-semibold text-black dark:text-white">{message}</p>
    </div>
  );
};

export default VisibleLoadingScreen; 