import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CanvasContainer } from '../3d/CanvasContainer';
import { useTheme } from '../../context/ThemeContext';
import { useBooking } from '../../context/BookingContext';
import { Sparkles, Eye, Award, Globe, ArrowRight, Shield } from 'lucide-react';

import heroImg from '../../assets/hero.png';
import herosecImg from '../../assets/herosec.jpg';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onOpenVideo: (title: string, cat: string, desc: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenVideo }) => {
  const { themeMeta } = useTheme();
  const { scrollToBooking } = useBooking();
  const containerRef = useRef<HTMLDivElement>(null);
  const textTopRef = useRef<HTMLHeadingElement>(null);
  const textBottomRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(badgeRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.9,
        delay: 0.2
      })
      .from([textTopRef.current, textBottomRef.current], {
        opacity: 0,
        y: 40,
        stagger: 0.2,
        duration: 1.1
      }, '-=0.6')
      .from(portraitRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 1.2
      }, '-=0.8')
      .from(subtitleRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.9
      }, '-=0.7')
      .from(ctaRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8
      }, '-=0.6');

      // ScrollTrigger Pinned Hero Split (Only on desktop to keep mobile silky smooth):
      if (containerRef.current && textTopRef.current && textBottomRef.current && window.innerWidth >= 768) {
        gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=100%',
            scrub: 1.2,
            pin: true,
          }
        })
        .to(textTopRef.current, {
          x: -160,
          opacity: 0.12,
          scale: 1.1,
          ease: 'none'
        })
        .to(textBottomRef.current, {
          x: 160,
          opacity: 0.12,
          scale: 1.1,
          ease: 'none'
        }, 0)
        .to(portraitRef.current, {
          opacity: 0.2,
          scale: 1.05,
          ease: 'none'
        }, 0)
        .to(subtitleRef.current, {
          opacity: 0,
          y: -40,
          ease: 'none'
        }, 0)
        .to(ctaRef.current, {
          opacity: 0,
          scale: 0.92,
          ease: 'none'
        }, 0);
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToGallery = () => {
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen min-h-[750px] flex items-center justify-center overflow-hidden bg-black select-none"
    >
      {/* 3D WebGL Canvas Scene in Background */}
      <CanvasContainer />

      {/* Real Hero Section Backdrop Blend */}
      <div
        className="absolute inset-0 z-[1] bg-cover bg-center opacity-25 mix-blend-luminosity pointer-events-none"
        style={{ backgroundImage: `url(${herosecImg})` }}
      />

      {/* Vignette Screen Overlay */}
      <div className="vignette-overlay" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/40 to-black/70 pointer-events-none z-10" />

      {/* Hero Content Layer */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center flex flex-col items-center pointer-events-none pt-12">
        
        {/* Real Location Tagline from arismith.co.uk */}
        <div
          ref={badgeRef}
          className="pointer-events-auto inline-flex items-center gap-2 px-4 py-1.5 border border-white/20 bg-black/80 backdrop-blur-md mb-4 shadow-xl"
        >
          <span
            className="w-2 h-2 animate-ping"
            style={{ backgroundColor: themeMeta.accentHex }}
          />
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white/90">
            Manchester &bull; UK & International
          </span>
        </div>

        {/* Pinned Split Typography: "REALITY IS AN ILLUSION" */}
        <div className="overflow-visible space-y-1 sm:space-y-2 mb-4">
          <h1
            ref={textTopRef}
            className="font-display text-3xl xs:text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-[0.08em] sm:tracking-[0.14em] text-white uppercase drop-shadow-[0_10px_40px_rgba(0,0,0,0.95)]"
          >
            Reality Is
          </h1>
          <h1
            ref={textBottomRef}
            className="font-display text-3xl xs:text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-[0.08em] sm:tracking-[0.14em] uppercase transition-colors duration-500 drop-shadow-[0_10px_40px_rgba(0,0,0,0.95)]"
            style={{ color: themeMeta.accentHex }}
          >
            An Illusion
          </h1>
        </div>

        {/* Real Ari Portrait Graphic Layer */}
        <div
          ref={portraitRef}
          className="pointer-events-auto my-2 relative w-32 h-32 sm:w-40 sm:h-40 border border-white/20 bg-black/40 backdrop-blur-md overflow-hidden p-1 shadow-2xl group transition-transform duration-500 hover:scale-105"
        >
          <img
            src={heroImg}
            alt="Ari Smith Magician & Mentalist"
            className="w-full h-full object-cover grayscale-0 md:grayscale md:contrast-125 md:group-hover:grayscale-0 transition-all duration-500"
          />
          <div
            className="absolute inset-0 border pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-300"
            style={{ borderColor: themeMeta.accentHex }}
          />
        </div>

        {/* Authentic Subtitle from arismith.co.uk */}
        <div ref={subtitleRef} className="max-w-2xl mb-8 mt-2">
          <p className="font-serif text-sm sm:text-lg text-white/90 font-light tracking-wide leading-relaxed">
            Unforgettable close-up magic, mind-reading and illusion that captivates, amazes and sparks conversation long after the event has ended.
          </p>
          <p className="text-[10px] font-mono text-white/40 tracking-[0.25em] uppercase mt-2">
            Click cards in 3D space to disperse &bull; Drag to tilt realm
          </p>
        </div>

        {/* Sharp Rectangular CTAs */}
        <div
          ref={ctaRef}
          className="pointer-events-auto flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={() => scrollToBooking()}
            className="w-full sm:w-auto px-8 py-3.5 border font-serif text-xs sm:text-sm font-bold tracking-[0.25em] uppercase transition-all duration-300 shadow-2xl hover:brightness-110 active:scale-95 group flex items-center justify-center gap-2.5"
            style={{
              borderColor: themeMeta.accentHex,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF'
            }}
          >
            <Sparkles className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" style={{ color: themeMeta.accentHex }} />
            <span>Book Ari</span>
          </button>

          <button
            onClick={scrollToGallery}
            className="w-full sm:w-auto px-8 py-3.5 border border-white/25 bg-black/60 hover:bg-white/10 text-white font-serif text-xs sm:text-sm tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-2.5"
          >
            <Eye className="w-4 h-4" />
            <span>View Gallery</span>
          </button>
        </div>

      </div>

      {/* Real Stats Metrics Bar from arismith.co.uk */}
      <div className="absolute bottom-6 left-0 w-full z-20 px-8 pointer-events-none hidden md:block">
        <div className="max-w-6xl mx-auto grid grid-cols-4 gap-4 text-center border-t border-white/15 pt-4 text-white/80">
          <div className="border-r border-white/10 pr-4">
            <div className="font-display text-xl lg:text-2xl font-bold text-white">5+</div>
            <div className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Years Experience</div>
          </div>
          <div className="border-r border-white/10 pr-4">
            <div className="font-display text-xl lg:text-2xl font-bold text-white" style={{ color: themeMeta.accentHex }}>500+</div>
            <div className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Events Performed</div>
          </div>
          <div className="border-r border-white/10 pr-4">
            <div className="font-display text-xl lg:text-2xl font-bold text-white">100%</div>
            <div className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Bespoke Shows</div>
          </div>
          <div>
            <div className="font-display text-xl lg:text-2xl font-bold text-white" style={{ color: themeMeta.accentHex }}>UK + INT</div>
            <div className="font-mono text-[9px] text-white/40 uppercase tracking-widest">International Reach</div>
          </div>
        </div>
      </div>

    </section>
  );
};
