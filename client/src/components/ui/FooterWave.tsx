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

const PARTICLES: Particle[] = [
  // Core high-intensity cluster
  { cx: 6, cy: 38, r: 5.5, opacity: 0.95, delay: '0s', dur: '2.5s' },
  { cx: 12, cy: 35, r: 4.8, opacity: 0.9, delay: '0.3s', dur: '3.0s' },
  { cx: 8, cy: 44, r: 4.2, opacity: 0.85, delay: '0.6s', dur: '2.2s' },
  { cx: 16, cy: 40, r: 3.8, opacity: 0.88, delay: '0.2s', dur: '2.8s' },
  { cx: 4, cy: 30, r: 4.5, opacity: 0.8, delay: '0.8s', dur: '3.2s' },

  // Upper dispersion cloud
  { cx: 10, cy: 18, r: 3.2, opacity: 0.75, delay: '0.4s', dur: '2.6s' },
  { cx: 15, cy: 12, r: 2.6, opacity: 0.7, delay: '0.7s', dur: '2.4s' },
  { cx: 8, cy: 8, r: 2.2, opacity: 0.65, delay: '0.1s', dur: '3.1s' },
  { cx: 20, cy: 22, r: 2.5, opacity: 0.7, delay: '0.5s', dur: '2.7s' },
  { cx: 25, cy: 16, r: 1.8, opacity: 0.6, delay: '0.9s', dur: '2.9s' },
  { cx: 14, cy: 5, r: 1.6, opacity: 0.5, delay: '0.2s', dur: '3.3s' },

  // Lower dispersion cloud
  { cx: 9, cy: 50, r: 3.4, opacity: 0.75, delay: '0.5s', dur: '2.8s' },
  { cx: 16, cy: 56, r: 2.8, opacity: 0.7, delay: '0.2s', dur: '3.0s' },
  { cx: 7, cy: 62, r: 2.0, opacity: 0.6, delay: '0.8s', dur: '2.5s' },
  { cx: 22, cy: 52, r: 2.2, opacity: 0.65, delay: '0.4s', dur: '2.7s' },
  { cx: 26, cy: 60, r: 1.5, opacity: 0.5, delay: '0.6s', dur: '3.2s' },
  { cx: 18, cy: 66, r: 1.4, opacity: 0.45, delay: '1.0s', dur: '2.4s' },

  // Trail drifting along the wave entrance
  { cx: 24, cy: 34, r: 2.8, opacity: 0.8, delay: '0.3s', dur: '2.6s' },
  { cx: 30, cy: 37, r: 2.4, opacity: 0.75, delay: '0.7s', dur: '2.9s' },
  { cx: 36, cy: 32, r: 2.0, opacity: 0.7, delay: '0.1s', dur: '2.5s' },
  { cx: 42, cy: 36, r: 1.8, opacity: 0.65, delay: '0.5s', dur: '3.1s' },
  { cx: 48, cy: 30, r: 1.5, opacity: 0.55, delay: '0.8s', dur: '2.8s' },
  { cx: 55, cy: 34, r: 1.2, opacity: 0.5, delay: '0.4s', dur: '3.0s' },
  { cx: 62, cy: 28, r: 1.0, opacity: 0.4, delay: '0.9s', dur: '2.7s' },

  // Micro ambient speckles
  { cx: 3, cy: 22, r: 1.3, opacity: 0.6, delay: '0.2s', dur: '2.3s' },
  { cx: 2, cy: 46, r: 1.4, opacity: 0.55, delay: '0.6s', dur: '2.8s' },
  { cx: 18, cy: 30, r: 1.6, opacity: 0.7, delay: '0.3s', dur: '3.0s' },
  { cx: 28, cy: 46, r: 1.5, opacity: 0.6, delay: '0.7s', dur: '2.5s' },
  { cx: 34, cy: 22, r: 1.2, opacity: 0.5, delay: '0.5s', dur: '2.7s' },
  { cx: 38, cy: 44, r: 1.3, opacity: 0.5, delay: '0.1s', dur: '3.2s' },
  { cx: 45, cy: 24, r: 1.0, opacity: 0.45, delay: '0.8s', dur: '2.9s' }
];

export const FooterWave: React.FC = () => {
  const { themeMeta } = useTheme();
  const accent = themeMeta.accentHex;

  // Exact Bezier wave curve matching the user's reference image
  // 0% (start) -> 28% (crest 1) -> 53% (trough) -> 80% (crest 2) -> 100% (end)
  const pathD1 =
    'M 0,38 C 180,36 260,14 380,14 C 520,14 620,56 750,56 C 880,56 990,22 1120,22 C 1260,22 1350,38 1440,40';
  const pathD2 =
    'M 0,38 C 190,44 270,22 390,22 C 530,22 610,48 740,48 C 870,48 1000,16 1130,16 C 1270,16 1360,42 1440,40';
  const pathD3 =
    'M 0,38 C 170,28 250,10 370,10 C 510,10 630,62 760,62 C 890,62 980,28 1110,28 C 1250,28 1340,34 1440,40';

  return (
    <div className="absolute top-0 left-0 w-full h-16 sm:h-20 -translate-y-1/2 pointer-events-none overflow-visible z-20">
      <svg
        viewBox="0 0 1440 70"
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Multi-layered Neon Laser Glow Filter */}
          <filter id="laserGlow" x="-20%" y="-150%" width="140%" height="400%">
            <feGaussianBlur stdDeviation="2" result="blur1" />
            <feGaussianBlur stdDeviation="5" result="blur2" />
            <feGaussianBlur stdDeviation="12" result="blur3" />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Radial Aura for Left Particle Emitter */}
          <radialGradient id="nebulaCore" cx="0%" cy="50%" r="60%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.95" />
            <stop offset="25%" stopColor={accent} stopOpacity="0.6" />
            <stop offset="60%" stopColor={accent} stopOpacity="0.2" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>

          {/* Linear Gradient for wave line to fade seamlessly at boundaries */}
          <linearGradient id="waveStrokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="3%" stopColor={accent} />
            <stop offset="96%" stopColor={accent} />
            <stop offset="100%" stopColor={accent} stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* 1. Nebula Radiant Background Aura on Left */}
        <circle cx="10" cy="38" r="45" fill="url(#nebulaCore)" filter="blur(10px)" opacity="0.8" />
        <circle cx="20" cy="38" r="28" fill="url(#nebulaCore)" filter="blur(4px)" opacity="0.9" />

        {/* 2. Soft Ambient Glow Wave (Underneath) */}
        <path
          d={pathD1}
          fill="none"
          stroke={accent}
          strokeWidth="6"
          strokeOpacity="0.3"
          strokeLinecap="round"
          filter="blur(6px)"
        >
          <animate
            attributeName="d"
            dur="4s"
            repeatCount="indefinite"
            values={`${pathD1}; ${pathD2}; ${pathD3}; ${pathD1}`}
            keyTimes="0; 0.33; 0.66; 1"
            calcMode="spline"
            keySplines="0.45 0 0.25 1; 0.45 0 0.25 1; 0.45 0 0.25 1"
          />
        </path>

        {/* 3. Primary Crisp Neon Laser Wave Line */}
        <path
          d={pathD1}
          fill="none"
          stroke="url(#waveStrokeGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#laserGlow)"
        >
          <animate
            attributeName="d"
            dur="4s"
            repeatCount="indefinite"
            values={`${pathD1}; ${pathD2}; ${pathD3}; ${pathD1}`}
            keyTimes="0; 0.33; 0.66; 1"
            calcMode="spline"
            keySplines="0.45 0 0.25 1; 0.45 0 0.25 1; 0.45 0 0.25 1"
          />
        </path>

        {/* 4. White Hot Core Wave Filament */}
        <path
          d={pathD1}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="0.75"
          strokeOpacity="0.85"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            dur="4s"
            repeatCount="indefinite"
            values={`${pathD1}; ${pathD2}; ${pathD3}; ${pathD1}`}
            keyTimes="0; 0.33; 0.66; 1"
            calcMode="spline"
            keySplines="0.45 0 0.25 1; 0.45 0 0.25 1; 0.45 0 0.25 1"
          />
        </path>

        {/* 5. Traveling Photon Energy Spark across the Wave */}
        <circle r="3" fill="#FFFFFF" filter="url(#laserGlow)">
          <animateMotion
            dur="3.2s"
            repeatCount="indefinite"
            path={pathD1}
          />
        </circle>
        <circle r="6" fill={accent} opacity="0.5" filter="blur(3px)">
          <animateMotion
            dur="3.2s"
            repeatCount="indefinite"
            path={pathD1}
          />
        </circle>

        {/* 6. Glowing Particle Cluster on Left (matching reference image) */}
        <g id="particleCluster">
          {PARTICLES.map((p, idx) => (
            <circle
              key={idx}
              cx={p.cx}
              cy={p.cy}
              r={p.r}
              fill={idx % 4 === 0 ? '#FFFFFF' : accent}
              opacity={p.opacity}
              filter={p.r > 2.5 ? 'url(#laserGlow)' : undefined}
            >
              <animate
                attributeName="opacity"
                values={`${p.opacity}; ${Math.max(0.15, p.opacity * 0.3)}; ${p.opacity}`}
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
