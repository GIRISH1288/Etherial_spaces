'use strict';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowUpRight, SlidersHorizontal } from 'lucide-react';
import { db, Project } from '@/lib/db';

const categories = ['All', 'Residential', 'Commercial', 'Luxury Villas', 'Apartments', 'Renovations'];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      const allProjects = await db.getProjects();
      setProjects(allProjects);
      setFilteredProjects(allProjects);
    }
    loadData();
  }, []);

  // Handle live filtering by category and search query
  useEffect(() => {
    let result = projects;

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.overview.toLowerCase().includes(query) ||
        p.materials.some(m => m.toLowerCase().includes(query))
      );
    }

    setFilteredProjects(result);
  }, [selectedCategory, searchQuery, projects]);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-dark-bg text-ivory">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header Title */}
        <div className="space-y-4 mb-16 text-center md:text-left">
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold block">Our Portfolios</span>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight">Curated Creations</h1>
          <p className="text-xs text-ivory/60 max-w-sm tracking-wide leading-relaxed font-light">
            Explore our collection of boutique physical canvases, each crafted to evoke peace, clarity, and structural beauty.
          </p>
        </div>

        {/* Filters and Search Bar Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-gold/10 pb-8 mb-12">
          
          {/* Category Filter Toggles */}
          <div className="flex flex-wrap items-center gap-2">
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

          {/* Search Box */}
          <div className="relative max-w-md w-full">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50" />
            <input
              type="text"
              placeholder="Search by name, stone, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-surface border border-gold/10 focus:border-gold focus:outline-none pl-12 pr-6 py-2.5 rounded-full text-xs text-ivory placeholder-ivory/40 tracking-wider transition-all"
            />
          </div>

        </div>

        {/* Masonry Layout Portfolio */}
        {filteredProjects.length === 0 ? (
          <div className="py-24 text-center border border-gold/5 rounded-sm bg-dark-surface/30">
            <p className="text-xs uppercase tracking-widest text-ivory/50">No matching projects found.</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => {
                // Alternating sizes for luxury architectural masonry look
                const isTall = idx % 3 === 1;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    key={project.id}
                    className={`group relative overflow-hidden bg-dark-surface border border-gold/5 rounded-sm ${
                      isTall ? 'md:row-span-2 aspect-[3/4]' : 'aspect-square md:aspect-[4/3] lg:aspect-square'
                    }`}
                  >
                    <Link href={`/projects/${project.slug}`} className="block relative w-full h-full">
                      <Image
                        src={project.hero_image}
                        alt={project.name}
                        fill
                        className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                      />
                      
                      {/* Hover Glass Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-500" />
                      
                      <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-[12px] uppercase tracking-[0.25em] text-white/80 mb-1 font-semibold">
                          {project.category}
                        </span>
                        <h3 className="text-lg md:text-xl font-light text-white tracking-wide mb-1">
                          {project.name}
                        </h3>
                        <span className="text-[10px] text-white/50 tracking-wider font-light mb-4">
                          {project.location}
                        </span>

                        <div className="flex items-center space-x-2 text-[10px] text-white/90 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <span>View Detail</span>
                          <ArrowUpRight size={12} />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </div>
  );
}
