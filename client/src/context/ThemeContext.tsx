import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';

export type OccultTheme = 'abyssal' | 'crimson' | 'toxic' | 'amber';

export interface ThemeMeta {
  id: OccultTheme;
  name: string;
  subtitle: string;
  accentHex: string;
  glowHex: string;
  description: string;
}

export const THEMES: ThemeMeta[] = [
  {
    id: 'abyssal',
    name: 'Abyssal Obsidian',
    subtitle: 'Matte Pitch & Stark Smoke',
    accentHex: '#E2E8F0',
    glowHex: 'rgba(226, 232, 240, 0.3)',
    description: 'The cold, silent realm of pure psychological focus.'
  },
  {
    id: 'crimson',
    name: 'Crimson Séance',
    subtitle: 'Arterial Red & Candlelight',
    accentHex: '#E11D48',
    glowHex: 'rgba(225, 29, 72, 0.45)',
    description: 'The burning theatre of blood oaths and forbidden revelations.'
  },
  {
    id: 'toxic',
    name: 'Toxic Apparition',
    subtitle: 'Radioactive & Phantom Green',
    accentHex: '#22C55E',
    glowHex: 'rgba(34, 197, 94, 0.4)',
    description: 'The spectral glow of ectoplasm and telepathic static.'
  },
  {
    id: 'amber',
    name: 'Occult Amber',
    subtitle: 'Cursed Gold & Sulfur Soot',
    accentHex: '#F59E0B',
    glowHex: 'rgba(245, 158, 11, 0.4)',
    description: 'Ancient parchment, arcane seals, and celestial eclipses.'
  }
];

interface ThemeContextType {
  theme: OccultTheme;
  themeMeta: ThemeMeta;
  setTheme: (theme: OccultTheme) => void;
  nextTheme: () => void;
  isGlitching: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<OccultTheme>(() => {
    const saved = localStorage.getItem('ari_smith_theme') as OccultTheme;
    return (saved && ['abyssal', 'crimson', 'toxic', 'amber'].includes(saved)) ? saved : 'abyssal';
  });
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ari_smith_theme', theme);
  }, [theme]);

  const setTheme = (newTheme: OccultTheme) => {
    if (newTheme === theme) return;
    soundEngine.playMechanicalClick();
    setIsGlitching(true);
    setThemeState(newTheme);

    setTimeout(() => {
      setIsGlitching(false);
    }, 400);
  };

  const nextTheme = () => {
    const currentIdx = THEMES.findIndex(t => t.id === theme);
    const nextIdx = (currentIdx + 1) % THEMES.length;
    setTheme(THEMES[nextIdx].id);
  };

  const currentMeta = THEMES.find(t => t.id === theme) || THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, themeMeta: currentMeta, setTheme, nextTheme, isGlitching }}>
      <div className={isGlitching ? 'screen-glitch' : ''}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};
