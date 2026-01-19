import React, { useState } from 'react';
import GlassCard from './GlassCard';

type Mode = 'ai-assisted' | 'user' | 'choice-based';

const LeftPanel: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<Mode>('ai-assisted');

  const modes: { id: Mode; label: string; description: string; icon: string; badge?: string }[] = [
    {
      id: 'ai-assisted',
      label: 'AI Assisted',
      description: 'Collaborate with AI to write your story.',
      icon: '✨',
      badge: 'Popular'
    },
    {
      id: 'user',
      label: 'User Mode',
      description: 'Write freely with minimal AI intervention.',
      icon: '✍️'
    },
    {
      id: 'choice-based',
      label: 'Choice Based',
      description: 'Interactive storytelling with branching paths.',
      icon: '🔀',
      badge: 'New'
    }
  ];

  return (
    <div className="h-full flex flex-col gap-5 p-5">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Writing Mode</h2>
        <p className="text-sm text-slate-400">Choose your creation style</p>
      </div>
      
      <div className="flex flex-col gap-3">
        {modes.map((mode) => (
          <GlassCard 
            key={mode.id}
            variant={selectedMode === mode.id ? 'active' : 'dark'}
            className={`cursor-pointer transition-all ${
              selectedMode === mode.id 
                ? 'border-blue-500' 
                : 'hover:bg-slate-800/70 hover:border-slate-600'
            }`}
            onClick={() => setSelectedMode(mode.id)}
          >
            {mode.badge && (
              <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-semibold uppercase tracking-wider rounded-full">
                {mode.badge}
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h3 className={`font-semibold text-base mb-1 transition-colors ${
                  selectedMode === mode.id ? 'text-blue-400' : 'text-slate-200'
                }`}>
                  {mode.label}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {mode.description}
                </p>
              </div>
            </div>
            {selectedMode === mode.id && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <span className="text-xs text-blue-400 font-medium">Active</span>
              </div>
            )}
          </GlassCard>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-auto space-y-3">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Session Stats</span>
            <span className="text-xs text-green-400">● Live</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-2xl font-bold text-slate-100">0</div>
              <div className="text-xs text-slate-500">Stories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-100">0</div>
              <div className="text-xs text-slate-500">Words</div>
            </div>
          </div>
        </div>
        
        <div className="text-center py-3 border-t border-slate-800">
          <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">
            NarrativeFlow v2.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;

