
import React from 'react';

interface ProgressCircleProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  bgColor?: string;
  fgColor?: string;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  value,
  size = 60,
  strokeWidth = 4,
  bgColor = '#F1F5F9',
  fgColor = 'hsl(var(--primary))',
}) => {
  const normalizedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const dash = (circumference * normalizedValue) / 100;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        {/* Foreground circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={fgColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - dash}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: 'stroke-dashoffset 0.5s ease',
          }}
        />
      </svg>
      <div className="absolute text-xs font-medium">
        {normalizedValue}%
      </div>
    </div>
  );
};
