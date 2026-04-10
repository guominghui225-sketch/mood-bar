import React from 'react';

interface ProcessIconsProps {
  className?: string;
}

const ProcessIcons: React.FC<ProcessIconsProps> = ({ className }) => {
  const steps = [
    { emoji: '🎭', text: '选择情绪' },
    { emoji: '🍸', text: '生成特调' },
    { emoji: '📸', text: '保存分享' },
  ];

  return (
    <div className={`flex justify-center items-center gap-[85.33px] ${className}`}>
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center">
          {/* Icon container */}
          <div className="w-[42.66px] h-[42.66px] flex items-center justify-center text-[32px]">
            {step.emoji}
          </div>
          {/* Text */}
          <div className="mt-[10.67px] text-[16px] text-[#888888] font-sans font-normal tracking-[0]">
            {step.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProcessIcons;