// Mood Bar Types

export type MoodType = 
  | 'happy' 
  | 'tired' 
  | 'anxious' 
  | 'calm' 
  | 'lonely' 
  | 'energetic' 
  | 'sad' 
  | 'healing';

export interface MoodOption {
  id: MoodType;
  label: string;
  color: string;
  baseSpirit: string;
  flavor: string;
  description: string;
}

export interface Cocktail {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  alcoholContent: number;
  glassType: string;
  color1: string;
  color2: string;
  imageUrl: string | null;
  imageGenerationId: string | null;
  imageStatus?: 'pending' | 'generating' | 'completed' | 'failed';
  imageStatusMessage?: string;
  mood: MoodType;
  moodLabel: string;
  generatedAt?: string;
  debugInfo?: {
    doubaoPrompt: string;
    klingPrompt: string;
    promptLengths: {
      doubao: number;
      kling: number;
    };
    generatedAt: string;
  };
}

export type PageType = 'splash' | 'mood-select' | 'loading' | 'cocktail-card' | 'share';

export interface AppState {
  currentPage: PageType;
  selectedMood: MoodType | null;
  currentCocktail: Cocktail | null;
  isMusicPlaying: boolean;
  isGenerating: boolean;
}

export interface GenerateCocktailRequest {
  mood: MoodType;
  moodLabel: string;
}

export interface GenerateCocktailResponse {
  name: string;
  description: string;
  ingredients: string[];
  alcoholContent: number;
  imagePrompt: string;
}

// API Response Interfaces
export interface ApiCocktailResponse {
  success: boolean;
  message: string;
  data: Cocktail;
}

export interface ApiImageStatusResponse {
  success: boolean;
  generationId: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  estimatedTime: string;
  imageUrl?: string;
  message: string;
}
