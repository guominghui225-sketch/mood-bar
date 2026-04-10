import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface MusicToggleProps {
  isPlaying: boolean;
  onToggle: () => void;
}

const MusicToggle: React.FC<MusicToggleProps> = ({ isPlaying, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="fixed top-[21.33px] right-[21.33px] z-50 w-[58.67px] h-[58.67px] flex items-center justify-center rounded-full border border-current backdrop-blur-sm transition-all duration-200 active:scale-95 touch-manipulation"
      style={{
        borderWidth: '1.33px',
        borderRadius: '29.33px',
      }}
      aria-label={isPlaying ? '关闭声音' : '开启声音'}
    >
      {isPlaying ? (
        <Volume2 className="w-6 h-6 text-mood-gold" />
      ) : (
        <VolumeX className="w-6 h-6 text-mood-light-gray" />
      )}
    </button>
  );
};

export default MusicToggle;
