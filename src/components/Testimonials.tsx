import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TESTIMONIALS } from '../data/coffeeData';
import { Star, Quote, ChevronLeft, ChevronRight, Pause, Play, MessageCircle } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);

  const toggleAuto = useCallback(() => setAuto(p => !p), []);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setIdx(p => (p + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(t);
  }, [auto]);

  const r = TESTIMONIALS[idx];

  return (
    <section id="testimonials" className="py-28 bg-gradient-to-b from-[#1C130F] via-[#281C16] to-[#1C130F] relative overflow-hidden"
      aria-label="Customer Testimonials"
      aria-roledescription="carousel"
    >
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#A67C52]/5 rounded-full blur-[180px] pointer-events-none" aria-hidden="true" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#A67C52]/30 bg-[#1C130F]/80 mb-6 text-[#C4956A] text-xs uppercase tracking-[0.25em] font-semibold">
          <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
          <span>What Our Guests Say</span>
        </div>

        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
          Words from the{' '}
          <span className="warm-gradient-text">Community</span>
        </h2>
        <p className="text-gray-400 text-lg mb-16 max-w-xl mx-auto">
          Real stories from the people who make our coffee shop feel like home.
        </p>

        {/* Live region for screen readers */}
        <div aria-live="polite" aria-atomic="true">
          <AnimatePresence mode="wait">
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <Quote className="w-10 h-10 text-[#A67C52]/40 mx-auto mb-6" aria-hidden="true" />

              <blockquote className="text-xl sm:text-2xl md:text-3xl text-gray-200 font-light leading-relaxed mb-8 max-w-3xl mx-auto font-instrument italic">
                &ldquo;{r.quote}&rdquo;
              </blockquote>

              <div className="flex items-center justify-center gap-4">
                <img
                  src={r.avatar}
                  alt={r.name}
                  loading="lazy"
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#A67C52]/40"
                />
                <div className="text-left">
                  <cite className="not-italic text-white font-semibold text-base block">{r.name}</cite>
                  <span className="text-gray-400 text-sm">{r.role}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1 mt-4" role="img" aria-label={`Rating: ${r.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < r.rating ? 'text-[#C4956A] fill-[#C4956A]' : 'text-gray-600'}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4" role="group" aria-label="Testimonial controls">
          <button
            onClick={() => { setAuto(false); setIdx(p => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length); }}
            className="w-12 h-12 rounded-full border border-[#A67C52]/30 flex items-center justify-center text-[#C4956A] hover:bg-[#A67C52]/10 hover:scale-105 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A67C52]"
            aria-label="Previous testimonial"
            disabled={TESTIMONIALS.length <= 1}
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Pagination dots */}
          <div className="flex items-center gap-2" role="tablist" aria-label="Select testimonial">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.id}
                onClick={() => { setAuto(false); setIdx(i); }}
                className={`w-6 h-6 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A67C52] ${
                  i === idx ? 'bg-[#C4956A] ring-2 ring-[#C4956A]/50 ring-offset-2 ring-offset-[#1C130F] scale-110' : 'bg-[#A67C52]/30 hover:bg-[#A67C52]/50'
                }`}
                role="tab"
                aria-selected={i === idx}
                aria-label={`Testimonial ${i + 1} of ${TESTIMONIALS.length}: ${t.name}`}
              />
            ))}
          </div>

          <button
            onClick={() => { setAuto(false); setIdx(p => (p + 1) % TESTIMONIALS.length); }}
            className="w-12 h-12 rounded-full border border-[#A67C52]/30 flex items-center justify-center text-[#C4956A] hover:bg-[#A67C52]/10 hover:scale-105 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A67C52]"
            aria-label="Next testimonial"
            disabled={TESTIMONIALS.length <= 1}
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>

          <button
            onClick={toggleAuto}
            className="w-12 h-12 rounded-full border border-[#A67C52]/30 flex items-center justify-center text-[#C4956A] hover:bg-[#A67C52]/10 hover:scale-105 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A67C52]"
            aria-label={auto ? 'Pause auto-rotation' : 'Resume auto-rotation'}
          >
            {auto ? <Pause className="w-4 h-4" aria-hidden="true" /> : <Play className="w-4 h-4" aria-hidden="true" />}
          </button>
        </div>

        {!auto && (
          <p className="text-gray-500 text-xs mt-4">Auto-play paused. Click <Play className="w-3 h-3 inline-block" aria-hidden="true" /> to resume.</p>
        )}
      </div>
    </section>
  );
};
