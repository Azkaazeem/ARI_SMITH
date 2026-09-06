import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAudio } from '../../context/AudioContext';
import { fetchReviews, submitReview } from '../../utils/api';
import type { ReviewItem } from '../../utils/api';
import { showLuxuryAlert } from '../../utils/alerts';
import { Star, Quote, Sparkles, MessageSquarePlus, X } from 'lucide-react';

const PRESS_ITEMS = [
  'GOOGLE VERIFIED REVIEWS',
  'MANCHESTER WEDDINGS & GALAS',
  'CORPORATE SUMMIT ENTERTAINMENT',
  'BAFTA GALA DINNER',
  'SOCIETY OF AMERICAN MAGICIANS',
  'CHESHIRE LUXURY RECEPTIONS',
  'UK & INTERNATIONAL PERFORMANCES'
];

export const ReviewsSection: React.FC = () => {
  const { themeMeta } = useTheme();
  const { playClick, playChime } = useAudio();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
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

        // Luxury SweetAlert Confirmation
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
      
      {/* Continuous Seamless Infinite Marquee Row (Never stops, flows continuously forward) */}
      <div className="w-full mb-16 sm:mb-20 overflow-hidden select-none border-y border-white/15 py-3.5 bg-black">
        <div className="animate-continuous-marquee flex items-center">
          {/* Duplicate list twice for seamless 50% translation loop */}
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
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 sm:mb-16 gap-6">
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

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 border border-white/20 bg-white/5 hover:bg-white/10 text-white font-serif text-xs font-semibold tracking-wider uppercase transition-all duration-200"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Leave A Review</span>
          </button>
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
          /* Sharp Review Cards Grid (Golden Yellow Stars Only!) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {reviews.map((rev, idx) => (
              <div
                key={rev._id || idx}
                className="p-6 sm:p-7 border border-white/15 bg-[#0A0A0A] flex flex-col justify-between space-y-5 shadow-lg hover:border-white/30 transition-all duration-200"
              >
                <div className="space-y-3">
                  {/* Rating: PURE GOLDEN YELLOW STARS ONLY! */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: rev.rating || 5 }).map((_, s) => (
                        <Star
                          key={s}
                          className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]"
                        />
                      ))}
                    </div>

                    {/* Neutral Clean Google Review Tag */}
                    <span className="text-[9px] font-mono text-white/50 border border-white/15 bg-white/5 px-2 py-0.5 uppercase tracking-wider">
                      Google Review &bull; 5.0 ★
                    </span>
                  </div>

                  {/* Testimonial Quote */}
                  <div className="relative pt-1">
                    <Quote className="w-4 h-4 text-white/10 absolute -top-1 -left-1 pointer-events-none" />
                    <blockquote className="font-serif text-xs sm:text-sm text-white/85 italic leading-relaxed pl-2">
                      &ldquo;{rev.quote}&rdquo;
                    </blockquote>
                  </div>
                </div>

                {/* Author & Event */}
                <div className="pt-3 border-t border-white/10">
                  <div className="font-serif text-xs sm:text-sm font-bold text-white tracking-wide">
                    {rev.clientName}
                  </div>
                  <div className="font-mono text-[9px] text-white/40 uppercase tracking-widest mt-0.5">
                    {rev.eventCategory}
                  </div>
                </div>

              </div>
            ))}
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
