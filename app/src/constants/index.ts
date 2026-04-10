/**
 * Mood Bar 前端常量
 */

import type { MoodType, MoodOption } from '@/types';

export const moodOptions: MoodOption[] = [
  {
    id: 'happy',
    label: '😊开心愉悦',
    color: '#E8B4D9',
    baseSpirit: '金酒',
    flavor: '甜口',
    description: '明亮粉紫调，口感甜口，突出快乐松弛感'
  },
  {
    id: 'tired',
    label: '😫疲惫倦怠',
    color: '#8B6F4E',
    baseSpirit: '威士忌',
    flavor: '醇厚',
    description: '暖棕调，口感醇厚，突出治愈放松'
  },
  {
    id: 'anxious',
    label: '😰焦虑烦躁',
    color: '#5A9A9A',
    baseSpirit: '金酒',
    flavor: '清爽',
    description: '清透蓝绿冷调，口感清爽，突出平静舒缓'
  },
  {
    id: 'calm',
    label: '😌平静松弛',
    color: '#D4D4C8',
    baseSpirit: '清酒',
    flavor: '柔和',
    description: '米白浅绿调，口感柔和，突出宁静自在'
  },
  {
    id: 'lonely',
    label: '😔孤独 emo',
    color: '#4A2C3A',
    baseSpirit: '威士忌',
    flavor: '浓郁',
    description: '墨黑酒红调，口感浓郁，突出陪伴自愈'
  },
  {
    id: 'energetic',
    label: '😄元气满满',
    color: '#F4A261',
    baseSpirit: '朗姆酒',
    flavor: '清爽有活力',
    description: '橙黄亮色调，口感清爽有活力，突出元气向上'
  },
  {
    id: 'sad',
    label: '😭难过低落',
    color: '#6B3A5A',
    baseSpirit: '红酒',
    flavor: '温柔',
    description: '酒红暗紫调，口感温柔，突出慰藉释然'
  },
  {
    id: 'healing',
    label: '💆治愈放空',
    color: '#E8E0E8',
    baseSpirit: '金酒',
    flavor: '梦幻柔和',
    description: '粉白银色调，口感梦幻柔和，突出放空自愈'
  }
];

/**
 * 根据情绪类型获取标签
 */
export function getMoodLabel(mood: MoodType): string {
  const option = moodOptions.find(opt => opt.id === mood);
  return option?.label || mood;
}

/**
 * 根据情绪类型获取完整选项
 */
export function getMoodOption(mood: MoodType): MoodOption | undefined {
  return moodOptions.find(opt => opt.id === mood);
}