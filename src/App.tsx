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
      setShowAuthModal(true);
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
    } else {
      // No saved session, show auth modal
      setShowAuthModal(true);
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

  const handleGenerateStory = async () => {
    const token = localStorage.getItem('narrativeflow_token');
    if (!token) {
      alert('Please login to generate stories');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: currentStory.content,
          genre: currentStory.genre || 'fantasy',
          pov: pov,
          creativity: creativity,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCurrentStory({
          ...currentStory,
          content: data.generatedStory,
        });
        // Generate new choices based on the story
        handleGenerateChoices(data.generatedStory);
      } else {
        alert(data.message || 'Story generation failed');
      }
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate story. Please try again.');
    }
  };

  const handleAutoGenerate = async () => {
    const token = localStorage.getItem('narrativeflow_token');
    if (!token) {
      alert('Please login to auto-generate');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/ai/auto-generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentContent: currentStory.content,
          genre: currentStory.genre || 'fantasy',
          pov: pov,
          creativity: creativity,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCurrentStory({
          ...currentStory,
          content: currentStory.content + '\n\n' + data.continuation,
        });
        // Generate new choices
        handleGenerateChoices(currentStory.content + '\n\n' + data.continuation);
      } else {
        alert(data.message || 'Auto-generation failed');
      }
    } catch (error) {
      console.error('Auto-generation error:', error);
      alert('Failed to auto-generate. Please try again.');
    }
  };

  const handleGenerateChoices = async (storyContent?: string) => {
    const token = localStorage.getItem('narrativeflow_token');
    if (!token) return;

    const content = storyContent || currentStory.content;
    if (!content || content.length < 50) return;

    try {
      const response = await fetch(`${API_URL}/api/ai/choices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          storyContent: content,
          genre: currentStory.genre || 'fantasy',
          pov: pov,
          creativity: creativity,
          numberOfChoices: 4,
        }),
      });

      const data = await response.json();

      if (data.success && data.choices) {
        setChoices(data.choices);
      }
    } catch (error) {
      console.error('Choices generation error:', error);
      // Keep existing mock choices on error
    }
  };

  const handleGenerateSummary = async () => {
    const token = localStorage.getItem('narrativeflow_token');
    if (!token) {
      alert('Please login to generate summary');
      return;
    }

    if (!currentStory.content || currentStory.content.length < 50) {
      alert('Story is too short to summarize');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/ai/summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: currentStory.content,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Story Summary:\n\n${data.summary}`);
      } else {
        alert(data.message || 'Summary generation failed');
      }
    } catch (error) {
      console.error('Summary error:', error);
      alert('Failed to generate summary. Please try again.');
    }
  };



  const handleRefinePrompt = async () => {
    const token = localStorage.getItem('narrativeflow_token');
    if (!token) {
      alert('Please login to refine prompts');
      return;
    }

    if (!currentStory.content || currentStory.content.length < 10) {
      alert('Please enter a story prompt first');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/ai/refine-prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          originalPrompt: currentStory.content,
          genre: currentStory.genre || 'fantasy',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCurrentStory({
          ...currentStory,
          content: data.refinedPrompt,
        });
      } else {
        alert(data.message || 'Prompt refinement failed');
      }
    } catch (error) {
      console.error('Refine error:', error);
      alert('Failed to refine prompt. Please try again.');
    }
  };

  const handleInsert = (choiceId: number) => {
    const selectedChoice = choices.find(c => c.id === choiceId);
    if (selectedChoice) {
      // Insert the choice text into the story
      const insertion = `\n\n${selectedChoice.text}`;
      const newContent = currentStory.content + insertion;
      setCurrentStory({
        ...currentStory,
        content: newContent
      });
      
      // Generate new choices after insertion using AI
      handleGenerateChoices(newContent);
    }
  };

  const handleCreativityChange = (value: number) => {
    setCreativity(value);
    // Regenerate choices with new creativity level using AI
    if (currentStory.content.length > 50) {
      handleGenerateChoices();
    }
  };

  const handlePOVChange = (value: string) => {
    setPov(value);
    // Regenerate choices with new POV
    if (currentStory.content.length > 50) {
      handleGenerateChoices();
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
        {!isLoggedIn ? (
          // Show welcome screen with login prompt
          <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
            <div className="text-center max-w-2xl">
              <div className="mb-8">
                <h1 className="text-5xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
                  Welcome to NarrativeAI
                </h1>
                <p className="text-xl text-slate-300 mb-2">
                  AI-Powered Interactive Storytelling
                </p>
                <p className="text-slate-400">
                  Create, explore, and shape your own narrative adventures with the power of AI
                </p>
              </div>
              
              <div className="glass-dark rounded-2xl p-8 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center">
                      <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">AI-Assisted</h3>
                    <p className="text-sm text-slate-400">Let AI help craft your story with intelligent suggestions</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center">
                      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">Full Control</h3>
                    <p className="text-sm text-slate-400">Write freely with complete creative control</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-500/20 border-2 border-pink-500 flex items-center justify-center">
                      <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">Choice-Based</h3>
                    <p className="text-sm text-slate-400">Make decisions that shape your narrative</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Get Started - Sign In or Register
                </button>
              </div>
              
              <p className="text-sm text-slate-500">
                Join thousands of storytellers creating amazing narratives
              </p>
            </div>
          </div>
        ) : view === 'home' ? (
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
                  onRefinePrompt={handleRefinePrompt}
                  onPromptChange={handlePromptChange}
                  onGenerate={handleGenerateStory}
                  onAutoGenerate={handleAutoGenerate}
                  onGenerateSummary={handleGenerateSummary}
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
        onClose={() => {
          // Only allow closing if user is logged in
          if (isLoggedIn) {
            setShowAuthModal(false);
          }
        }}
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
