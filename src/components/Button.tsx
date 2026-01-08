import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'bronze' | 'amber' | 'outline' | 'primary' | 'secondary' | 'danger';
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  className = '',
  disabled = false
}) => {
  const baseClasses = 'px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900';
  
  const variantClasses = {
    bronze: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    amber: 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500', 
    outline: 'border border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500 focus:ring-slate-500 hover:text-white',
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white focus:ring-slate-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
  };

  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed pointer-events-none' 
    : 'cursor-pointer';

  const selectedVariant = variantClasses[variant] || variantClasses['primary'];

  return (
    <button
      className={`${baseClasses} ${selectedVariant} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;

