import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ThemeProvider } from './context/ThemeContext';
import { AudioProvider } from './context/AudioContext';
import { BookingProvider } from './context/BookingContext';

import { CustomCursor } from './components/ui/CustomCursor';
import { Navigation } from './components/ui/Navigation';
import { VideoModal } from './components/ui/VideoModal';
import { AdminModal } from './components/ui/AdminModal';

import { HeroSection } from './components/sections/HeroSection';
import { PhilosophySection } from './components/sections/PhilosophySection';
import { ShowcaseSection } from './components/sections/ShowcaseSection';
import { GallerySection } from './components/sections/GallerySection';
import { WhyBookSection } from './components/sections/WhyBookSection';
import { ReviewsSection } from './components/sections/ReviewsSection';
import { FaqSection } from './components/sections/FaqSection';
import { BookingSection } from './components/sections/BookingSection';
import { Footer } from './components/sections/Footer';

import { TelepathicAssistant } from './components/ai/TelepathicAssistant';

gsap.registerPlugin(ScrollTrigger);

export function AppContent() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [videoModal, setVideoModal] = useState<{
    isOpen: boolean;
    title: string;
    category: string;
    description: string;
  }>({
    isOpen: false,
    title: '',
    category: '',
    description: ''
  });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  const handleOpenVideo = (title: string, category: string, description: string) => {
    setVideoModal({
      isOpen: true,
      title,
      category,
      description
    });
  };

  const handleCloseVideo = () => {
    setVideoModal(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="relative min-h-screen bg-[#080808] text-[#E2E8F0] selection:bg-rose-950 selection:text-white font-sans overflow-x-hidden">
      
      {/* Global Inverted Custom Cursor */}
      <CustomCursor />

      {/* Screen Noise & Grain Overlay */}
      <div className="noise-overlay" />

      {/* Navigation Header */}
      <Navigation onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Main Page Flow - Full Faithful Modules from arismith.co.uk */}
      <main>
        {/* 1. Hero Section (3D Canvas + Real Imagery & Stats) */}
        <HeroSection onOpenVideo={handleOpenVideo} />

        {/* 2. Welcome / About Section ("Hello, I am Ari | Welcome To My World") */}
        <PhilosophySection />

        {/* 3. Core Services ("What I Do | Entertainment For Every Occasion") */}
        <ShowcaseSection onOpenVideo={handleOpenVideo} />

        {/* 4. Live Visual Archive ("Moments of Amazement | Gallery") */}
        <GallerySection />

        {/* 5. Gold Standard ("Why Book Me? | Magic That Gets People Talking") */}
        <WhyBookSection />

        {/* 6. Real Google Reviews ("Kind Words | Testimonials") */}
        <ReviewsSection />

        {/* 7. Questions ("Good To Know | FAQ Accordion") */}
        <FaqSection />

        {/* 8. Live Booking Engine & Availability Calendar ("Book Ari") */}
        <BookingSection />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Floating AI Telepathic Mind Assistant */}
      <TelepathicAssistant />

      {/* Modals */}
      <VideoModal
        isOpen={videoModal.isOpen}
        onClose={handleCloseVideo}
        title={videoModal.title}
        category={videoModal.category}
        description={videoModal.description}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AudioProvider>
        <BookingProvider>
          <AppContent />
        </BookingProvider>
      </AudioProvider>
    </ThemeProvider>
  );
}
