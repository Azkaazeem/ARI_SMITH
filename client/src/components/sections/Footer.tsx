import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useBooking } from '../../context/BookingContext';
import { Clock, Shield, ArrowUp, Mail, Instagram, Globe } from 'lucide-react';
import realLogo from '../../assets/logo.png';
import { FooterWave } from '../ui/FooterWave';

export const Footer: React.FC<{ onOpenAdmin: () => void }> = ({ onOpenAdmin }) => {
  const { themeMeta } = useTheme();
  const { scrollToBooking } = useBooking();
  const [manchesterTime, setManchesterTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const timeStr = new Intl.DateTimeFormat('en-GB', options).format(now);
      const isBST = Boolean(
        new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', timeZoneName: 'short' })
          .format(now)
          .includes('BST')
      );
      setManchesterTime(`${timeStr} ${isBST ? 'BST' : 'GMT'}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full bg-black text-white/70 pt-24 pb-12 px-4 sm:px-12 font-serif overflow-hidden">
      
      {/* Glowing Laser Wave Line with Left Particle Spark Nebula */}
      <FooterWave />

      {/* Light Faint Watermark Typography in Footer Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className="font-display font-black text-[18vw] tracking-[0.2em] uppercase text-white/[0.03] whitespace-nowrap leading-none">
          ARI SMITH
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-14">
        
        {/* Top Header Split: Logo & Real-Time Manchester Clock */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-10 border-b border-white/10">
          
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 border border-white/20 bg-black flex items-center justify-center p-1">
              <img
                src={realLogo}
                alt="Ari Smith Official Logo"
                className="w-full h-full object-contain filter invert opacity-95"
              />
            </div>
            <div>
              <span className="font-display text-xl sm:text-2xl font-bold tracking-widest text-white uppercase block">
                Ari Smith
              </span>
              <p className="font-mono text-[9px] text-white/50 tracking-[0.25em] uppercase">
                Manchester &bull; UK &bull; International
              </p>
            </div>
          </div>

          {/* Dynamic Real-Time Manchester Clock */}
          <div className="flex items-center gap-3 p-3 border border-white/15 bg-white/5">
            <div className="relative w-2 h-2 flex items-center justify-center">
              <span
                className="absolute inset-0 animate-ping opacity-75"
                style={{ backgroundColor: themeMeta.accentHex }}
              />
              <span
                className="relative w-1.5 h-1.5"
                style={{ backgroundColor: themeMeta.accentHex }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1 text-[8px] sm:text-[9px] font-mono tracking-widest text-white/40 uppercase">
                <Clock className="w-3 h-3 text-white/40" />
                <span>Manchester Local Time</span>
              </div>
              <div className="font-mono text-xs sm:text-sm font-bold text-white tracking-wider">
                {manchesterTime || '19:00:00 BST'}
              </div>
            </div>
          </div>

        </div>

        {/* Navigation & Contact Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs font-light leading-relaxed">
          
          {/* Col 1: Explore */}
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-white/40 font-bold">
              Explore
            </h4>
            <ul className="space-y-1.5 font-mono text-xs text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Ari</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Services (Weddings & Corporate)</a></li>
              <li><a href="#gallery" className="hover:text-white transition-colors">Moments of Amazement (Gallery)</a></li>
              <li><a href="#reviews" className="hover:text-white transition-colors">Verified Google Reviews</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Frequently Asked Questions</a></li>
            </ul>
          </div>

          {/* Col 2: Services Details */}
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-white/40 font-bold">
              Performance Formats
            </h4>
            <ul className="space-y-1.5 font-mono text-xs text-white/60">
              <li>Weddings (Close-Up Magic)</li>
              <li>Corporate Galas & Keynotes</li>
              <li>Private Celebrations & Dinners</li>
              <li>Mind Reading & Mentalism</li>
              <li>Bespoke Theatrical Illusions</li>
            </ul>
          </div>

          {/* Col 3: Real Contact Info */}
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-white/40 font-bold">
              Direct Contact
            </h4>
            <div className="space-y-2 font-mono text-xs text-white/60">
              <div>
                <a
                  href="mailto:contact@arismith.co.uk"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" style={{ color: themeMeta.accentHex }} />
                  <span>contact@arismith.co.uk</span>
                </a>
              </div>
              <div>
                <a
                  href="https://instagram.com/AriSmith_Magic"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5" style={{ color: themeMeta.accentHex }} />
                  <span>@AriSmith_Magic</span>
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-white/40" />
                <span>www.arismith.co.uk</span>
              </div>
              <div className="text-[10px] text-white/40 pt-1">
                Manchester &bull; UK & International Performances
              </div>
            </div>
          </div>

          {/* Col 4: Bookings & Protected Admin */}
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-white/40 font-bold">
              Inquiries & Management
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => scrollToBooking()}
                className="w-full py-2.5 px-4 border border-white/20 bg-white/5 hover:bg-white/10 text-white font-serif text-xs uppercase tracking-wider transition-colors text-center"
              >
                Check Availability & Book
              </button>
              <button
                onClick={onOpenAdmin}
                className="w-full py-2.5 px-4 border border-dashed border-white/15 hover:border-white/40 text-white/40 hover:text-white font-mono text-[10px] tracking-widest uppercase transition-colors flex items-center justify-center gap-2"
                title="Management login for Ari Smith"
              >
                <Shield className="w-3 h-3" />
                <span>Admin Sanctum</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Legal Bar from arismith.co.uk */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-white/40 uppercase tracking-wider">
          <div>
            &copy; 2026 Ari Smith. All rights reserved. &bull; <a href="#" className="hover:text-white">Cookie Policy</a> &bull; <a href="#" className="hover:text-white">Privacy Policy</a> &bull; <a href="#" className="hover:text-white">Terms of Service</a>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <span>Back To Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
