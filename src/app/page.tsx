'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { db, HomepageContent, Project } from '@/lib/db';

const RoomTransformation = dynamic(() => import('@/components/RoomTransformation'), { ssr: false });
const InteractiveGallery = dynamic(() => import('@/components/InteractiveGallery'), { ssr: false });

export default function HomePage() {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [activeProject, setActiveProject] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);

  // Framer Motion hooks for scroll parallax
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 800], [0, -60]);
  const imageScale = useTransform(scrollY, [0, 800], [1, 1.03]);
  const textY = useTransform(scrollY, [0, 600], [0, 30]);
  const textOpacity = useTransform(scrollY, [0, 600], [1, 0]);

  useEffect(() => {
    async function loadData() {
      const homeContent = await db.getHomepageContent();
      const allProjects = await db.getProjects();
      setContent(homeContent);
      setProjects(allProjects.slice(0, 3)); // show first 3 premium projects
    }
    loadData();
  }, []);

  if (!content) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <span className="absolute w-6 h-6 border border-gold rotate-45 animate-spin" />
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-champagne/80">Loading Ethereal Spaces...</span>
        </div>
      </div>
    );
  }

  const handleNextProject = () => {
    setSlideDirection(1);
    setActiveProject((prev) => (prev + 1) % projects.length);
  };

  const handlePrevProject = () => {
    setSlideDirection(-1);
    setActiveProject((prev) => (prev - 1 + projects.length) % projects.length);
  };

  // Staggered reveal variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      }
    }
  };

  const staggerItem = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    }
  };

  // Word-by-word overflow mask reveal variants
  const wordContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const wordReveal = {
    hidden: { y: '100%' },
    visible: {
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    })
  };

  return (
    <div className="relative overflow-hidden">
      
      {/* 1. CINEMATIC SPLIT-SCREEN HERO SECTION */}
      <section className="relative min-h-screen w-full flex items-center justify-center bg-dark-bg overflow-hidden pt-28 pb-16 lg:py-0">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Hero Content Column */}
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col justify-center space-y-8 z-10 pointer-events-auto"
          >
            <div className="space-y-4">
              <motion.span 
                variants={staggerItem}
                className="text-[12px] tracking-[0.4em] uppercase text-gold font-semibold block animate-pulse"
              >
                Premium Interior Design Studio
              </motion.span>
              
              <motion.h1 
                variants={wordContainer}
                className="text-5xl md:text-8xl font-light tracking-tight text-ivory leading-[1.05] flex flex-wrap"
              >
                {content.hero_title.split(' ').map((word, i) => {
                  const isItalicWord = word === 'Inspire' || word === 'Timeless' || word === 'Aesthetics';
                  return (
                    <span key={i} className="overflow-hidden inline-block mr-3 md:mr-4 py-1">
                      <motion.span 
                        variants={wordReveal}
                        className={`inline-block ${isItalicWord ? 'text-gold italic font-serif font-medium' : ''}`}
                      >
                        {word}
                      </motion.span>
                    </span>
                  );
                })}
              </motion.h1>
            </div>

            <motion.p
              variants={staggerItem}
              className="text-xs md:text-sm font-light tracking-wide text-champagne max-w-lg leading-relaxed"
            >
              {content.hero_subtitle}
            </motion.p>

            <motion.div
              variants={staggerItem}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 pt-2"
            >
              <Link 
                href="/projects" 
                className="px-8 py-4 bg-ivory hover:bg-gold text-dark-bg text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 rounded-lg shadow-sm hover:scale-[1.02] active:scale-[0.98] text-center"
              >
                Explore Projects
              </Link>
              <Link 
                href="/contact" 
                className="px-8 py-4 border border-ivory/20 hover:border-ivory/60 hover:bg-dark-surface/50 text-ivory text-xs uppercase tracking-[0.2em] transition-all duration-300 rounded-lg text-center"
              >
                Start Your Project
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Showcase Image Column */}
          <div className="lg:col-span-5 relative w-full flex justify-center items-center z-10">
            <motion.div
              style={{ y: imageY, scale: imageScale }}
              initial={{ opacity: 0, scale: 0.98, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="relative aspect-[3/4] w-full max-w-md lg:max-w-none rounded-2xl overflow-hidden border border-gold/10 bg-dark-surface shadow-[0_20px_50px_rgba(0,0,0,0.08)] group"
            >
              <SafeImage
                src={content.hero_image}
                alt="Luxury Modern Interior"
                fill
                sizes="(max-w-1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/10 via-transparent to-transparent opacity-50" />
            </motion.div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center space-y-2 opacity-50">
          <span className="text-[12px] uppercase tracking-[0.3em] text-ivory">Scroll</span>
          <div className="w-[1px] h-12 bg-ivory/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gold animate-[scroll-line_2s_infinite]" />
          </div>
        </div>
      </section>

      {/* 1.2. INTERACTIVE GALLERY OF CURATED SPACES */}
      <InteractiveGallery 
        tag={content.gallery_tag}
        title={content.gallery_title}
        description={content.gallery_description}
      />

      {/* 1.5. SCROLL-BASED 3D ROOM TRANSFORMATION SECTION */}
      <RoomTransformation />

      {/* 2. FEATURED PROJECTS SECTION */}
      <section className="pt-12 pb-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="space-y-4">
            <span className="text-[10px] tracking-[0.3em] uppercase text-gold">{content.portfolio_tag || 'Portfolio'}</span>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-ivory">{content.portfolio_title || 'Featured Projects'}</h2>
          </div>
          <Link 
            href="/projects" 
            className="text-xs uppercase tracking-[0.2em] text-champagne hover:text-gold flex items-center space-x-1.5 transition-colors mt-4 md:mt-0 group"
          >
            <span>{content.portfolio_link_text || 'View All Showcase'}</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </Link>
        </div>

        {/* Masonry-like dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              whileHover={{ y: idx === 1 ? 24 : -8 }}
              key={project.id}
              className={`group relative overflow-hidden bg-white border border-gold/10 shadow-[0_10px_35px_rgba(0,0,0,0.01)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.03)] hover:border-gold/20 rounded-2xl transition-all duration-500 ${
                idx === 1 ? 'md:translate-y-8' : '' // architectural offsets
              }`}
            >
              <Link href={`/projects/${project.slug}`} className="block relative aspect-[4/5] overflow-hidden rounded-2xl">
                <SafeImage
                  src={project.hero_image}
                  alt={project.name}
                  fill
                  sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                />
                
                {/* Custom Glassmorphism Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-[12px] uppercase tracking-[0.2em] text-white/80 mb-1.5 font-medium">{project.category}</span>
                  <h3 className="text-xl font-light text-white tracking-wide mb-1">{project.name}</h3>
                  <span className="text-[10px] text-white/50 tracking-wider font-light mb-4">{project.location}</span>
                  
                  {/* Slide-in Animated Arrow */}
                  <div className="flex items-center space-x-2 text-xs text-white/95 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span>View Project</span>
                    <ArrowUpRight size={14} className="translate-y-px" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. WHY CHOOSE US SECTION */}
      <section className="bg-dark-surface py-32 border-t border-b border-gold/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <span className="text-[10px] tracking-[0.3em] uppercase text-gold">{content.distinction_tag || 'The Distinction'}</span>
              <h2 className="text-3xl md:text-5xl font-light tracking-tight text-ivory leading-tight">
                {content.distinction_title || 'Our Philosophy of Craftsmanship'}
              </h2>
            </div>
            <p className="text-xs md:text-sm font-light text-ivory/70 leading-relaxed max-w-md">
              {content.distinction_text || 'At Ethereal Spaces, design goes far beyond selecting furnishings. We view environments as structural canvases that capture light, direct emotional pathways, and celebrate quiet luxury.'}
            </p>
            <div className="border-l border-gold/30 pl-6 space-y-1">
              <p className="text-xs text-champagne uppercase tracking-[0.25em] font-medium">{content.distinction_badge_title || 'Lighthouse Certified'}</p>
              <p className="text-[10px] text-ivory/40">{content.distinction_badge_desc || 'Clean code structures rendering under 120ms latency'}</p>
            </div>
          </motion.div>

          {/* Grid of Distinctive Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {content.why_choose_us.map((card, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.12 }}
                className="p-8 bg-white border border-gold/10 hover:border-gold/20 shadow-[0_10px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] rounded-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-full border border-gold/20 flex items-center justify-center mb-6 bg-dark-bg">
                    <span className="text-xs font-serif text-gold">{idx + 1}</span>
                  </div>
                  <h3 className="text-base font-light text-ivory tracking-wide mb-3">{card.title}</h3>
                  <p className="text-[11px] text-ivory/60 leading-relaxed font-light">{card.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DESIGN PROCESS TIMELINE */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-32 px-6 md:px-12 max-w-7xl mx-auto"
      >
        <div className="text-center space-y-4 mb-20">
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold">{content.methodology_tag || 'Methodology'}</span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-ivory">{content.methodology_title || 'The Creation Journey'}</h2>
        </div>

        {/* Stepper Header */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-16 relative">
          {content.design_process.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className="flex items-center space-x-2.5 focus:outline-none group relative py-2"
            >
              <div 
                className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] transition-colors duration-500 ${
                  activeStep === idx 
                    ? 'border-gold bg-gold text-dark-bg font-bold' 
                    : 'border-gold/30 text-gold/60 group-hover:border-gold/70 group-hover:text-gold'
                }`}
              >
                {step.step}
              </div>
              <span 
                className={`text-xs uppercase tracking-[0.15em] transition-colors duration-500 font-light ${
                  activeStep === idx ? 'text-ivory font-medium' : 'text-ivory/60 group-hover:text-gold'
                }`}
              >
                {step.title.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Stepper Body with AnimatePresence */}
        <div className="glass-panel p-8 md:p-16 rounded-2xl border border-gold/10 shadow-[0_15px_40px_rgba(0,0,0,0.015)] max-w-4xl mx-auto relative min-h-[260px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
            >
              <div className="md:col-span-3">
                <span className="text-5xl md:text-7xl font-serif text-gold/20 font-bold block mb-2">
                  0{content.design_process[activeStep].step}
                </span>
                <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium">Phase Details</span>
              </div>
              <div className="md:col-span-9 space-y-4">
                <h3 className="text-xl md:text-2xl font-light text-ivory tracking-wide">
                  {content.design_process[activeStep].title}
                </h3>
                <p className="text-xs md:text-sm font-light text-ivory/70 leading-relaxed">
                  {content.design_process[activeStep].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.section>

      {/* 5. PROJECT SHOWCASE SLIDER SECTION */}
      {projects.length > 0 && (
        <section className="bg-dark-surface py-32 border-t border-b border-gold/5 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-center space-y-12">
            <div className="space-y-4">
              <span className="text-[10px] tracking-[0.3em] uppercase text-gold">{content.showcase_tag || 'Showcase'}</span>
              <h2 className="text-2xl md:text-4xl font-light tracking-tight text-ivory">{content.showcase_title || 'Spaces of Serenity'}</h2>
            </div>

            {/* Slider Container Frame */}
            <div className="relative w-full max-w-5xl mx-auto aspect-[16/9] md:aspect-[21/9] rounded-2xl border border-gold/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.06)] bg-white">
              <AnimatePresence initial={false} custom={slideDirection} mode="popLayout">
                <motion.div
                  key={activeProject}
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 w-full h-full"
                >
                  <SafeImage
                    src={projects[activeProject].hero_image}
                    alt={projects[activeProject].name}
                    fill
                    sizes="(max-w-1024px) 100vw, 1024px"
                    className="object-cover"
                    priority
                  />
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Overlay text detail brief */}
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6 text-white text-left z-10">
                    <div className="space-y-2">
                      <span className="text-[12px] uppercase tracking-[0.25em] text-white/70 font-semibold">{projects[activeProject].category}</span>
                      <h3 className="text-xl md:text-3xl font-light tracking-wide">{projects[activeProject].name}</h3>
                      <p className="text-xs text-white/60 font-light">{projects[activeProject].location}</p>
                    </div>
                    <Link
                      href={`/projects/${projects[activeProject].slug}`}
                      className="px-6 py-3 bg-white text-black hover:bg-gold hover:text-dark-bg text-[10px] uppercase tracking-widest font-semibold rounded-lg transition-all duration-300 w-fit flex items-center space-x-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span>View Project</span>
                      <ArrowUpRight size={12} />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Dots and Arrows */}
            <div className="flex justify-center items-center space-x-6">
              <button 
                onClick={handlePrevProject}
                className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-gold/60 hover:text-gold hover:border-gold transition-all duration-300 bg-white shadow-sm cursor-pointer hover:scale-[1.05]"
                aria-label="Previous Project"
              >
                <ArrowLeft size={16} />
              </button>
              
              <div className="flex space-x-2">
                {projects.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSlideDirection(idx > activeProject ? 1 : -1);
                      setActiveProject(idx);
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      activeProject === idx ? 'bg-gold w-4' : 'bg-gold/20'
                    }`}
                  />
                ))}
              </div>

              <button 
                onClick={handleNextProject}
                className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-gold/60 hover:text-gold hover:border-gold transition-all duration-300 bg-white shadow-sm cursor-pointer hover:scale-[1.05]"
                aria-label="Next Project"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 6. IMMERSIVE CALL TO ACTION */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="relative py-40 overflow-hidden flex items-center justify-center"
      >
        {/* Background dark plaster imagery */}
        <div className="absolute inset-0 bg-dark-bg z-0 opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent z-0 animate-pulse" />

        <div className="relative z-10 text-center max-w-3xl px-6 space-y-8">
          <div className="space-y-4">
            <span className="text-[10px] tracking-[0.4em] uppercase text-gold block">{content.cta_tag || 'Consultation'}</span>
            <h2 className="text-3xl md:text-6xl font-light tracking-tight text-ivory">
              {content.cta_title}
            </h2>
          </div>
          <p className="text-xs md:text-sm font-light text-ivory/60 max-w-md mx-auto leading-relaxed">
            {content.cta_description || 'Let us arrange a personal alignment session to review your architectural canvas, timeline priorities, and aesthetic goals.'}
          </p>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-block"
          >
            <Link 
              href="/contact" 
              className="px-10 py-4.5 bg-ivory hover:bg-gold text-dark-bg font-medium text-xs uppercase tracking-[0.25em] transition-all duration-300 rounded-lg shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              {content.cta_button_text}
            </Link>
          </motion.div>
        </div>
      </motion.section>

    </div>
  );
}
