'use strict';
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { db, GalleryItem } from '@/lib/db';

const categories = ['All', 'Residential', 'Commercial', 'Luxury Villas', 'Apartments', 'Renovations'];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filtered, setFiltered] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Lightbox States
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  // Pagination
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    async function loadData() {
      const gallery = await db.getGalleryItems();
      setItems(gallery);
      setFiltered(gallery);
    }
    loadData();
  }, []);

  // Filter items by category
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFiltered(items);
    } else {
      setFiltered(items.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase()));
    }
    setVisibleCount(6); // Reset pagination on category change
  }, [selectedCategory, items]);

  const loadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! + 1) % filtered.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! - 1 + filtered.length) % filtered.length);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filtered]);

  const visibleItems = filtered.slice(0, visibleCount);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-dark-bg text-ivory">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Title */}
        <div className="space-y-4 mb-16 text-center">
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold block">Visual Inspiration</span>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight">The Gallery</h1>
          <p className="text-xs text-ivory/60 max-w-md mx-auto tracking-wide leading-relaxed font-light">
            A raw, unedited archive of architectural details, joinery connections, stone selection, and completed spatial moments.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-16 border-b border-gold/5 pb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-[10px] uppercase tracking-wider transition-all duration-300 rounded-full border ${
                selectedCategory === cat
                  ? 'border-gold bg-gold text-dark-bg font-medium'
                  : 'border-gold/10 text-ivory/70 hover:border-gold/30 hover:text-gold'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {visibleItems.map((item, idx) => (
            <div 
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="break-inside-avoid relative overflow-hidden bg-dark-surface border border-gold/5 rounded-sm cursor-pointer group shadow-lg"
            >
              {/* Aspect ratio set in pre-seeded mock details */}
              <div 
                className="relative w-full overflow-hidden"
                style={{ aspectRatio: `${item.width} / ${item.height}` }}
              >
                <Image
                  src={item.image_url}
                  alt={item.caption || 'Gallery Image'}
                  fill
                  sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Cover Overlay on Hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                  <div className="flex justify-end">
                    <div className="w-8 h-8 rounded-full bg-white/20 border border-white/20 flex items-center justify-center text-white">
                      <Maximize2 size={12} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[12px] uppercase tracking-widest text-white/80 font-semibold">{item.category}</span>
                    <p className="text-[10px] text-white/90 line-clamp-2 font-light">{item.caption}</p>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < filtered.length && (
          <div className="text-center mt-16">
            <button
              onClick={loadMore}
              className="px-8 py-3 border border-gold text-gold hover:bg-gold hover:text-dark-bg text-xs uppercase tracking-[0.25em] font-medium transition-all duration-500 rounded-sm"
            >
              Load More Inspiration
            </button>
          </div>
        )}

        {/* LIGHTBOX SLIDESHOW MODAL */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
              className="fixed inset-0 z-50 bg-black/98 flex flex-col justify-between items-center p-6 select-none"
            >
              {/* Top Bar */}
              <div className="w-full max-w-7xl flex justify-between items-center text-ivory/60 pt-4">
                <span className="text-[12px] uppercase tracking-[0.25em] font-light pl-4">
                  {filtered[lightboxIndex].category}
                </span>
                <button 
                  onClick={closeLightbox}
                  className="w-10 h-10 rounded-full border border-ivory/10 flex items-center justify-center text-ivory hover:text-gold hover:border-gold transition-all duration-300"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Main Content Area */}
              <div className="w-full max-w-5xl flex items-center justify-between grow relative my-6">
                
                {/* Prev Button */}
                <button
                  onClick={prevImage}
                  className="absolute left-0 md:-left-16 z-10 w-12 h-12 rounded-full border border-gold/15 bg-dark-bg/40 flex items-center justify-center text-gold hover:text-ivory hover:border-gold transition-all duration-300"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Image panel */}
                <div 
                  className="relative w-full h-[65vh] md:h-[70vh] flex justify-center items-center"
                  onClick={(e) => e.stopPropagation()} // Prevent close on image click
                >
                  <Image
                    src={filtered[lightboxIndex].image_url}
                    alt={filtered[lightboxIndex].caption || 'Gallery lightbox'}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </div>

                {/* Next Button */}
                <button
                  onClick={nextImage}
                  className="absolute right-0 md:-right-16 z-10 w-12 h-12 rounded-full border border-gold/15 bg-dark-bg/40 flex items-center justify-center text-gold hover:text-ivory hover:border-gold transition-all duration-300"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>

              </div>

              {/* Bottom Caption Bar */}
              <div className="w-full max-w-3xl text-center pb-6 space-y-2">
                {filtered[lightboxIndex].caption && (
                  <p className="text-xs text-champagne/80 font-light leading-relaxed max-w-xl mx-auto">
                    {filtered[lightboxIndex].caption}
                  </p>
                )}
                <span className="text-[12px] text-ivory/40 uppercase tracking-widest block">
                  Image {lightboxIndex + 1} of {filtered.length}
                </span>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
