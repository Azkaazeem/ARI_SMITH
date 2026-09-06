import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { soundEngine } from '../../utils/soundEngine';

// Generate procedural occult card texture
function createCardTexture(themeColor: string, title = 'THE ILLUSION'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background
  ctx.fillStyle = '#080808';
  ctx.fillRect(0, 0, 512, 768);

  // Intricate vintage border
  ctx.strokeStyle = themeColor;
  ctx.lineWidth = 6;
  ctx.strokeRect(20, 20, 472, 728);

  ctx.lineWidth = 1.5;
  ctx.strokeRect(32, 32, 448, 704);

  // Corner ornaments
  const corners = [
    [40, 40], [472, 40], [40, 728], [472, 728]
  ];
  ctx.fillStyle = themeColor;
  corners.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  // Central Eye / Occult Emblem
  ctx.save();
  ctx.translate(256, 340);
  ctx.strokeStyle = themeColor;
  ctx.lineWidth = 3;

  // Eye shape
  ctx.beginPath();
  ctx.moveTo(-90, 0);
  ctx.quadraticCurveTo(0, -65, 90, 0);
  ctx.quadraticCurveTo(0, 65, -90, 0);
  ctx.stroke();

  // Iris & Pupil
  ctx.beginPath();
  ctx.arc(0, 0, 32, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = themeColor;
  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, Math.PI * 2);
  ctx.fill();

  // Ethereal radiating rays
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
    const rx1 = Math.cos(a) * 44;
    const ry1 = Math.sin(a) * 44;
    const rx2 = Math.cos(a) * 68;
    const ry2 = Math.sin(a) * 68;
    ctx.beginPath();
    ctx.moveTo(rx1, ry1);
    ctx.lineTo(rx2, ry2);
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  ctx.restore();

  // Typography
  ctx.fillStyle = themeColor;
  ctx.font = 'bold 26px "Cinzel", serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '6px';
  ctx.fillText('ARI SMITH', 256, 520);

  ctx.font = '16px "Cinzel", serif';
  ctx.letterSpacing = '4px';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText(title, 256, 560);

  ctx.font = '12px "Inter", monospace';
  ctx.letterSpacing = '3px';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillText('N° 07 • SANCTUM EDITION', 256, 680);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

interface SingleCardProps {
  index: number;
  total: number;
  isScattered: boolean;
  texture: THREE.CanvasTexture;
  themeColor: string;
}

const SingleCard: React.FC<SingleCardProps> = ({ index, total, isScattered, texture }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Resting position in tight stacked deck
  const restPos = useMemo(() => {
    const zOffset = (index - total / 2) * 0.045;
    const rotZ = (index - total / 2) * 0.025;
    return { x: 0, y: 0, z: zOffset, rotX: 0, rotY: 0, rotZ };
  }, [index, total]);

  // Scattered position in 3D space (fan / vortex dispersion)
  const scatterPos = useMemo(() => {
    const angle = (index / total) * Math.PI * 2 + Math.PI / 4;
    const radius = 2.4 + (index % 3) * 0.5;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * (radius * 0.65);
    const z = (Math.sin(index * 2.2) * 1.6) + 0.5;
    const rotX = Math.sin(index * 1.5) * 0.6;
    const rotY = Math.cos(index * 1.2) * 0.8;
    const rotZ = angle + Math.PI / 2;
    return { x, y, z, rotX, rotY, rotZ };
  }, [index, total]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const target = isScattered ? scatterPos : restPos;
    const speed = isScattered ? 6.5 : 4.0;

    // Smooth lerp to target position and rotation
    meshRef.current.position.x = THREE.MathUtils.damp(meshRef.current.position.x, target.x, speed, delta);
    meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, target.y, speed, delta);
    meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, target.z, speed, delta);

    meshRef.current.rotation.x = THREE.MathUtils.damp(meshRef.current.rotation.x, target.rotX, speed, delta);
    meshRef.current.rotation.y = THREE.MathUtils.damp(meshRef.current.rotation.y, target.rotY, speed, delta);
    meshRef.current.rotation.z = THREE.MathUtils.damp(meshRef.current.rotation.z, target.rotZ, speed, delta);
  });

  return (
    <mesh ref={meshRef} position={[restPos.x, restPos.y, restPos.z]} castShadow receiveShadow>
      {/* Playing card geometry: standard poker aspect ratio (1.4 x 2.1) */}
      <planeGeometry args={[1.4, 2.1]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.25}
        metalness={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export const FloatingCardDeck: React.FC<{ position?: [number, number, number] }> = ({
  position = [0, 0, 0]
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [isScattered, setIsScattered] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { themeMeta } = useTheme();
  const { mouse } = useThree();

  const totalCards = 9;
  const cardTitles = [
    'THE TELEPATH',
    'ACE OF OBSIDIAN',
    'THE MIRROR ILLUSION',
    'PSYCHIC ARCHITECT',
    'SEALED PROMISE',
    'THE MANCHESTER CHRONICLE',
    'TIME STOP',
    'THE GRAND CONJUROR',
    'THE VOID'
  ];

  // Textures memoized by theme
  const textures = useMemo(() => {
    return cardTitles.map(title => createCardTexture(themeMeta.accentHex, title));
  }, [themeMeta.accentHex]);

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    soundEngine.playCardShuffle();
    soundEngine.playMysticChime(isScattered ? 1.2 : 0.9);
    setIsScattered(prev => !prev);
  };

  // Auto-reassemble after 4.5 seconds if left scattered
  useEffect(() => {
    if (isScattered) {
      const timer = setTimeout(() => {
        setIsScattered(false);
        soundEngine.playCardShuffle();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [isScattered]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Mouse parallax tilt with smooth damping
    const targetRotY = mouse.x * 0.45;
    const targetRotX = -mouse.y * 0.35 + Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
    const floatY = Math.sin(state.clock.elapsedTime * 1.4) * 0.12;

    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 3.5, delta);
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 3.5, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, position[1] + floatY, 3.0, delta);
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={handleClick}
      onPointerOver={() => {
        setIsHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setIsHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {textures.map((tex, idx) => (
        <SingleCard
          key={idx}
          index={idx}
          total={totalCards}
          isScattered={isScattered}
          texture={tex}
          themeColor={themeMeta.accentHex}
        />
      ))}

      {/* Subtle Glow Point Light reacting to active theme */}
      <pointLight
        color={themeMeta.accentHex}
        intensity={isHovered ? 4.5 : 2.5}
        distance={6}
        position={[0, 0, 1.2]}
      />
    </group>
  );
};
