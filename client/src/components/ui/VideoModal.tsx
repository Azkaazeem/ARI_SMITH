import React, { useEffect, useRef } from 'react';
import { X, Play, Volume2, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category: string;
  description: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  title,
  category,
  description
}) => {
  const { themeMeta } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.03;
      ctx.fillStyle = '#070707';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      for (let r = 20; r < 360; r += 28) {
        ctx.beginPath();
        const rippleOffset = Math.sin(t + r * 0.05) * 8;
        ctx.arc(cx, cy, r + rippleOffset, 0, Math.PI * 2);
        ctx.strokeStyle = themeMeta.accentHex;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = Math.max(0.05, 1 - (r / 360));
        ctx.stroke();
      }

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isOpen, themeMeta]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-3xl border border-white/20 bg-[#0A0A0A] shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/50">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase">
              {category}
            </span>
            <h3 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Simulation */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          <canvas
            ref={canvasRef}
            width={854}
            height={480}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-4 text-center px-6">
            <div
              className="w-16 h-16 border border-white/30 bg-black/80 flex items-center justify-center shadow-2xl group transition-transform duration-300 hover:scale-105"
              style={{ borderColor: themeMeta.accentHex }}
            >
              <Play className="w-6 h-6 ml-1 text-white fill-white" />
            </div>
            <div>
              <p className="text-xs font-mono tracking-widest text-white/70 uppercase">
                [Live Performance Reel Archive]
              </p>
              <p className="text-sm font-serif text-white/90 italic mt-1 max-w-md">
                Captured before live audiences across Manchester and prestigious UK venues.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-mono text-white/60">
              <Volume2 className="w-3 h-3 text-white/60" />
              <span>Full 4K Performance Reel Available Upon Request</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-[#0C0C0C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10">
          <div className="text-xs text-white/70 max-w-lg leading-relaxed font-serif font-light">
            {description}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Live Performance</span>
          </div>
        </div>

      </div>
    </div>
  );
};
