import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles, Menu, X, Palette, Check } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { useTheme, THEMES } from '../../context/ThemeContext';
import { useBooking } from '../../context/BookingContext';
import realLogo from '../../assets/logo.png';

interface NavigationProps {
  onOpenAdmin: () => void;
}

export const Navigation: React.FC<NavigationProps> = () => {
  const { isPlaying, toggleAudio } = useAudio();
  const { theme, themeMeta, setTheme } = useTheme();
  const { scrollToBooking } = useBooking();
  const [themeOpen, setThemeOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);

  // Click outside to close theme dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-3 sm:px-6 py-2 sm:py-3 pointer-events-none transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto border border-white/20 bg-black/90 backdrop-blur-xl px-3.5 sm:px-5 py-2.5 shadow-2xl">
        
        {/* Left: Brand Logo & Title */}
        <a
          href="#"
          className="flex items-center gap-3 group"
          title="Ari Smith - Magician, Mentalist & Illusionist"
        >
          <img
            src={realLogo}
            alt="Ari Smith Signature Logo"
            className="h-7 sm:h-8 w-auto max-w-[85px] sm:max-w-[105px] object-contain opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
          />
          <div className="flex flex-col border-l border-white/20 pl-2.5 sm:pl-3">
            <span className="font-display tracking-[0.2em] text-xs sm:text-sm font-bold text-white uppercase group-hover:text-white/90">
              Ari Smith
            </span>
            <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.25em] text-white/50 uppercase hidden xs:inline">
              Manchester &bull; Magician & Mentalist
            </span>
          </div>
        </a>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
          {navLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="hover:text-white transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all after:duration-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Explicit, Responsive Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">

          {/* 1. Sound Ambience Toggle (Icon-only on mobile, text on sm+) */}
          <button
            onClick={toggleAudio}
            className={`flex items-center justify-center gap-1.5 px-2 sm:px-3 py-1.5 border text-[10px] sm:text-[11px] font-mono tracking-wider uppercase transition-all duration-200 shrink-0 ${
              isPlaying
                ? 'border-white bg-white text-black font-bold'
                : 'border-white/20 bg-white/5 text-white/70 hover:text-white hover:border-white/40'
            }`}
            title={isPlaying ? 'Mute Atmospheric Audio' : 'Turn On Atmospheric Audio'}
          >
            {isPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden sm:inline">Sound: On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-white/50" />
                <span className="hidden sm:inline">Sound: Off</span>
              </>
            )}
          </button>

          {/* 2. Theme Switcher (Desktop & Tablet only on top bar; also in mobile drawer) */}
          <div className="relative hidden sm:block" ref={themeRef}>
            <button
              onClick={() => setThemeOpen(prev => !prev)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 border border-white/20 bg-white/5 hover:border-white/40 text-[10px] sm:text-[11px] font-mono tracking-wider uppercase text-white/80 transition-all duration-200 shrink-0"
              title="Change Color Theme"
            >
              <Palette className="w-3.5 h-3.5 text-white/70" />
              <span className="hidden md:inline">Theme:</span>
              <span
                className="w-2.5 h-2.5 border border-white/30"
                style={{ backgroundColor: themeMeta.accentHex }}
              />
            </button>

            {themeOpen && (
              <div className="absolute right-0 mt-2 w-52 border border-white/20 bg-[#0C0C0C] shadow-2xl p-2 z-50">
                <div className="px-2.5 py-1 text-[9px] font-mono tracking-widest text-white/40 uppercase border-b border-white/10">
                  Select Visual Ambience
                </div>
                <div className="mt-1 space-y-1">
                  {THEMES.map(t => {
                    const isSelected = t.id === theme;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTheme(t.id);
                          setThemeOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 text-left font-mono text-xs transition-colors ${
                          isSelected ? 'bg-white/15 text-white' : 'hover:bg-white/5 text-white/70'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 border border-white/30"
                            style={{ backgroundColor: t.accentHex }}
                          />
                          <span>{t.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 3. Primary Booking CTA */}
          <button
            onClick={() => scrollToBooking()}
            className="flex items-center gap-1 px-2.5 sm:px-4 py-1.5 font-serif text-[11px] sm:text-xs font-bold tracking-[0.1em] sm:tracking-[0.15em] uppercase border transition-all duration-200 hover:brightness-110 active:scale-95 shrink-0"
            style={{
              borderColor: themeMeta.accentHex,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF'
            }}
          >
            <Sparkles className="w-3 h-3" style={{ color: themeMeta.accentHex }} />
            <span>Book Ari</span>
          </button>

          {/* 4. Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="lg:hidden p-1.5 border border-white/20 bg-white/5 text-white shrink-0 hover:bg-white/10"
            title="Open Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden pointer-events-auto max-w-7xl mx-auto mt-2 border border-white/20 bg-[#0C0C0C]/98 backdrop-blur-2xl p-4 sm:p-5 flex flex-col gap-3 font-mono text-xs uppercase tracking-widest text-white shadow-2xl animate-in fade-in duration-200">
          
          {/* Mobile Theme Selector Swatches */}
          <div className="p-3 border border-white/10 bg-white/5 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-white/50">
              <span className="flex items-center gap-1.5"><Palette className="w-3.5 h-3.5" /> Visual Ambience:</span>
              <span className="text-white font-bold">{themeMeta.name}</span>
            </div>
            <div className="grid grid-cols-4 gap-2 pt-1">
              {THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`py-1.5 px-2 border text-[9px] flex items-center justify-center gap-1.5 transition-colors ${
                    theme === t.id ? 'border-white bg-white/20 text-white font-bold' : 'border-white/15 bg-black/60 text-white/60'
                  }`}
                >
                  <span className="w-2.5 h-2.5 border border-white/30" style={{ backgroundColor: t.accentHex }} />
                  <span>{t.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Nav Links */}
          <div className="space-y-1">
            {navLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 block border-b border-white/5 hover:bg-white/5 transition-colors text-white/80 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              scrollToBooking();
            }}
            className="mt-2 w-full py-3 border font-serif text-xs font-bold tracking-widest uppercase text-white hover:bg-white/10 flex items-center justify-center gap-2"
            style={{ borderColor: themeMeta.accentHex, backgroundColor: 'rgba(255,255,255,0.06)' }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: themeMeta.accentHex }} />
            <span>Check Availability & Book Ari</span>
          </button>
        </div>
      )}
    </header>
  );
};
