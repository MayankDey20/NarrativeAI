import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'dark' | 'active';
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  onClick 
}) => {
  let baseClasses = '';
  
  switch (variant) {
    case 'dark':
      baseClasses = 'glass-dark';
      break;
    case 'active':
      baseClasses = 'glass-active';
      break;
    default:
      baseClasses = 'glass';
  }

  const hoverClasses = onClick ? 'cursor-pointer hover:shadow-lg transition-all duration-300' : '';
  
  return (
    <div 
      className={`${baseClasses} rounded-lg p-4 ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlassCard;

