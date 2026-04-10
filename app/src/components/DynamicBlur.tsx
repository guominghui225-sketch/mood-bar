import React, { useEffect, useRef } from 'react';

interface DynamicBlurProps {
  intensity?: number; // 模糊强度
  speed?: number;     // 动画速度
  opacity?: number;   // 不透明度
}

const DynamicBlur: React.FC<DynamicBlurProps> = ({
  intensity = 40,
  speed = 0.005,
  opacity = 0.05,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置Canvas尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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

    let time = 0;
    const animate = () => {
      time += speed;

      const width = canvas.width;
      const height = canvas.height;

      // 清除画布
      ctx.clearRect(0, 0, width, height);

      // 创建图像数据
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      // 生成动态噪声
      const scale = 0.01;
      const noiseIntensity = intensity;

      for (let y = 0; y < height; y += 2) {
        for (let x = 0; x < width; x += 2) {
          // 计算噪声值
          const nx = x * scale;
          const ny = y * scale;
          const nz = time;

          const n1 = noise(nx, ny);
          const n2 = noise(nx + 5.2, ny + 1.3);
          const n3 = noise(nx * 0.5 + nz, ny * 0.5 + nz);

          const noiseValue = (n1 + n2 + n3) / 3;
          const alpha = Math.abs(noiseValue) * opacity * 255;

          // 设置像素颜色（白色半透明）
          const index = (y * width + x) * 4;
          data[index] = 255;     // R
          data[index + 1] = 255; // G
          data[index + 2] = 255; // B
          data[index + 3] = Math.min(255, alpha);

          // 填充2x2块
          if (x + 1 < width && y + 1 < height) {
            const indices = [
              (y * width + x + 1) * 4,
              ((y + 1) * width + x) * 4,
              ((y + 1) * width + x + 1) * 4
            ];

            indices.forEach(idx => {
              data[idx] = 255;
              data[idx + 1] = 255;
              data[idx + 2] = 255;
              data[idx + 3] = Math.min(255, alpha);
            });
          }
        }
      }

      // 应用模糊效果
      ctx.putImageData(imageData, 0, 0);

      // 应用CSS模糊滤镜
      ctx.filter = `blur(${intensity * 0.5}px)`;
      ctx.globalAlpha = opacity;
      ctx.drawImage(canvas, 0, 0);
      ctx.filter = 'none';
      ctx.globalAlpha = 1;

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [intensity, speed, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity }}
    />
  );
};

export default DynamicBlur;