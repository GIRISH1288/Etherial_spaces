'use strict';
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Services', path: '/services' },
  { name: 'Contact', path: '/contact' }
];

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Hide header completely on admin panel routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'py-4 glass-panel-heavy shadow-xl border-b border-gold/10' 
          : 'py-6 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Elegant Architectural Logo */}
        <Link href="/" className="flex items-center group">
          <img 
            src="/images/logo.png" 
            alt="Ethereal Spaces Logo" 
            className="h-12 w-auto object-contain invert brightness-[2] transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`text-xs uppercase tracking-[0.2em] transition-all duration-300 relative py-1 hover:text-gold ${
                  isActive ? 'text-gold' : 'text-ivory/80'
                }`}
              >
                {link.name}
                <span 
                  className={`absolute bottom-0 left-0 h-[1px] bg-gold transition-all duration-500 ${
                    isActive ? 'w-full' : 'w-0 hover:w-full'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-ivory hover:text-gold transition-colors duration-300"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 top-[72px] bg-dark-bg/95 z-40 md:hidden flex flex-col items-center justify-center space-y-8 transition-all duration-500 ease-in-out border-t border-gold/10 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none translate-x-full'
        }`}
      >
        {navLinks.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link
              key={link.path}
              href={link.path}
              className={`text-lg uppercase tracking-[0.25em] transition-colors duration-300 ${
                isActive ? 'text-gold' : 'text-ivory'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
