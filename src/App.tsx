import { useState, useEffect } from 'react';
import Background from './components/Background';
import Navbar from './components/Navbar';
import LeftPanel from './components/LeftPanel';
import CenterPanel from './components/CenterPanel';
import RightPanel from './components/RightPanel';
import AuthModal from './components/AuthModal';
import SuccessModal from './components/SuccessModal';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import { API_URL } from './config/api';
import { Story, Choice } from './data/mockData';
import { mockStory, savedStories, generateChoices } from './data/mockData';

type View = 'home' | 'editor' | 'about';

interface User {
  email: string;
  name: string;
  provider?: 'email' | 'google' | 'apple' | 'facebook';
}

function App() {
  const [currentStory, setCurrentStory] = useState<Story>(mockStory);
  const [choices, setChoices] = useState<Choice[]>(generateChoices(mockStory.content));
  const [view, setView] = useState<View>('editor');
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [creativity, setCreativity] = useState(7);
  const [pov, setPov] = useState('third');

  // Check for saved session on mount
  useEffect(() => {
    // Check for OAuth callback parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userParam = urlParams.get('user');
    const error = urlParams.get('error');

    if (error) {
      alert('Authentication failed. Please try again.');
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (token && userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        setUser(userData);
        setIsLoggedIn(true);
        localStorage.setItem('narrativeflow_user', JSON.stringify(userData));
        localStorage.setItem('narrativeflow_token', token);
        localStorage.setItem('narrativeflow_loggedIn', 'true');
        setShowAuthModal(false);
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (err) {
        console.error('Failed to parse user data:', err);
      }
      return;
    }

    // Check for existing saved session
    const savedUser = localStorage.getItem('narrativeflow_user');
    const savedLoginState = localStorage.getItem('narrativeflow_loggedIn');
    if (savedUser && savedLoginState === 'true') {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // Update choices when story changes
  useEffect(() => {
    setChoices(generateChoices(currentStory.content));
  }, [currentStory]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+/ or Ctrl+/ to show shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setShowShortcuts(true);
      }
      // Cmd+N for new story
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        handleStartNew();
      }
      // Cmd+O to open/load story
      if ((e.metaKey || e.ctrlKey) && e.key === 'o') {
        e.preventDefault();
        handleLoadStory();
      }
      // Cmd+K for quick actions (could be expanded)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Future: Open command palette
        console.log('Command palette (Coming soon)');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleStartNew = () => {
    const newStory: Story = {
      title: "Untitled Story",
      content: "Begin your story here..."
    };
    setCurrentStory(newStory);
    setView('editor');
    setShowLoadModal(false);
  };

  const handleLoadStory = () => {
    setShowLoadModal(true);
  };

  const handleLoadSelectedStory = (story: Story) => {
    setCurrentStory(story);
    setView('editor');
    setShowLoadModal(false);
  };

  const handleHome = () => {
    setView('home');
    setShowLoadModal(false);
    setShowAboutModal(false);
  };

  const handleAbout = () => {
    setShowAboutModal(true);
    setShowLoadModal(false);
  };

  const handleLoginClick = () => {
    if (isLoggedIn) {
      // Logout
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem('narrativeflow_user');
      localStorage.removeItem('narrativeflow_loggedIn');
    } else {
      // Show login modal
      setShowAuthModal(true);
    }
  };

  const handleLogin = async (email: string, password?: string, provider?: string) => {
    if (provider) {
      // OAuth login handled by redirect in AuthModal
      return;
    }
    
    // Email/password login via backend API
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setIsLoggedIn(true);
        localStorage.setItem('narrativeflow_user', JSON.stringify(data.user));
        localStorage.setItem('narrativeflow_token', data.token);
        localStorage.setItem('narrativeflow_loggedIn', 'true');
        setShowAuthModal(false);
        setSuccessMessage('Successfully logged in!');
        setShowSuccessModal(true);
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your connection.');
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setIsLoggedIn(true);
        localStorage.setItem('narrativeflow_user', JSON.stringify(data.user));
        localStorage.setItem('narrativeflow_token', data.token);
        localStorage.setItem('narrativeflow_loggedIn', 'true');
        setShowAuthModal(false);
        setSuccessMessage('Account created successfully!');
        setShowSuccessModal(true);
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please check your connection.');
    }
  };

  const handleRewrite = () => {
    // Simulate rewriting the current paragraph
    const sentences = currentStory.content.split('. ');
    if (sentences.length > 0) {
      const lastSentence = sentences[sentences.length - 1];
      const rewritten = `[Rewritten] ${lastSentence}`;
      sentences[sentences.length - 1] = rewritten;
      setCurrentStory({
        ...currentStory,
        content: sentences.join('. ')
      });
    }
  };

  const handleExpand = () => {
    // Add new content to expand the story
    const expansion = `\n\nThe story deepened as new layers of meaning unfolded. Each word seemed to carry more weight, each sentence building upon the last to create something greater than the sum of its parts.`;
    setCurrentStory({
      ...currentStory,
      content: currentStory.content + expansion
    });
  };

  const handleInsert = (choiceId: number) => {
    const selectedChoice = choices.find(c => c.id === choiceId);
    if (selectedChoice) {
      // Insert the choice text into the story
      const insertion = `\n\n${selectedChoice.text}`;
      setCurrentStory({
        ...currentStory,
        content: currentStory.content + insertion
      });
      
      // Generate new choices after insertion
      setTimeout(() => {
        setChoices(generateChoices(currentStory.content + insertion));
      }, 100);
    }
  };

  const handleCreativityChange = (value: number) => {
    setCreativity(value);
    // Regenerate choices with new creativity level
    setChoices(generateChoices(currentStory.content));
  };

  const handlePOVChange = (value: string) => {
    setPov(value);
    // Adjust story content based on POV (simplified)
    if (value === 'first') {
      // Convert to first person (simplified example)
      const firstPerson = currentStory.content.replace(/\b(She|He|They)\b/g, 'I');
      setCurrentStory({ ...currentStory, content: firstPerson });
    }
  };

  const handlePromptChange = (newPrompt: string) => {
    setCurrentStory(prev => ({ ...prev, content: newPrompt }));
  };

  const renderHome = () => (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="glass rounded-xl p-12 max-w-3xl mx-auto">
        <h1 className="text-5xl font-serif font-bold text-amber-100 mb-6">
          Welcome to NarrativeFlow
        </h1>
        <p className="text-xl text-amber-200/80 mb-8 leading-relaxed">
          Craft your stories with the power of AI. Start a new adventure, continue an existing tale, 
          or explore the infinite possibilities of narrative creation.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleStartNew}
            className="px-8 py-3 gradient-bronze text-white rounded-lg font-medium glow-hover transition-all"
          >
            Start New Story
          </button>
          <button
            onClick={handleLoadStory}
            className="px-8 py-3 border-2 border-bronze-light text-bronze-light rounded-lg font-medium hover:bg-bronze-light/10 glow-hover transition-all"
          >
            Load Story
          </button>
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAboutModal(false)} />
      <div className="glass-dark rounded-xl p-8 max-w-2xl relative z-10 max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-serif font-bold text-amber-300 mb-4">About NarrativeFlow</h2>
        <div className="space-y-4 text-amber-100/80 leading-relaxed">
          <p>
            NarrativeFlow is a premium story generation platform that combines the art of writing 
            with the power of artificial intelligence. Create, expand, and refine your narratives 
            with an intuitive interface designed for writers of all levels.
          </p>
          <p>
            Our AI co-pilot helps you explore different narrative directions, rewrite sections for 
            clarity, and expand your stories with contextually relevant content. Every choice you 
            make shapes your story in unique ways.
          </p>
          <p>
            Whether you're crafting a short story, developing a novel, or exploring creative 
            writing, NarrativeFlow provides the tools and inspiration you need to bring your 
            ideas to life.
          </p>
        </div>
        <button
          onClick={() => setShowAboutModal(false)}
          className="mt-6 px-6 py-2 gradient-bronze text-white rounded-lg glow-hover"
        >
          Close
        </button>
      </div>
    </div>
  );

  const renderLoadModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLoadModal(false)} />
      <div className="glass-dark rounded-xl p-8 max-w-3xl relative z-10 max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-serif font-bold text-amber-300 mb-6">Load Story</h2>
        <div className="space-y-4">
          {savedStories.map((story, index) => (
            <div
              key={index}
              onClick={() => handleLoadSelectedStory(story)}
              className="glass p-4 rounded-lg cursor-pointer glow-hover transition-all"
            >
              <h3 className="text-xl font-semibold text-amber-200 mb-2">{story.title}</h3>
              <p className="text-sm text-amber-100/70 line-clamp-2">
                {story.content.substring(0, 150)}...
              </p>
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowLoadModal(false)}
          className="mt-6 px-6 py-2 border-2 border-bronze-light text-bronze-light rounded-lg hover:bg-bronze-light/10 glow-hover"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative">
      <Background />
      
      {/* Navbar */}
      <Navbar
        onStartNew={handleStartNew}
        onLoadStory={handleLoadStory}
        onHome={handleHome}
        onAbout={handleAbout}
        onLogin={handleLoginClick}
        isLoggedIn={isLoggedIn}
        user={user}
      />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen pt-16 md:pt-20">
        {view === 'home' ? (
          renderHome()
        ) : (
          <>
            {/* Three-panel layout */}
            <div className="container mx-auto min-h-screen grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 p-4">
              {/* Left Panel - Story Info */}
              <aside className="md:col-span-3 h-[500px] md:h-auto md:max-h-screen overflow-y-auto order-1 md:order-1">
                <div className="glass-dark rounded-xl h-full">
                  <LeftPanel />
                </div>
              </aside>

              {/* Center Panel - Main Story */}
              <main className="md:col-span-6 h-[600px] md:h-auto md:max-h-screen overflow-hidden order-2 md:order-2">
                <CenterPanel
                  story={currentStory}
                  onRewrite={handleRewrite}
                  onExpand={handleExpand}
                  onPromptChange={handlePromptChange}
                />
              </main>

              {/* Right Panel - AI Choices */}
              <aside className="md:col-span-3 h-[500px] md:h-auto md:max-h-screen overflow-y-auto order-3 md:order-3">
                <div className="glass-dark rounded-xl h-full">
                  <RightPanel
                    choices={choices}
                    onInsert={handleInsert}
                    creativity={creativity}
                    pov={pov}
                    onCreativityChange={handleCreativityChange}
                    onPOVChange={handlePOVChange}
                  />
                </div>
              </aside>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showLoadModal && renderLoadModal()}
      {showAboutModal && renderAbout()}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
      <SuccessModal
        isOpen={showSuccessModal}
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
      />
      <KeyboardShortcuts
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
}

export default App;
