import React from 'react';

interface CompassLogoProps {
  className?: string;
  size?: number;
}

export const CompassLogo: React.FC<CompassLogoProps> = ({ className = 'w-8 h-8', size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Fine Ring */}
      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" strokeOpacity="0.85" />
      {/* Inner Decorative Dashed Ring */}
      <circle cx="32" cy="32" r="23" stroke="#C59A4E" strokeWidth="1" strokeDasharray="2 3" />

      {/* Cardinal Ticks */}
      <line x1="32" y1="5" x2="32" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="54" x2="32" y2="59" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="5" y1="32" x2="10" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="54" y1="32" x2="59" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

      {/* Compass Needles */}
      {/* North needle - Champagne Gold */}
      <polygon points="32,10 36,32 32,28" fill="#C59A4E" />
      <polygon points="32,10 28,32 32,28" fill="#AA7F38" />

      {/* South needle - Deep Ink */}
      <polygon points="32,54 36,32 32,36" fill="#1F2F4A" />
      <polygon points="32,54 28,32 32,36" fill="#0B1320" />

      {/* East needle */}
      <polygon points="54,32 32,28 36,32" fill="#D5B26E" />
      <polygon points="54,32 32,36 36,32" fill="#AA7F38" />

      {/* West needle */}
      <polygon points="10,32 32,28 28,32" fill="#334768" />
      <polygon points="10,32 32,36 28,32" fill="#1F2F4A" />

      {/* Center Pivot Point */}
      <circle cx="32" cy="32" r="3" fill="#FAF8F5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
};

