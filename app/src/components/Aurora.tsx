import React, { useEffect, useRef } from 'react';

interface AuroraProps {
  /** Array of color stops for the gradient */
  colorStops?: string[];
  /** Amplitude of the wave effect */
  amplitude?: number;
  /** Blend mode for the gradient layers */
  blend?: number;
  /** Width of the container */
  width?: string | number;
  /** Height of the container */
  height?: string | number;
  /** Custom class name */
  className?: string;
}

const Aurora: React.FC<AuroraProps> = ({
  colorStops = ["#C8A97E", "#D4B98F", "#F5F0E1"],
  amplitude = 1,
  blend = 0.5,
  width = '100%',
  height = '100%',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio || 1;
        canvas.height = rect.height * window.devicePixelRatio || 1;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Animation variables
    let time = 0;

    const drawAurora = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas with slight transparency for trail effect
      ctx.fillStyle = `rgba(0, 0, 0, ${1 - blend * 0.05})`;
      ctx.fillRect(0, 0, width, height);

      // Create gradient layers (limit to 3 layers for performance)
      const gradientLayers = colorStops.slice(0, 3).map((color, index, arr) => {
        const gradient = ctx.createLinearGradient(
          0,
          0,
          width,
          height
        );

        // Add color stops with offsets based on index
        const offset1 = index / arr.length;
        const offset2 = (index + 1) / arr.length;

        gradient.addColorStop(offset1, color);
        gradient.addColorStop(offset2, arr[(index + 1) % arr.length]);

        return gradient;
      });

      // Draw wave layers
      gradientLayers.forEach((gradient, layerIndex) => {
        const layerTime = time * (0.5 + layerIndex * 0.3);
        const layerAmplitude = amplitude * (0.8 + layerIndex * 0.2);

        ctx.beginPath();

        // Start from left edge
        ctx.moveTo(0, height / 2);

        // Draw wave (use larger step for better performance)
        for (let x = 0; x <= width; x += 20) {
          // Calculate wave parameters
          const wave1 = Math.sin(x * 0.002 + layerTime) * layerAmplitude * 50;
          const wave2 = Math.cos(x * 0.003 + layerTime * 0.7) * layerAmplitude * 30;
          const wave3 = Math.sin(x * 0.0015 + layerTime * 1.3) * layerAmplitude * 20;

          const y = height / 2 + wave1 + wave2 + wave3;

          ctx.lineTo(x, y);
        }

        // Complete the path
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        // Fill with gradient
        ctx.fillStyle = gradient;
        ctx.globalAlpha = blend * (0.3 + layerIndex * 0.2);
        ctx.fill();
      });

      // Reset global alpha
      ctx.globalAlpha = 1;

      // Increment time
      time += 0.01;

      // Continue animation
      animationRef.current = requestAnimationFrame(drawAurora);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(drawAurora);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [colorStops, amplitude, blend]);

  return (
    <div
      className={`aurora-container ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default Aurora;