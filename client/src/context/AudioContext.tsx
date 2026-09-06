import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';

interface AudioContextType {
  isPlaying: boolean;
  volume: number;
  toggleAudio: () => void;
  setVolume: (vol: number) => void;
  playClick: () => void;
  playChime: (pitch?: number) => void;
  playCardSound: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.45);

  const toggleAudio = () => {
    if (isPlaying) {
      soundEngine.stopDrone();
      setIsPlaying(false);
    } else {
      soundEngine.startDrone();
      setIsPlaying(true);
    }
  };

  const handleSetVolume = (vol: number) => {
    setVolumeState(vol);
    soundEngine.setVolume(vol);
  };

  const playClick = () => soundEngine.playMechanicalClick();
  const playChime = (pitch = 1) => soundEngine.playMysticChime(pitch);
  const playCardSound = () => soundEngine.playCardShuffle();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      soundEngine.stopDrone();
    };
  }, []);

  return (
    <AudioContext.Provider value={{
      isPlaying,
      volume,
      toggleAudio,
      setVolume: handleSetVolume,
      playClick,
      playChime,
      playCardSound
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within an AudioProvider');
  return ctx;
};
