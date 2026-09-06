import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAudio } from '../../context/AudioContext';
import { useBooking } from '../../context/BookingContext';
import { HelpCircle, ChevronDown, Sparkles, MessageCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "What style of magic do you perform?",
    answer: "My performances combine close-up magic, mentalism, mind-reading and illusion, creating interactive experiences that engage and amaze guests of all ages."
  },
  {
    question: "How long do performances typically last?",
    answer: "Typically 1 to 3 hours, mixing and mingling throughout the event. This can be adjusted based on the schedule and needs of your occasion."
  },
  {
    question: "Do you travel for events?",
    answer: "Absolutely. Performances happen regularly across the UK, and international bookings are available as well. Travel details are confirmed at the time of booking."
  },
  {
    question: "How far in advance should I book?",
    answer: "As early as possible is always best, especially for weekend and peak-season dates. That said, get in touch anytime — last-minute enquiries are always welcome and I’ll do my best to accommodate."
  },
  {
    question: "Are you insured?",
    answer: "Yes. I carry £5M public liability insurance and documentation can be provided to your venue on request, so everything runs smoothly on the day."
  },
  {
    question: "What do you need for performance space?",
    answer: "Very little! Close-up magic happens right in front of your guests and requires no stage or setup. For larger stage illusions, we’ll discuss the space during planning."
  },
  {
    question: "Is your entertainment suitable for all ages?",
    answer: "Definitely. The performances are designed to bring people together and captivate audiences of all ages, making every event feel inclusive and memorable."
  },
  {
    question: "How do I book?",
    answer: "Simply send an enquiry through our booking engine with your date and event details. I’ll confirm availability, tailor a bespoke package and guide you through the rest."
  }
];

export const FaqSection: React.FC = () => {
  const { themeMeta } = useTheme();
  const { playClick } = useAudio();
  const { scrollToBooking } = useBooking();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    playClick();
    setOpenIdx(prev => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="relative w-full py-28 px-6 sm:px-12 bg-[#080808] border-t border-white/10">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 bg-white/5 text-[11px] font-mono tracking-[0.25em] uppercase text-white/70">
            <HelpCircle className="w-3.5 h-3.5" style={{ color: themeMeta.accentHex }} />
            <span>Questions &bull; Good To Know</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-wider text-white">
            Frequently Asked <span style={{ color: themeMeta.accentHex }}>Questions</span>
          </h2>

          <p className="font-serif text-sm sm:text-base text-white/60 font-light max-w-xl mx-auto">
            Everything you need to know before securing your date with Ari Smith.
          </p>
        </div>

        {/* Sharp Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-white/15 bg-black/60 transition-colors duration-200"
                style={{
                  borderColor: isOpen ? themeMeta.accentHex : 'rgba(255, 255, 255, 0.12)'
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 transition-colors"
                >
                  <span className="font-serif text-sm sm:text-base font-bold text-white tracking-wide">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/60 transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-white' : ''
                    }`}
                    style={{ color: isOpen ? themeMeta.accentHex : undefined }}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-0 border-t border-white/5">
                    <p className="font-serif text-xs sm:text-sm text-white/70 leading-relaxed font-light mt-3">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Callout */}
        <div className="p-6 border border-white/15 bg-white/5 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-serif text-sm font-bold text-white uppercase">
              Have a bespoke question about your venue or date?
            </h4>
            <p className="font-mono text-xs text-white/50 mt-0.5">
              Ari and his team are always available to discuss tailored arrangements.
            </p>
          </div>

          <button
            onClick={() => scrollToBooking()}
            className="w-full sm:w-auto px-6 py-2.5 border font-serif text-xs font-bold tracking-widest uppercase transition-all duration-300 hover:brightness-110 flex items-center justify-center gap-2"
            style={{
              borderColor: themeMeta.accentHex,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF'
            }}
          >
            <MessageCircle className="w-3.5 h-3.5" style={{ color: themeMeta.accentHex }} />
            <span>Ask A Question</span>
          </button>
        </div>

      </div>
    </section>
  );
};
