'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import SafeImage from './SafeImage';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { db, Project } from '@/lib/db';

const FALLBACK_PROJECTS: Partial<Project>[] = [
  {
    name: 'Residence Lumiere',
    category: 'Luxury Villas',
    location: 'Geneva, Switzerland',
    hero_image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
    overview: 'A stunning lakeside estate engineered to capture reflection, light, and structured warmth. Constructed on the banks of Geneva, it blends clean geometries with soft natural textures.',
    slug: 'residence-lumiere'
  },
  {
    name: 'Serene Penthouse',
    category: 'Apartments',
    location: 'Manhattan, New York',
    hero_image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200',
    overview: 'A high-rise penthouse situated above the skyline. The project is an exploration of "warm minimalism"—substituting clinical white surfaces with textured plaster, linen wallcoverings, and tactile stone.',
    slug: 'serene-penthouse'
  },
  {
    name: 'Monolith HQ',
    category: 'Commercial',
    location: 'Mayfair, London',
    hero_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    overview: 'A private family office designed as a hybrid hospitality salon and executive suite. We crafted an interior that projects permanence, authority, and quiet luxury.',
    slug: 'monolith-office'
  },
  {
    name: 'Vienna Townhouse',
    category: 'Renovations',
    location: 'Vienna, Austria',
    hero_image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200',
    overview: 'A historical rejuvenation of a 19th-century salon. The project features hand-restored wall panels sitting opposite ultra-modern modular kitchen blocks and Italian lighting fixtures.',
    slug: 'vienna-townhouse'
  }
];

export default function RoomTransformation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await db.getProjects();
        if (data && data.length > 0) {
          setProjects(data);
        }
      } catch (err) {
        console.error('Failed to load projects inside RoomTransformation:', err);
      }
    }
    loadProjects();
  }, []);

  // Hydrate projects with fallback data if still loading or empty
  const activeProjects = projects.length > 0 ? projects : (FALLBACK_PROJECTS as Project[]);
  
  const lumiere = activeProjects.find(p => p.slug === 'residence-lumiere') || activeProjects[0];
  const penthouse = activeProjects.find(p => p.slug === 'serene-penthouse') || activeProjects[1] || activeProjects[0];
  const monolith = activeProjects.find(p => p.slug === 'monolith-office') || activeProjects[2] || activeProjects[0];
  const vienna = activeProjects.find(p => p.slug === 'vienna-townhouse') || activeProjects[3] || activeProjects[0];

  // Scroll bindings for horizontal desktop paginated slider
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-83.333%']); // Translates 6 pages (5 shifts total)

  return (
    <div className="w-full">
      {/* ========================================================
          1. DESKTOP IMPLEMENTATION (Horizontal Scroll paginated spreads)
          ======================================================== */}
      <div ref={containerRef} className="hidden lg:block relative w-full h-[600vh] bg-[#F6F4EE]">
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-center bg-[#F6F4EE]">
          
          {/* Magazine Pages Container */}
          <motion.div style={{ x }} className="flex w-[600vw] h-full">
            
            {/* PAGE 1: INTRODUCTORY SPREAD */}
            <div className="w-screen h-full flex items-center relative border-r border-[#1C1B1A]/5 bg-[#FAF9F5]">
              <div className="w-full h-full grid grid-cols-12">
                
                {/* Left Side: Editorial Introduction Image Frame */}
                <div className="col-span-5 relative h-full w-full bg-[#1C1B1A]/5 flex items-center justify-center p-12">
                  <div className="relative w-[85%] h-[80%] rounded-2xl overflow-hidden shadow-lg border border-black/5">
                    <SafeImage
                      src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800"
                      alt="Sculptured Space"
                      fill
                      className="object-cover transition-transform duration-[3s] hover:scale-103"
                      sizes="(min-w-1024px) 42vw, 0px"
                      priority
                    />
                    <div className="absolute inset-0 bg-black/5" />
                  </div>
                </div>

                {/* Right Side: Editorial Typography & Metadata */}
                <div className="col-span-7 flex flex-col justify-between px-16 md:px-24 py-20 relative bg-[#F6F4EE] border-l border-[#1C1B1A]/5">
                  {/* Top metadata */}
                  <div>
                    <span className="text-[12px] tracking-[0.4em] uppercase text-[#C5A265] font-semibold block mb-2 animate-pulse">
                      Studio Collection
                    </span>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#1C1B1A]/50">
                      Issue No. 04 / Spring 2026
                    </p>
                  </div>

                  {/* Center Title and Description */}
                  <div className="space-y-8 my-auto pr-8">
                    <span className="text-[12px] uppercase tracking-[0.4em] text-[#C5A265] block font-semibold">
                      The Poetry of Space
                    </span>
                    <h1 className="text-5xl md:text-7xl font-light tracking-tight text-[#1C1B1A] font-serif leading-[1.1]">
                      Sculpting light,<br />refining structure.
                    </h1>
                    <hr className="border-[#1C1B1A]/10 w-24" />
                    <p className="text-sm font-light leading-relaxed text-[#1C1B1A]/70 max-w-xl">
                      We approach interior design as a narrative of quiet luxury. Every environment tells the story of raw materials, architectural alignment, and the relationship between light and shadow. A visual curation of residential and commercial spaces structured to inspire.
                    </p>
                  </div>

                  {/* Bottom details */}
                  <div className="pt-6 border-t border-[#1C1B1A]/10 flex justify-between text-[10px] text-[#1C1B1A]/40 uppercase font-light">
                    <span>Ethereal Spaces © {new Date().getFullYear()}</span>
                    <span>All Rights Reserved</span>
                  </div>
                </div>

              </div>

              {/* Page Number & Prompt */}
              <div className="absolute bottom-12 right-24 flex items-center space-x-3 text-[11px] tracking-[0.25em] text-[#1C1B1A]/40 z-20">
                <span>Scroll to turn page</span>
                <motion.div 
                  animate={{ x: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                >
                  <ArrowRight size={12} className="text-[#C5A265]" />
                </motion.div>
              </div>
            </div>

            {/* PAGE 2: PROJECT SPREAD 1 (Residence Lumiere - Split-Screen, Image-First) */}
            <div className="w-screen h-full flex items-center relative border-r border-[#1C1B1A]/5 bg-[#FAF9F5]">
              <div className="w-full h-full grid grid-cols-12">
                
                {/* Left Side: Large Immersive Photography */}
                <div className="col-span-7 relative h-full w-full overflow-hidden">
                  <SafeImage
                    src={lumiere.hero_image}
                    alt={lumiere.name}
                    fill
                    className="object-cover transition-transform duration-[2s] hover:scale-102"
                    sizes="(min-w-1024px) 58vw, 0px"
                    priority
                  />
                  <div className="absolute inset-0 bg-[#1C1B1A]/5" />
                </div>

                {/* Right Side: Editorial Narrative Column */}
                <div className="col-span-5 flex flex-col justify-center px-16 md:px-20 py-12 relative bg-[#F6F4EE] border-l border-[#1C1B1A]/5">
                  <div className="space-y-6">
                    <span className="text-[12px] uppercase tracking-[0.35em] text-[#C5A265] block font-semibold">
                      01 / {lumiere.category}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#1C1B1A] font-serif leading-tight">
                      {lumiere.name}
                    </h2>
                    <span className="text-[11px] text-[#1C1B1A]/50 tracking-widest font-light block uppercase">
                      Location: {lumiere.location}
                    </span>
                    <hr className="border-[#1C1B1A]/10 w-20" />
                    <p className="text-xs md:text-sm font-light leading-relaxed text-[#1C1B1A]/70 max-w-sm">
                      {lumiere.overview}
                    </p>
                    <div className="pt-4">
                      <Link 
                        href={`/projects/${lumiere.slug}`}
                        className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-[#1C1B1A] hover:text-[#C5A265] font-semibold group transition-colors duration-300"
                      >
                        <span>Explore Narrative</span>
                        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>
                </div>

              </div>

              {/* Page Number */}
              <div className="absolute bottom-12 left-24 text-[12px] tracking-[0.25em] text-white/80 z-20">
                P. 02 — EXHIBIT I
              </div>
              <div className="absolute bottom-12 right-24 text-[12px] tracking-[0.25em] text-[#1C1B1A]/40">
                RESIDENCE LUMIERE
              </div>
            </div>

            {/* PAGE 3: PROJECT SPREAD 2 (Serene Penthouse - Full-Page Immersive) */}
            <div className="w-screen h-full flex items-center relative border-r border-[#1C1B1A]/5">
              <SafeImage
                src={penthouse.hero_image}
                alt={penthouse.name}
                fill
                className="object-cover"
                sizes="(min-w-1024px) 100vw, 0px"
              />
              <div className="absolute inset-0 bg-[#1C1B1A]/35" />

              {/* Floating Absolute Glassmorphic Card on Right */}
              <div className="absolute right-24 top-1/2 -translate-y-1/2 max-w-md bg-[#FAF9F5]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl space-y-6 text-[#1C1B1A] z-10">
                <span className="text-[12px] uppercase tracking-[0.35em] text-[#C5A265] block font-semibold">
                  02 / {penthouse.category}
                </span>
                <h2 className="text-3xl md:text-4xl font-light tracking-tight font-serif leading-tight">
                  {penthouse.name}
                </h2>
                <span className="text-[11px] text-[#1C1B1A]/50 tracking-widest font-light block uppercase">
                  Location: {penthouse.location}
                </span>
                <hr className="border-[#1C1B1A]/10 w-16" />
                <p className="text-xs md:text-sm font-light leading-relaxed text-[#1C1B1A]/70">
                  {penthouse.overview}
                </p>
                <div className="pt-2">
                  <Link 
                    href={`/projects/${penthouse.slug}`}
                    className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-[#1C1B1A] hover:text-[#C5A265] font-semibold group transition-colors duration-300"
                  >
                    <span>View Penthouse Gallery</span>
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </Link>
                </div>
              </div>

              {/* Page Number */}
              <div className="absolute bottom-12 left-24 text-[12px] tracking-[0.25em] text-white/80 z-20">
                P. 03 — EXHIBIT II
              </div>
              <div className="absolute bottom-12 right-24 text-[12px] tracking-[0.25em] text-white/60">
                SERENE PENTHOUSE
              </div>
            </div>

            {/* PAGE 4: PROJECT SPREAD 3 (Monolith HQ - Split-Screen, Text-First) */}
            <div className="w-screen h-full flex items-center relative border-r border-[#1C1B1A]/5 bg-[#FAF9F5]">
              <div className="w-full h-full grid grid-cols-12">
                
                {/* Left Side: Editorial Narrative Column */}
                <div className="col-span-5 flex flex-col justify-center px-16 md:px-20 py-12 relative bg-[#F6F4EE] border-r border-[#1C1B1A]/5">
                  <div className="space-y-6">
                    <span className="text-[12px] uppercase tracking-[0.35em] text-[#C5A265] block font-semibold">
                      03 / {monolith.category}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#1C1B1A] font-serif leading-tight">
                      {monolith.name}
                    </h2>
                    <span className="text-[11px] text-[#1C1B1A]/50 tracking-widest font-light block uppercase">
                      Location: {monolith.location}
                    </span>
                    <hr className="border-[#1C1B1A]/10 w-20" />
                    <p className="text-xs md:text-sm font-light leading-relaxed text-[#1C1B1A]/70 max-w-sm">
                      {monolith.overview}
                    </p>
                    <div className="pt-4">
                      <Link 
                        href={`/projects/${monolith.slug}`}
                        className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-[#1C1B1A] hover:text-[#C5A265] font-semibold group transition-colors duration-300"
                      >
                        <span>Explore Space Details</span>
                        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Right Side: Offset Photo Frame Container */}
                <div className="col-span-7 relative h-full w-full bg-[#1C1B1A]/5 flex items-center justify-center">
                  <div className="relative w-[78%] h-[74%] rounded-2xl overflow-hidden shadow-xl border border-black/5 hover:scale-[1.01] transition-transform duration-700">
                    <SafeImage
                      src={monolith.hero_image}
                      alt={monolith.name}
                      fill
                      className="object-cover"
                      sizes="(min-w-1024px) 45vw, 0px"
                    />
                  </div>
                </div>

              </div>

              {/* Page Number */}
              <div className="absolute bottom-12 left-24 text-[12px] tracking-[0.25em] text-[#1C1B1A]/40 z-20">
                P. 04 — EXHIBIT III
              </div>
              <div className="absolute bottom-12 right-24 text-[12px] tracking-[0.25em] text-[#1C1B1A]/40">
                MONOLITH HQ
              </div>
            </div>

            {/* PAGE 5: PROJECT SPREAD 4 (Vienna Townhouse - Multi-Image Composition) */}
            <div className="w-screen h-full flex items-center relative border-r border-[#1C1B1A]/5 bg-[#F6F4EE]">
              <div className="w-full h-full grid grid-cols-12 items-center px-24">
                
                {/* Left Side: Metadata & Narrative (Col-span 4) */}
                <div className="col-span-4 space-y-6 pr-12 text-left">
                  <span className="text-[12px] uppercase tracking-[0.35em] text-[#C5A265] block font-semibold">
                    04 / {vienna.category}
                  </span>
                  <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#1C1B1A] font-serif leading-tight">
                    {vienna.name}
                  </h2>
                  <span className="text-[11px] text-[#1C1B1A]/50 tracking-widest font-light block uppercase">
                    Location: {vienna.location}
                  </span>
                  <hr className="border-[#1C1B1A]/10 w-20" />
                  <p className="text-xs md:text-sm font-light leading-relaxed text-[#1C1B1A]/70">
                    {vienna.overview}
                  </p>
                  <div className="pt-4">
                    <Link 
                      href={`/projects/${vienna.slug}`}
                      className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-[#1C1B1A] hover:text-[#C5A265] font-semibold group transition-colors duration-300"
                    >
                      <span>Explore Renovation</span>
                      <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>

                {/* Right Side: Dual-Image Layered Composition (Col-span 8) */}
                <div className="col-span-8 relative w-full h-[70vh] flex items-center justify-start pl-8 select-none">
                  {/* Large Hero Frame */}
                  <div className="relative w-[62%] h-[82%] rounded-2xl overflow-hidden shadow-lg border border-black/5">
                    <SafeImage
                      src={vienna.hero_image}
                      alt={vienna.name}
                      fill
                      className="object-cover"
                      sizes="(min-w-1024px) 41vw, 0px"
                    />
                  </div>
                  {/* Smaller Offset Detail Frame */}
                  <div className="absolute w-[36%] h-[50%] bottom-8 right-12 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#F6F4EE] z-10 group">
                    <SafeImage
                      src={vienna.images && vienna.images[1] ? vienna.images[1] : vienna.hero_image}
                      alt={`${vienna.name} Detail`}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      sizes="(min-w-1024px) 24vw, 0px"
                    />
                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-md text-[10px] uppercase text-white tracking-widest font-light">
                      Material Detail
                    </div>
                  </div>
                </div>

              </div>

              {/* Page Number */}
              <div className="absolute bottom-12 left-24 text-[12px] tracking-[0.25em] text-[#1C1B1A]/40 z-20">
                P. 05 — EXHIBIT IV
              </div>
              <div className="absolute bottom-12 right-24 text-[12px] tracking-[0.25em] text-[#1C1B1A]/40">
                VIENNA TOWNHOUSE
              </div>
            </div>

            {/* PAGE 6: CLOSING SPREAD (Brand Statistics & Curation Philosophy Transition Section) */}
            <div className="w-screen h-full flex flex-col justify-center items-center px-24 relative select-none bg-gradient-to-r from-[#F6F4EE] via-[#FAF9F5] to-dark-bg">
              <div className="max-w-5xl w-full grid grid-cols-12 gap-12 lg:gap-16 items-center">
                
                {/* Left Column: Curation Philosophy Editorial */}
                <div className="col-span-6 space-y-6 text-left border-r border-[#1C1B1A]/10 pr-16 h-full flex flex-col justify-center py-6">
                  <span className="text-[12px] tracking-[0.4em] uppercase text-[#C5A265] font-semibold block animate-pulse">
                    The Architecture of Space
                  </span>
                  <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[#1C1B1A] font-serif leading-tight">
                    Sculpting Space,<br />Refining Light
                  </h2>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-[#1C1B1A]/70 max-w-md">
                    Our creation journey demonstrates the meticulous precision we bring to every residence. By structuring empty rooms into sensory narratives, we curate custom environments that honor structural integrity, exquisite raw materials, and clean lines.
                  </p>
                </div>

                {/* Right Column: Grid of Statistics Metrics */}
                <div className="col-span-6 grid grid-cols-2 gap-6 md:gap-8 w-full pl-8">
                  {[
                    { metric: '150+', title: 'Bespoke Spaces', desc: 'Residences styled across Europe & the Americas' },
                    { metric: '12+', title: 'Global Awards', desc: 'Recognized for craftsmanship & modern minimalism' },
                    { metric: '100%', title: 'Turnkey Handover', desc: 'From initial CAD drawing to custom table styling' },
                    { metric: '4', title: 'Creative Hubs', desc: 'Geneva, London, New York, and Vienna' }
                  ].map((stat, idx) => (
                    <div 
                      key={idx} 
                      className="p-5 md:p-6 bg-white border border-[#1C1B1A]/5 hover:border-[#C5A265]/30 rounded-2xl transition-all duration-500 shadow-[0_5px_15px_rgba(0,0,0,0.01)] flex flex-col justify-between group hover:-translate-y-1"
                    >
                      <span className="text-3xl md:text-4xl font-serif text-[#C5A265] font-light tracking-tight block mb-1.5 group-hover:scale-105 transition-transform duration-300">
                        {stat.metric}
                      </span>
                      <div>
                        <h4 className="text-xs md:text-sm font-light text-[#1C1B1A] tracking-wider mb-1">
                          {stat.title}
                        </h4>
                        <p className="text-[10px] md:text-[11px] text-[#1C1B1A]/55 leading-relaxed font-light">
                          {stat.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              {/* Page Number */}
              <div className="absolute bottom-12 left-24 text-[12px] tracking-[0.25em] text-[#1C1B1A]/40">
                P. 06 — CLOSING SPREAD
              </div>
              <div className="absolute bottom-12 right-24 text-[12px] tracking-[0.25em] text-[#1C1B1A]/40 uppercase">
                Ethereal Spaces © {new Date().getFullYear()}
              </div>
            </div>

          </motion.div>
        </div>
      </div>

      {/* ========================================================
          2. MOBILE IMPLEMENTATION (Responsive Stacking spreads for touch screens)
          ======================================================== */}
      <div className="block lg:hidden bg-[#F6F4EE] border-t border-b border-[#1C1B1A]/5">
        
        {/* MOBILE PAGE 1: INTRO */}
        <div className="border-b border-[#1C1B1A]/5 bg-[#FAF9F5]">
          <div className="relative aspect-[4/3] w-full bg-[#1C1B1A]/5 flex items-center justify-center p-4">
            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-md">
              <SafeImage
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800"
                alt="Sculptured Space"
                fill
                className="object-cover"
                sizes="(max-w-1024px) 100vw, 0px"
                priority
              />
            </div>
          </div>
          <div className="px-6 py-12 space-y-5 bg-[#F6F4EE]">
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#C5A265] font-semibold block">
              Studio Collection / Issue 04
            </span>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-[#1C1B1A] font-serif leading-tight">
              Sculpting light,<br />refining structure.
            </h1>
            <p className="text-xs font-light leading-relaxed text-[#1C1B1A]/70">
              We approach interior design as a narrative of quiet luxury. Every environment tells the story of raw materials, architectural alignment, and the relationship between light and shadow. A visual curation of residential and commercial spaces structured to inspire.
            </p>
            <div className="pt-6 border-t border-[#1C1B1A]/10 flex justify-between text-[10px] text-[#1C1B1A]/40 uppercase font-light">
              <span>P. 01 — INTRO</span>
              <span>Spring 2026</span>
            </div>
          </div>
        </div>

        {/* MOBILE PAGE 2: Residence Lumiere */}
        <div className="border-b border-[#1C1B1A]/5 bg-[#FAF9F5]">
          <div className="relative aspect-[4/3] w-full">
            <SafeImage
              src={lumiere.hero_image}
              alt={lumiere.name}
              fill
              className="object-cover"
              sizes="(max-w-1024px) 100vw, 0px"
            />
          </div>
          <div className="px-6 py-12 space-y-5 bg-[#F6F4EE]">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A265] block font-semibold">
              01 / {lumiere.category}
            </span>
            <h2 className="text-2xl md:text-3xl font-light tracking-tight text-[#1C1B1A] font-serif">
              {lumiere.name}
            </h2>
            <span className="text-[10px] text-[#1C1B1A]/50 tracking-widest font-light block uppercase">
              Location: {lumiere.location}
            </span>
            <p className="text-xs font-light leading-relaxed text-[#1C1B1A]/70">
              {lumiere.overview}
            </p>
            <div className="pt-2">
              <Link 
                href={`/projects/${lumiere.slug}`}
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#1C1B1A] hover:text-[#C5A265] font-semibold"
              >
                <span>Explore Narrative</span>
                <ArrowUpRight size={12} />
              </Link>
            </div>
            <div className="pt-6 border-t border-[#1C1B1A]/10 flex justify-between text-[10px] text-[#1C1B1A]/40 uppercase font-light">
              <span>P. 02 — EXHIBIT I</span>
              <span>Geneva</span>
            </div>
          </div>
        </div>

        {/* MOBILE PAGE 3: Serene Penthouse */}
        <div className="relative flex items-center justify-center py-24 px-6 min-h-[90vh]">
          <SafeImage
            src={penthouse.hero_image}
            alt={penthouse.name}
            fill
            className="object-cover"
            sizes="(max-w-1024px) 100vw, 0px"
          />
          <div className="absolute inset-0 bg-[#1C1B1A]/45 z-0" />

          <div className="relative bg-[#FAF9F5]/95 backdrop-blur-md rounded-2xl p-8 shadow-xl space-y-5 text-[#1C1B1A] z-10 max-w-md w-full border border-white/10">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A265] block font-semibold">
              02 / {penthouse.category}
            </span>
            <h2 className="text-2xl md:text-3xl font-light tracking-tight font-serif">
              {penthouse.name}
            </h2>
            <span className="text-[10px] text-[#1C1B1A]/50 tracking-widest font-light block uppercase">
              Location: {penthouse.location}
            </span>
            <p className="text-xs font-light leading-relaxed text-[#1C1B1A]/70">
              {penthouse.overview}
            </p>
            <div className="pt-2">
              <Link 
                href={`/projects/${penthouse.slug}`}
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#1C1B1A] hover:text-[#C5A265] font-semibold"
              >
                <span>View Penthouse Gallery</span>
                <ArrowUpRight size={12} />
              </Link>
            </div>
            <div className="pt-6 border-t border-[#1C1B1A]/10 flex justify-between text-[10px] text-[#1C1B1A]/40 uppercase font-light">
              <span>P. 03 — EXHIBIT II</span>
              <span>New York</span>
            </div>
          </div>
        </div>

        {/* MOBILE PAGE 4: Monolith HQ */}
        <div className="border-b border-[#1C1B1A]/5 bg-[#FAF9F5]">
          <div className="relative aspect-[4/3] w-full bg-[#1C1B1A]/5 flex items-center justify-center p-4">
            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-md">
              <SafeImage
                src={monolith.hero_image}
                alt={monolith.name}
                fill
                className="object-cover"
                sizes="(max-w-1024px) 100vw, 0px"
              />
            </div>
          </div>
          <div className="px-6 py-12 space-y-5 bg-[#F6F4EE]">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A265] block font-semibold">
              03 / {monolith.category}
            </span>
            <h2 className="text-2xl md:text-3xl font-light tracking-tight text-[#1C1B1A] font-serif">
              {monolith.name}
            </h2>
            <span className="text-[10px] text-[#1C1B1A]/50 tracking-widest font-light block uppercase">
              Location: {monolith.location}
            </span>
            <p className="text-xs font-light leading-relaxed text-[#1C1B1A]/70">
              {monolith.overview}
            </p>
            <div className="pt-2">
              <Link 
                href={`/projects/${monolith.slug}`}
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#1C1B1A] hover:text-[#C5A265] font-semibold"
              >
                <span>Explore Space Details</span>
                <ArrowUpRight size={12} />
              </Link>
            </div>
            <div className="pt-6 border-t border-[#1C1B1A]/10 flex justify-between text-[10px] text-[#1C1B1A]/40 uppercase font-light">
              <span>P. 04 — EXHIBIT III</span>
              <span>London</span>
            </div>
          </div>
        </div>

        {/* MOBILE PAGE 5: Vienna Townhouse */}
        <div className="border-b border-[#1C1B1A]/5 bg-[#F6F4EE]">
          <div className="px-6 py-12 space-y-5">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A265] block font-semibold">
              04 / {vienna.category}
            </span>
            <h2 className="text-2xl md:text-3xl font-light tracking-tight text-[#1C1B1A] font-serif">
              {vienna.name}
            </h2>
            <span className="text-[10px] text-[#1C1B1A]/50 tracking-widest font-light block uppercase">
              Location: {vienna.location}
            </span>
            <p className="text-xs font-light leading-relaxed text-[#1C1B1A]/70">
              {vienna.overview}
            </p>
            <div className="pt-2">
              <Link 
                href={`/projects/${vienna.slug}`}
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#1C1B1A] hover:text-[#C5A265] font-semibold"
              >
                <span>Explore Renovation</span>
                <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>

          {/* Layered Photos stacked on mobile */}
          <div className="relative w-full h-[50vh] px-6 pb-12 select-none">
            <div className="relative w-[75%] h-[90%] rounded-xl overflow-hidden shadow-md">
              <SafeImage
                src={vienna.hero_image}
                alt={vienna.name}
                fill
                className="object-cover"
                sizes="(max-w-1024px) 75vw, 0px"
              />
            </div>
            <div className="absolute w-[45%] h-[60%] bottom-6 right-6 rounded-xl overflow-hidden shadow-2xl border-4 border-[#F6F4EE] z-10">
              <SafeImage
                src={vienna.images && vienna.images[1] ? vienna.images[1] : vienna.hero_image}
                alt={`${vienna.name} Detail`}
                fill
                className="object-cover"
                sizes="(max-w-1024px) 45vw, 0px"
              />
            </div>
          </div>
          <div className="px-6 py-4 border-t border-[#1C1B1A]/10 flex justify-between text-[10px] text-[#1C1B1A]/40 uppercase font-light bg-[#FAF9F5]">
            <span>P. 05 — EXHIBIT IV</span>
            <span>Vienna</span>
          </div>
        </div>

        {/* MOBILE PAGE 6: CLOSING SPREAD */}
        <div className="px-6 py-20 space-y-12 bg-gradient-to-b from-[#F6F4EE] to-[#FAFAFA]">
          <div className="space-y-4">
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#C5A265] font-semibold block">
              The Architecture of Space
            </span>
            <h2 className="text-3xl font-light tracking-tight text-[#1C1B1A] font-serif leading-tight">
              Sculpting Space,<br />Refining Light
            </h2>
            <p className="text-xs md:text-sm font-light leading-relaxed text-[#1C1B1A]/70">
              Our creation journey demonstrates the meticulous precision we bring to every residence. By structuring empty rooms into sensory narratives, we curate custom environments that honor structural integrity, exquisite raw materials, and clean lines.
            </p>
          </div>

          {/* Stats Grid stacked for mobile */}
          <div className="grid grid-cols-2 gap-4 w-full">
            {[
              { metric: '150+', title: 'Bespoke Spaces', desc: 'Residences styled across Europe & the Americas' },
              { metric: '12+', title: 'Global Awards', desc: 'Recognized for craftsmanship' },
              { metric: '100%', title: 'Turnkey Handover', desc: 'From CAD drawings to custom table styling' },
              { metric: '4', title: 'Creative Hubs', desc: 'Geneva, London, NY, Vienna' }
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className="p-4 bg-white border border-[#1C1B1A]/5 rounded-xl shadow-sm flex flex-col justify-between"
              >
                <span className="text-2xl font-serif text-[#C5A265] font-light tracking-tight block mb-1">
                  {stat.metric}
                </span>
                <div>
                  <h4 className="text-[10px] md:text-xs font-light text-[#1C1B1A] tracking-wider mb-0.5">
                    {stat.title}
                  </h4>
                  <p className="text-[9px] text-[#1C1B1A]/50 leading-relaxed font-light">
                    {stat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-[#1C1B1A]/10 flex justify-between text-[10px] text-[#1C1B1A]/40 uppercase font-light">
            <span>P. 06 — CLOSING</span>
            <span>Ethereal Spaces © {new Date().getFullYear()}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
