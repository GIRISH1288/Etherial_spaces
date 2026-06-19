'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { db } from '@/lib/db';

export default function AutoContactPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Check localStorage if already dismissed
    const dismissed = localStorage.getItem('ethereal_contact_popup_dismissed');
    if (dismissed === 'true') return;

    // Trigger popup after a 6-second delay
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('ethereal_contact_popup_dismissed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill out all fields.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      // 1. Submit inquiry to local database (matches contact page behavior)
      await db.createInquiry({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        source: 'Auto Contact Popup'
      });

      // 2. Submit to API route for Email Lead Forwarding
      const apiResponse = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          source: 'Auto Contact Popup'
        })
      });

      if (!apiResponse.ok) {
        const errData = await apiResponse.json();
        throw new Error(errData.error || 'Failed to forward lead via email');
      }

      // Luxury success celebration
      confetti({
        particleCount: 50,
        spread: 45,
        origin: { x: 0.9, y: 0.9 }, // Originating from the bottom right where popup is
        colors: ['#C5A265', '#FAF9F5', '#1C1B1A']
      });

      setSubmitted(true);
      localStorage.setItem('ethereal_contact_popup_dismissed', 'true');

      // Dismiss popup after showing success state
      setTimeout(() => {
        setIsOpen(false);
      }, 3500);

    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 right-4 left-4 md:left-auto md:bottom-8 md:right-8 z-40 max-w-sm p-6 glass-panel-heavy rounded-2xl shadow-2xl border border-gold/15 text-ivory"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-dark-bg/40 hover:bg-dark-bg/80 border border-gold/10 flex items-center justify-center text-ivory/60 hover:text-ivory transition-colors duration-300 cursor-pointer"
            aria-label="Close popup"
          >
            <X size={14} />
          </button>

          {/* Accent decoration */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 rounded-full border border-gold/20 flex items-center justify-center bg-gold/10">
              <Sparkles size={14} className="text-gold" />
            </div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-gold font-semibold">
              Bespoke Service
            </span>
          </div>

          {/* Form / Success Screen */}
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center text-gold mx-auto bg-dark-bg">
                <CheckCircle size={24} strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-light text-ivory">Thank You</h3>
                <p className="text-[10px] text-gold uppercase tracking-widest font-medium">Inquiry Captured</p>
              </div>
              <p className="text-[11px] text-ivory/60 leading-relaxed font-light max-w-xs mx-auto">
                Our concierge will review your details and contact you within 24 business hours to arrange a design consultation.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-light tracking-wide font-serif text-ivory">
                  Curate Your Space
                </h3>
                <p className="text-[11px] font-light leading-relaxed text-champagne">
                  Schedule a private alignment session to review your architectural canvas, timeline, and goals.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-dark-bg/60 border border-gold/15 focus:border-gold focus:outline-none px-3 py-2 text-xs text-ivory placeholder-ivory/20 rounded-lg transition-all"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-dark-bg/60 border border-gold/15 focus:border-gold focus:outline-none px-3 py-2 text-xs text-ivory placeholder-ivory/20 rounded-lg transition-all"
                  />
                </div>
                <div>
                  <textarea
                    required
                    placeholder="Briefly describe your vision"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    rows={3}
                    className="w-full bg-dark-bg/60 border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory placeholder-ivory/20 rounded-lg transition-all resize-none leading-relaxed"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-[10px] text-red-400 font-light tracking-wide">{errorMsg}</p>
              )}

              {/* Action buttons */}
              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-gold hover:bg-gold/90 disabled:bg-gold/40 text-dark-bg disabled:text-dark-bg/60 font-semibold text-[10px] uppercase tracking-widest text-center transition-all duration-300 rounded-lg shadow-sm hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <span className="w-3 h-3 border border-dark-bg border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={10} />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-3 py-2.5 border border-gold/10 hover:border-gold/30 text-ivory/60 hover:text-ivory text-[10px] uppercase tracking-widest transition-colors duration-300 rounded-lg cursor-pointer"
                >
                  Later
                </button>
              </div>
            </form>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
