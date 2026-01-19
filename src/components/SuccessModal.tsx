import React, { useEffect } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, message, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="glass-dark rounded-2xl p-8 relative z-10 animate-fadeIn max-w-md w-full text-center">
        {/* Success Icon - Green Circle with Checkmark */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center animate-pulse">
              <svg 
                className="w-12 h-12 text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            {/* Outer glow ring */}
            <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-green-400/30 animate-ping"></div>
          </div>
        </div>

        {/* Success Message */}
        <h3 className="text-2xl font-serif font-bold text-green-400 mb-2">
          Success!
        </h3>
        <p className="text-amber-100/80 text-lg">
          {message}
        </p>
      </div>
    </div>
  );
};

export default SuccessModal;
