import { useState, useRef, useCallback, useEffect } from 'react';

interface UseAudioReturn {
  isPlaying: boolean;
  toggle: () => void;
  play: () => void;
  pause: () => void;
  playSoundEffect: (type: 'shake' | 'pour') => void;
}

// Background music URL - using local cocktail.mp3
const BACKGROUND_MUSIC_URL = '/cocktail.mp3';

export function useAudio(): UseAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const isPlayingRef = useRef(false);

  // Initialize audio on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (!audioRef.current) {
        console.log('Initializing audio with URL:', BACKGROUND_MUSIC_URL);
        const audio = new Audio(BACKGROUND_MUSIC_URL);
        audio.loop = true;
        audio.volume = 0.3;
        audio.preload = 'auto';

        // 监听音频加载事件
        audio.addEventListener('canplaythrough', () => {
          console.log('Audio loaded and ready to play, readyState:', audio.readyState);
          setIsInitialized(true);
          setIsLoading(false);
        }, { once: true });

        audio.addEventListener('error', (e) => {
          console.error('Audio loading error:', e, 'Error details:', audio.error);
          setIsLoading(false);
        });

        audio.addEventListener('loadstart', () => {
          console.log('Audio loading started');
        });

        audio.addEventListener('progress', () => {
          console.log('Audio loading progress, readyState:', audio.readyState);
        });

        audioRef.current = audio;
        setIsLoading(true);

        // 开始加载音频
        audio.load();
      }
    };

    // Listen for first interaction
    const handleInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);

      // Clean up audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const play = useCallback(async () => {
    if (!audioRef.current || isPlayingRef.current) return;

    try {
      isPlayingRef.current = true;
      setIsPlaying(true);

      // 如果有正在进行的play promise，先暂停
      if (playPromiseRef.current) {
        try {
          await playPromiseRef.current;
        } catch (e) {
          // 忽略之前的play promise错误
        }
      }

      // 重置音频到开始位置以确保可以播放
      if (audioRef.current.currentTime > 0) {
        audioRef.current.currentTime = 0;
      }

      const playPromise = audioRef.current.play();
      playPromiseRef.current = playPromise;

      await playPromise;
      playPromiseRef.current = null;
    } catch (err) {
      console.log('Audio play failed:', err);
      isPlayingRef.current = false;
      setIsPlaying(false);
      playPromiseRef.current = null;

      // 如果是AbortError，可能是用户快速切换，不认为是错误
      if (err.name !== 'AbortError') {
        console.error('Audio playback error:', err);
      }
    }
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current || !isPlayingRef.current) return;

    // 先更新状态
    isPlayingRef.current = false;
    setIsPlaying(false);

    // 暂停音频
    audioRef.current.pause();

    // 清空play promise
    playPromiseRef.current = null;
  }, []);

  const toggle = useCallback(async () => {
    if (isLoading) return; // 加载中不响应

    if (isPlayingRef.current) {
      pause();
    } else {
      // 如果音频未初始化，先初始化
      if (!isInitialized && !audioRef.current) {
        const audio = new Audio(BACKGROUND_MUSIC_URL);
        audio.loop = true;
        audio.volume = 0.3;
        audio.preload = 'auto';

        // 添加事件监听器
        audio.addEventListener('canplaythrough', () => {
          console.log('Audio initialized manually');
          setIsInitialized(true);
          setIsLoading(false);
        }, { once: true });

        audio.addEventListener('error', (e) => {
          console.error('Audio initialization error:', e);
          setIsLoading(false);
        });

        audioRef.current = audio;
        setIsLoading(true);
        audio.load();
      }

      await play();
    }
  }, [isLoading, isInitialized, play, pause]);

  // Play sound effects
  const playSoundEffect = useCallback((type: 'shake' | 'pour') => {
    // Create a simple oscillator-based sound effect
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      if (type === 'shake') {
        // Shaking ice sound simulation
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);

        // Second shake
        setTimeout(() => {
          const osc2 = audioContext.createOscillator();
          const gain2 = audioContext.createGain();
          osc2.connect(gain2);
          gain2.connect(audioContext.destination);
          osc2.frequency.setValueAtTime(600, audioContext.currentTime);
          osc2.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1);
          gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
          osc2.start(audioContext.currentTime);
          osc2.stop(audioContext.currentTime + 0.15);
        }, 200);
      } else if (type === 'pour') {
        // Pouring liquid sound simulation
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(150, audioContext.currentTime + 1);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
      }
    } catch (error) {
      console.log('Sound effect failed:', error);
    }
  }, []);

  return {
    isPlaying,
    toggle,
    play,
    pause,
    playSoundEffect
  };
}
