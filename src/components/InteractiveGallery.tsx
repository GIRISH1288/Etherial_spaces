'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { db, GalleryItem } from '@/lib/db';

interface InteractiveGalleryProps {
  tag?: string;
  title?: string;
  description?: string;
}

export default function InteractiveGallery({ tag, title, description }: InteractiveGalleryProps) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const data = await db.getGalleryItems();
        if (data && data.length > 0) {
          setItems(data);
        }
      } catch (error) {
        console.error('Error fetching gallery items:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(items.map((item) => item.category)))];

  // Filter items
  const filteredItems = activeFilter === 'All' 
    ? items 
    : items.filter((item) => item.category === activeFilter);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev! - 1));
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev! + 1));
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (lightboxIndex === null) return;
    if (e.key === 'Escape') setLightboxIndex(null);
    if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev! - 1));
    if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev! + 1));
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems]);

  return (
    <section className="py-24 px-6 md:px-12 bg-dark-bg border-b border-gold/5 relative overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-champagne/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        
        {/* Editorial Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <span className="text-[10px] tracking-[0.4em] uppercase text-gold font-semibold block animate-pulse">
              {tag || 'Atmospheric Board'}
            </span>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-ivory">
              {title || 'Curated Details'}
            </h2>
            <p className="text-xs md:text-sm font-light text-champagne max-w-md leading-relaxed">
              {description || 'Explore the raw materials, textures, and bespoke joinery details that form the foundation of our spatial signature.'}
            </p>
          </div>

          {/* Dynamic Filter Buttons */}
          <div className="flex flex-wrap gap-2 md:gap-3 bg-dark-surface/60 backdrop-blur-md p-1.5 rounded-xl border border-gold/5 self-start md:self-end">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`relative px-4 py-2 text-[10px] md:text-xs uppercase tracking-widest transition-all duration-500 rounded-lg font-medium cursor-pointer ${
                  activeFilter === category 
                    ? 'text-dark-bg font-semibold' 
                    : 'text-ivory/60 hover:text-ivory'
                }`}
              >
                {activeFilter === category && (
                  <motion.span
                    layoutId="activeFilterBg"
                    className="absolute inset-0 bg-gold rounded-lg -z-10 shadow-sm"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-dark-surface animate-pulse rounded-2xl border border-gold/5" />
            ))}
          </div>
        ) : (
          /* Interactive Masonry-like Grid */
          <motion.div 
            layout 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => {
                // Architectural height offset pattern
                const heightClass = index % 4 === 1 ? 'md:translate-y-6' : index % 4 === 3 ? 'md:-translate-y-6' : '';
                
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    key={item.id}
                    className={`group relative overflow-hidden bg-white border border-gold/10 rounded-2xl transition-all duration-500 hover:shadow-xl hover:border-gold/20 cursor-pointer ${heightClass}`}
                    onClick={() => setLightboxIndex(index)}
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl">
                      <Image
                        src={item.image_url}
                        alt={item.caption || 'Curated Detail'}
                        fill
                        sizes="(max-w-720px) 100vw, 25vw"
                        className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-108"
                      />
                      
                      {/* Spotlight Glassmorphic Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 md:p-8" />
                      
                      <div className="absolute inset-0 flex flex-col justify-between p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                        <div className="flex justify-end">
                          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                            <Eye size={14} />
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-white">
                          <span className="text-[9px] uppercase tracking-[0.25em] text-white/70 font-semibold bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full w-fit">
                            {item.category}
                          </span>
                          <p className="text-[11px] font-light leading-relaxed tracking-wide text-white/90 line-clamp-2">
                            {item.caption || 'Curated spacing detail.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Prevent grid height shift due to architectural offsets */}
        <div className="h-12 hidden md:block" />

      </div>

      {/* LUXURIOUS LIGHTBOX COMPONENT */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 select-none"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close Button */}
            <button 
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors duration-300 cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-6 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors duration-300 cursor-pointer z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-6 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors duration-300 cursor-pointer z-10"
              aria-label="Next image"
            >
              <ChevronRight size={22} />
            </button>

            {/* Image & Detail Panel Frame */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 bg-[#FAF9F5] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking card
            >
              {/* Image Column */}
              <div className="col-span-1 md:col-span-8 relative aspect-[4/3] md:aspect-square w-full overflow-hidden bg-black/10">
                <Image
                  src={filteredItems[lightboxIndex].image_url}
                  alt={filteredItems[lightboxIndex].caption || 'Curated Detail'}
                  fill
                  className="object-cover"
                  sizes="(max-w-1024px) 100vw, 66vw"
                  priority
                />
              </div>

              {/* Detail Brief Column */}
              <div className="col-span-1 md:col-span-4 p-8 md:p-10 flex flex-col justify-between h-full bg-[#FAF9F5] text-[#1C1B1A]">
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A265] block font-semibold mb-2">
                      {filteredItems[lightboxIndex].category}
                    </span>
                    <h3 className="text-xl md:text-2xl font-light font-serif tracking-tight leading-tight">
                      Curated Element
                    </h3>
                  </div>
                  
                  <hr className="border-[#1C1B1A]/10 w-16" />
                  
                  <p className="text-xs md:text-sm font-light leading-relaxed text-[#1C1B1A]/70">
                    {filteredItems[lightboxIndex].caption || 'No detail details configured for this canvas.'}
                  </p>
                </div>

                <div className="pt-8 border-t border-[#1C1B1A]/10 flex justify-between items-center text-[10px] text-[#1C1B1A]/40 uppercase tracking-widest">
                  <span>ITEM {lightboxIndex + 1} OF {filteredItems.length}</span>
                  <span>ETHEREAL SPACES</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
