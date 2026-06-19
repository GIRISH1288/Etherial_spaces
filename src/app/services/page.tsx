'use strict';

import Link from 'next/link';
import { ArrowRight, PencilRuler, Layout, RefreshCw, Armchair, Lightbulb, ShieldCheck } from 'lucide-react';

const services = [
  {
    icon: PencilRuler,
    title: 'Interior Design',
    subtitle: 'Bespoke Architectural Styling',
    description: 'We develop comprehensive design schemes tailored to your unique signature, managing everything from initial spatial layouts to exact material and detailing selections.',
    details: ['Color Curation & Styling', 'Custom Joinery details', 'Finishing & Stone Sourcing', 'Furniture Curation']
  },
  {
    icon: Layout,
    title: 'Space Planning',
    subtitle: 'Structural Spatial Programming',
    description: 'Optimizing flow, sightlines, and natural light within your floor plan. We program structural dividers and openings to maximize spatial harmony and privacy.',
    details: ['Furniture Layout planning', 'Circulation analysis', 'Sightline mapping', 'Structural openings design']
  },
  {
    icon: RefreshCw,
    title: 'Renovation Design',
    subtitle: 'Historical & Structural Revitalizations',
    description: 'Breathing new life into existing spaces. We carefully blend modern spatial requirements and modular blocks with historical moldings and structural context.',
    details: ['Structural alterations', 'Moldings & Panel restorations', 'HVAC integration', 'Acoustic linings']
  },
  {
    icon: Armchair,
    title: 'Furniture Selection',
    subtitle: 'Bespoke Procurement & Curation',
    description: 'Sourcing and designing custom furniture collections. We collaborate with high-end Italian and Scandinavian craftsmen to construct low-profile luxury items.',
    details: ['Custom upholstery specs', 'Craftsmen collaborations', 'Global logistics & Delivery', 'Styling positioning']
  },
  {
    icon: Lightbulb,
    title: 'Lighting Design',
    subtitle: 'Atmospheric Luminescence',
    description: 'Lighting is the invisible architecture. We map out discrete recessed details, cove lighting channels, and hand-forged feature fixtures to set the emotional threshold.',
    details: ['Cove & Recess layouts', 'Lumen calculations', 'Dimming circuit setup', 'Feature fixture curation']
  },
  {
    icon: ShieldCheck,
    title: 'Turnkey Solutions',
    subtitle: 'End-to-End Management',
    description: 'A complete hand-over service. We coordinate site operations, manage schedules, and curate finishing accessories, allowing you to walk into a complete home.',
    details: ['Site coordination', 'Timeline management', 'Contractor oversight', 'Full decorative styling']
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-dark-bg text-ivory">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Title */}
        <div className="space-y-4 mb-20 text-center md:text-left">
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold block">Our Expertise</span>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight">Design Services</h1>
          <p className="text-xs text-ivory/60 max-w-sm tracking-wide leading-relaxed font-light">
            Bespoke design solutions built on structural clarity, material integrity, and comprehensive site execution.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div 
                key={idx}
                className="p-8 bg-white border border-gold/10 hover:border-gold/20 shadow-[0_10px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] rounded-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div className="space-y-6">
                  {/* Icon Panel */}
                  <div className="w-12 h-12 rounded-xl border border-gold/10 bg-dark-surface flex items-center justify-center text-ivory group-hover:bg-ivory group-hover:text-dark-bg transition-all duration-500">
                    <Icon size={20} strokeWidth={1.2} />
                  </div>
                  
                  {/* Titles */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-light tracking-wide text-ivory transition-colors duration-300">
                      {srv.title}
                    </h3>
                    <p className="text-[10px] uppercase tracking-wider text-champagne font-medium">
                      {srv.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-ivory/60 leading-relaxed font-light">
                    {srv.description}
                  </p>

                  {/* Details Bullet List */}
                  <ul className="space-y-2 pt-2 border-t border-gold/5">
                    {srv.details.map((detail, idx2) => (
                      <li key={idx2} className="flex items-center space-x-2 text-[10px] text-ivory/60">
                        <span className="w-1 h-1 rounded-full bg-gold" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Consultation Link */}
                <div className="pt-8 mt-4">
                  <Link 
                    href="/contact" 
                    className="inline-flex items-center space-x-1 text-[10px] uppercase tracking-widest text-ivory/80 hover:text-ivory border-b border-ivory/10 hover:border-ivory pb-0.5 transition-all duration-300 font-medium group/link"
                  >
                    <span>Request Details</span>
                    <ArrowRight size={10} className="ml-1 group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Immersive bottom highlight banner */}
        <div className="mt-24 p-12 md:p-20 border border-gold/10 bg-white shadow-[0_15px_40px_rgba(0,0,0,0.02)] text-center rounded-2xl space-y-6">
          <h2 className="text-xl md:text-3xl font-light tracking-wide text-ivory">Seeking a Unique Curation?</h2>
          <p className="text-xs text-ivory/60 max-w-md mx-auto leading-relaxed font-light">
            We collaborate on custom material sourcing campaigns and structural layout consulting globally. Connect with our concierge to discuss.
          </p>
          <div className="pt-4">
            <Link 
              href="/contact" 
              className="px-8 py-4 bg-ivory hover:bg-gold text-dark-bg text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 rounded-lg hover:scale-[1.02] active:scale-[0.98] inline-block"
            >
              Book Consultation
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
