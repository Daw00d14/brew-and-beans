import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Calendar, ExternalLink } from 'lucide-react';

export const Location: React.FC = () => {
  return (
    <section id="location" className="py-28 bg-[#1C130F] relative overflow-hidden">
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#A67C52]/5 rounded-full blur-[180px] pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#A67C52]/30 bg-[#1C130F]/80 mb-6 text-[#C4956A] text-xs uppercase tracking-[0.25em] font-semibold">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" /><span>Visit Us</span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              Find Your{' '}
              <span className="warm-gradient-text">Perfect Cup</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-10">
              Nestled in the heart of Portland&apos;s historic Pearl District, our doors are always open — whether you need a quiet corner to read, a spot to catch up with friends, or your morning ritual to-go.
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#A67C52]/20 border border-[#A67C52]/20 flex items-center justify-center shrink-0" aria-hidden="true">
                  <MapPin className="w-5 h-5 text-[#C4956A]" />
                </div>
                <div>
                  <p className="text-white font-semibold">Address</p>
                  <p className="text-gray-400 text-sm mt-0.5">245 NW 12th Avenue, Portland, OR 97209</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#A67C52]/20 border border-[#A67C52]/20 flex items-center justify-center shrink-0" aria-hidden="true">
                  <Clock className="w-5 h-5 text-[#C4956A]" />
                </div>
                <div>
                  <p className="text-white font-semibold">Hours</p>
                  <div className="text-gray-400 text-sm mt-0.5 space-y-0.5">
                    <p>Mon — Fri: 7:00 AM — 7:00 PM</p>
                    <p>Saturday: 8:00 AM — 9:00 PM</p>
                    <p>Sunday: 8:00 AM — 5:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#A67C52]/20 border border-[#A67C52]/20 flex items-center justify-center shrink-0" aria-hidden="true">
                  <Phone className="w-5 h-5 text-[#C4956A]" />
                </div>
                <div>
                  <p className="text-white font-semibold">Contact</p>
                  <a href="tel:+15035551234" className="text-[#C4956A] text-sm mt-0.5 block hover:text-[#D4AF37] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A67C52] rounded">
                    (503) 555-1234
                  </a>
                  <a href="mailto:hello@brewandbean.com" className="text-gray-400 text-sm mt-0.5 block hover:text-[#C4956A] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A67C52] rounded">
                    hello@brewandbean.com
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <a
                href="https://maps.google.com/?q=245+NW+12th+Ave+Portland+OR+97209"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#A67C52] text-[#1C130F] font-bold text-sm hover:bg-[#C4956A] transition-all duration-300 shadow-[0_0_20px_rgba(166,124,82,0.3)] hover:shadow-[0_0_40px_rgba(166,124,82,0.5)] hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label="Open in Google Maps (opens in new tab)"
              >
                <MapPin className="w-4 h-4" aria-hidden="true" />
                <span>Get Directions</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
              <button
                onClick={() => document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#A67C52]/60 text-[#C4956A] font-semibold text-sm hover:bg-[#A67C52]/10 hover:scale-105 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C4956A]"
                aria-label="Book a table reservation"
              >
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <span>Reserve a Table</span>
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
            <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden border border-[#A67C52]/20 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1000&q=80"
                alt="Brew & Bean coffee shop interior with warm wooden tables and ambient lighting"
                loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C130F]/40 via-transparent to-transparent" aria-hidden="true" />
            </div>
            {/* Overlay card */}
            <div className="absolute -bottom-4 -left-4 right-4 sm:right-auto">
              <div className="glass-card px-5 py-4 rounded-2xl inline-block">
                <p className="text-xs uppercase tracking-widest text-[#C4956A] font-semibold">Free Wi-Fi</p>
                <p className="text-white text-sm mt-1">Ask our barista for the password</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
