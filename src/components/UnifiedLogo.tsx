import React from 'react';

interface UnifiedLogoProps {
  size?: number;
  className?: string;
}

export const UnifiedLogo: React.FC<UnifiedLogoProps> = ({ size = 38, className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={`shrink-0 drop-shadow-md ${className}`}
      aria-label="IDSS + IMH Ujedinjeni amblem"
    >
      <defs>
        {/* Background Dark Shield */}
        <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0a1926" />
          <stop offset="50%" stopColor="#102538" />
          <stop offset="100%" stopColor="#07121c" />
        </linearGradient>

        {/* IDSS Academic Gradient (Blue to Red to Cyan) */}
        <linearGradient id="logoIdssGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#08ABE6" />
          <stop offset="45%" stopColor="#035EA1" />
          <stop offset="100%" stopColor="#E8262C" />
        </linearGradient>

        {/* IMH Montessori Gradient (Green to Lime) */}
        <linearGradient id="logoImhGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e8237" />
          <stop offset="60%" stopColor="#2CB14D" />
          <stop offset="100%" stopColor="#D8E155" />
        </linearGradient>

        {/* Gold Accent Gradient */}
        <linearGradient id="logoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE885" />
          <stop offset="60%" stopColor="#FFCB29" />
          <stop offset="100%" stopColor="#E6A800" />
        </linearGradient>

        {/* Outer Glow */}
        <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="#08abe6" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Outer Shield Base with Smooth Rounded Corners */}
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="16"
        fill="url(#logoBgGrad)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.5"
      />

      {/* Top Connecting Arc (The Educational Rainbow & Horizon) */}
      <path
        d="M 12 18 C 12 10, 20 6, 32 6 C 44 6, 52 10, 52 18"
        fill="none"
        stroke="url(#logoIdssGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="32" cy="6" r="2.5" fill="url(#logoGoldGrad)" />

      {/* Central Emblem: Fusion of IMH Montessori Tree & IDSS German Academic Wings */}
      <g filter="url(#logoGlow)">
        {/* IMH Left: Montessori Sprout & Blossoming Leaves */}
        <path
          d="M 32 46 C 30 38, 20 37, 16 32 C 12 27, 17 21, 23 23 C 27 24, 29 28, 32 35 Z"
          fill="url(#logoImhGrad)"
        />
        <path
          d="M 32 36 C 28 30, 20 28, 19 22 C 18 17, 25 15, 29 19 C 31 22, 31 26, 32 30 Z"
          fill="#D8E155"
          opacity={0.9}
        />

        {/* IDSS Right: German-International Academic Wings / Open Book */}
        <path
          d="M 32 46 C 34 38, 44 37, 48 32 C 52 27, 47 21, 41 23 C 37 24, 35 28, 32 35 Z"
          fill="url(#logoIdssGrad)"
        />
        <path
          d="M 32 36 C 36 30, 44 28, 45 22 C 46 17, 39 15, 35 19 C 33 22, 33 26, 32 30 Z"
          fill="#08ABE6"
          opacity={0.95}
        />

        {/* Central Golden Spire (Sarajevo Sun & Continuum Spire) */}
        <path d="M 32 15 L 34 23 L 32 47 L 30 23 Z" fill="url(#logoGoldGrad)" />
        <circle cx="32" cy="14" r="3.2" fill="url(#logoGoldGrad)" stroke="#102538" strokeWidth="1" />
      </g>

      {/* Bottom Harmonization Dots: IMH Green, IDSS Red */}
      <rect x="18" y="50" width="12" height="3" rx="1.5" fill="#2CB14D" />
      <rect x="34" y="50" width="12" height="3" rx="1.5" fill="#E8262C" />
    </svg>
  );
};
