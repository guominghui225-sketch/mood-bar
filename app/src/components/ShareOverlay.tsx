import { useRef, useEffect, useState } from 'react';
import type { Cocktail } from '@/types';

interface ShareOverlayProps {
  cocktail: Cocktail;
  onClose: () => void;
}

const ShareOverlay = ({ cocktail, onClose }: ShareOverlayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    // Generate share image on canvas
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size (3:4 ratio)
    canvas.width = 600;
    canvas.height = 800;

    // Background
    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

    // Load and draw cocktail image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Draw image with rounded corners
      const imgSize = 500;
      const imgX = 50;
      const imgY = 50;
      const cornerRadius = 16;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(imgX + cornerRadius, imgY);
      ctx.lineTo(imgX + imgSize - cornerRadius, imgY);
      ctx.quadraticCurveTo(imgX + imgSize, imgY, imgX + imgSize, imgY + cornerRadius);
      ctx.lineTo(imgX + imgSize, imgY + imgSize - cornerRadius);
      ctx.quadraticCurveTo(imgX + imgSize, imgY + imgSize, imgX + imgSize - cornerRadius, imgY + imgSize);
      ctx.lineTo(imgX + cornerRadius, imgY + imgSize);
      ctx.quadraticCurveTo(imgX, imgY + imgSize, imgX, imgY + imgSize - cornerRadius);
      ctx.lineTo(imgX, imgY + cornerRadius);
      ctx.quadraticCurveTo(imgX, imgY, imgX + cornerRadius, imgY);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, imgX, imgY, imgSize, imgSize);
      ctx.restore();

      // Draw cocktail name
      ctx.font = 'bold 36px "Playfair Display", serif';
      ctx.fillStyle = '#F5F0E1';
      ctx.textAlign = 'center';
      ctx.fillText(cocktail.name, canvas.width / 2, 620);

      // Draw Mood Bar
      ctx.font = '16px "Inter", sans-serif';
      ctx.fillStyle = '#A89B7B';
      ctx.fillText('Mood Bar', canvas.width / 2, 655);

      // Draw description
      ctx.font = '18px "Inter", sans-serif';
      ctx.fillStyle = '#E8D5A3';
      const maxWidth = 500;
      const words = cocktail.description.split('');
      let line = '';
      let y = 700;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          ctx.fillText(line, canvas.width / 2, y);
          line = words[i];
          y += 28;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, canvas.width / 2, y);

      // Generate image URL
      setImageUrl(canvas.toDataURL('image/png'));
    };
    img.src = cocktail.imageUrl;
  }, [cocktail]);

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}?mood=${cocktail.mood}&cocktail=${cocktail.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      // Could show a toast here
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-mood-dark/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 w-full max-w-md">
        {/* Hint text */}
        <p className="text-mood-cream text-sm font-sans mb-4 text-center">
          长按图片保存，发送给好友
        </p>

        {/* Share image */}
        <div className="relative rounded-xl overflow-hidden border-2 border-mood-gold shadow-gold-lg mb-6">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="分享卡片"
              className="w-full max-w-[300px] h-auto"
            />
          ) : (
            <div className="w-[300px] h-[400px] bg-mood-card flex items-center justify-center">
              <span className="text-mood-text-muted text-sm">生成中...</span>
            </div>
          )}
        </div>

        {/* Hidden canvas for image generation */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Copy link button */}
        <button
          onClick={handleCopyLink}
          className="mb-4 px-6 py-2 rounded-full border border-mood-gold/50 text-mood-gold text-sm transition-all duration-200 hover:bg-mood-gold/10 active:scale-95 touch-manipulation"
        >
          复制分享链接
        </button>

        {/* Close button */}
        <button
          onClick={onClose}
          className="px-10 py-3 rounded-xl bg-mood-gold text-mood-dark font-medium transition-all duration-200 hover:brightness-110 active:scale-95 touch-manipulation"
        >
          关闭
        </button>
      </div>
    </div>
  );
};

export default ShareOverlay;
