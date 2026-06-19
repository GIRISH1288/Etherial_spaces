'use strict';
'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { db, FormField, StudioSettings } from '@/lib/db';

export default function ContactPage() {
  const [fields, setFields] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [settings, setSettings] = useState<StudioSettings | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [activeFields, studioSettings] = await Promise.all([
          db.getContactFormFields(),
          db.getStudioSettings()
        ]);
        setFields(activeFields);
        setSettings(studioSettings);
        
        // Pre-populate state
        const initialData: Record<string, string> = {};
        activeFields.forEach(f => {
          initialData[f.id] = f.field_type === 'select' && f.options.length > 0 ? f.options[0] : '';
        });
        setFormData(initialData);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      // Validate required fields
      for (const field of fields) {
        if (field.is_required && !formData[field.id]?.trim()) {
          throw new Error(`Please fill out the required field: ${field.label}`);
        }
      }

      // 1. Submit inquiry to local database
      await db.createInquiry(formData);

      // 2. Submit to API route for Email Lead Forwarding
      const apiResponse = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!apiResponse.ok) {
        const errData = await apiResponse.json();
        throw new Error(errData.error || 'Failed to forward lead via email');
      }

      // Trigger Confetti Celebration (Luxury Experience!)
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#C9A86A', '#D8C4A3', '#F5F1E8', '#121212']
      });

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-dark-bg text-ivory">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Contact Info & Blueprint Map */}
        <div className="lg:col-span-5 space-y-12">
          
          <div className="space-y-4">
            <span className="text-[10px] tracking-[0.3em] uppercase text-gold block font-semibold">Get In Touch</span>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight">Begin Your Journey</h1>
            <p className="text-xs text-ivory/60 leading-relaxed font-light">
              We look forward to hearing your architectural vision and spatial goals. Complete the form to start a dialogue.
            </p>
          </div>

          {/* Details list */}
          <ul className="space-y-6 text-xs text-ivory/70 font-light">
            <li className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full border border-gold/15 flex items-center justify-center text-gold shrink-0 bg-dark-surface">
                <MapPin size={14} />
              </div>
              <div className="space-y-1 pt-1">
                <p className="text-ivory font-medium">Headquarters</p>
                <p>{settings?.address || "15 Avenue de la Paix, Geneva, Switzerland"}</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full border border-gold/15 flex items-center justify-center text-gold shrink-0 bg-dark-surface">
                <Phone size={14} />
              </div>
              <div className="space-y-1 pt-1">
                <p className="text-ivory font-medium">Phone Number</p>
                <p>{settings?.phone || "+41 22 730 4000"}</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full border border-gold/15 flex items-center justify-center text-gold shrink-0 bg-dark-surface">
                <Mail size={14} />
              </div>
              <div className="space-y-1 pt-1">
                <p className="text-ivory font-medium">Email Address</p>
                <a href={`mailto:${settings?.email || "concierge@etherealspaces.com"}`} className="hover:text-gold transition-colors duration-300">
                  {settings?.email || "concierge@etherealspaces.com"}
                </a>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full border border-gold/15 flex items-center justify-center text-gold shrink-0 bg-dark-surface">
                <Clock size={14} />
              </div>
              <div className="space-y-1 pt-1">
                <p className="text-ivory font-medium">Business Hours</p>
                <p>{settings?.hours_weekday || "Mon - Fri"}: {settings?.hours_weekday_time || "09:00 AM - 06:00 PM"}</p>
                <p className="text-ivory/40">{settings?.hours_weekend || "Sat"}: {settings?.hours_weekend_time || "10:00 AM - 04:00 PM (By Appointment)"}</p>
              </div>
            </li>
          </ul>

          {/* Blueprint Map Component (Light Architectural Placeholder) */}
          <div className="border border-gold/10 rounded-sm bg-dark-surface/40 aspect-video w-full p-6 relative overflow-hidden flex items-center justify-center group">
            {/* Grid pattern background mimicking blueprint paper */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(0,0,0,0.02)_1px,_transparent_1px)] bg-[size:20px_20px] opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-br from-dark-bg/10 via-transparent to-dark-bg/40" />

            <div className="relative z-10 text-center space-y-3">
              <div className="w-1.5 h-1.5 bg-gold rounded-full mx-auto animate-ping" />
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold font-medium">Map Coordinates</p>
              <p className="text-[12px] font-mono text-ivory/40">46.2044° N, 6.1432° E — Geneva, CH</p>
            </div>
            
            {/* Decorative blueprint border marks */}
            <div className="absolute top-2 left-2 border-t border-l border-gold/20 w-3 h-3" />
            <div className="absolute top-2 right-2 border-t border-r border-gold/20 w-3 h-3" />
            <div className="absolute bottom-2 left-2 border-b border-l border-gold/20 w-3 h-3" />
            <div className="absolute bottom-2 right-2 border-b border-r border-gold/20 w-3 h-3" />
          </div>

        </div>

        {/* Dynamic Inquiry Form Card */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-8 md:p-12 rounded-sm border border-gold/10 relative overflow-hidden">
            
            {submitted ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 rounded-full border border-gold flex items-center justify-center text-gold mx-auto bg-dark-bg">
                  <CheckCircle size={32} strokeWidth={1} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-light text-ivory">Thank You</h3>
                  <p className="text-xs text-champagne uppercase tracking-widest font-medium">Inquiry Captured Successfully</p>
                </div>
                <p className="text-xs text-ivory/60 max-w-sm mx-auto leading-relaxed font-light">
                  Our concierge will review your spatial data and contact you within 24 business hours to arrange an initial design consultation.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 border border-gold/30 hover:border-gold text-gold hover:text-dark-bg hover:bg-gold text-[10px] uppercase tracking-widest font-semibold transition-all duration-300 rounded-sm"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-gold/10 pb-4 mb-4">
                  <h3 className="text-xs uppercase tracking-[0.25em] text-gold font-medium">Project Questionnaire</h3>
                  <p className="text-[10px] text-ivory/40">Please complete all fields to help us prepare your brief</p>
                </div>

                {loading ? (
                  // Loading skeletons
                  <div className="space-y-6">
                    {[1, 2, 3, 4].map(n => (
                      <div key={n} className="space-y-2">
                        <div className="h-3 w-24 bg-gold/10 rounded animate-pulse" />
                        <div className="h-10 w-full bg-dark-surface/40 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Render fields dynamically */}
                    {fields.map((field) => (
                      <div key={field.id} className="space-y-2 flex flex-col">
                        <label 
                          htmlFor={field.id} 
                          className="text-[10px] uppercase tracking-[0.2em] text-ivory/80 flex items-center justify-between"
                        >
                          <span>{field.label}</span>
                          {field.is_required && <span className="text-gold text-xs">*</span>}
                        </label>

                        {field.field_type === 'textarea' ? (
                          <textarea
                            id={field.id}
                            required={field.is_required}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            rows={5}
                            placeholder={`Describe your vision for this ${field.id === 'message' ? 'project' : field.label.toLowerCase()}`}
                            className="w-full bg-dark-bg/60 border border-gold/15 focus:border-gold focus:outline-none p-4 text-xs text-ivory placeholder-ivory/20 rounded-sm transition-all resize-none leading-relaxed"
                          />
                        ) : field.field_type === 'select' ? (
                          <select
                            id={field.id}
                            required={field.is_required}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            className="w-full bg-dark-bg/60 border border-gold/15 focus:border-gold focus:outline-none px-4 py-3 text-xs text-ivory rounded-sm transition-all"
                          >
                            {field.options.map((opt, i) => (
                              <option key={i} value={opt} className="bg-dark-surface text-ivory py-2">
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            id={field.id}
                            type={field.field_type}
                            required={field.is_required}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            placeholder={field.is_required ? '(Required)' : ''}
                            className="w-full bg-dark-bg/60 border border-gold/15 focus:border-gold focus:outline-none px-4 py-3 text-xs text-ivory placeholder-ivory/20 rounded-sm transition-all"
                          />
                        )}
                      </div>
                    ))}

                    {errorMsg && (
                      <p className="text-[11px] text-red-400 font-light tracking-wide">{errorMsg}</p>
                    )}

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 bg-gold hover:bg-champagne disabled:bg-gold/40 text-dark-bg disabled:text-dark-bg/60 font-semibold text-xs uppercase tracking-[0.25em] transition-all duration-500 rounded-sm flex items-center justify-center space-x-2"
                      >
                        {submitting ? (
                          <>
                            <span className="w-3.5 h-3.5 border border-dark-bg border-t-transparent rounded-full animate-spin" />
                            <span>Submitting brief...</span>
                          </>
                        ) : (
                          <>
                            <Send size={12} className="translate-y-px" />
                            <span>Submit Project Inquiry</span>
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
