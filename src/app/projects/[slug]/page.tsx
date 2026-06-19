'use strict';
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { db, Project } from '@/lib/db';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [project, setProject] = useState<Project | null>(null);
  const [related, setRelated] = useState<Project[]>([]);
  const [sliderPosition, setSliderPosition] = useState(50); // Before/After split in percentage
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadProject() {
      if (!slug) return;
      const data = await db.getProjectBySlug(slug);
      if (!data) {
        // Redirect if not found
        router.push('/projects');
        return;
      }
      setProject(data);

      const allProjects = await db.getProjects();
      const relatedFiltered = allProjects
        .filter(p => p.category === data.category && p.id !== data.id)
        .slice(0, 2);
      setRelated(relatedFiltered);
    }
    loadProject();
  }, [slug, router]);

  // Handle Before/After slider dragging
  const handleMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <span className="absolute w-6 h-6 border border-gold rotate-45 animate-spin" />
        </div>
      </div>
    );
  }

  // Before/After comparison images
  const beforeImage = project.before_image || (project.images && project.images[2]) || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200';
  const afterImage = project.after_image || project.hero_image;

  return (
    <div className="min-h-screen bg-dark-bg text-ivory pb-24">
      
      {/* 1. HERO BANNER */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <Image
          src={project.hero_image}
          alt={project.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Floating Back Button */}
        <div className="absolute top-28 left-6 md:left-12 z-10">
          <Link 
            href="/projects"
            className="flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors duration-300 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Projects</span>
          </Link>
        </div>

        {/* Hero Title details */}
        <div className="absolute bottom-12 left-6 md:left-12 max-w-3xl space-y-4">
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/70 font-medium">{project.category}</span>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white">{project.name}</h1>
          <p className="text-xs md:text-sm text-white/70 tracking-wide font-light">{project.location} — Completed {project.completion_date}</p>
        </div>
      </section>

      {/* 2. CASE STUDY DETAILS */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Narrative columns */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Section 1: Overview */}
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-[0.25em] text-gold font-medium">Concept & Spatial Design</h2>
            <p className="text-xs md:text-sm font-light text-ivory/80 leading-relaxed">
              {project.overview}
            </p>
          </div>

          {/* Section 2: Challenges & Solutions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-4 border-l border-gold/15 pl-6">
              <h3 className="text-xs uppercase tracking-[0.2em] text-champagne font-medium">The Challenge</h3>
              <p className="text-xs font-light text-ivory/60 leading-relaxed">
                {project.design_challenge}
              </p>
            </div>
            <div className="space-y-4 border-l border-gold/15 pl-6">
              <h3 className="text-xs uppercase tracking-[0.2em] text-gold font-medium">The Solution</h3>
              <p className="text-xs font-light text-ivory/60 leading-relaxed">
                {project.design_solution}
              </p>
            </div>
          </div>

          {/* Section 3: Before & After comparison slider */}
          <div className="space-y-6 pt-4">
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-gold font-medium mb-1">Spatial Transformation</h3>
              <p className="text-[10px] text-ivory/40">Drag the slider horizontally to view the raw site comparison</p>
            </div>
            
            <div 
              ref={sliderRef}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="relative h-[400px] w-full overflow-hidden select-none cursor-ew-resize border border-gold/10 rounded-sm"
            >
              {/* After image (Base background) */}
              <Image 
                src={afterImage} 
                alt="After Transformation" 
                fill 
                className="object-cover"
                draggable={false}
              />
              <div className="absolute right-4 bottom-4 z-10 bg-black/60 px-3 py-1 rounded text-[12px] uppercase tracking-widest text-white">AFTER</div>

              {/* Before image (Overlay container with clip path) */}
              <div 
                className="absolute inset-0 z-0 overflow-hidden" 
                style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
              >
                <Image 
                  src={beforeImage} 
                  alt="Before State" 
                  fill 
                  className="object-cover filter grayscale contrast-125"
                  draggable={false}
                />
                <div className="absolute left-4 bottom-4 z-10 bg-black/60 px-3 py-1 rounded text-[12px] uppercase tracking-widest text-white/70">BEFORE</div>
              </div>

              {/* Central Divider Handle */}
              <div 
                className="absolute top-0 bottom-0 w-[1px] bg-gold z-20 cursor-ew-resize"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-gold bg-dark-bg/85 flex items-center justify-center shadow-lg">
                  <div className="flex space-x-1 text-gold text-[10px]">
                    <span>‹</span>
                    <span>›</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar Specifications */}
        <div className="lg:col-span-4 space-y-12">
          
          {/* Material Board Chips */}
          <div className="p-8 bg-dark-surface border border-gold/5 rounded-sm space-y-6">
            <h3 className="text-xs uppercase tracking-[0.2em] text-gold font-medium">Material Curation</h3>
            <div className="flex flex-wrap gap-2">
              {project.materials.map((mat, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1.5 bg-dark-bg border border-gold/15 text-[10px] uppercase tracking-wider text-ivory/80 rounded-full"
                >
                  {mat}
                </span>
              ))}
            </div>
          </div>

          {/* Testimonial Box */}
          {project.client_testimonial && (
            <div className="p-8 border border-gold/10 rounded-sm bg-gradient-to-br from-dark-surface to-dark-bg space-y-6 relative overflow-hidden">
              <span className="absolute top-2 right-4 text-7xl font-serif text-gold/5 select-none font-bold">"</span>
              <h3 className="text-xs uppercase tracking-[0.2em] text-gold font-medium">Reflections</h3>
              <p className="text-xs font-serif italic text-champagne/90 leading-relaxed font-light">
                "{project.client_testimonial}"
              </p>
              <div className="border-t border-gold/5 pt-4">
                <p className="text-[10px] uppercase tracking-wider text-ivory font-medium">{project.client_name}</p>
                <p className="text-[12px] text-ivory/40">Verified Client</p>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 3. IMAGES LIGHTBOX & CAROUSEL */}
      {project.images && project.images.length > 0 && (
        <section className="py-20 border-t border-gold/5 bg-dark-surface/30">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <h3 className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-12 text-center">Project Portfolio Images</h3>
            
            {/* Active Display Panel */}
            <div className="relative aspect-[16/9] max-w-5xl mx-auto mb-6 border border-gold/10 rounded-sm overflow-hidden group">
              <Image
                src={project.images[activeImageIndex]}
                alt={`${project.name} view ${activeImageIndex}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button 
                  onClick={() => setIsLightboxOpen(true)}
                  className="w-12 h-12 rounded-full bg-dark-bg/85 border border-gold flex items-center justify-center text-gold shadow-lg transform scale-95 group-hover:scale-100 transition-all duration-300"
                >
                  <Eye size={16} />
                </button>
              </div>

              {/* Prev / Next buttons inside panel */}
              <button 
                onClick={() => setActiveImageIndex((prev) => (prev - 1 + project.images!.length) % project.images!.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-ivory hover:text-gold transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => setActiveImageIndex((prev) => (prev + 1) % project.images!.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-ivory hover:text-gold transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Thumbnail selector */}
            <div className="flex justify-center items-center space-x-4">
              {project.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-24 aspect-[16/10] overflow-hidden rounded-sm border transition-all duration-300 ${
                    activeImageIndex === idx ? 'border-gold scale-105 shadow-md shadow-gold/5' : 'border-gold/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LIGHTBOX MODAL */}
      {isLightboxOpen && project.images && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-center items-center p-6">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-ivory/60 hover:text-gold text-xs uppercase tracking-widest border border-ivory/15 px-4 py-2 bg-dark-bg"
          >
            Close ✕
          </button>
          
          <div className="relative w-full max-w-6xl aspect-[16/10]">
            <Image
              src={project.images[activeImageIndex]}
              alt="Lightbox Zoom"
              fill
              className="object-contain"
            />
          </div>
          
          <span className="text-[10px] text-ivory/40 uppercase tracking-widest mt-6">
            Image {activeImageIndex + 1} of {project.images.length}
          </span>
        </div>
      )}

      {/* 4. RELATED PROJECTS */}
      {related.length > 0 && (
        <section className="py-24 border-t border-gold/5 max-w-7xl mx-auto px-6 md:px-12">
          <h3 className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-12">Related Transformations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {related.map((item) => (
              <Link 
                href={`/projects/${item.slug}`} 
                key={item.id}
                className="group relative aspect-[16/10] overflow-hidden rounded-sm border border-gold/5 bg-dark-surface block"
              >
                <Image
                  src={item.hero_image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-60 group-hover:opacity-75 transition-opacity" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <span className="text-[12px] uppercase tracking-[0.2em] text-white/80 mb-1 font-semibold">{item.category}</span>
                  <h4 className="text-lg font-light text-white tracking-wide mb-1">{item.name}</h4>
                  <div className="flex items-center space-x-1.5 text-[10px] text-white/90 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Inspect</span>
                    <ArrowUpRight size={10} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
