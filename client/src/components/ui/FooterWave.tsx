import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface Particle {
  cx: number;
  cy: number;
  r: number;
  opacity: number;
  delay: string;
  dur: string;
}

// Particle field centered around origin (0, 60) with generous vertical clearance [15, 105]
const PARTICLES: Particle[] = [
  // Core high-intensity emitter
  { cx: 8, cy: 60, r: 5.5, opacity: 0.95, delay: '0s', dur: '2.5s' },
  { cx: 14, cy: 56, r: 4.8, opacity: 0.9, delay: '0.3s', dur: '3.0s' },
  { cx: 10, cy: 66, r: 4.5, opacity: 0.88, delay: '0.6s', dur: '2.2s' },
  { cx: 18, cy: 62, r: 4.0, opacity: 0.85, delay: '0.2s', dur: '2.8s' },
  { cx: 6, cy: 52, r: 4.6, opacity: 0.82, delay: '0.8s', dur: '3.2s' },
  { cx: 12, cy: 72, r: 4.2, opacity: 0.8, delay: '0.5s', dur: '2.6s' },

  // Upper dispersion cloud
  { cx: 12, cy: 42, r: 3.5, opacity: 0.75, delay: '0.4s', dur: '2.6s' },
  { cx: 18, cy: 32, r: 2.8, opacity: 0.7, delay: '0.7s', dur: '2.4s' },
  { cx: 10, cy: 24, r: 2.2, opacity: 0.65, delay: '0.1s', dur: '3.1s' },
  { cx: 24, cy: 36, r: 2.6, opacity: 0.7, delay: '0.5s', dur: '2.7s' },
  { cx: 30, cy: 44, r: 2.0, opacity: 0.6, delay: '0.9s', dur: '2.9s' },
  { cx: 16, cy: 18, r: 1.8, opacity: 0.5, delay: '0.2s', dur: '3.3s' },
  { cx: 26, cy: 26, r: 1.5, opacity: 0.5, delay: '0.6s', dur: '2.8s' },

  // Lower dispersion cloud
  { cx: 12, cy: 78, r: 3.6, opacity: 0.75, delay: '0.5s', dur: '2.8s' },
  { cx: 18, cy: 88, r: 2.8, opacity: 0.7, delay: '0.2s', dur: '3.0s' },
  { cx: 10, cy: 96, r: 2.2, opacity: 0.65, delay: '0.8s', dur: '2.5s' },
  { cx: 24, cy: 84, r: 2.5, opacity: 0.7, delay: '0.4s', dur: '2.7s' },
  { cx: 30, cy: 76, r: 2.0, opacity: 0.6, delay: '0.6s', dur: '3.2s' },
  { cx: 16, cy: 104, r: 1.8, opacity: 0.5, delay: '1.0s', dur: '2.4s' },
  { cx: 26, cy: 94, r: 1.5, opacity: 0.5, delay: '0.3s', dur: '2.9s' },

  // Dispersing trail entering the wave
  { cx: 28, cy: 58, r: 3.0, opacity: 0.8, delay: '0.3s', dur: '2.6s' },
  { cx: 38, cy: 52, r: 2.5, opacity: 0.75, delay: '0.7s', dur: '2.9s' },
  { cx: 48, cy: 46, r: 2.2, opacity: 0.7, delay: '0.1s', dur: '2.5s' },
  { cx: 60, cy: 40, r: 1.8, opacity: 0.65, delay: '0.5s', dur: '3.1s' },
  { cx: 74, cy: 35, r: 1.5, opacity: 0.55, delay: '0.8s', dur: '2.8s' },
  { cx: 90, cy: 30, r: 1.2, opacity: 0.45, delay: '0.4s', dur: '3.0s' },

  // Ambient micro sparkles
  { cx: 4, cy: 38, r: 1.4, opacity: 0.6, delay: '0.2s', dur: '2.3s' },
  { cx: 3, cy: 82, r: 1.4, opacity: 0.55, delay: '0.6s', dur: '2.8s' },
  { cx: 22, cy: 50, r: 1.6, opacity: 0.7, delay: '0.3s', dur: '3.0s' },
  { cx: 32, cy: 68, r: 1.5, opacity: 0.6, delay: '0.7s', dur: '2.5s' },
  { cx: 42, cy: 72, r: 1.2, opacity: 0.5, delay: '0.5s', dur: '2.7s' },
  { cx: 52, cy: 62, r: 1.3, opacity: 0.5, delay: '0.1s', dur: '3.2s' }
];

export const FooterWave: React.FC = () => {
  const { themeMeta } = useTheme();
  const accent = themeMeta.accentHex || '#E50914';

  // Full, pronounced, unclipped Bezier sine wave curves (viewBox 0 0 1440 120)
  // All points remain strictly within Y: 18 to Y: 104 with 16px+ safe margin from borders
  // Peak 1 (280, 24) -> Valley 1 (640, 96) -> Peak 2 (1000, 24) -> Valley 2 (1340, 88)
  const pathA =
    'M 0,60 C 120,60 180,24 280,24 C 400,24 500,96 640,96 C 780,96 880,24 1000,24 C 1120,24 1220,88 1340,88 C 1390,88 1415,60 1440,60';

  const pathB =
    'M 0,60 C 130,60 190,38 290,38 C 410,38 490,82 630,82 C 770,82 870,38 990,38 C 1110,38 1230,98 1350,98 C 1400,98 1415,60 1440,60';

  const pathC =
    'M 0,60 C 110,60 170,18 270,18 C 390,18 510,102 650,102 C 790,102 890,18 1010,18 C 1130,18 1210,78 1330,78 C 1380,78 1415,60 1440,60';

  // Secondary subtle harmonic echo line
  const pathEcho =
    'M 0,60 C 140,60 200,34 310,34 C 430,34 490,88 620,88 C 760,88 860,34 980,34 C 1100,34 1240,92 1360,92 C 1410,92 1420,60 1440,60';

  return (
    <div className="absolute top-0 left-0 w-full h-24 sm:h-28 pointer-events-none overflow-visible z-20">
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Laser Glow Filter */}
          <filter id="laserGlowFilter" x="-10%" y="-100%" width="120%" height="300%">
            <feGaussianBlur stdDeviation="2.5" result="blur1" />
            <feGaussianBlur stdDeviation="6" result="blur2" />
            <feGaussianBlur stdDeviation="14" result="blur3" />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Core Nebula Radial Glow for Left Emitter */}
          <radialGradient id="nebulaCoreGrad" cx="0%" cy="50%" r="70%">
            <stop offset="0%" stopColor={accent} stopOpacity="1" />
            <stop offset="30%" stopColor={accent} stopOpacity="0.65" />
            <stop offset="65%" stopColor={accent} stopOpacity="0.2" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>

          {/* Horizontal Gradient for the main laser line */}
          <linearGradient id="laserLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="2%" stopColor={accent} />
            <stop offset="97%" stopColor={accent} />
            <stop offset="100%" stopColor={accent} stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* 1. Left Nebula Glowing Core Background */}
        <circle cx="15" cy="60" r="50" fill="url(#nebulaCoreGrad)" filter="blur(10px)" opacity="0.85" />
        <circle cx="25" cy="60" r="30" fill="url(#nebulaCoreGrad)" filter="blur(4px)" opacity="0.95" />

        {/* 2. Wide Soft Ambient Glow Wave (Underneath) */}
        <path
          d={pathA}
          fill="none"
          stroke={accent}
          strokeWidth="7"
          strokeOpacity="0.35"
          strokeLinecap="round"
          filter="blur(8px)"
        >
          <animate
            attributeName="d"
            dur="4.5s"
            repeatCount="indefinite"
            values={`${pathA}; ${pathB}; ${pathC}; ${pathA}`}
            keyTimes="0; 0.33; 0.66; 1"
            calcMode="spline"
            keySplines="0.45 0 0.25 1; 0.45 0 0.25 1; 0.45 0 0.25 1"
          />
        </path>

        {/* 3. Secondary Delicate Harmonic Echo Line */}
        <path
          d={pathEcho}
          fill="none"
          stroke={accent}
          strokeWidth="1.2"
          strokeOpacity="0.4"
          strokeLinecap="round"
        />

        {/* 4. Main Luminous Laser Wave Line */}
        <path
          d={pathA}
          fill="none"
          stroke="url(#laserLineGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          filter="url(#laserGlowFilter)"
        >
          <animate
            attributeName="d"
            dur="4.5s"
            repeatCount="indefinite"
            values={`${pathA}; ${pathB}; ${pathC}; ${pathA}`}
            keyTimes="0; 0.33; 0.66; 1"
            calcMode="spline"
            keySplines="0.45 0 0.25 1; 0.45 0 0.25 1; 0.45 0 0.25 1"
          />
        </path>

        {/* 5. Delicate White-Hot Center Core Filament */}
        <path
          d={pathA}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="0.8"
          strokeOpacity="0.75"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            dur="4.5s"
            repeatCount="indefinite"
            values={`${pathA}; ${pathB}; ${pathC}; ${pathA}`}
            keyTimes="0; 0.33; 0.66; 1"
            calcMode="spline"
            keySplines="0.45 0 0.25 1; 0.45 0 0.25 1; 0.45 0 0.25 1"
          />
        </path>

        {/* 6. Traveling Energy Photon Bead */}
        <circle r="3.5" fill="#FFFFFF" filter="url(#laserGlowFilter)">
          <animateMotion
            dur="3.6s"
            repeatCount="indefinite"
            path={pathA}
          />
        </circle>
        <circle r="7" fill={accent} opacity="0.6" filter="blur(3px)">
          <animateMotion
            dur="3.6s"
            repeatCount="indefinite"
            path={pathA}
          />
        </circle>

        {/* 7. Left Particle Spark Cluster (Matching Reference Image) */}
        <g id="sparkField">
          {PARTICLES.map((p, idx) => (
            <circle
              key={idx}
              cx={p.cx}
              cy={p.cy}
              r={p.r}
              fill={idx % 5 === 0 ? '#FFFFFF' : accent}
              opacity={p.opacity}
              filter={p.r > 2.2 ? 'url(#laserGlowFilter)' : undefined}
            >
              <animate
                attributeName="opacity"
                values={`${p.opacity}; ${Math.max(0.18, p.opacity * 0.35)}; ${p.opacity}`}
                dur={p.dur}
                begin={p.delay}
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values={`${p.r}; ${p.r * 1.25}; ${p.r}`}
                dur={p.dur}
                begin={p.delay}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>
      </svg>
    </div>
  );
};
