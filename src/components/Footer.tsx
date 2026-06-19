'use strict';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Phone, MapPin, Clock, ArrowUp } from 'lucide-react';
import { db, StudioSettings } from '@/lib/db';


export default function Footer() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<StudioSettings | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await db.getStudioSettings();
        setSettings(data);
      } catch (err) {
        console.error('Failed to load studio settings in footer:', err);
      }
    }
    loadSettings();
  }, []);

  // Hide footer completely on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <footer className="bg-dark-surface border-t border-gold/10 pt-20 pb-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Column */}
        <div className="space-y-6">
          <Link href="/" className="block w-fit">
            <img 
              src="/images/logo.png" 
              alt="Ethereal Spaces Logo" 
              className="h-14 w-auto object-contain invert brightness-[2]"
            />
          </Link>
          <p className="text-xs text-ivory/60 leading-relaxed max-w-xs font-light">
            {settings?.about_text || "We are passionate creators of extraordinary environments, dedicated to transforming spaces into timeless expressions of beauty, functionality, and personal style."}
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h4 className="text-xs uppercase tracking-[0.25em] text-gold font-medium">Navigation</h4>
          <ul className="space-y-3">
            {[
              { name: 'Home', path: '/' },
              { name: 'About Studio', path: '/about' },
              { name: 'Our Projects', path: '/projects' },
              { name: 'Design Services', path: '/services' },
              { name: 'Inspiration Gallery', path: '/gallery' },
              { name: 'Book Consultation', path: '/contact' }
            ].map((link) => (
              <li key={link.path}>
                <Link 
                  href={link.path} 
                  className="text-xs text-ivory/70 hover:text-gold transition-colors duration-300 font-light tracking-wider"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div className="space-y-6">
          <h4 className="text-xs uppercase tracking-[0.25em] text-gold font-medium">Studio Contact</h4>
          <ul className="space-y-4 text-xs text-ivory/70 font-light">
            <li className="flex items-start space-x-3">
              <MapPin size={14} className="text-gold mt-0.5 shrink-0" />
              <span>{settings?.address || "15 Avenue de la Paix, Geneva, Switzerland"}</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={14} className="text-gold shrink-0" />
              <span>{settings?.phone || "+41 22 730 4000"}</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail size={14} className="text-gold shrink-0" />
              <a href={`mailto:${settings?.email || "concierge@etherealspaces.com"}`} className="hover:text-gold transition-colors duration-300">
                {settings?.email || "concierge@etherealspaces.com"}
              </a>
            </li>
          </ul>
        </div>

        {/* Studio Hours */}
        <div className="space-y-6">
          <h4 className="text-xs uppercase tracking-[0.25em] text-gold font-medium">Opening Hours</h4>
          <ul className="space-y-4 text-xs text-ivory/70 font-light">
            <li className="flex items-start space-x-3">
              <Clock size={14} className="text-gold mt-0.5 shrink-0" />
              <div>
                <p>{settings?.hours_weekday || "Monday - Friday"}</p>
                <p className="text-ivory/50 mt-1">{settings?.hours_weekday_time || "09:00 AM - 06:00 PM"}</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <Clock size={14} className="text-gold mt-0.5 shrink-0" />
              <div>
                <p>{settings?.hours_weekend || "Saturday"}</p>
                <p className="text-ivory/50 mt-1">{settings?.hours_weekend_time || "10:00 AM - 04:00 PM (By Appt)"}</p>
              </div>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-gold/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-ivory/40 tracking-wider">
        <p>© {new Date().getFullYear()} Ethereal Spaces. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0 items-center">
          <a href="#" className="hover:text-gold transition-colors duration-300">Privacy Policy</a>
          <a href="#" className="hover:text-gold transition-colors duration-300">Terms of Service</a>
          <button 
            onClick={scrollToTop}
            className="flex items-center space-x-1.5 hover:text-gold transition-colors duration-300 border border-gold/10 hover:border-gold/30 px-3 py-1.5 rounded-full bg-dark-bg/50"
            aria-label="Scroll to top"
          >
            <span>Top</span>
            <ArrowUp size={10} />
          </button>
        </div>
      </div>
    </footer>
  );
}
