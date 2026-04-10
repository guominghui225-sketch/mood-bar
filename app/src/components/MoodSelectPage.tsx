import { useState } from 'react';
import type { MoodType, MoodOption } from '@/types';
import { moodOptions } from '@/constants';

interface MoodSelectPageProps {
  onSelectMood: (mood: MoodType) => void;
  onMixCocktail: () => void;
  selectedMood: MoodType | null;
}

const MoodSelectPage = ({ 
  onSelectMood, 
  onMixCocktail, 
  selectedMood 
}: MoodSelectPageProps) => {
  const [isShaking, setIsShaking] = useState(false);

  const handleMixClick = () => {
    if (!selectedMood) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
      return;
    }
    onMixCocktail();
  };

  return (
    <div className="flex flex-col min-h-screen px-6 py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h2 className="font-serif text-2xl font-bold text-mood-gold">
          Mood Bar
        </h2>
        <p className="font-sans text-sm text-mood-cream/80 mt-1">
          ・以情绪入酒
        </p>
      </div>

      {/* Question */}
      <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <p className="font-sans text-lg text-mood-cream">
          现在的心情是？
        </p>
        <p className="font-sans text-sm text-mood-text-muted mt-2">
          AI酒保为你生成专属特调
        </p>
      </div>

      {/* Mood Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {moodOptions.map((mood, index) => (
          <button
            key={mood.id}
            onClick={() => onSelectMood(mood.id)}
            className={`mood-btn animate-fade-in ${
              selectedMood === mood.id ? 'mood-btn-selected' : 'mood-btn-unselected'
            }`}
            style={{ animationDelay: `${0.15 + index * 0.05}s` }}
          >
            <span className="text-sm">{mood.label}</span>
          </button>
        ))}
      </div>

      {/* Mix Button */}
      <div className="mt-4 flex justify-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <button
          onClick={handleMixClick}
          className={`group flex items-center gap-3 px-10 py-4 rounded-xl font-medium text-base transition-all duration-200 touch-manipulation ${
            selectedMood
              ? 'bg-mood-gold text-mood-dark hover:brightness-110 active:scale-95'
              : 'bg-mood-gold/30 text-mood-dark/50 cursor-not-allowed'
          } ${isShaking ? 'animate-shake' : ''}`}
          disabled={!selectedMood}
        >
          <span className="text-xl">🍸</span>
          <span>调出今日心情</span>
        </button>
      </div>

      {/* Hint text */}
      {!selectedMood && (
        <p className="text-center text-mood-text-muted text-xs mt-2 animate-fade-in">
          请先选择一种情绪
        </p>
      )}
    </div>
  );
};

export default MoodSelectPage;
export { moodOptions };
