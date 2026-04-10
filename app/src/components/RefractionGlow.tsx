import React, { useEffect, useRef } from 'react';

interface RefractionGlowProps {
  size?: number;           // 尺寸 (px)
  x?: string | number;     // 水平位置 (百分比或px)
  y?: string | number;     // 垂直位置 (百分比或px)
  color?: string;         // 颜色
  intensity?: number;     // 强度
  speed?: number;         // 动画速度
  blur?: number;          // 模糊度
}

const RefractionGlow: React.FC<RefractionGlowProps> = ({
  size = 300,
  x = '50%',
  y = '50%',
  color = 'rgba(212, 175, 55, 0.3)', // 金色
  intensity = 1,
  speed = 0.002,
  blur = 100,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置Canvas尺寸
    const resizeCanvas = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();

      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Perlin噪声参数
    const perlin = {
      grad: [
        [1, 1], [-1, 1], [1, -1], [-1, -1],
        [1, 0], [-1, 0], [1, 0], [-1, 0],
        [0, 1], [0, -1], [0, 1], [0, -1]
      ],
      perm: new Array(512)
    };

    // 初始化置换表
    for (let i = 0; i < 512; i++) {
      perlin.perm[i] = Math.floor(Math.random() * 256);
    }

    // Perlin噪声函数
    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (a: number, b: number, t: number) => a + t * (b - a);
    const grad = (hash: number, x: number, y: number) => {
      const h = hash & 15;
      const grad = perlin.grad[h];
      return grad[0] * x + grad[1] * y;
    };

    const noise = (x: number, y: number) => {
      const X = Math.floor(x) & 255;
      const Y = Math.floor(y) & 255;
      x -= Math.floor(x);
      y -= Math.floor(y);
      const u = fade(x);
      const v = fade(y);

      const a = perlin.perm[X] + Y;
      const b = perlin.perm[X + 1] + Y;

      return lerp(
        lerp(grad(perlin.perm[a], x, y), grad(perlin.perm[b], x - 1, y), u),
        lerp(grad(perlin.perm[a + 1], x, y - 1), grad(perlin.perm[b + 1], x - 1, y - 1), u),
        v
      );
    };

    // 解析颜色
    const parseColor = (colorStr: string) => {
      if (colorStr.startsWith('rgba')) {
        const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (match) {
          return {
            r: parseInt(match[1]),
            g: parseInt(match[2]),
            b: parseInt(match[3]),
            a: match[4] ? parseFloat(match[4]) : 1
          };
        }
      } else if (colorStr.startsWith('#')) {
        const hex = colorStr.slice(1);
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return { r, g, b, a: 1 };
      }
      return { r: 212, g: 175, b: 55, a: 0.3 }; // 默认金色
    };

    const baseColor = parseColor(color);
    let time = 0;

    const animate = () => {
      time += speed;

      const width = canvas.width;
      const height = canvas.height;

      // 清除画布
      ctx.clearRect(0, 0, width, height);

      // 计算中心点
      const centerX = typeof x === 'string' && x.includes('%')
        ? (parseFloat(x) / 100) * width
        : typeof x === 'number' ? x : width / 2;

      const centerY = typeof y === 'string' && y.includes('%')
        ? (parseFloat(y) / 100) * height
        : typeof y === 'number' ? y : height / 2;

      // 创建径向渐变
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, size / 2
      );

      // 基于时间动态变化颜色
      const timeOffset = Math.sin(time * 2) * 0.1;
      const hueShift = Math.sin(time) * 20;

      // 添加渐变色标
      gradient.addColorStop(0, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${baseColor.a * intensity})`);
      gradient.addColorStop(0.3, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${baseColor.a * intensity * 0.7})`);
      gradient.addColorStop(0.7, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${baseColor.a * intensity * 0.3})`);
      gradient.addColorStop(1, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0)`);

      // 绘制基础光晕
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // 应用噪声变形
      ctx.globalCompositeOperation = 'lighter';

      const noiseScale = 0.005;
      const noiseIntensity = size * 0.1;

      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 60) {
        const radius = size / 2;

        // 计算噪声偏移
        const nx = centerX + Math.cos(angle) * radius;
        const ny = centerY + Math.sin(angle) * radius;

        const noiseValue = noise(
          nx * noiseScale + time,
          ny * noiseScale + time
        );

        const offsetRadius = radius + noiseValue * noiseIntensity;
        const offsetX = centerX + Math.cos(angle) * offsetRadius;
        const offsetY = centerY + Math.sin(angle) * offsetRadius;

        if (angle === 0) {
          ctx.beginPath();
          ctx.moveTo(offsetX, offsetY);
        } else {
          ctx.lineTo(offsetX, offsetY);
        }
      }

      ctx.closePath();

      // 创建变形渐变
      const distortedGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, size / 2 * 1.2
      );

      distortedGradient.addColorStop(0, `rgba(255, 255, 255, ${baseColor.a * intensity * 0.5})`);
      distortedGradient.addColorStop(0.5, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${baseColor.a * intensity * 0.3})`);
      distortedGradient.addColorStop(1, 'transparent');

      ctx.fillStyle = distortedGradient;
      ctx.fill();
      ctx.restore();

      // 添加内部光晕
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, size / 3, 0, Math.PI * 2);

      const innerGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, size / 3
      );

      innerGradient.addColorStop(0, `rgba(255, 255, 255, ${baseColor.a * intensity * 0.8})`);
      innerGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

      ctx.fillStyle = innerGradient;
      ctx.globalAlpha = 0.3;
      ctx.fill();
      ctx.restore();

      // 应用模糊效果
      ctx.save();
      ctx.filter = `blur(${blur}px)`;
      ctx.globalAlpha = 0.7;
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [size, x, y, color, intensity, speed, blur]);

  // 解析位置样式
  const getPositionStyle = () => {
    const style: React.CSSProperties = {
      position: 'absolute' as const,
      pointerEvents: 'none' as const,
      zIndex: 1,
    };

    if (typeof x === 'string' && x.includes('%')) {
      style.left = x;
    } else if (typeof x === 'number') {
      style.left = `${x}px`;
    } else {
      style.left = '50%';
    }

    if (typeof y === 'string' && y.includes('%')) {
      style.top = y;
    } else if (typeof y === 'number') {
      style.top = `${y}px`;
    } else {
      style.top = '50%';
    }

    if (typeof x === 'string' && x.includes('%') && typeof y === 'string' && y.includes('%')) {
      style.transform = 'translate(-50%, -50%)';
    }

    style.width = `${size}px`;
    style.height = `${size}px`;

    return style;
  };

  return (
    <div ref={containerRef} style={getPositionStyle()}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
};

export default RefractionGlow;