import React from 'react';

interface BaseLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const BaseLoadingSpinner: React.FC<BaseLoadingSpinnerProps> = ({ 
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-16 h-16 border-4'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-solid border-primary border-t-transparent ${sizeClasses[size]}`} />
    </div>
  );
};

export default BaseLoadingSpinner; 