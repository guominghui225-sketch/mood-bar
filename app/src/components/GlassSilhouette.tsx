import React from 'react';

interface GlassSilhouetteProps {
  className?: string;
}

const GlassSilhouette: React.FC<GlassSilhouetteProps> = ({ className }) => {
  return (
    <div className={`fixed bottom-[160px] right-[21.33px] z-0 ${className}`}>
      <svg
        width="160px"
        height="240px"
        viewBox="0 0 160 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-glass-float opacity-[0.12] blur-[16px]"
        style={{
          filter: 'drop-shadow(0 0 8px rgba(200, 169, 126, 0.3))',
        }}
      >
        {/* Cocktail glass silhouette - simplified outline */}
        <path
          d="M80,40 C100,40 120,60 120,100 L120,160 C120,180 110,200 80,220 C50,200 40,180 40,160 L40,100 C40,60 60,40 80,40 Z"
          fill="#C8A97E"
          fillOpacity="0.12"
          stroke="none"
        />
        {/* Stem */}
        <rect
          x="75"
          y="160"
          width="10"
          height="40"
          fill="#C8A97E"
          fillOpacity="0.12"
        />
        {/* Base */}
        <ellipse
          cx="80"
          cy="210"
          rx="20"
          ry="10"
          fill="#C8A97E"
          fillOpacity="0.12"
        />
      </svg>
    </div>
  );
};

export default GlassSilhouette;