import React, { useState, useEffect, useRef } from 'react';
import type { MoodType } from '@/types';
import { getMoodOption } from '@/constants';

interface LoadingCinematicProps {
  selectedMood: MoodType | null;
  /** 第一阶段：AI文本返回前的状态 */
  stage?: 'stage1' | 'stage2' | 'stage3';
  /** AI返回的定制参数（基酒、配料等） */
  aiTextData?: {
    baseSpirit?: string;
    ingredients?: string[];
    flavors?: string[];
  };
}


const LoadingCinematicComponent: React.FC<LoadingCinematicProps> = ({
  selectedMood,
  stage = 'stage1',
  aiTextData,
}) => {
  const [currentText, setCurrentText] = useState<string>('正在解析当下情绪');
  const [textQueue, setTextQueue] = useState<string[]>([]);
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textIndexRef = useRef<number>(0);

  const moodOption = selectedMood ? getMoodOption(selectedMood) : null;

  // 第一阶段固定文案
  const stage1Texts: string[] = [
    '正在解析当下情绪',
    '匹配专属风味调性',
    '甄选适配基酒原料',
  ];

  // 第二阶段动态文案模板
  const stage2TextTemplates: string[] = [
    '已为你甄选「{baseSpirit}」打底',
    '搭配定制原料：{ingredient1}和{ingredient2}',
    '调试情绪适配酒感比例',
    '静待酒体融合酝酿',
  ];

  // 无限轮播调酒话术池（用于长等待填充）
  const infiniteCocktailPhrases: string[] = [
    '专业酒保匀速摇杯醒酒',
    '激发层次香气迸发',
    '锁定专属情绪口感',
    '浓缩此刻心情风味',
    '精致杯具冰镇预处理',
    '点缀花艺果香装饰',
    '擦拭杯面精致收尾',
    '静待专属酒品成型',
    '调试酒体酸甜平衡',
    '加入独特香料调味',
    '融合情绪专属风味',
    '等待酒体充分融合',
    '创意装饰杯口边缘',
    '加入气泡提升口感',
    '调配完美酒体比例',
    '激发基酒原始风味',
    '融入当季新鲜水果',
    '等待香气充分释放',
    '精心调制情绪特调',
    '准备专属呈现方式',
  ];

  // 替换动态文案中的占位符，返回字符串数组
  const getStage2Texts = React.useCallback((): string[] => {
    if (!aiTextData) {
      return stage2TextTemplates.map(text =>
        text
          .replace('{baseSpirit}', '精选基酒')
          .replace('{ingredient1}', '特色原料')
          .replace('{ingredient2}', '独特风味')
      );
    }

    return stage2TextTemplates.map(text => {
      let result = text;

      // 替换基酒
      if (aiTextData.baseSpirit && result.includes('{baseSpirit}')) {
        result = result.replace('{baseSpirit}', aiTextData.baseSpirit);
      }

      // 替换配料
      if (aiTextData.ingredients) {
        const ingredient1 = aiTextData.ingredients[0] || '精选配料';
        const ingredient2 = aiTextData.ingredients[1] || (aiTextData.ingredients[0] ? '独特香料' : '特色风味');

        if (result.includes('{ingredient1}') && result.includes('{ingredient2}')) {
          result = result.replace('{ingredient1}', ingredient1).replace('{ingredient2}', ingredient2);
        } else if (result.includes('{ingredients}')) {
          const ingredientsStr = aiTextData.ingredients.slice(0, 3).join('、');
          result = result.replace('{ingredients}', ingredientsStr);
        }
      }

      return result;
    });
  }, [aiTextData]); // 依赖aiTextData

  // 获取当前阶段的核心文案
  const getCurrentStageTexts = React.useCallback((): string[] => {
    if (stage === 'stage1') {
      return stage1Texts;
    } else if (stage === 'stage2') {
      return getStage2Texts();
    } else {
      return []; // stage3: 不显示文案
    }
  }, [stage, aiTextData]); // 依赖stage和aiTextData

  // 补充队列函数 - 当队列少于3条时自动补充
  const replenishQueue = React.useCallback(() => {
    if (stage === 'stage3') return; // 阶段3不补充

    setTextQueue(prev => {
      // 如果队列已经有3条或更多，不需要补充
      if (prev.length >= 3) return prev;

      const currentStageTexts = getCurrentStageTexts();
      const newQueue = [...prev];
      const neededCount = 3 - newQueue.length;

      // 如果当前阶段有核心文案，优先使用
      if (currentStageTexts.length > 0) {
        // 从当前阶段文案中选取，避免重复
        const usedCount = textIndexRef.current;
        const availableTexts = currentStageTexts.slice(usedCount);
        const textsToAdd = availableTexts.slice(0, neededCount);

        if (textsToAdd.length > 0) {
          newQueue.push(...textsToAdd);
          textIndexRef.current += textsToAdd.length;
        }

        // 如果还需要更多文案，使用无限轮播话术
        const stillNeeded = 3 - newQueue.length;
        if (stillNeeded > 0) {
          for (let i = 0; i < stillNeeded; i++) {
            const randomPhrase = infiniteCocktailPhrases[
              Math.floor(Math.random() * infiniteCocktailPhrases.length)
            ];
            newQueue.push(randomPhrase);
          }
        }
      } else {
        // 直接使用无限轮播话术填充所需数量
        for (let i = 0; i < neededCount; i++) {
          const randomPhrase = infiniteCocktailPhrases[
            Math.floor(Math.random() * infiniteCocktailPhrases.length)
          ];
          newQueue.push(randomPhrase);
        }
      }

      return newQueue;
    });
  }, [stage, getCurrentStageTexts]); // 不再依赖textQueue.length

  // 阶段变化处理
  const prevStageRef = useRef<'stage1' | 'stage2' | 'stage3'>(stage);

  useEffect(() => {
    if (stage === 'stage3') {
      // 阶段3：停止所有动画，清空队列
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setCurrentText('');
      setTextQueue([]);
      prevStageRef.current = stage;
      return;
    }

    // 首次加载或从阶段3进入：完全初始化
    if (prevStageRef.current === 'stage3' || prevStageRef.current === undefined) {
      const initialTexts = getCurrentStageTexts();
      if (initialTexts.length > 0) {
        // 首屏秒显：立即显示第一条
        setCurrentText(initialTexts[0]);
        // 剩余文案加入队列
        setTextQueue(initialTexts.slice(1));
        textIndexRef.current = initialTexts.length;
      } else {
        // 如果没有核心文案，使用无限轮播话术
        const randomPhrase = infiniteCocktailPhrases[
          Math.floor(Math.random() * infiniteCocktailPhrases.length)
        ];
        setCurrentText(randomPhrase);
        // 添加一条到队列，确保计时器能正常工作
        const secondPhrase = infiniteCocktailPhrases[
          Math.floor(Math.random() * infiniteCocktailPhrases.length)
        ];
        setTextQueue([secondPhrase]);
      }
    } else if (prevStageRef.current !== stage) {
      // 阶段变化（stage1→stage2）：不打断当前文字，只更新队列
      const newStageTexts = getCurrentStageTexts();
      if (newStageTexts.length > 0) {
        // 将新阶段文案添加到队列末尾，避免重复当前显示的文字
        setTextQueue(prev => {
          const newQueue = [...prev];
          // 跳过可能已经在显示或队列中的文案
          const usedCount = textIndexRef.current;
          const availableTexts = newStageTexts.slice(usedCount);
          newQueue.push(...availableTexts);
          textIndexRef.current += availableTexts.length;
          return newQueue;
        });
      }
    }

    prevStageRef.current = stage;
  }, [stage, getCurrentStageTexts]);

  // 文字切换定时器
  useEffect(() => {
    if (stage === 'stage3') return;

    // 如果队列为空，立即补充队列
    if (textQueue.length === 0) {
      replenishQueue();
      return;
    }

    // 每行文字显示时间（毫秒）
    const displayTime = stage === 'stage1' ? 2000 : 1500; // 阶段1稍慢，阶段2正常

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      // 开始退出动画
      setIsExiting(true);

      // 等待退出动画完成（300ms）
      setTimeout(() => {
        // 切换到下一行文字
        const [nextText, ...remainingQueue] = textQueue;
        setCurrentText(nextText);
        setTextQueue(remainingQueue);

        // 结束退出动画
        setIsExiting(false);

        // 检查是否需要补充队列
        if (remainingQueue.length < 3) {
          replenishQueue();
        }
      }, 300);
    }, displayTime);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [stage, textQueue, replenishQueue]);

  // 自定义动画样式已通过Tailwind实现，无需额外添加

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-6">
      {/* 主要内容区域 - 垂直水平居中 */}
      <div className="flex flex-col items-center justify-center w-full max-w-md">
        {/* 旋转酒杯图标 */}
        <div className="mb-12">
          <div className={`text-7xl sm:text-8xl lg:text-9xl ${stage !== 'stage3' ? 'animate-rotate animate-shake' : ''}`}>
            🍸
          </div>
        </div>

        {/* 单行字幕显示区域 */}
        <div className="relative w-full min-h-[120px] flex items-center justify-center mb-8">
          {/* 当前显示的文字 - 透明底色，裸字展示 */}
          {stage !== 'stage3' && currentText && (
            <div
              className={`
                text-center font-serif text-mood-gold
                text-2xl sm:text-3xl lg:text-4xl
                transition-all duration-300
                ${isExiting ? 'opacity-0 transform -translate-y-5' : 'opacity-100 transform translate-y-0'}
              `}
              style={{
                fontFamily: '"Noto Serif SC", serif',
                fontWeight: 400,
                letterSpacing: '0.05em',
                lineHeight: '1.5',
                textShadow: '0 2px 12px rgba(212, 175, 55, 0.3)',
              }}
            >
              {currentText}
            </div>
          )}

          {/* 阶段3时不显示文字 */}
          {stage === 'stage3' && (
            <div className="text-center font-sans text-mood-cream text-lg">
              调酒完成，正在呈现...
            </div>
          )}
        </div>

        {/* 当前情绪提示 */}
        {moodOption && stage !== 'stage3' && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-mood-dark/30 backdrop-blur-sm rounded-full border border-mood-gold/20">
              <span className="text-sm text-mood-cream/90 tracking-wide">当前情绪：</span>
              <span className="text-sm font-medium text-mood-gold tracking-wider">{moodOption.label}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const arePropsEqual = (prevProps: LoadingCinematicProps, nextProps: LoadingCinematicProps) => {
  // 深度比较selectedMood
  if (prevProps.selectedMood !== nextProps.selectedMood) return false;

  // 比较stage
  if (prevProps.stage !== nextProps.stage) return false;

  // 浅比较aiTextData（因为结构简单）
  if (prevProps.aiTextData?.baseSpirit !== nextProps.aiTextData?.baseSpirit) return false;
  if (JSON.stringify(prevProps.aiTextData?.ingredients) !== JSON.stringify(nextProps.aiTextData?.ingredients)) return false;
  if (JSON.stringify(prevProps.aiTextData?.flavors) !== JSON.stringify(nextProps.aiTextData?.flavors)) return false;

  return true;
};

const LoadingCinematic = React.memo(LoadingCinematicComponent, arePropsEqual);
export default LoadingCinematic;