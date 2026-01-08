import React, { useEffect, useState } from 'react';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ isOpen, onClose }) => {
  const shortcuts = [
    { keys: ['⌘', 'Enter'], description: 'Generate story from prompt', category: 'Generation' },
    { keys: ['⌘', 'K'], description: 'Open command palette', category: 'Navigation' },
    { keys: ['⌘', 'S'], description: 'Save current story', category: 'File' },
    { keys: ['⌘', 'N'], description: 'Start new story', category: 'File' },
    { keys: ['⌘', 'O'], description: 'Open story library', category: 'File' },
    { keys: ['⌘', '1-3'], description: 'Switch writing mode', category: 'Navigation' },
    { keys: ['Esc'], description: 'Close modal/dialog', category: 'Navigation' },
    { keys: ['⌘', '/'], description: 'Show keyboard shortcuts', category: 'Help' },
  ];

  const categories = Array.from(new Set(shortcuts.map(s => s.category)));

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md" 
        onClick={onClose}
      />
      
      <div className="relative z-10 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-slideInUp">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Keyboard Shortcuts</h2>
              <p className="text-sm text-slate-400 mt-1">Master NarrativeFlow like a pro</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors group"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {shortcuts
                  .filter(s => s.category === category)
                  .map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <span className="text-sm text-slate-300">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <kbd className="px-2.5 py-1.5 bg-slate-700 border border-slate-600 rounded-md font-mono text-xs text-slate-200 shadow-sm min-w-[2rem] text-center">
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="text-slate-500 text-xs mx-0.5">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800 px-6 py-4">
          <p className="text-xs text-slate-500 text-center">
            Press <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded font-mono text-slate-400">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;
