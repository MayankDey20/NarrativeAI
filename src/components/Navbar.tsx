import React, { useState } from 'react';
import Button from './Button';

interface User {
  email: string;
  name: string;
  provider?: 'email' | 'google' | 'apple' | 'facebook';
}

interface NavbarProps {
  onStartNew?: () => void;
  onLoadStory?: () => void;
  onHome?: () => void;
  onAbout?: () => void;
  onLogin?: () => void;
  isLoggedIn?: boolean;
  user?: User | null;
}

const Navbar: React.FC<NavbarProps> = ({
  onStartNew,
  onLoadStory,
  onHome,
  onAbout,
  onLogin,
  isLoggedIn = false,
  user
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleStartNew = () => {
    onStartNew?.();
    setMobileMenuOpen(false);
  };

  const handleLoadStory = () => {
    onLoadStory?.();
    setMobileMenuOpen(false);
  };

  const handleHome = () => {
    onHome?.();
    setMobileMenuOpen(false);
  };

  const handleAbout = () => {
    onAbout?.();
    setMobileMenuOpen(false);
  };

  const handleLogin = () => {
    onLogin?.();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="relative z-20 w-full">
      <div className="glass-nav border-b border-amber-900/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <h1 className="text-xl md:text-2xl font-serif font-bold text-amber-100 tracking-wide">
                NarrativeFlow
              </h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={handleHome}
                className="px-4 py-2 text-sm text-amber-200/80 hover:text-amber-100 transition-colors duration-200"
              >
                Home
              </button>
              <button
                onClick={handleStartNew}
                className="px-4 py-2 text-sm text-amber-200/80 hover:text-amber-100 transition-colors duration-200"
              >
                Start New Story
              </button>
              <button
                onClick={handleLoadStory}
                className="px-4 py-2 text-sm text-amber-200/80 hover:text-amber-100 transition-colors duration-200"
              >
                Load Story
              </button>
              <button
                onClick={handleAbout}
                className="px-4 py-2 text-sm text-amber-200/80 hover:text-amber-100 transition-colors duration-200"
              >
                About
              </button>
              <div className="h-6 w-px bg-amber-900/30 mx-2" />
              {isLoggedIn && user ? (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-amber-100 font-medium">{user.name}</div>
                    <div className="text-xs text-amber-200/60">{user.email}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full gradient-bronze flex items-center justify-center text-white text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleLogin}
                    className="text-xs py-1.5 px-4"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleLogin}
                  className="text-xs py-1.5 px-4"
                >
                  Login
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-amber-200/80 hover:text-amber-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2 animate-fadeIn">
              <button
                onClick={handleHome}
                className="block w-full text-left px-2 py-2 text-sm text-amber-200/80 hover:text-amber-100"
              >
                Home
              </button>
              <button
                onClick={handleStartNew}
                className="block w-full text-left px-2 py-2 text-sm text-amber-200/80 hover:text-amber-100"
              >
                Start New Story
              </button>
              <button
                onClick={handleLoadStory}
                className="block w-full text-left px-2 py-2 text-sm text-amber-200/80 hover:text-amber-100"
              >
                Load Story
              </button>
              <button
                onClick={handleAbout}
                className="block w-full text-left px-2 py-2 text-sm text-amber-200/80 hover:text-amber-100"
              >
                About
              </button>
              <div className="pt-2 border-t border-amber-900/20">
                {isLoggedIn && user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-2 py-2">
                      <div className="w-8 h-8 rounded-full gradient-bronze flex items-center justify-center text-white text-sm font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs text-amber-100 font-medium">{user.name}</div>
                        <div className="text-xs text-amber-200/60">{user.email}</div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleLogin}
                      className="w-full text-xs py-2"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleLogin}
                    className="w-full text-xs py-2"
                  >
                    Login
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

