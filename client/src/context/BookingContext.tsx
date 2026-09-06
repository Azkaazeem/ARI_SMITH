import React, { createContext, useContext, useState, useRef } from 'react';

export interface BookingPrefill {
  eventType?: string;
  eventDate?: string;
  guestCount?: number;
  venueCity?: string;
  budgetRange?: string;
  specialRequests?: string;
}

interface BookingContextType {
  prefill: BookingPrefill;
  setPrefill: (data: Partial<BookingPrefill>) => void;
  bookingRef: React.RefObject<HTMLDivElement>;
  scrollToBooking: (prefillData?: Partial<BookingPrefill>) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prefill, setPrefillState] = useState<BookingPrefill>({
    eventType: 'Mind Reading & Mentalism',
    eventDate: '',
    guestCount: 75,
    venueCity: 'Manchester',
    budgetRange: '£5,000 - £10,000'
  });

  const bookingRef = useRef<HTMLDivElement>(null);

  const setPrefill = (data: Partial<BookingPrefill>) => {
    setPrefillState(prev => ({ ...prev, ...data }));
  };

  const scrollToBooking = (extraData?: Partial<BookingPrefill>) => {
    if (extraData) {
      setPrefillState(prev => ({ ...prev, ...extraData }));
    }
    if (bookingRef.current) {
      bookingRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <BookingContext.Provider value={{ prefill, setPrefill, bookingRef, scrollToBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within a BookingProvider');
  return ctx;
};
