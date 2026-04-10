import { useState, useEffect, useRef } from 'react';

export interface UseSoundReturn {
  isPlaying: boolean;
  toggleSound: () => void;
  playGlassClink: () => void;
}

export const useSound = (): UseSoundReturn => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const whiteNoiseRef = useRef<HTMLAudioElement | null>(null);
  const glassClinkRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio elements
  useEffect(() => {
    // Create white noise audio (placeholder - would need actual audio file)
    whiteNoiseRef.current = new Audio();
    whiteNoiseRef.current.loop = true;
    whiteNoiseRef.current.volume = 0.1; // 10% volume as per design spec

    // Create glass clink audio (placeholder - would need actual audio file)
    glassClinkRef.current = new Audio();
    glassClinkRef.current.volume = 0.2; // 20% volume as per design spec

    // Try to load audio files if they exist
    // In a real implementation, you would set the src to actual audio files
    // For example: whiteNoiseRef.current.src = '/sounds/white-noise.mp3';
    // For example: glassClinkRef.current.src = '/sounds/glass-clink.mp3';

    // Start playing white noise by default
    if (isPlaying) {
      whiteNoiseRef.current.play().catch(console.error);
    }

    return () => {
      // Cleanup
      if (whiteNoiseRef.current) {
        whiteNoiseRef.current.pause();
        whiteNoiseRef.current = null;
      }
      if (glassClinkRef.current) {
        glassClinkRef.current.pause();
        glassClinkRef.current = null;
      }
    };
  }, []);

  // Toggle white noise playback
  useEffect(() => {
    if (!whiteNoiseRef.current) return;

    if (isPlaying) {
      whiteNoiseRef.current.play().catch(console.error);
    } else {
      whiteNoiseRef.current.pause();
    }
  }, [isPlaying]);

  const toggleSound = () => {
    setIsPlaying(prev => !prev);
  };

  const playGlassClink = () => {
    if (!glassClinkRef.current) return;

    // Reset audio to start
    glassClinkRef.current.currentTime = 0;

    // Play the sound
    glassClinkRef.current.play().catch(console.error);
  };

  return {
    isPlaying,
    toggleSound,
    playGlassClink,
  };
};