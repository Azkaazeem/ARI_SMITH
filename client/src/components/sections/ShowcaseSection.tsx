import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useBooking } from '../../context/BookingContext';
import { useAudio } from '../../context/AudioContext';
import { Sparkles, Play, Check, ArrowRight, Heart, Briefcase, GlassWater } from 'lucide-react';

import weddingImg from '../../assets/4.jpg';
import corporateImg from '../../assets/6.jpg';
import privateImg from '../../assets/7.jpg';

interface ShowcaseSectionProps {
  onOpenVideo: (title: string, cat: string, desc: string) => void;
}

interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  image: string;
  icon: React.ReactNode;
  description: string;
  highlights: string[];
}

export const ShowcaseSection: React.FC<ShowcaseSectionProps> = ({ onOpenVideo }) => {
  const { themeMeta } = useTheme();
  const { scrollToBooking } = useBooking();
  const { playClick, playChime } = useAudio();

  const [tilt, setTilt] = useState<{ [key: string]: { x: number; y: number } }>({});

  const services: ServiceItem[] = [
    {
      id: 'weddings',
      title: 'Weddings',
      subtitle: 'A touch of wonder on your day',
      category: 'Luxury Wedding Entertainment',
      image: weddingImg,
      icon: <Heart className="w-4 h-4" />,
      description:
        'Ari provides elegant, interactive wedding entertainment designed to amaze guests and enhance your celebration. Blending sophisticated close-up magic with incredible mind-reading, Ari creates unforgettable experiences that add a unique touch to your wedding day.',
      highlights: [
        'Drinks reception & wandering entertainment',
        'Table-to-table magic during the wedding breakfast',
        'An unforgettable icebreaker for mixing guests',
        'Intimate miracles created exclusively for the couple'
      ]
    },
    {
      id: 'corporate',
      title: 'Corporate & Business',
      subtitle: 'Make your brand unforgettable',
      category: 'Corporate Galas & Conferences',
      image: corporateImg,
      icon: <Briefcase className="w-4 h-4" />,
      description:
        'Impress clients, reward employees and create a memorable atmosphere with Ari Smith’s professional corporate entertainment. Combining world-class magic, mentalism and audience interaction, Ari helps break the ice, encourage networking and leave a lasting impression.',
      highlights: [
        'Conferences & award ceremonies',
        'Product launches & brand activations',
        'Company parties & networking events',
        'Keynote mind-reading tailored to your company themes'
      ]
    },
    {
      id: 'private',
      title: 'Private Events & Parties',
      subtitle: 'Celebrations to remember',
      category: 'Milestones & VIP Salons',
      image: privateImg,
      icon: <GlassWater className="w-4 h-4" />,
      description:
        'From intimate gatherings to milestone celebrations, Ari delivers bespoke performances for birthdays, anniversaries, dinner parties and special occasions — entertainment that brings people together and creates truly memorable moments for guests of all ages.',
      highlights: [
        'Birthdays & milestone celebrations',
        'Dinner parties & intimate parlour gatherings',
        'Fully bespoke to your exact venue and occasion',
        'Captivating entertainment for guests of all ages'
      ]
    }
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    setTilt(prev => ({ ...prev, [id]: { x, y } }));
  };

  const handleMouseLeave = (id: string) => {
    setTilt(prev => ({ ...prev, [id]: { x: 0, y: 0 } }));
  };

  const handleSelectService = (title: string) => {
    playChime(1.2);
    scrollToBooking({ eventType: title });
  };

  return (
    <section
      id="services"
      className="relative w-full bg-[#060606] py-24 overflow-hidden border-t border-white/10"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 bg-white/5 text-[11px] font-mono tracking-[0.25em] uppercase text-white/70 mb-3">
          <Sparkles className="w-3.5 h-3.5" style={{ color: themeMeta.accentHex }} />
          <span>What I Do &bull; Services & Formats</span>
        </div>
        <h2 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-wider text-white">
          Entertainment For <span style={{ color: themeMeta.accentHex }}>Every Occasion</span>
        </h2>
        <p className="font-serif text-sm sm:text-base text-white/60 font-light mt-2 max-w-2xl leading-relaxed">
          Interactive, world-class magic tailored to the style and scale of your event.
          Choose a discipline to pre-fill coordinates into our reservation dossier.
        </p>
      </div>

      {/* Static 3-Card Grid with Rich Hover Effects */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {services.map((svc) => {
            const cardTilt = tilt[svc.id] || { x: 0, y: 0 };
            return (
              <div
                key={svc.id}
                onMouseMove={(e) => handleMouseMove(e, svc.id)}
                onMouseLeave={() => handleMouseLeave(svc.id)}
                className="w-full border border-white/15 bg-[#0C0C0C] flex flex-col justify-between transition-all duration-300 shadow-2xl relative group overflow-hidden hover:-translate-y-2 hover:border-white/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
                style={{
                  transform: cardTilt.x !== 0 ? `perspective(1000px) rotateX(${cardTilt.y}deg) rotateY(${cardTilt.x}deg)` : undefined,
                  borderColor: cardTilt.x !== 0 ? themeMeta.accentHex : undefined
                }}
              >
                {/* Accent Top Highlight Bar on Hover */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                  style={{ backgroundColor: themeMeta.accentHex }}
                />
                {/* Photo Top Header */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-black border-b border-white/10">
                  <img
                    src={svc.image}
                    alt={svc.title}
                    className="w-full h-full object-cover grayscale-0 md:grayscale md:contrast-110 md:group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-transparent to-black/30" />
                  
                  {/* Category Tag */}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/80 border border-white/20 text-[10px] font-mono uppercase tracking-widest text-white">
                    <span style={{ color: themeMeta.accentHex }}>{svc.icon}</span>
                    <span>{svc.category}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-8 space-y-4 flex-1">
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-wide uppercase">
                      {svc.title}
                    </h3>
                    <p className="font-mono text-xs text-white/50 tracking-wider uppercase mt-1" style={{ color: themeMeta.accentHex }}>
                      {svc.subtitle}
                    </p>
                  </div>

                  <p className="font-serif text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                    {svc.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                      Signature Format Elements:
                    </div>
                    {svc.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-white/80">
                        <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: themeMeta.accentHex }} />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons (Sharp Rectangles, Responsive Wrapping) */}
                <div className="p-4 sm:p-6 border-t border-white/10 bg-black/40 flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 sm:gap-3">
                  <button
                    onClick={() => {
                      playClick();
                      onOpenVideo(svc.title, svc.category, svc.description);
                    }}
                    className="flex-1 py-3 px-3 sm:px-4 border border-white/15 bg-white/5 hover:bg-white/10 text-white font-serif text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>View Archive</span>
                  </button>

                  <button
                    onClick={() => handleSelectService(svc.title)}
                    className="flex-1 py-3 px-3 sm:px-4 border font-serif text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95"
                    style={{
                      borderColor: themeMeta.accentHex,
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      color: '#FFFFFF'
                    }}
                  >
                    <span>Enquire Act</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
