import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAudio } from '../../context/AudioContext';
import { Camera, Eye, X, ZoomIn, Sparkles } from 'lucide-react';

import img1 from '../../assets/1.jpg';
import img2 from '../../assets/2.jpg';
import img3 from '../../assets/3.jpg';
import img4 from '../../assets/4.jpg';
import img5 from '../../assets/5.png';
import img6 from '../../assets/6.jpg';
import img7 from '../../assets/7.jpg';
import img8 from '../../assets/8.jpg';

interface GalleryItem {
  src: string;
  caption: string;
  category: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  { src: img1, caption: 'Intimate Sleight of Hand with Signed Cards', category: 'Close-Up Magic' },
  { src: img2, caption: 'Mind Reading & Mentalism at Gala Reception', category: 'Mentalism' },
  { src: img3, caption: 'Heirloom Ring Levitation in Spectator Hands', category: 'Psychological Illusion' },
  { src: img4, caption: 'Table-Hopping Wonder during Wedding Breakfast', category: 'Weddings' },
  { src: img5, caption: 'Ari Smith Live Performance Portrait', category: 'Live Stage' },
  { src: img6, caption: 'High-Impact Executive Entertainment', category: 'Corporate Galas' },
  { src: img7, caption: 'Unstoppable Astonishment and Laughter', category: 'Private Celebrations' },
  { src: img8, caption: 'The Art of Impossible Physical Feats', category: 'Master Sleight' }
];

export const GallerySection: React.FC = () => {
  const { themeMeta } = useTheme();
  const { playClick, playChime } = useAudio();
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const handlePhotoClick = (photo: GalleryItem) => {
    playClick();
    playChime(1.1);
    setActivePhoto(photo);
  };

  return (
    <section id="gallery" className="relative w-full py-28 px-6 sm:px-12 bg-[#060606] border-t border-white/10">
      
      {/* Background Ambience */}
      <div
        className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-none opacity-5 blur-3xl pointer-events-none"
        style={{ backgroundColor: themeMeta.accentHex }}
      />

      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 bg-white/5 text-[11px] font-mono tracking-[0.25em] uppercase text-white/70 mb-3">
              <Camera className="w-3.5 h-3.5" style={{ color: themeMeta.accentHex }} />
              <span>Visual Archive &bull; Live Moments</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-wider text-white">
              Moments Of <span style={{ color: themeMeta.accentHex }}>Amazement</span>
            </h2>
            <p className="font-serif text-sm sm:text-base text-white/60 font-light mt-2 max-w-xl">
              Authentic snapshots captured live across weddings, corporate galas, and private celebrations across Manchester and worldwide.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-white/40 uppercase">
            <Eye className="w-4 h-4" style={{ color: themeMeta.accentHex }} />
            <span>Click any frame to inspect</span>
          </div>
        </div>

        {/* Sharp Architectural Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {GALLERY_ITEMS.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handlePhotoClick(item)}
              className="group relative aspect-[4/5] bg-black/60 border border-white/15 overflow-hidden cursor-pointer transition-all duration-300 hover:border-white/40 shadow-xl"
              style={{
                outline: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              {/* Actual Image */}
              <img
                src={item.src}
                alt={item.caption}
                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                loading="lazy"
              />

              {/* Dark Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

              {/* Sharp Corner Accent Lines */}
              <div
                className="absolute top-2 left-2 w-3 h-3 border-t border-l opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ borderColor: themeMeta.accentHex }}
              />
              <div
                className="absolute bottom-2 right-2 w-3 h-3 border-b border-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ borderColor: themeMeta.accentHex }}
              />

              {/* Hover Badge */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="p-1.5 bg-black/80 border border-white/20 text-white">
                  <ZoomIn className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-0 left-0 w-full p-4 space-y-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span
                  className="font-mono text-[9px] tracking-[0.2em] uppercase font-bold block"
                  style={{ color: themeMeta.accentHex }}
                >
                  {item.category}
                </span>
                <h4 className="font-serif text-xs text-white/90 font-medium leading-tight line-clamp-2">
                  {item.caption}
                </h4>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Fullscreen Sharp Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setActivePhoto(null)} />
          
          <div className="relative max-w-4xl max-h-[90vh] border border-white/25 bg-[#090909] shadow-2xl z-10 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" style={{ color: themeMeta.accentHex }} />
                <span className="font-mono text-xs text-white/70 uppercase tracking-widest">
                  {activePhoto.category}
                </span>
              </div>
              <button
                onClick={() => setActivePhoto(null)}
                className="p-1.5 border border-white/15 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Container */}
            <div className="relative max-h-[75vh] flex items-center justify-center bg-black overflow-hidden">
              <img
                src={activePhoto.src}
                alt={activePhoto.caption}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-[#0C0C0C] flex items-center justify-between">
              <p className="font-serif text-xs sm:text-sm text-white/80 font-light">
                {activePhoto.caption}
              </p>
              <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                Ari Smith Archive &bull; Manchester
              </span>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
