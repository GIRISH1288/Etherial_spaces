'use strict';
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { db, TeamMember } from '@/lib/db';

export default function AboutPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    async function loadData() {
      const allTeam = await db.getTeamMembers();
      setTeam(allTeam);
    }
    loadData();
  }, []);

  return (
    <div className="relative pt-32 overflow-hidden bg-dark-bg">
      
      {/* 1. EDITORIAL STORY SECTION */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
        <div className="md:col-span-7 space-y-8">
          <div className="space-y-4">
            <span className="text-[10px] tracking-[0.3em] uppercase text-gold">Our Story</span>
            <h1 className="text-4xl md:text-6xl font-light tracking-tight text-ivory leading-[1.15]">
              Transcend Mere <span className="text-gold italic font-serif">Aesthetics</span>
            </h1>
          </div>
          <p className="text-xs md:text-sm font-light text-ivory/80 leading-relaxed max-w-xl">
            We are passionate creators of extraordinary environments, dedicated to transforming spaces into timeless expressions of beauty, functionality, and personal style. 
            Founded in Geneva, Ethereal Spaces emerged from a single, guiding belief: that architecture is not merely physical structure, but an emotional conduit.
          </p>
          <p className="text-xs md:text-sm font-light text-ivory/60 leading-relaxed max-w-xl">
            We listen, we understand, and we translate dreams into tangible realities that exceed expectations. Through meticulous attention to detail, innovative solutions, and an unwavering commitment to excellence, we create spaces that are not just beautiful, but truly meaningful.
          </p>
        </div>

        {/* Hero Studio Curation Image */}
        <div className="md:col-span-5 relative aspect-[3/4] border border-gold/10 p-2 rounded-sm bg-dark-surface">
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800"
              alt="Ethereal Spaces Design Office"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-40" />
          </div>
        </div>
      </section>

      {/* 2. FOUNDER MESSAGE SECTION */}
      <section className="py-24 border-t border-b border-gold/5 bg-dark-surface/40">
        <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-4 relative aspect-square max-w-[280px] mx-auto md:mx-0 overflow-hidden rounded-full border border-gold/20 p-1 bg-dark-bg">
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
                alt="Aria Thorne Founder"
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          <div className="md:col-span-8 space-y-6 text-center md:text-left">
            <span className="text-[12px] tracking-[0.25em] uppercase text-gold block">Founder Note</span>
            <p className="text-sm md:text-lg font-serif italic text-champagne/90 leading-relaxed font-light">
              "Great design does not yell; it hums. It sits quietly in the background, shaping the light, elevating the atmosphere, and making everyday rituals feel sacred."
            </p>
            <div className="space-y-1">
              <h4 className="text-xs uppercase tracking-[0.2em] text-ivory font-medium">Aria Thorne</h4>
              <p className="text-[10px] text-ivory/40">Creative Director & Founder, Ethereal Spaces</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VISION & PHILOSOPHY */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto text-center space-y-16">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold block">Philosophy</span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-ivory leading-tight">
            Connecting People to Their <span className="text-gold italic font-serif">Environment</span>
          </h2>
          <p className="text-xs md:text-sm font-light text-ivory/70 leading-relaxed max-w-xl mx-auto">
            Our approach is rooted in the understanding that every client is unique, with their own story to tell. We craft physical narratives that honor context, material honesty, and spatial harmony.
          </p>
        </div>

        {/* Vision Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { title: 'Architectural Elegance', desc: 'Prioritizing structural clarity, balanced lines, and continuous visual planes that align with site geography.' },
            { title: 'Material Honesty', desc: 'Utilizing raw veneers, genuine stone slabs, and sand-cast metals that age beautifully over decades.' },
            { title: 'Emotional Connection', desc: 'Crafting spatial atmospheres that immediately convey restfulness, privacy, and curated exclusivity.' }
          ].map((pillar, idx) => (
            <div key={idx} className="p-8 border border-gold/10 hover:border-gold/25 rounded-sm bg-dark-surface/50 transition-all duration-300">
              <span className="text-xs font-serif text-gold block mb-6">0{idx + 1}</span>
              <h3 className="text-base font-light text-ivory tracking-wide mb-3">{pillar.title}</h3>
              <p className="text-[11px] text-ivory/60 leading-relaxed font-light">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TEAM SECTION */}
      <section className="py-32 bg-dark-surface border-t border-gold/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="space-y-4 mb-20 text-center">
            <span className="text-[10px] tracking-[0.3em] uppercase text-gold">The Collective</span>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-ivory">Our Creative Minds</h2>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                key={member.id}
                className="group relative overflow-hidden aspect-[3/4] rounded-sm border border-gold/5 bg-dark-bg"
              >
                {/* Photo with subtle hover scale */}
                <Image
                  src={member.image_url}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Glassmorphic Info Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-60 group-hover:opacity-90 transition-all duration-500" />
                
                {/* Text reveal content */}
                <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 flex flex-col justify-end min-h-[50%]">
                  <span className="text-[12px] uppercase tracking-[0.15em] text-white/70 mb-1 font-medium">{member.designation}</span>
                  <h3 className="text-lg font-light text-white tracking-wider mb-3">{member.name}</h3>
                  <p className="text-[11px] text-white/60 leading-relaxed font-light opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                    {member.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
