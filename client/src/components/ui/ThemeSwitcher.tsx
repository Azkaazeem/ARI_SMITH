import React, { useState } from 'react';
import { useTheme, THEMES } from '../../context/ThemeContext';
import type { OccultTheme } from '../../context/ThemeContext';
import { Eye, Flame, Skull, Sparkles, ChevronDown } from 'lucide-react';

const icons: Record<OccultTheme, React.ReactNode> = {
  abyssal: <Eye className="w-3.5 h-3.5" />,
  crimson: <Flame className="w-3.5 h-3.5" />,
  toxic: <Skull className="w-3.5 h-3.5" />,
  amber: <Sparkles className="w-3.5 h-3.5" />
};

export const ThemeSwitcher: React.FC = () => {
  const { theme, themeMeta, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300 text-xs tracking-wider uppercase font-mono interactive-hover"
        title="Switch Occult Ambience"
      >
        <span
          className="w-2 h-2 transition-all duration-300 shadow-sm"
          style={{ backgroundColor: themeMeta.accentHex, boxShadow: `0 0 10px ${themeMeta.glowHex}` }}
        />
        <span className="hidden sm:inline font-medium text-white/80">{themeMeta.name}</span>
        <ChevronDown className={`w-3 h-3 text-white/60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 border border-white/20 bg-[#0A0A0A] shadow-2xl p-2 z-50 animate-in fade-in duration-200">
            <div className="px-3 py-1.5 text-[10px] font-mono tracking-widest text-white/40 uppercase border-b border-white/10">
              Occult Resonance Mode
            </div>
            <div className="mt-1 space-y-1">
              {THEMES.map(t => {
                const isActive = t.id === theme;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-start gap-3 p-2.5 text-left transition-all duration-200 interactive-hover border ${
                      isActive
                        ? 'bg-white/10 border-white/30'
                        : 'hover:bg-white/5 border-transparent'
                    }`}
                  >
                    <div
                      className="mt-0.5 p-1 flex items-center justify-center text-black"
                      style={{ backgroundColor: t.accentHex }}
                    >
                      {icons[t.id]}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white tracking-wide">
                        {t.name}
                      </div>
                      <div className="text-[10px] text-white/50 leading-snug">
                        {t.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
