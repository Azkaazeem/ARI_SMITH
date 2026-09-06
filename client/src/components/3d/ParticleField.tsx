import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

export const ParticleField: React.FC<{ count?: number }> = ({ count = 1200 }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse } = useThree();
  const { themeMeta } = useTheme();

  // Generate initial particle coordinates and speeds
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Spread across a 3D box
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;

      // Velocities: slow upward drift with subtle horizontal jitter
      spd[i * 3] = (Math.random() - 0.5) * 0.008;
      spd[i * 3 + 1] = 0.006 + Math.random() * 0.015;
      spd[i * 3 + 2] = (Math.random() - 0.5) * 0.008;
    }
    return [pos, spd];
  }, [count]);

  const color = useMemo(() => new THREE.Color(themeMeta.accentHex), [themeMeta.accentHex]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    const mouseX = mouse.x * 0.8;
    const mouseY = mouse.y * 0.8;
    const scrollOffset = window.scrollY * 0.002;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;

      // Update positions
      arr[idx] += speeds[idx] + (mouseX * 0.002);
      arr[idx + 1] += speeds[idx + 1];
      arr[idx + 2] += speeds[idx + 2];

      // Recycle particles when they float off the top
      if (arr[idx + 1] > 8) {
        arr[idx + 1] = -8;
        arr[idx] = (Math.random() - 0.5) * 16;
        arr[idx + 2] = (Math.random() - 0.5) * 10;
      }
    }

    posAttr.needsUpdate = true;

    // Gentle global rotation influenced by scroll
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03 + scrollOffset * 0.2;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.05 + mouseY * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color={color}
        transparent={true}
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
