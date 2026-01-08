import React from 'react';
import Button from './Button';
import { Choice } from '../data/mockData';

interface RightPanelProps {
  choices: Choice[];
  onInsert?: (choiceId: number) => void;
  creativity?: number;
  pov?: string;
  onCreativityChange?: (value: number) => void;
  onPOVChange?: (value: string) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ 
  choices, 
  onInsert,
  creativity = 7,
  pov = 'third',
  onCreativityChange,
  onPOVChange
}) => {

  return (
    <div className="h-full flex flex-col gap-5 p-5">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">AI Suggestions</h2>
          <div className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Ready</span>
          </div>
        </div>
        <p className="text-sm text-slate-400">Choose your next direction</p>
      </div>

      {/* Controls */}
      <div className="space-y-4 pb-4 border-b border-slate-700">
        {/* Creativity Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Creativity</label>
            <span className="text-sm font-semibold text-slate-200">{creativity}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={creativity}
            onChange={(e) => onCreativityChange?.(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${creativity * 10}%, rgb(30, 41, 59) ${creativity * 10}%, rgb(30, 41, 59) 100%)`
            }}
          />
        </div>

        {/* POV Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Point of View</label>
          <div className="grid grid-cols-3 gap-2">
            {['first', 'second', 'third'].map((povOption) => (
              <button
                key={povOption}
                onClick={() => onPOVChange?.(povOption)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  pov === povOption
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {povOption === 'first' ? '1st' : povOption === 'second' ? '2nd' : '3rd'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Choice Cards */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {choices.map((choice, index) => (
          <div 
            key={choice.id} 
            className="glass-dark p-4 rounded-lg border border-slate-700 hover:border-slate-600 hover:bg-slate-800/60 transition-all"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-200 leading-relaxed">{choice.text}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => onInsert?.(choice.id)}
              className="w-full text-xs py-1.5"
            >
              Insert into Story
            </Button>
          </div>
        ))}
        
        {choices.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <p className="text-slate-500 text-sm">Start writing to see suggestions</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-700">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Suggestions</span>
          <span className="text-blue-400 font-semibold">{choices.length} available</span>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;

