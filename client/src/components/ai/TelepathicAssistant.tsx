import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { X, Sparkles, Bot } from 'lucide-react';
import { ChatWindow } from './ChatWindow';
import aiRoboImg from '../../assets/AI robo.jpg';

export const TelepathicAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const { themeMeta } = useTheme();
  const chatRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    setIsOpen(true);
    setHasInteracted(true);
  };

  // Close when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && chatRef.current && !chatRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="fixed bottom-5 right-5 z-50 pointer-events-auto" ref={chatRef}>
      
      {/* Round AI Floating Trigger Button */}
      {!isOpen && (
        <div className="relative group">
          {/* Subtle animated glowing aura */}
          <div
            className="absolute -inset-1.5 rounded-full opacity-60 blur-md animate-pulse"
            style={{ backgroundColor: themeMeta.accentHex }}
          />

          {!hasInteracted && (
            <div className="absolute right-full mr-3 bottom-2 whitespace-nowrap px-3.5 py-1.5 rounded-full bg-black/95 border border-white/20 text-xs font-serif tracking-wide text-white/90 shadow-2xl backdrop-blur-md hidden sm:flex items-center gap-2 pointer-events-none">
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: themeMeta.accentHex }} />
              Chat with Ari&apos;s AI Assistant
            </div>
          )}

          <button
            onClick={handleOpen}
            className="relative w-14 h-14 rounded-full border-2 bg-black p-0.5 flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group overflow-hidden"
            style={{ borderColor: themeMeta.accentHex, boxShadow: `0 0 25px ${themeMeta.accentHex}50` }}
            title="Chat with Ari's AI Mentalist Assistant"
          >
            <div className="w-full h-full rounded-full overflow-hidden relative flex items-center justify-center bg-black">
              <img
                src={aiRoboImg}
                alt="Ari's AI Assistant"
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
              />
              {/* Online status indicator */}
              <span
                className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-black bg-emerald-500 z-10"
              />
            </div>
          </button>
        </div>
      )}

      {/* Rounded Modern AI Chat Window */}
      {isOpen && (
        <div className="w-[94vw] sm:w-[410px] h-[550px] max-h-[82vh] rounded-2xl sm:rounded-3xl border border-white/20 bg-[#0A0A0A]/95 backdrop-blur-2xl shadow-[0_15px_60px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Curved Header */}
          <div className="px-4 py-3.5 border-b border-white/10 flex items-center justify-between bg-black/60">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full border-2 bg-black overflow-hidden flex items-center justify-center relative p-0.5 shadow-md flex-shrink-0"
                style={{ borderColor: themeMeta.accentHex }}
              >
                <img
                  src={aiRoboImg}
                  alt="Ari's AI Assistant"
                  className="w-full h-full object-cover object-center rounded-full"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-serif font-bold tracking-wider text-white uppercase">
                    Ari&apos;s AI Concierge
                  </h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <p className="text-[10px] font-mono text-white/50 tracking-wider">
                  Real-Time Virtual Mentalist
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              title="Close chat"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <ChatWindow onClose={() => setIsOpen(false)} />
        </div>
      )}

    </div>
  );
};
