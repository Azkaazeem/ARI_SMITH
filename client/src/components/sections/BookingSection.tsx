import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useBooking } from '../../context/BookingContext';
import { useAudio } from '../../context/AudioContext';
import { fetchAvailability, submitBooking } from '../../utils/api';
import { showLuxuryAlert } from '../../utils/alerts';
import { 
  Calendar, 
  Lock, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Send, 
  CheckCircle, 
  Shield, 
  Clock
} from 'lucide-react';

export const BookingSection: React.FC = () => {
  const { themeMeta } = useTheme();
  const { prefill, setPrefill, bookingRef } = useBooking();
  const { playClick, playChime } = useAudio();

  // Calendar State
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(8); // September
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [activeNotice, setActiveNotice] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: prefill.eventType || 'Weddings',
    eventDate: prefill.eventDate || '',
    venueCity: prefill.venueCity || 'Manchester',
    guestCount: prefill.guestCount || 80,
    budgetRange: prefill.budgetRange || '£2,500 - £5,000',
    specialRequests: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<{
    reference: string;
    date: string;
    city: string;
    act: string;
  } | null>(null);

  // Sync prefill from Context
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      ...(prefill.eventType && { eventType: prefill.eventType }),
      ...(prefill.eventDate && { eventDate: prefill.eventDate }),
      ...(prefill.venueCity && { venueCity: prefill.venueCity }),
      ...(prefill.guestCount && { guestCount: prefill.guestCount }),
      ...(prefill.budgetRange && { budgetRange: prefill.budgetRange }),
    }));
  }, [prefill]);

  // Load calendar availability
  const loadMonthAvailability = async (year: number, monthIdx: number) => {
    const monthStr = `${year}-${String(monthIdx + 1).padStart(2, '0')}`;
    try {
      const res = await fetchAvailability(monthStr);
      if (res.success) {
        setUnavailableDates(res.unavailableDates || []);
        if (res.notice) setActiveNotice(res.notice);
      }
    } catch (err) {
      console.warn('Calendar availability error:', err);
    }
  };

  useEffect(() => {
    loadMonthAvailability(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  const nextMonth = () => {
    playClick();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const prevMonth = () => {
    playClick();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const calculateEstimate = () => {
    let base = 2200;
    if (formData.eventType.includes('Corporate')) {
      base = 3500;
      if (formData.guestCount > 100) base += 1200;
    } else if (formData.eventType.includes('Weddings')) {
      base = 2500;
      if (formData.guestCount > 100) base += 800;
    } else if (formData.eventType.includes('Private')) {
      base = 1800;
      if (formData.guestCount > 60) base += 600;
    }
    return `£${base.toLocaleString('en-GB')}`;
  };

  const handleDateSelect = (dayNum: number) => {
    const formatted = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    if (unavailableDates.includes(formatted)) return;

    playChime(1.1);
    setFormData(prev => ({ ...prev, eventDate: formatted }));
    setPrefill({ eventDate: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!formData.name || !formData.email || !formData.eventDate || !formData.venueCity) {
      setSubmitError('Please complete all mandatory coordinates (Name, Email, Date, City).');
      return;
    }

    setIsSubmitting(true);
    playClick();

    try {
      const res = await submitBooking(formData);
      if (res.success) {
        playChime(1.4);
        const refCode = res.booking._id || res.booking.id || 'AS-SEALED-2026';
        setConfirmedBooking({
          reference: refCode,
          date: formData.eventDate,
          city: formData.venueCity,
          act: formData.eventType
        });

        // Luxury SweetAlert
        showLuxuryAlert(
          'INQUIRY ENCRYPTED & SEALED',
          `Your date request for <strong>${formData.eventDate}</strong> in <strong>${formData.venueCity}</strong> has been secured.<br/><br/><span style="font-family:monospace;font-size:11px;color:#94A3B8;">Ref Code: ${refCode}</span><br/><br/>Ari's concierge will contact you within 24 hours.`,
          'success'
        );
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'The psychic channel was interrupted.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={bookingRef}
      className="relative w-full py-28 px-6 sm:px-12 bg-[#080808] border-t border-white/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 bg-white/5 text-[11px] font-mono tracking-[0.25em] uppercase text-white/70">
            <Calendar className="w-3.5 h-3.5" style={{ color: themeMeta.accentHex }} />
            <span>Check Availability &bull; Book Ari</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-wider text-white">
            Secure Your <span style={{ color: themeMeta.accentHex }}>Date</span>
          </h2>

          <p className="font-serif text-sm sm:text-base text-white/60 font-light leading-relaxed">
            Dates marked <span className="text-white font-medium">&ldquo;Sealed by Mystery&rdquo;</span> are unavailable due to private bookings. Select any available date below to begin your consultation.
          </p>

          {activeNotice && (
            <div className="p-3 border border-white/20 bg-white/5 text-xs font-mono text-white/80 max-w-xl mx-auto flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5" style={{ color: themeMeta.accentHex }} />
              <span>{activeNotice}</span>
            </div>
          )}
        </div>

        {/* Sharp Split: Calendar Left, Form Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Calendar (5 cols) */}
          <div className="lg:col-span-5 border border-white/15 bg-[#0C0C0C] p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="font-mono text-[9px] tracking-widest text-white/40 uppercase block">
                  Ari Smith Tour Calendar
                </span>
                <h3 className="font-display text-lg font-bold text-white uppercase tracking-wide">
                  {monthNames[currentMonth]} {currentYear}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  className="p-2 border border-white/15 bg-white/5 hover:bg-white/10 text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 border border-white/15 bg-white/5 hover:bg-white/10 text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-1 text-center py-2 font-mono text-[10px] text-white/40 uppercase">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square opacity-0 pointer-events-none" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const isUnavailable = unavailableDates.includes(dateStr);
                const isSelected = formData.eventDate === dateStr;

                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => handleDateSelect(dayNum)}
                    disabled={isUnavailable}
                    className={`aspect-square border flex flex-col items-center justify-center text-xs font-mono transition-all duration-200 relative group/day ${
                      isSelected
                        ? 'bg-white text-black font-bold border-white'
                        : isUnavailable
                        ? 'bg-black/60 border-white/5 text-white/20 cursor-not-allowed'
                        : 'bg-white/5 hover:bg-white/15 border-white/15 text-white'
                    }`}
                  >
                    <span>{dayNum}</span>
                    {isUnavailable && <Lock className="w-2.5 h-2.5 mt-0.5 text-white/20" />}

                    {isUnavailable && (
                      <div className="absolute bottom-full mb-1 hidden group-hover/day:block z-30 px-2 py-1 bg-black border border-white/20 text-[9px] font-mono text-white/80 whitespace-nowrap shadow-xl">
                        Sealed by Mystery
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/50 uppercase">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 border border-white/30 bg-white/10" />
                <span>Open</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-black border border-white/20 flex items-center justify-center">
                  <Lock className="w-1.5 h-1.5 text-white/40" />
                </span>
                <span>Sealed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-white" />
                <span className="text-white">Selected</span>
              </div>
            </div>

          </div>

          {/* Form (7 cols) */}
          <div className="lg:col-span-7 border border-white/15 bg-[#0C0C0C] p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="pb-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <span className="font-mono text-[9px] tracking-widest text-white/40 uppercase block">
                  Bespoke Booking Consultation
                </span>
                <h3 className="font-display text-lg font-bold text-white uppercase tracking-wide">
                  Enquiry Form
                </h3>
              </div>
              <div className="text-right">
                <span className="font-mono text-[9px] text-white/40 uppercase block">
                  Estimate
                </span>
                <span className="font-serif text-base font-bold" style={{ color: themeMeta.accentHex }}>
                  {calculateEstimate()}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/60 block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Marcus Thorne"
                    className="w-full px-3.5 py-2.5 border border-white/15 bg-black text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/60 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="e.g. marcus@company.co.uk"
                    className="w-full px-3.5 py-2.5 border border-white/15 bg-black text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/60 block mb-1">
                    Telephone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="e.g. +44 7700 900123"
                    className="w-full px-3.5 py-2.5 border border-white/15 bg-black text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/60 block mb-1">
                    Event Type *
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventType: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-white/15 bg-black text-xs text-white focus:outline-none focus:border-white/40"
                  >
                    <option value="Weddings">Weddings (Close-Up Magic & Mind-Reading)</option>
                    <option value="Corporate & Business">Corporate & Business (Conferences, Galas)</option>
                    <option value="Private Events & Parties">Private Events & Parties (Milestones, Dinners)</option>
                    <option value="Mind Reading & Mentalism">Mind Reading & Mentalism</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/60 block mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-white/15 bg-black text-xs text-white focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/60 block mb-1">
                    Venue Location & City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.venueCity}
                    onChange={(e) => setFormData(prev => ({ ...prev, venueCity: e.target.value }))}
                    placeholder="e.g. Manchester / London / Cheshire"
                    className="w-full px-3.5 py-2.5 border border-white/15 bg-black text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              {/* Guest Count Slider */}
              <div className="p-3.5 border border-white/10 bg-white/5 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[9px] text-white/50 uppercase tracking-widest">
                    Guest Count:
                  </span>
                  <span className="font-serif font-bold text-white">
                    {formData.guestCount} Guests
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="600"
                  step="10"
                  value={formData.guestCount}
                  onChange={(e) => setFormData(prev => ({ ...prev, guestCount: parseInt(e.target.value, 10) }))}
                  className="w-full accent-white h-1 bg-white/20 cursor-pointer"
                />
              </div>

              {/* Special Requests */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/60 block mb-1">
                  Tell Ari About Your Event / Timings / Requirements
                </label>
                <textarea
                  rows={2}
                  value={formData.specialRequests}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                  placeholder="Share details about your drinks reception, stage, or guests..."
                  className="w-full px-3.5 py-2.5 border border-white/15 bg-black text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/40"
                />
              </div>

              {submitError && (
                <div className="p-2.5 border border-rose-900 bg-rose-950/30 text-rose-300 text-xs font-mono">
                  {submitError}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 border font-serif text-xs font-bold tracking-[0.25em] uppercase transition-all duration-300 hover:brightness-110 active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
                style={{
                  borderColor: themeMeta.accentHex,
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF'
                }}
              >
                {isSubmitting ? (
                  <span>Encrypting Dossier...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Enquiry to Ari</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[10px] font-mono text-white/40 pt-1">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Full Discretion Guaranteed
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Response within 24 Hours
                </span>
              </div>

            </form>

          </div>

        </div>

      </div>

      {/* Confirmation Modal */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg border border-white/20 bg-[#0A0A0A] p-8 text-center space-y-6">
            <div
              className="w-14 h-14 mx-auto border border-white/30 flex items-center justify-center bg-black"
              style={{ borderColor: themeMeta.accentHex }}
            >
              <CheckCircle className="w-7 h-7" style={{ color: themeMeta.accentHex }} />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase">
                Booking Inquiry Saved In MongoDB
              </span>
              <h3 className="font-display text-xl font-bold text-white uppercase tracking-wider">
                Inquiry Successfully Sealed
              </h3>
            </div>

            <div className="p-4 border border-white/10 bg-white/5 text-left font-mono text-xs space-y-1 text-white/70">
              <div>Reference: <span className="text-white">{confirmedBooking.reference}</span></div>
              <div>Date: <span className="text-white">{confirmedBooking.date}</span></div>
              <div>Location: <span className="text-white">{confirmedBooking.city}</span></div>
              <div>Format: <span className="text-white">{confirmedBooking.act}</span></div>
            </div>

            <p className="font-serif text-xs text-white/70 leading-relaxed font-light">
              Ari Smith’s team will review your date coordinates and contact you promptly with a bespoke performance proposal and rider details.
            </p>

            <button
              onClick={() => setConfirmedBooking(null)}
              className="w-full py-3 border font-serif text-xs font-bold tracking-widest uppercase text-white hover:bg-white/10 transition-colors"
              style={{ borderColor: themeMeta.accentHex }}
            >
              Return To Website
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
