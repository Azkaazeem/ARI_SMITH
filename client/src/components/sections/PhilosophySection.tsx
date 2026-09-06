import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../../context/ThemeContext';
import { useBooking } from '../../context/BookingContext';
import { Sparkles, MapPin, Check, ArrowRight, Eye, Layers } from 'lucide-react';
import photoAri from '../../assets/1.jpg';

gsap.registerPlugin(ScrollTrigger);

export const PhilosophySection: React.FC = () => {
  const { themeMeta } = useTheme();
  const { scrollToBooking } = useBooking();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reveals = sectionRef.current?.querySelectorAll('.scroll-reveal');
      if (reveals) {
        gsap.from(reveals, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          y: 35,
          opacity: 0,
          stagger: 0.15,
          duration: 1.0,
          ease: 'power3.out'
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const disciplines = [
    {
      title: 'Magic',
      desc: 'Sleight of hand and close-up magic performed inches from your eyes – impossible, tactile and utterly baffling.'
    },
    {
      title: 'Mentalism',
      desc: 'Mind-reading and psychological illusion that feels genuinely unexplainable and deeply personal to your guests.'
    },
    {
      title: 'Illusion',
      desc: 'Show-stopping moments of astonishment, curated to elevate your event into a talking point for weeks.'
    }
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-28 px-6 sm:px-12 bg-[#070707] border-t border-white/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Authentic Photo from Assets in Sharp Beveled Frame */}
        <div className="lg:col-span-5 scroll-reveal">
          <div className="relative border border-white/20 bg-black p-2 shadow-2xl group">
            
            {/* Corner Bracket Accents */}
            <div
              className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 pointer-events-none"
              style={{ borderColor: themeMeta.accentHex }}
            />
            <div
              className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 pointer-events-none"
              style={{ borderColor: themeMeta.accentHex }}
            />

            <div className="relative aspect-[4/5] w-full overflow-hidden bg-black">
              <img
                src={photoAri}
                alt="Ari Smith Magician, Mentalist & Illusionist"
                className="w-full h-full object-cover grayscale-0 md:grayscale md:contrast-110 md:group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

              {/* Foreground Quote Stamp */}
              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2" style={{ backgroundColor: themeMeta.accentHex }} />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-white/70">
                    Manchester Resident &bull; Global Performer
                  </span>
                </div>
                <blockquote className="font-serif text-sm text-white/90 italic">
                  &ldquo;I create interactive moments that bring people together and leave guests wondering, &lsquo;How did he do that?&rsquo;&rdquo;
                </blockquote>
                <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest pt-1 border-t border-white/10">
                  Ari Smith &bull; Manchester, UK
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Authentic Story from arismith.co.uk */}
        <div className="lg:col-span-7 space-y-8">
          
          <div className="scroll-reveal space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 bg-white/5 text-[11px] font-mono tracking-[0.25em] uppercase text-white/70">
              <MapPin className="w-3.5 h-3.5" style={{ color: themeMeta.accentHex }} />
              <span>Hello, I am Ari &bull; Welcome To My World</span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-wide text-white leading-tight">
              Unforgettable <br />
              <span style={{ color: themeMeta.accentHex }}>Entertainment</span>
            </h2>
          </div>

          <div className="scroll-reveal space-y-4 font-serif text-sm sm:text-base text-white/70 leading-relaxed font-light">
            <p>
              I’m a Manchester-based magician, mentalist and illusionist, performing across the UK and at international events. 
            </p>
            <p>
              Blending sleight of hand, mind-reading and psychological illusion with a warm, approachable style, I create interactive moments that bring people together and leave guests wondering, <span className="text-white font-medium">&ldquo;How did he do that?&rdquo;</span>
            </p>
            <p>
              Whether mingling with guests during a drinks reception, entertaining at a corporate function, or providing a bespoke performance for a private celebration, my approach connects with audiences of all ages to make every event truly unique.
            </p>
          </div>

          {/* Three Disciplines from arismith.co.uk */}
          <div className="scroll-reveal space-y-3 pt-2">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              <Layers className="w-3.5 h-3.5" style={{ color: themeMeta.accentHex }} />
              <span>Three Disciplines, One Experience</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {disciplines.map((d, i) => (
                <div key={i} className="p-4 border border-white/15 bg-white/5 space-y-1.5 hover:border-white/30 transition-colors">
                  <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
                    {d.title}
                  </h4>
                  <p className="font-serif text-xs text-white/60 font-light leading-relaxed">
                    {d.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="scroll-reveal pt-4 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => scrollToBooking()}
              className="w-full sm:w-auto px-7 py-3 border font-serif text-xs font-bold tracking-[0.25em] uppercase transition-all duration-300 hover:brightness-110 flex items-center justify-center gap-2"
              style={{
                borderColor: themeMeta.accentHex,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF'
              }}
            >
              <span>Check Availability</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <a
              href="#services"
              className="w-full sm:w-auto px-7 py-3 border border-white/20 bg-black text-white font-serif text-xs tracking-[0.25em] uppercase text-center hover:bg-white/10 transition-colors"
            >
              Explore Services
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
