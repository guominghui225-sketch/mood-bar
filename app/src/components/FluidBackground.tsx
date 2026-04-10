import React, { useEffect, useRef } from 'react';

interface FluidBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  type: 'bubble' | 'sparkle';
  color: string;
  element: HTMLDivElement;
}

const ParticleSystem: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const particleCount = 50;

  const createParticle = (type: 'bubble' | 'sparkle', width: number, height: number): Particle => {
    const element = document.createElement('div');
    element.className = `particle particle-${type}`;

    // 随机大小
    const size = type === 'bubble'
      ? Math.random() * 20 + 8  // 8-28px
      : Math.random() * 6 + 2;  // 2-8px

    // 随机位置
    const x = Math.random() * width;
    const y = Math.random() * height;


    // 气泡颜色变化
    let color = '';
    if (type === 'bubble') {
      const colorVariants = [
        'rgba(243, 208, 12, 0.25)',  // 暖白金色
        'rgba(242, 248, 65, 0.2)',    // 主金色
        'rgba(255, 223, 127, 0.3)',   // 亮金色
        'rgba(139, 111, 78, 0.15)'    // 深金色
      ];
      color = colorVariants[Math.floor(Math.random() * colorVariants.length)];
    }

    // 设置样式
    Object.assign(element.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${x}px`,
      top: `${y}px`,
      opacity: type === 'bubble' ? Math.random() * 0.4 + 0.1 : Math.random() * 0.6 + 0.2
    });

    // 添加气泡颜色样式
    if (type === 'bubble' && color) {
      element.style.backgroundColor = color;
    }

    const particle: Particle = {
      x,
      y,
      size,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3 - 0.7,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.5,
      type,
      color,
      element
    };

    return particle;
  };

  const createParticles = () => {
    if (!containerRef.current) return;

    // 清空现有粒子
    containerRef.current.innerHTML = '';
    particlesRef.current = [];

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 创建气泡粒子
    for (let i = 0; i < particleCount * 0.7; i++) {
      const particle = createParticle('bubble', width, height);
      particlesRef.current.push(particle);
      containerRef.current.appendChild(particle.element);
    }

    // 创建光点粒子
    for (let i = 0; i < particleCount * 0.3; i++) {
      const particle = createParticle('sparkle', width, height);
      particlesRef.current.push(particle);
      containerRef.current.appendChild(particle.element);
    }
  };

  const animate = () => {
    if (!containerRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    particlesRef.current.forEach(particle => {
      // 更新位置
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // 边界检查
      if (particle.x < -100) particle.x = width + 100;
      if (particle.x > width + 100) particle.x = -100;
      if (particle.y < -100) particle.y = height + 100;
      if (particle.y > height + 100) particle.y = -100;

      // 更新旋转
      particle.rotation += particle.rotationSpeed;

      // 应用变换
      particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px) rotate(${particle.rotation}deg)`;

      // 轻微的大小变化
      const scale = 1 + Math.sin(Date.now() * 0.001) * 0.1;
      particle.element.style.transform += ` scale(${scale})`;
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    createParticles();
    animate();

    const handleResize = () => {
      createParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="particle-system fixed inset-0 pointer-events-none z-0"
    />
  );
};

const FluidBackground: React.FC<FluidBackgroundProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${className}`}>
      {/* Base dark background */}
      <div className="absolute inset-0 bg-mood-dark" />
      
      {/* Fluid gradient layers */}
      <div 
        className="absolute inset-0 animate-fluid-gradient opacity-40"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(212, 175, 55, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(139, 111, 78, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(74, 44, 58, 0.1) 0%, transparent 60%),
            radial-gradient(ellipse at 30% 80%, rgba(212, 175, 55, 0.08) 0%, transparent 40%),
            radial-gradient(ellipse at 70% 20%, rgba(90, 154, 158, 0.06) 0%, transparent 40%)
          `,
          backgroundSize: '400% 400%',
        }}
      />
      
      {/* Floating orbs */}
      <div 
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full animate-float opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%)' }}
      />
      <div 
        className="absolute top-2/3 right-1/3 w-48 h-48 rounded-full animate-float opacity-15 blur-3xl"
        style={{ 
          background: 'radial-gradient(circle, rgba(139, 111, 78, 0.25) 0%, transparent 70%)',
          animationDelay: '-4s'
        }}
      />
      <div 
        className="absolute bottom-1/4 left-1/2 w-56 h-56 rounded-full animate-float opacity-18 blur-3xl"
        style={{ 
          background: 'radial-gradient(circle, rgba(74, 44, 58, 0.2) 0%, transparent 70%)',
          animationDelay: '-2s'
        }}
      />
      
      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Particle System */}
      <ParticleSystem />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default FluidBackground;
