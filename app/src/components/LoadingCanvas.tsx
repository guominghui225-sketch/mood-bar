import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { MoodType } from '@/types';
import { getMoodOption } from '@/constants';

interface LoadingCanvasProps {
  message?: string;
  selectedMood: MoodType | null;
}

interface AnimationState {
  startTime: number;
  elapsedTime: number;
  isPlaying: boolean;
}

interface Point {
  x: number;
  y: number;
}

const LoadingCanvas: React.FC<LoadingCanvasProps> = ({
  message = '正在调制你的情绪特调...',
  selectedMood
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [animationState, setAnimationState] = useState<AnimationState>({
    startTime: 0,
    elapsedTime: 0,
    isPlaying: false
  });

  // 获取情绪颜色
  const moodOption = selectedMood ? getMoodOption(selectedMood) : null;
  const liquidColor = moodOption?.color || '#C8A97E';

  // 绘制高玻璃杯
  const drawHighballGlass = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    ctx.save();
    ctx.translate(x, y);

    // 玻璃杯轮廓
    ctx.beginPath();
    ctx.moveTo(-width / 3, 0);
    ctx.quadraticCurveTo(-width / 6, height * 0.6, 0, height * 0.7);
    ctx.quadraticCurveTo(width / 6, height * 0.6, width / 3, 0);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 杯口
    ctx.beginPath();
    ctx.moveTo(-width / 3, 0);
    ctx.lineTo(width / 3, 0);
    ctx.stroke();

    // 杯脚
    ctx.beginPath();
    ctx.moveTo(0, height * 0.7);
    ctx.lineTo(0, height * 0.8);
    ctx.stroke();

    ctx.restore();
  }, []);

  // 绘制量酒器
  const drawJigger = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, rotation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);

    // 量酒器轮廓
    ctx.beginPath();
    ctx.moveTo(-width / 8, -height / 2);
    ctx.lineTo(-width / 8, height * 0.2);
    ctx.quadraticCurveTo(-width / 8, height * 0.3, 0, height * 0.3);
    ctx.quadraticCurveTo(width / 8, height * 0.3, width / 8, height * 0.2);
    ctx.lineTo(width / 8, -height / 2);
    ctx.closePath();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 底部椭圆
    ctx.beginPath();
    ctx.ellipse(0, height * 0.2, width / 5, height * 0.05, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }, []);

  // 绘制马提尼杯
  const drawMartiniGlass = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    ctx.save();
    ctx.translate(x, y);

    // 杯壁
    ctx.beginPath();
    ctx.moveTo(-width / 3, height * 0.4);
    ctx.lineTo(0, height * 0.1);
    ctx.lineTo(width / 3, height * 0.4);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 杯脚
    ctx.beginPath();
    ctx.moveTo(0, height * 0.1);
    ctx.lineTo(0, 0);
    ctx.stroke();

    // 杯底椭圆
    ctx.beginPath();
    ctx.ellipse(0, height * 0.4, width / 4, height * 0.03, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }, []);

  // 绘制冰块
  const drawIceCube = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.strokeRect(-size / 2, -size / 2, size, size);

    ctx.restore();
  }, []);

  // 绘制调酒器
  const drawShaker = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, rotation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);

    // 顶部
    ctx.beginPath();
    ctx.ellipse(0, -height / 3, width / 2, height * 0.1, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 主体
    ctx.beginPath();
    ctx.moveTo(-width / 4, -height / 3);
    ctx.lineTo(-width / 4, height / 3);
    ctx.quadraticCurveTo(-width / 4, height / 2, 0, height / 2);
    ctx.quadraticCurveTo(width / 4, height / 2, width / 4, height / 3);
    ctx.lineTo(width / 4, -height / 3);
    ctx.stroke();

    // 底部椭圆
    ctx.beginPath();
    ctx.ellipse(0, height / 2, width / 3, height * 0.06, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }, []);

  // 绘制手
  const drawHand = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    ctx.save();
    ctx.translate(x, y);

    ctx.beginPath();
    ctx.moveTo(-width / 4, -height / 4);
    ctx.bezierCurveTo(-width / 3, height / 6, -width / 6, height / 2, width / 8, height / 3);
    ctx.bezierCurveTo(width / 4, height * 0.7, width / 6, height * 0.9, -width / 8, height * 0.9);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }, []);

  // 绘制滤网
  const drawStrainer = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    ctx.save();
    ctx.translate(x, y);

    // 滤网边框
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.strokeRect(-width / 2, -height / 2, width, height);

    // 滤网线
    for (let i = -height / 2 + 5; i < height / 2; i += 5) {
      ctx.beginPath();
      ctx.moveTo(-width / 2, i);
      ctx.lineTo(width / 2, i);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    ctx.restore();
  }, []);

  // 绘制柠檬片
  const drawLemonSlice = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    ctx.translate(x, y);

    // 外圆
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 内圆
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.restore();
  }, []);

  // 绘制液体流动
  const drawLiquidPour = useCallback((
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    width: number,
    progress: number
  ) => {
    ctx.save();

    // 液体流动路径
    const controlY = startY + (endY - startY) * 0.3;
    const currentY = startY + (endY - startY) * progress;

    // 计算贝塞尔曲线控制点
    const cp1x = startX + (endX - startX) * 0.3;
    const cp1y = controlY;
    const cp2x = startX + (endX - startX) * 0.7;
    const cp2y = controlY;

    // 绘制液体流
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, currentY);

    // 液体截面
    const liquidPath = new Path2D();
    liquidPath.moveTo(startX - width / 2, startY);
    liquidPath.bezierCurveTo(cp1x - width / 2, cp1y, cp2x - width / 2, cp2y, endX - width / 2, currentY);
    liquidPath.lineTo(endX + width / 2, currentY);
    liquidPath.bezierCurveTo(cp2x + width / 2, cp2y, cp1x + width / 2, cp1y, startX + width / 2, startY);
    liquidPath.closePath();

    ctx.fillStyle = liquidColor;
    ctx.globalAlpha = 0.8;
    ctx.fill(liquidPath);
    ctx.globalAlpha = 1;

    ctx.restore();
  }, [liquidColor]);

  // 绘制液体填充
  const drawLiquidFill = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    fillProgress: number,
    isMartini: boolean = false
  ) => {
    ctx.save();
    ctx.translate(x, y);

    const fillHeight = height * fillProgress;

    // 液体渐变
    const gradient = ctx.createLinearGradient(0, 0, 0, -fillHeight);
    gradient.addColorStop(0, liquidColor);
    gradient.addColorStop(0.5, `${liquidColor}CC`);
    gradient.addColorStop(1, `${liquidColor}99`);

    ctx.fillStyle = gradient;

    if (isMartini) {
      // 马提尼杯液体形状（三角形）
      ctx.beginPath();
      const topWidth = width * (1 - fillProgress * 0.5);
      ctx.moveTo(-topWidth / 2, -fillHeight);
      ctx.lineTo(topWidth / 2, -fillHeight);
      ctx.lineTo(width / 4, 0);
      ctx.lineTo(-width / 4, 0);
      ctx.closePath();
    } else {
      // 高玻璃杯液体形状（弧形）
      ctx.beginPath();
      const topWidth = width * (0.7 + fillProgress * 0.3);
      ctx.ellipse(0, -fillHeight, topWidth / 2, height * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();

      // 侧面
      ctx.beginPath();
      ctx.moveTo(-topWidth / 2, -fillHeight);
      ctx.quadraticCurveTo(-width / 4, 0, -width / 3, 0);
      ctx.lineTo(width / 3, 0);
      ctx.quadraticCurveTo(width / 4, 0, topWidth / 2, -fillHeight);
      ctx.closePath();
    }

    ctx.fill();

    // 液体表面波动
    if (fillProgress > 0.1) {
      ctx.beginPath();
      const waveOffset = Math.sin(Date.now() * 0.005) * 2;
      ctx.ellipse(0, -fillHeight + waveOffset, width * 0.4, height * 0.03, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `${liquidColor}CC`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.restore();
  }, [liquidColor]);

  // 绘制气泡
  const drawBubble = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number, progress: number) => {
    ctx.save();
    ctx.translate(x, y);

    const currentSize = size * (0.5 + progress * 0.5);
    const opacity = 0.8 * (1 - progress);

    ctx.beginPath();
    ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
    ctx.fill();

    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();

    ctx.restore();
  }, []);

  // 主要绘制函数
  const drawAnimation = useCallback((ctx: CanvasRenderingContext2D, elapsedTime: number) => {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    // 清除画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 设置绘图质量
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 转换为秒
    const timeSec = elapsedTime / 1000;

    // 步骤1: 倒酒 (0-2秒)
    if (timeSec >= 0 && timeSec < 2) {
      const stepProgress = timeSec / 2;

      // 高玻璃杯（左侧）
      drawHighballGlass(ctx, canvasWidth * 0.3, canvasHeight * 0.6, 120, 180);

      // 量酒器（右侧，倒酒动画）
      const jiggerRotation = stepProgress * 60; // 倾斜角度
      drawJigger(ctx, canvasWidth * 0.7, canvasHeight * 0.3, 60, 80, jiggerRotation);

      // 液体流动
      if (stepProgress < 0.9) {
        const pourProgress = Math.min(stepProgress * 1.2, 1);
        drawLiquidPour(
          ctx,
          canvasWidth * 0.7, canvasHeight * 0.32,
          canvasWidth * 0.3, canvasHeight * 0.5,
          8, pourProgress
        );
      }

      // 玻璃杯中的液体
      const fillProgress = Math.max(0, (stepProgress - 0.2) / 0.8);
      drawLiquidFill(ctx, canvasWidth * 0.3, canvasHeight * 0.78, 80, 40, fillProgress);
    }

    // 步骤2: 加冰 (2-4秒)
    if (timeSec >= 2 && timeSec < 4) {
      const stepProgress = (timeSec - 2) / 2;

      // 高玻璃杯（保持）
      drawHighballGlass(ctx, canvasWidth * 0.3, canvasHeight * 0.6, 120, 180);

      // 玻璃杯中的液体（已满）
      drawLiquidFill(ctx, canvasWidth * 0.3, canvasHeight * 0.78, 80, 45, 1);

      // 冰块托盘（上方）
      const trayX = canvasWidth * 0.5;
      const trayY = canvasHeight * 0.2;
      for (let i = 0; i < 3; i++) {
        drawIceCube(ctx, trayX + (i - 1) * 30, trayY, 15, 0);
      }

      // 冰块掉落
      for (let i = 0; i < 3; i++) {
        const iceProgress = Math.max(0, Math.min(1, stepProgress * 2 - i * 0.2));
        if (iceProgress > 0) {
          const iceY = canvasHeight * 0.2 + (canvasHeight * 0.3) * iceProgress;
          drawIceCube(ctx, trayX + (i - 1) * 30, iceY, 12, iceProgress * 45);
        }
      }
    }

    // 步骤3: 摇酒准备 (4-5秒)
    if (timeSec >= 4 && timeSec < 5) {
      const stepProgress = (timeSec - 4) / 1;

      // 调酒器（中心）
      const shakeOffset = Math.sin(stepProgress * Math.PI * 4) * 10;
      drawShaker(ctx, canvasWidth * 0.5, canvasHeight * 0.5 + shakeOffset, 100, 150, 0);

      // 手（摇动动画）
      const handX = canvasWidth * 0.5;
      const handY = canvasHeight * 0.3;
      const handRotation = Math.sin(stepProgress * Math.PI * 4) * 15;
      ctx.save();
      ctx.translate(handX, handY);
      ctx.rotate((handRotation * Math.PI) / 180);
      drawHand(ctx, 0, 0, 40, 60);
      ctx.restore();

      // 添加气泡效果
      for (let i = 0; i < 3; i++) {
        const bubbleProgress = (stepProgress + i * 0.1) % 1;
        const bubbleX = canvasWidth * 0.5 + Math.sin(bubbleProgress * Math.PI * 2) * 30;
        const bubbleY = canvasHeight * 0.5 - bubbleProgress * 50;
        if (bubbleProgress < 0.8) {
          drawBubble(ctx, bubbleX, bubbleY, 3 + i * 1, bubbleProgress / 0.8);
        }
      }
    }

    // 步骤4: 滤酒 (6-8秒) - 注意：5-6秒是间隔
    if (timeSec >= 6 && timeSec < 8) {
      const stepProgress = (timeSec - 6) / 2;

      // 调酒器倾倒（左侧）
      const shakerRotation = stepProgress * 60;
      drawShaker(ctx, canvasWidth * 0.3, canvasHeight * 0.5, 90, 140, shakerRotation);

      // 滤网
      drawStrainer(ctx, canvasWidth * 0.35, canvasHeight * 0.45, 25, 40);

      // 马提尼杯（右侧）
      drawMartiniGlass(ctx, canvasWidth * 0.7, canvasHeight * 0.6, 100, 120);

      // 液体从调酒器流出到马提尼杯
      if (stepProgress > 0.2 && stepProgress < 0.9) {
        const pourProgress = (stepProgress - 0.2) / 0.7;
        drawLiquidPour(
          ctx,
          canvasWidth * 0.35, canvasHeight * 0.45,
          canvasWidth * 0.7, canvasHeight * 0.52,
          6, pourProgress
        );
      }

      // 马提尼杯液体填充
      const fillProgress = Math.max(0, (stepProgress - 0.3) / 0.7);
      drawLiquidFill(ctx, canvasWidth * 0.7, canvasHeight * 0.72, 60, 35, fillProgress, true);
    }

    // 步骤5: 装饰 (8-9秒)
    if (timeSec >= 8 && timeSec < 9) {
      const stepProgress = (timeSec - 8) / 1;

      // 马提尼杯（已满）
      drawMartiniGlass(ctx, canvasWidth * 0.7, canvasHeight * 0.6, 100, 120);
      drawLiquidFill(ctx, canvasWidth * 0.7, canvasHeight * 0.72, 60, 35, 1, true);

      // 柠檬片飞入
      const lemonX = canvasWidth * 0.6 + (1 - stepProgress) * 100;
      const lemonY = canvasHeight * 0.5 + stepProgress * 50;
      const lemonRotation = stepProgress * 180;

      ctx.save();
      ctx.translate(lemonX, lemonY);
      ctx.rotate((lemonRotation * Math.PI) / 180);
      drawLemonSlice(ctx, 0, 0, 12);
      ctx.restore();
    }

    // 步骤6: 成品 (9-10秒)
    if (timeSec >= 9) {
      const stepProgress = Math.min(1, (timeSec - 9) / 1);

      // 小碟子
      ctx.save();
      ctx.translate(canvasWidth * 0.5, canvasHeight * 0.75);
      ctx.beginPath();
      ctx.ellipse(0, 0, 50, 8, 0, 0, Math.PI * 2);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // 马提尼杯（中心）
      const glassX = canvasWidth * 0.5;
      const glassY = canvasHeight * 0.6;
      drawMartiniGlass(ctx, glassX, glassY, 100, 120);
      drawLiquidFill(ctx, glassX, glassY + 12, 60, 35, 1, true);

      // 柠檬装饰
      const lemonX = glassX + 25;
      const lemonY = glassY + 20;
      drawLemonSlice(ctx, lemonX, lemonY, 10);

      // 成品浮现效果
      if (stepProgress < 1) {
        ctx.save();
        ctx.globalAlpha = stepProgress;
        drawMartiniGlass(ctx, glassX, glassY, 100, 120);
        drawLiquidFill(ctx, glassX, glassY + 12, 60, 35, 1, true);
        drawLemonSlice(ctx, lemonX, lemonY, 10);
        ctx.restore();
      }
    }

    // 显示当前时间（调试用）
    if (process.env.NODE_ENV === 'development') {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px monospace';
      ctx.fillText(`Time: ${timeSec.toFixed(2)}s`, 10, 20);
    }
  }, [drawHighballGlass, drawJigger, drawMartiniGlass, drawIceCube, drawShaker, drawHand, drawStrainer, drawLemonSlice, drawLiquidPour, drawLiquidFill, drawBubble]);

  // 动画循环
  const animate = useCallback((timestamp: number) => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (!animationState.isPlaying) {
      setAnimationState({
        startTime: timestamp,
        elapsedTime: 0,
        isPlaying: true
      });
    }

    const elapsedTime = timestamp - animationState.startTime;
    setAnimationState(prev => ({ ...prev, elapsedTime }));

    // 绘制动画
    drawAnimation(ctx, elapsedTime);

    // 继续动画循环（最多12秒，给一些缓冲时间）
    if (elapsedTime < 12000) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [animationState, drawAnimation]);

  // 初始化动画
  useEffect(() => {
    if (!canvasRef.current) return;

    // 设置Canvas尺寸
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    // 启动动画
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      {/* Canvas动画容器 */}
      <div className="relative w-96 h-96 mb-8 bg-black rounded-2xl overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ imageRendering: 'crisp-edges' }}
        />
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

      {/* 调试信息（开发模式） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 text-sm text-mood-text-muted font-mono">
          <div>Time: {(animationState.elapsedTime / 1000).toFixed(2)}s</div>
          <div>Mood: {selectedMood || 'none'}</div>
          <div>Color: {liquidColor}</div>
        </div>
      )}
    </div>
  );
};

export default LoadingCanvas;