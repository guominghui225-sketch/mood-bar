import React, { useEffect, useState, useRef } from 'react';
import { ChevronRight, Volume2, VolumeX } from 'lucide-react';
import GlassSilhouette from './GlassSilhouette';
import ProcessIcons from './ProcessIcons';
import Aurora from './Aurora';
import { useSound } from '../hooks/useSound';

interface SplashPageProps {
  onEnter: () => void;
}

const SplashPage: React.FC<SplashPageProps> = ({ onEnter }) => {
  const [animationState, setAnimationState] = useState({
    glassVisible: false,
    titleVisible: false,
    sloganVisible: false,
    processVisible: false,
    buttonVisible: false,
    buttonBreathing: false,
  });
  const [isSliding, setIsSliding] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { isPlaying, toggleSound, playGlassClink } = useSound();

  useEffect(() => {
    // Animation sequence with precise timing (1.5s total)
    const timers = [
      // 0.2s: Glass silhouette
      setTimeout(() => {
        setAnimationState(prev => ({ ...prev, glassVisible: true }));
      }, 200),

      // 0.4s: Main title
      setTimeout(() => {
        setAnimationState(prev => ({ ...prev, titleVisible: true }));
      }, 400),

      // 0.7s: Slogan + function description
      setTimeout(() => {
        setAnimationState(prev => ({ ...prev, sloganVisible: true }));
      }, 700),

      // 1.0s: Process icons
      setTimeout(() => {
        setAnimationState(prev => ({ ...prev, processVisible: true }));
      }, 1000),

      // 1.2s: Main button
      setTimeout(() => {
        setAnimationState(prev => ({ ...prev, buttonVisible: true }));
      }, 1200),

      // 1.5s: Start button breathing animation
      setTimeout(() => {
        setAnimationState(prev => ({ ...prev, buttonBreathing: true }));
      }, 1500),
    ];

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  const handleEnter = () => {
    // Play glass clink sound
    playGlassClink();

    // Button click animation: scale to 95%, color change to #D4B98F
    if (buttonRef.current) {
      buttonRef.current.style.transform = 'scale(0.95)';
      buttonRef.current.style.backgroundColor = '#D4B98F';
    }

    // Restore after 200ms and trigger slide animation
    setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.style.transform = '';
        buttonRef.current.style.backgroundColor = '';
      }
      setIsSliding(true);
      setTimeout(() => {
        onEnter();
      }, 500);
    }, 200);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Aurora effect - full screen background */}
      <div className="fixed inset-0 pointer-events-none z-1 overflow-hidden">
        <Aurora
          colorStops={["#C8A97E", "#D4B98F", "#F5F0E1"]}
          amplitude={1.2}
          blend={0.6}
        />
      </div>

      {/* Glass silhouette in bottom-right corner */}
      <div className={`
        transition-all duration-500
        ${animationState.glassVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}
      `}>
        <GlassSilhouette />
      </div>

      {/* Main content container - centered in single screen */}
      <div className={`
        flex flex-col min-h-screen px-[32px] max-w-[500px] mx-auto relative z-10
        justify-center overflow-hidden
        transition-all duration-500
        ${isSliding ? '-translate-y-1/3 opacity-0' : 'translate-y-0 opacity-100'}
      `}>
        {/* Background overlay for better readability */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] -z-10 rounded-3xl" />
        {/* Main Title - 72pt (96px) */}
        <h1
          className={`
            font-serif text-[96px] font-bold text-mood-gold mb-[21.33px]
            transition-all duration-500
            ${animationState.titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}
          `}
        >
          Mood Bar
        </h1>

        {/* Slogan - 20pt (26.66px) */}
        <p
          className={`
            font-sans text-[26.66px] font-light text-mood-pure-white tracking-[0.05em]
            transition-all duration-400
            ${animationState.sloganVisible ? 'opacity-100' : 'opacity-0'}
          `}
        >
          · 以情绪入酒，碰杯此刻
        </p>

    



        {/* Enter button */}
        <button
          ref={buttonRef}
          onClick={handleEnter}
          className={`
            group mt-[74.67px] w-full h-[74.67px] flex items-center justify-center gap-[10.67px]
            bg-[#C8A97E] text-[#000000] font-medium text-[24px] rounded-[21.33px]
            shadow-[0_5.33px_10.67px_rgba(0,0,0,0.1)]
            transition-all duration-300 active:scale-95 touch-manipulation
            ${animationState.buttonBreathing ? 'animate-breathing' : ''}
            ${animationState.buttonVisible ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <span>🍸调一杯</span>
          <ChevronRight className="w-[26.67px] h-[26.67px] text-[#000000] transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Music toggle button */}
      <div className="absolute top-[21.33px] right-[21.33px] z-50">
        <button
          onClick={toggleSound}
          className="w-[58.67px] h-[58.67px] flex items-center justify-center rounded-full border border-current backdrop-blur-sm transition-all duration-200 active:scale-95 touch-manipulation"
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
      </div>
    </div>
  );
};

export default SplashPage;
