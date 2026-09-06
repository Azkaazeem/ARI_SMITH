import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useBooking } from '../../context/BookingContext';
import { ShieldCheck, Check, Sparkles, ArrowRight, Award } from 'lucide-react';

const REASONS = [
  {
    title: 'Over 5 Years of Professional Experience',
    desc: 'Hundreds of live engagements across the UK and international destinations, with zero compromise on quality or presentation.'
  },
  {
    title: 'Interactive Entertainment That Keeps Guests Engaged',
    desc: 'No passive observation. Guests hold the cards, whisper the thoughts, and witness impossible miracles happening directly in their hands.'
  },
  {
    title: 'Tailored for Weddings, Corporate Events & Celebrations',
    desc: 'Each routine is calibrated to your event’s exact schedule, dress code, room acoustics, and guest demographics.'
  },
  {
    title: 'Professional, Reliable and Easy to Work With',
    desc: 'Prompt, courteous back-of-house communication, seamless coordination with event planners, and strict punctuality.'
  },
  {
    title: 'A Unique Blend of Magic, Mentalism and Illusion',
    desc: 'Discarding outdated magic tropes in favor of sharp psychological drama, mind-reading, and contemporary sleight of hand.'
  },
  {
    title: 'Unforgettable Moments for Guests of All Ages',
    desc: 'Universal astonishment that breaks the ice, stimulates conversations, and creates lifelong memories for all attendees.'
  }
];

export const WhyBookSection: React.FC = () => {
  const { themeMeta } = useTheme();
  const { scrollToBooking } = useBooking();

  return (
    <section className="relative w-full py-28 px-6 sm:px-12 bg-[#090909] border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 bg-white/5 text-[11px] font-mono tracking-[0.25em] uppercase text-white/70">
            <Award className="w-3.5 h-3.5" style={{ color: themeMeta.accentHex }} />
            <span>The Gold Standard &bull; Why Book Me</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-wider text-white">
            Magic That Gets <span style={{ color: themeMeta.accentHex }}>People Talking</span>
          </h2>

          <p className="font-serif text-sm sm:text-base text-white/60 font-light leading-relaxed">
            Entertainment engineered with precision. Why prestigious hosts across Manchester and the UK trust Ari Smith with their most important evenings.
          </p>
        </div>

        {/* Sharp Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map((reason, idx) => (
            <div
              key={idx}
              className="p-8 border border-white/15 bg-black/50 space-y-4 hover:border-white/30 transition-all duration-300 relative group"
            >
              {/* Top Accent Line */}
              <div
                className="absolute top-0 left-0 w-8 h-[2px] transition-all duration-300 group-hover:w-full"
                style={{ backgroundColor: themeMeta.accentHex }}
              />

              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-white/30 tracking-widest uppercase">
                  0{idx + 1}
                </span>
                <Check className="w-4 h-4" style={{ color: themeMeta.accentHex }} />
              </div>

              <h3 className="font-serif text-base font-bold text-white tracking-wide leading-snug">
                {reason.title}
              </h3>

              <p className="font-serif text-xs text-white/60 font-light leading-relaxed">
                {reason.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Banner: Insurance & Direct Action */}
        <div className="p-8 border border-white/20 bg-black flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className="p-3 border border-white/20 bg-white/5 text-white"
              style={{ color: themeMeta.accentHex }}
            >
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-white tracking-wide uppercase">
                £5,000,000 Public Liability Insurance
              </h4>
              <p className="font-mono text-xs text-white/50 mt-0.5">
                Full documentation provided to your venue upon booking confirmation.
              </p>
            </div>
          </div>

          <button
            onClick={() => scrollToBooking()}
            className="w-full md:w-auto px-8 py-3.5 border font-serif text-xs font-bold tracking-[0.25em] uppercase transition-all duration-300 hover:brightness-110 active:scale-95 flex items-center justify-center gap-2"
            style={{
              borderColor: themeMeta.accentHex,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF'
            }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: themeMeta.accentHex }} />
            <span>Enquire For Your Event</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
