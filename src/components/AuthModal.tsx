import React, { useState } from 'react';
import { API_URL } from '../config/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password?: string, provider?: string) => void;
  onRegister: (email: string, password: string, name: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, onRegister }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLoginMode) {
      if (!email) {
        setError('Please enter your email');
        return;
      }
      if (!password) {
        setError('Please enter your password');
        return;
      }
      onLogin(email, password);
    } else {
      if (!email || !password || !name) {
        setError('Please fill in all fields');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      onRegister(email, password, name);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'apple' | 'facebook') => {
    setError('');
    
    if (provider === 'google') {
      // Redirect to backend Google OAuth
      window.location.href = `${API_URL}/api/auth/google`;
    } else {
      const providerNames = {
        apple: 'Apple',
        facebook: 'Facebook'
      };
      setError(`${providerNames[provider]} OAuth integration is not yet implemented. Please use email/password or Google to sign in.`);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError('');
  };

  const switchMode = () => {
    setIsLoginMode(!isLoginMode);
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="glass-dark rounded-xl p-8 max-w-md w-full relative z-10 animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-200/60 hover:text-amber-100 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-serif font-bold text-amber-300 mb-2">
          {isLoginMode ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-sm text-amber-100/70 mb-6">
          {isLoginMode 
            ? 'Sign in to continue your story' 
            : 'Join NarrativeFlow to start creating'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div>
              <label className="block text-sm text-amber-100/70 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-cosmic-space/50 border border-bronze-light/30 rounded-lg px-4 py-2 text-amber-50 focus:outline-none focus:border-bronze-light focus:glow transition-all"
                placeholder="Enter your name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-amber-100/70 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-cosmic-space/50 border border-bronze-light/30 rounded-lg px-4 py-2 text-amber-50 focus:outline-none focus:border-bronze-light focus:glow transition-all"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-amber-100/70 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-cosmic-space/50 border border-bronze-light/30 rounded-lg px-4 py-2 text-amber-50 focus:outline-none focus:border-bronze-light focus:glow transition-all"
              placeholder={isLoginMode ? "Enter your password" : "Create a password (min. 6 characters)"}
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-2 rounded-lg font-medium transition-all duration-300 gradient-bronze text-white glow-hover cursor-pointer"
          >
            {isLoginMode ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-amber-900/30"></div>
          <span className="px-4 text-sm text-amber-200/50">or continue with</span>
          <div className="flex-1 border-t border-amber-900/30"></div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleSocialLogin('google')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-amber-50 transition-all glow-hover"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            onClick={() => handleSocialLogin('apple')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-amber-50 transition-all glow-hover"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            <span>Continue with Apple</span>
          </button>

          <button
            onClick={() => handleSocialLogin('facebook')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-amber-50 transition-all glow-hover"
          >
            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Continue with Facebook</span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={switchMode}
            className="text-sm text-amber-200/70 hover:text-amber-100 transition-colors"
          >
            {isLoginMode 
              ? "Don't have an account? " 
              : "Already have an account? "}
            <span className="text-bronze-light font-medium">
              {isLoginMode ? 'Sign up' : 'Sign in'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

