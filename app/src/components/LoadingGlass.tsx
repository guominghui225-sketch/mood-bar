import React from 'react';
import type { MoodType } from '@/types';
import { getMoodOption } from '@/constants';

interface LoadingGlassProps {
  message?: string;
  selectedMood: MoodType | null;
}

const LoadingGlass: React.FC<LoadingGlassProps> = ({
  message = '正在调制你的情绪特调...',
  selectedMood
}) => {
  // 获取情绪对应的颜色
  const moodOption = selectedMood ? getMoodOption(selectedMood) : null;
  const liquidColor = moodOption?.color || '#C8A97E'; // 默认金色

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      {/* 动画主容器 - 10秒动画序列 */}
      <div className="relative w-80 h-80 mb-8 bg-black rounded-2xl">

        {/* 步骤1: 倒酒 (0-2秒) */}
        <div className="absolute inset-0 flex items-center justify-center animate-step-1">
          {/* 高玻璃杯 (Highball Glass) */}
          <svg viewBox="0 0 100 100" className="absolute w-32 h-48">
            {/* 玻璃杯轮廓 - 白色线条 */}
            <path
              d="M30 20C30 20 35 70 50 70C65 70 70 20 70 20"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <line x1="30" y1="20" x2="70" y2="20" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="50" y1="70" x2="50" y2="80" stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>

          {/* 量酒器 (Jigger) */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2">
            <div className="relative">
              {/* 量酒器轮廓 */}
              <svg viewBox="0 0 40 60" className="w-10 h-15">
                <path
                  d="M5 0L5 40C5 45 15 45 15 40L15 0"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <ellipse cx="10" cy="40" rx="8" ry="3" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
              </svg>

              {/* 液体流出弧线 */}
              <div
                className="absolute top-12 left-1/2 -translate-x-1/2 w-1.5 h-20 rounded-b-full animate-liquid-pour"
                style={{ backgroundColor: liquidColor }}
              />
            </div>
          </div>

          {/* 玻璃杯中的液体 */}
          <div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 w-24 h-8 rounded-t-full"
            style={{ backgroundColor: liquidColor, opacity: 0.8 }}
          />
        </div>

        {/* 步骤2: 加冰 (2-4秒) */}
        <div className="absolute inset-0 flex items-center justify-center animate-step-2">
          {/* 冰块托盘 */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={`tray-${i}`}
                  className="w-4 h-4 border border-white rounded-sm opacity-70"
                />
              ))}
            </div>
          </div>

          {/* 冰块掉落动画 */}
          {[...Array(3)].map((_, i) => (
            <div
              key={`ice-${i}`}
              className="absolute w-3 h-3 border border-white rounded-sm"
              style={{
                top: '10px',
                left: `${40 + i * 15}%`,
                animation: `ice-fall 0.8s ease-in forwards ${i * 0.1 + 0.2}s`
              }}
            />
          ))}

          {/* 玻璃杯（保持） */}
          <svg viewBox="0 0 100 100" className="absolute w-32 h-48">
            <path
              d="M30 20C30 20 35 70 50 70C65 70 70 20 70 20"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <line x1="30" y1="20" x2="70" y2="20" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="50" y1="70" x2="50" y2="80" stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>

          {/* 液体（已加冰） */}
          <div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 w-24 h-10 rounded-t-full"
            style={{ backgroundColor: liquidColor, opacity: 0.8 }}
          />
        </div>

        {/* 步骤3: 摇酒准备 (4-5秒) */}
        <div className="absolute inset-0 flex items-center justify-center animate-step-3">
          {/* 调酒器上半部分 */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2">
            <div className="w-20 h-6 border border-white rounded-full opacity-80" />
            <div className="w-16 h-8 border-l border-r border-b border-white rounded-b-lg opacity-80 mx-auto" />
          </div>

          {/* 手 */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2">
            <svg viewBox="0 0 40 60" className="w-8 h-12 animate-shake">
              <path
                d="M10 0C10 0 5 15 15 25C25 35 20 50 10 55C0 60 5 40 10 30"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* 步骤4: 滤酒 (6-8秒) */}
        <div className="absolute inset-0 flex items-center justify-center animate-step-4">
          {/* 调酒器倾倒 */}
          <div className="absolute top-20 left-1/3">
            <div className="relative">
              {/* 调酒器主体 */}
              <svg viewBox="0 0 60 80" className="w-12 h-16" style={{ transform: 'rotate(45deg)' }}>
                <path
                  d="M10 0L10 50C10 55 40 55 40 50L40 0"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <ellipse cx="25" cy="50" rx="18" ry="5" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
              </svg>

              {/* 滤网 */}
              <div className="absolute top-8 right-0 w-4 h-6">
                <div className="h-full border-r border-white opacity-60" />
                <div className="absolute inset-0 flex flex-col gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <div key={`strainer-${i}`} className="w-full h-0.5 bg-white opacity-40" />
                  ))}
                </div>
              </div>

              {/* 倒出的液体 */}
              <div
                className="absolute top-12 right-2 w-1.5 h-16 rounded-b-full animate-liquid-pour-2"
                style={{ backgroundColor: liquidColor }}
              />
            </div>
          </div>

          {/* 马提尼杯 (Martini Glass) */}
          <div className="absolute bottom-20 right-1/3">
            <svg viewBox="0 0 80 80" className="w-14 h-14">
              <path d="M20 50L40 20L60 50" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
              <line x1="40" y1="20" x2="40" y2="5" stroke="#FFFFFF" strokeWidth="1.5" />
              <ellipse cx="40" cy="50" rx="15" ry="3" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
            </svg>

            {/* 马提尼杯中的液体 */}
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-6 rounded-t-full animate-liquid-fill-2"
              style={{ backgroundColor: liquidColor, opacity: 0.8 }}
            />
          </div>
        </div>

        {/* 步骤5: 装饰 (8-9秒) */}
        <div className="absolute inset-0 flex items-center justify-center animate-step-5">
          {/* 马提尼杯（已满） */}
          <div className="absolute bottom-20 right-1/3">
            <svg viewBox="0 0 80 80" className="w-14 h-14">
              <path d="M20 50L40 20L60 50" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
              <line x1="40" y1="20" x2="40" y2="5" stroke="#FFFFFF" strokeWidth="1.5" />
              <ellipse cx="40" cy="50" rx="15" ry="3" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
            </svg>

            {/* 满的液体 */}
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-8 rounded-t-full"
              style={{ backgroundColor: liquidColor, opacity: 0.8 }}
            />
          </div>

          {/* 柠檬切片飞入 */}
          <div
            className="absolute right-1/4 bottom-24 animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="relative">
              <div className="w-6 h-6 border border-white rounded-full opacity-80">
                <div className="absolute inset-1 border border-white rounded-full opacity-50" />
              </div>
            </div>
          </div>
        </div>

        {/* 步骤6: 成品 (9-10秒) */}
        <div className="absolute inset-0 flex items-center justify-center animate-step-6">
          {/* 小碟子 */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
            <div className="w-20 h-2 border border-white rounded-full opacity-70" />
          </div>

          {/* 装饰好的鸡尾酒 */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
            <svg viewBox="0 0 80 80" className="w-14 h-14">
              <path d="M20 50L40 20L60 50" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
              <line x1="40" y1="20" x2="40" y2="5" stroke="#FFFFFF" strokeWidth="1.5" />
              <ellipse cx="40" cy="50" rx="15" ry="3" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
            </svg>

            {/* 液体 */}
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-8 rounded-t-full"
              style={{ backgroundColor: liquidColor, opacity: 0.8 }}
            />

            {/* 柠檬装饰 */}
            <div className="absolute -right-2 bottom-8">
              <div className="w-4 h-4 border border-white rounded-full opacity-80">
                <div className="absolute inset-0.5 border border-white rounded-full opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 加载消息 */}
      <p className="text-mood-cream text-base font-sans font-light tracking-wide animate-pulse">
        {message}
      </p>

      {/* 加载圆点 */}
      <div className="flex gap-2 mt-4">
        <span className="w-2 h-2 rounded-full bg-mood-gold animate-bounce" style={{ animationDelay: '0s' }} />
        <span className="w-2 h-2 rounded-full bg-mood-gold animate-bounce" style={{ animationDelay: '0.2s' }} />
        <span className="w-2 h-2 rounded-full bg-mood-gold animate-bounce" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
};

export default LoadingGlass;