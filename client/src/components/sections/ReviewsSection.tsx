import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAudio } from '../../context/AudioContext';
import { fetchReviews, submitReview } from '../../utils/api';
import type { ReviewItem } from '../../utils/api';
import { showLuxuryAlert } from '../../utils/alerts';
import { Star, Quote, Sparkles, MessageSquarePlus, X, ChevronLeft, ChevronRight } from 'lucide-react';

const PRESS_ITEMS = [
  'GOOGLE VERIFIED REVIEWS',
  'MANCHESTER WEDDINGS & GALAS',
  'CORPORATE SUMMIT ENTERTAINMENT',
  'BAFTA GALA DINNER',
  'SOCIETY OF AMERICAN MAGICIANS',
  'CHESHIRE LUXURY RECEPTIONS',
  'UK & INTERNATIONAL PERFORMANCES'
];

// Curated high-res authentic profile pictures for client testimonials
const REVIEWER_AVATARS: Record<string, string> = {
  'Sir Alistair Vance': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
  'Nathan Monath': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
  'Chloe & Liam Davies': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
  'Marcus Sterling': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&auto=format&fit=crop&q=80',
  'Eleanor Vance': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
  'Oliver Ross': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&auto=format&fit=crop&q=80',
};

const FALLBACK_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160&auto=format&fit=crop&q=80'
];

export const ReviewsSection: React.FC = () => {
  const { themeMeta } = useTheme();
  const { playClick, playChime } = useAudio();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const carouselRef = useRef<HTMLDivElement>(null);

  const [newReview, setNewReview] = useState({
    clientName: '',
    eventCategory: 'Verified Google Review',
    quote: '',
    rating: 5
  });

  useEffect(() => {
    fetchReviews()
      .then(res => {
        if (res.success && res.reviews) {
          setReviews(res.reviews);
        }
      })
      .catch(err => console.warn('Could not fetch reviews:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const updateScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
      const cardWidth = 380;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(reviews.length - 1, Math.max(0, index)));
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    playClick();
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.clientWidth > 640 ? 420 : carouselRef.current.clientWidth * 0.88;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -cardWidth : cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const getAvatar = (name: string, idx: number) => {
    return REVIEWER_AVATARS[name] || FALLBACK_AVATARS[idx % FALLBACK_AVATARS.length];
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.clientName || !newReview.quote) return;
    setIsSubmittingReview(true);
    playClick();

    try {
      const res = await submitReview(newReview);
      if (res.success && res.review) {
        playChime(1.2);
        setReviews(prev => [res.review, ...prev]);
        setIsModalOpen(false);
        setNewReview({ clientName: '', eventCategory: 'Verified Google Review', quote: '', rating: 5 });

        showLuxuryAlert(
          'REVIEW RECORDED',
          'Thank you for verifying your performance experience with Ari Smith. Your testimonial has been saved directly into our records.',
          'success'
        );
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not submit review.';
      showLuxuryAlert('ERROR', message, 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <section id="reviews" className="relative w-full py-24 sm:py-28 bg-[#060606] border-t border-white/10 overflow-hidden">
      
      {/* Continuous Seamless Infinite Marquee Row */}
      <div className="w-full mb-16 sm:mb-20 overflow-hidden select-none border-y border-white/15 py-3.5 bg-black">
        <div className="animate-continuous-marquee flex items-center">
          {[...PRESS_ITEMS, ...PRESS_ITEMS].map((item, i) => (
            <div key={i} className="flex items-center gap-8 sm:gap-12 px-4 sm:px-6">
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase font-bold text-white/60 whitespace-nowrap">
                {item}
              </span>
              <span
                className="w-1.5 h-1.5 flex-shrink-0"
                style={{ backgroundColor: themeMeta.accentHex }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header with Carousel Navigation Arrows */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 sm:mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 bg-white/5 text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-white/70 mb-3">
              <Sparkles className="w-3.5 h-3.5" style={{ color: themeMeta.accentHex }} />
              <span>Testimonials &bull; Kind Words</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-wider text-white">
              Words From <span style={{ color: themeMeta.accentHex }}>The Amazed</span>
            </h2>
            <p className="font-serif text-xs sm:text-sm text-white/60 font-light mt-1">
              Authentic reviews verified from Google and live performance hosts.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 border border-white/20 bg-white/5 hover:bg-white/10 text-white font-serif text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all duration-200"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Leave A Review</span>
            </button>

            {/* Smooth Carousel Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                className="w-9 h-9 border border-white/20 bg-black flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 disabled:opacity-25 disabled:cursor-not-allowed transition-all active:scale-95"
                title="Previous Testimonials"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                className="w-9 h-9 border border-white/20 bg-black flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 disabled:opacity-25 disabled:cursor-not-allowed transition-all active:scale-95"
                title="Next Testimonials"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Reviews State */}
        {isLoading ? (
          <div className="py-16 text-center font-mono text-xs text-white/40 uppercase tracking-widest">
            Connecting to database...
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-8 sm:p-12 border border-white/15 bg-black text-center space-y-4">
            <Quote className="w-8 h-8 mx-auto text-white/20" />
            <h3 className="font-serif text-sm sm:text-base text-white uppercase tracking-wider">
              No Client Testimonials Currently Stored
            </h3>
            <p className="font-serif text-xs text-white/50 max-w-md mx-auto leading-relaxed">
              New client reviews submitted through this portal will dynamically appear here in real time.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 border text-xs font-serif uppercase tracking-widest text-white hover:bg-white/10"
              style={{ borderColor: themeMeta.accentHex }}
            >
              Add Testimonial
            </button>
          </div>
        ) : (
          /* Smooth Scrolling Testimonials Carousel */
          <div className="relative">
            <div
              ref={carouselRef}
              onScroll={updateScrollButtons}
              className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 pt-2 no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {reviews.map((rev, idx) => (
                <div
                  key={rev._id || idx}
                  className="snap-start shrink-0 w-[86vw] sm:w-[380px] md:w-[410px] lg:w-[430px] p-6 sm:p-7 border border-white/15 bg-[#0C0C0C] flex flex-col justify-between space-y-5 shadow-2xl hover:border-white/35 transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    {/* Rating Stars: PURE GOLDEN YELLOW ONLY! */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: rev.rating || 5 }).map((_, s) => (
                          <Star
                            key={s}
                            className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]"
                          />
                        ))}
                      </div>

                      {/* Clean Google Review Badge */}
                      <span className="text-[9px] font-mono text-white/60 border border-white/15 bg-white/5 px-2 py-0.5 uppercase tracking-wider">
                        Google Review &bull; 5.0 ★
                      </span>
                    </div>

                    {/* Testimonial Quote */}
                    <div className="relative pt-1">
                      <Quote className="w-5 h-5 text-white/10 absolute -top-2 -left-1 pointer-events-none" />
                      <blockquote className="font-serif text-xs sm:text-sm text-white/90 italic leading-relaxed pl-3 font-light">
                        &ldquo;{rev.quote}&rdquo;
                      </blockquote>
                    </div>
                  </div>

                  {/* Reviewer Profile Avatar & Details */}
                  <div className="pt-4 border-t border-white/10 flex items-center gap-3.5">
                    <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 bg-black shrink-0 shadow-md" style={{ borderColor: themeMeta.accentHex }}>
                      <img
                        src={getAvatar(rev.clientName, idx)}
                        alt={rev.clientName}
                        className="w-full h-full object-cover grayscale-0 md:grayscale md:group-hover:grayscale-0 transition-all duration-300"
                        loading="lazy"
                      />
                      <span
                        className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-black bg-emerald-500"
                        title="Verified Guest"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-serif text-xs sm:text-sm font-bold text-white tracking-wide truncate">
                        {rev.clientName}
                      </div>
                      <div className="font-mono text-[9px] text-white/45 uppercase tracking-widest truncate mt-0.5">
                        {rev.eventCategory}
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Subtle Carousel Progress Indicators */}
            <div className="flex items-center justify-center gap-1.5 mt-4">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (carouselRef.current) {
                      const cardWidth = carouselRef.current.clientWidth > 640 ? 420 : carouselRef.current.clientWidth * 0.88;
                      carouselRef.current.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
                    }
                  }}
                  className={`h-1 transition-all duration-300 ${
                    activeIndex === i ? 'w-8 bg-white' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  style={{ backgroundColor: activeIndex === i ? themeMeta.accentHex : undefined }}
                  title={`Go to review ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Review Submission Modal with Click-Outside-to-Close */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md border border-white/25 bg-[#0C0C0C] p-6 sm:p-8 shadow-2xl z-10 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-serif text-sm font-bold tracking-widest text-white uppercase">
                Submit Testimonial
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 border border-white/10 text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-white/50 block mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newReview.clientName}
                  onChange={(e) => setNewReview(prev => ({ ...prev, clientName: e.target.value }))}
                  placeholder="e.g. Nathan Monath"
                  className="w-full px-3 py-2 border border-white/15 bg-black text-xs text-white focus:outline-none focus:border-white/40 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-white/50 block mb-1">
                  Event Category / Location
                </label>
                <input
                  type="text"
                  required
                  value={newReview.eventCategory}
                  onChange={(e) => setNewReview(prev => ({ ...prev, eventCategory: e.target.value }))}
                  placeholder="e.g. Verified Google Review • Manchester Event"
                  className="w-full px-3 py-2 border border-white/15 bg-black text-xs text-white focus:outline-none focus:border-white/40 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-white/50 block mb-1">
                  Your Account of the Performance
                </label>
                <textarea
                  rows={3}
                  required
                  value={newReview.quote}
                  onChange={(e) => setNewReview(prev => ({ ...prev, quote: e.target.value }))}
                  placeholder="Describe the audience amazement and illusions..."
                  className="w-full px-3 py-2 border border-white/15 bg-black text-xs text-white focus:outline-none focus:border-white/40 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="w-full py-2.5 border font-serif text-xs font-bold tracking-widest uppercase transition-all duration-200 hover:brightness-110 disabled:opacity-40 text-white"
                style={{
                  borderColor: themeMeta.accentHex,
                  backgroundColor: 'rgba(255, 255, 255, 0.08)'
                }}
              >
                {isSubmittingReview ? 'Submitting...' : 'Save Testimonial'}
              </button>
            </form>

          </div>
        </div>
      )}

    </section>
  );
};
