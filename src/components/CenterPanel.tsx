import React, { useState, useMemo } from 'react';
import Button from './Button';
import { Story } from '../data/mockData';

interface CenterPanelProps {
  story: Story;
  onRewrite?: () => void;
  onExpand?: () => void;
  onPromptChange?: (prompt: string) => void;
}

type Genre = 'fantasy' | 'scifi' | 'mystery' | 'romance' | 'thriller' | 'horror';

const CenterPanel: React.FC<CenterPanelProps> = ({ 
  story, 
  onRewrite, 
  onExpand, 
  onPromptChange
}) => {
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const content = story.content === "Begin your story here..." ? "" : story.content;
  
  const charCount = useMemo(() => content.length, [content]);
  const wordCount = useMemo(() => {
    return content.trim() ? content.trim().split(/\s+/).length : 0;
  }, [content]);
  
  const optimalRange = charCount >= 100 && charCount <= 500;
  const genres = [
    { id: 'fantasy' as Genre, label: 'Fantasy' },
    { id: 'scifi' as Genre, label: 'Sci-Fi' },
    { id: 'mystery' as Genre, label: 'Mystery' },
    { id: 'romance' as Genre, label: 'Romance' },
    { id: 'thriller' as Genre, label: 'Thriller' },
    { id: 'horror' as Genre, label: 'Horror' },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    onRewrite?.();
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-6 lg:p-8">
      <div className="glass rounded-xl p-6 md:p-8 flex-1 flex flex-col">
        {/* Header with Status */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl text-slate-100 font-bold tracking-tight mb-1">Story Prompt</h2>
            <p className="text-sm text-slate-400">Describe your narrative concept</p>
          </div>
          {isGenerating && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-xs text-blue-400 font-medium">Generating...</span>
            </div>
          )}
        </div>

          {/* Genre Selector */}
          <div className="mb-5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 block">
              Genre
            </label>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => setSelectedGenre(genre.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedGenre === genre.id
                      ? 'bg-blue-600 text-white border border-blue-500'
                      : 'bg-slate-800/60 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                  }`}
                >
                  {genre.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Textarea */}
          <div className="flex-1 flex flex-col relative">
            <textarea
              className="w-full flex-1 bg-slate-900/70 text-slate-100 border border-slate-700 rounded-lg p-5 resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-sans text-base leading-relaxed placeholder-slate-500 hover:border-slate-600"
              placeholder="Describe your story concept...\n\nExample: A cyberpunk detective uncovers a conspiracy that threatens the boundary between human and AI consciousness in a neon-lit megacity."
              value={content}
              onChange={(e) => onPromptChange && onPromptChange(e.target.value)}
            />
            
            {/* Character Counter */}
            <div className="absolute bottom-4 right-4 flex items-center gap-3 bg-slate-800/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Words:</span>
                <span className="text-sm font-semibold text-slate-200">{wordCount}</span>
              </div>
              <div className="w-px h-4 bg-slate-600" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Chars:</span>
                <span className={`text-sm font-semibold transition-colors ${
                  optimalRange ? 'text-emerald-400' : charCount > 500 ? 'text-amber-400' : 'text-slate-200'
                }`}>
                  {charCount}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mt-6 pt-6 border-t border-slate-700">
            {/* Story Controls Row */}
            <div className="flex gap-2">
              <Button 
                variant="secondary"
                onClick={() => {}}
                className="flex-1 text-sm py-2"
              >
                <span className="mr-1.5">↻</span>
                Auto Generate
              </Button>
              <Button 
                variant="secondary"
                onClick={() => {}}
                className="flex-1 text-sm py-2"
              >
                <span className="mr-1.5">⟲</span>
                Reload Checkpoint
              </Button>
              <Button 
                variant="outline"
                onClick={() => {}}
                className="flex-1 text-sm py-2"
              >
                <span className="mr-1.5">📋</span>
                Story Summary
              </Button>
            </div>

            {/* Main Actions Row */}
            <div className="flex flex-wrap items-center gap-3">
              <Button 
                variant="primary" 
                onClick={handleGenerate}
                disabled={isGenerating || charCount < 10}
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </span>
                ) : (
                  'Generate Story'
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={onExpand}
              >
                Refine Prompt
              </Button>
              <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
                <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded font-mono text-slate-400">⌘</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded font-mono text-slate-400">Enter</kbd>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default CenterPanel;

