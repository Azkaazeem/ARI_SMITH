import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { FloatingCardDeck } from './FloatingCardDeck';
import { SmokeOrbShader } from './SmokeOrbShader';
import { ParticleField } from './ParticleField';
import { useTheme } from '../../context/ThemeContext';

export const CanvasContainer: React.FC = () => {
  const { themeMeta } = useTheme();

  return (
    <div className="absolute inset-0 pointer-events-auto z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 48 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          {/* Ambient & Occult Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[5, 8, 4]}
            intensity={1.2}
            color="#FFFFFF"
          />
          <pointLight
            position={[-4, -3, 2]}
            intensity={2.0}
            color={themeMeta.accentHex}
            distance={10}
          />

          {/* Levitating Smoke Orb in background */}
          <SmokeOrbShader position={[0, 0.2, -1.8]} scale={1.75} />

          {/* Floating Interactive 3D Playing Card Deck */}
          <FloatingCardDeck position={[0, -0.1, 0.4]} />

          {/* Floating Embers / Ash Particles */}
          <ParticleField count={450} />
        </Suspense>
      </Canvas>
    </div>
  );
};
