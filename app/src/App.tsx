import { useState, useEffect, useCallback } from 'react';
import FluidBackground from '@/components/FluidBackground';
import MusicToggle from '@/components/MusicToggle';
import SplashPage from '@/components/SplashPage';
import MoodSelectPage from '@/components/MoodSelectPage';
import LoadingCinematic from '@/components/LoadingCinematic';
import CocktailCard from '@/components/CocktailCard';
import ShareOverlay from '@/components/ShareOverlay';
import { useAudio } from '@/hooks/useAudio';
import { generateCocktail } from '@/services/aiGenerate';
import type { MoodType, Cocktail, PageType } from '@/types';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('splash');
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [currentCocktail, setCurrentCocktail] = useState<Cocktail | null>(null);
  const [showShareOverlay, setShowShareOverlay] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'stage1' | 'stage2' | 'stage3'>('stage1');
  const [aiTextData, setAiTextData] = useState<{
    baseSpirit?: string;
    ingredients?: string[];
    flavors?: string[];
  }>({});

  const { isPlaying, toggle, playSoundEffect } = useAudio();

  // Handle URL parameters for shared cocktails
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const moodParam = params.get('mood') as MoodType;
    const cocktailParam = params.get('cocktail');
    
    if (moodParam && cocktailParam) {
      // In a real app, we would fetch the shared cocktail from a backend
      // For now, we'll generate a new one with the same mood
      setSelectedMood(moodParam);
      handleGenerateCocktail(moodParam);
    }
  }, []);

  const handleEnter = useCallback(() => {
    setCurrentPage('mood-select');
  }, []);

  const handleSelectMood = useCallback((mood: MoodType) => {
    setSelectedMood(mood);
  }, []);

  const handleGenerateCocktail = useCallback(async (mood: MoodType) => {
    setCurrentPage('loading');
    setLoadingStage('stage1');
    setAiTextData({});

    // Play shake sound effect
    playSoundEffect('shake');

    try {
      // 阶段1: 调用API，等待文本AI返回
      const cocktail = await generateCocktail(mood);

      // 阶段2: 文本AI返回，提取基酒和配料信息
      const baseSpirit = cocktail.ingredients?.[0] || '精选基酒';
      const ingredients = cocktail.ingredients?.slice(1) || [];

      setAiTextData({
        baseSpirit,
        ingredients,
        flavors: [], // 可以从其他字段提取
      });
      setLoadingStage('stage2');
      setCurrentCocktail(cocktail);

      // 阶段2持续一段时间，让用户看到动态文案
      const stage2Duration = 6000; // 6秒

      // 如果有图片生成ID，说明图片AI已经开始生成
      if (cocktail.imageGenerationId) {
        // 阶段2后切换到阶段3
        setTimeout(() => {
          setLoadingStage('stage3');
          // 阶段3短暂展示后切换到成品页
          setTimeout(() => {
            setCurrentPage('cocktail-card');
          }, 1500);
        }, stage2Duration);
      } else {
        // 如果没有图片生成，阶段2后直接切换到成品页
        setTimeout(() => {
          setCurrentPage('cocktail-card');
        }, stage2Duration + 1000);
      }
    } catch (error) {
      console.error('Failed to generate cocktail:', error);
      // Fallback: go back to mood select
      setCurrentPage('mood-select');
    }
  }, [playSoundEffect]);

  const handleMixCocktail = useCallback(() => {
    if (selectedMood) {
      handleGenerateCocktail(selectedMood);
    }
  }, [selectedMood, handleGenerateCocktail]);

  const handleRemix = useCallback(() => {
    setSelectedMood(null);
    setCurrentCocktail(null);
    setCurrentPage('mood-select');
  }, []);

  const handleShare = useCallback(() => {
    setShowShareOverlay(true);
    
    // Copy share link to clipboard
    if (currentCocktail) {
      const shareUrl = `${window.location.origin}?mood=${currentCocktail.mood}&cocktail=${currentCocktail.id}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        console.log('Share link copied:', shareUrl);
      }).catch(err => {
        console.log('Failed to copy link:', err);
      });
    }
  }, [currentCocktail]);

  const handleCloseShare = useCallback(() => {
    setShowShareOverlay(false);
  }, []);

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'splash':
        return <SplashPage onEnter={handleEnter} />;
      
      case 'mood-select':
        return (
          <MoodSelectPage
            onSelectMood={handleSelectMood}
            onMixCocktail={handleMixCocktail}
            selectedMood={selectedMood}
          />
        );
      
      case 'loading':
        return (
          <LoadingCinematic
            selectedMood={selectedMood}
            stage={loadingStage}
            aiTextData={aiTextData}
          />
        );
      
      case 'cocktail-card':
        if (!currentCocktail) return null;
        return (
          <CocktailCard
            cocktail={currentCocktail}
            onRemix={handleRemix}
            onShare={handleShare}
          />
        );
      
      default:
        return <SplashPage onEnter={handleEnter} />;
    }
  };

  return (
    <FluidBackground>
      {/* Music Toggle */}
      <MusicToggle isPlaying={isPlaying} onToggle={toggle} />
      
      {/* Main Content */}
      <main className="min-h-screen">
        {renderPage()}
      </main>
      
      {/* Share Overlay */}
      {showShareOverlay && currentCocktail && (
        <ShareOverlay
          cocktail={currentCocktail}
          onClose={handleCloseShare}
        />
      )}
    </FluidBackground>
  );
}

export default App;
