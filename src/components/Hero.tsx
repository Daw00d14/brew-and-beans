import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, MapPin, ChevronRight } from 'lucide-react';

interface HeroProps {
  onBookClick: () => void;
  onMenuClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookClick, onMenuClick }) => {
  return (
    <section id="home" className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-[#1C130F]">
      {/* Background image with warm overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1920&q=80"
          alt="Coffee shop interior with warm lighting and wooden counter"
          className="w-full h-full object-cover object-center brightness-[0.4] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C130F]/90 via-[#1C130F]/60 to-[#1C130F]/80" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C130F] via-transparent to-[#1C130F]/30" aria-hidden="true" />
      </div>

      {/* Steam effects */}
      <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-white/5 blur-3xl steam pointer-events-none" aria-hidden="true" />
      <div className="absolute top-1/4 right-1/3 w-40 h-40 rounded-full bg-[#C4956A]/10 blur-3xl steam-delayed pointer-events-none" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#A67C52]/40 bg-[#1C130F]/70 backdrop-blur-md mb-8"
        >
          <Coffee className="w-4 h-4 text-[#C4956A]" aria-hidden="true" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#C4956A] font-semibold">
            Artisan Coffee Since 2019
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white mb-6 leading-[1.05]"
        >
          <span className="warm-gradient-text">Brew & Bean</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed mb-12 font-instrument italic"
        >
          Where every cup tells a story — hand-selected beans, masterfully roasted, brewed with intention.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center gap-5"
        >
          <button onClick={onBookClick}
            className="px-8 py-4 rounded-full bg-[#A67C52] text-[#1C130F] font-bold text-base tracking-wide flex items-center gap-3 shadow-[0_0_30px_rgba(166,124,82,0.4)] hover:shadow-[0_0_50px_rgba(166,124,82,0.6)] hover:scale-105 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
            <Coffee className="w-5 h-5" aria-hidden="true" />
            <span>Reserve a Table</span>
          </button>
          <button onClick={onMenuClick}
            className="px-8 py-4 rounded-full border border-[#A67C52]/60 text-[#C4956A] font-semibold text-base flex items-center gap-2 hover:bg-[#A67C52]/10 hover:scale-105 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C4956A]"
            >
            <span>View Menu</span>
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </motion.div>
      </div>

      {/* Location badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-8 z-10 hidden sm:block"
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C130F]/70 backdrop-blur-md border border-[#A67C52]/20">
          <MapPin className="w-4 h-4 text-[#C4956A]" aria-hidden="true" />
          <span className="text-xs text-gray-300 font-medium">Portland, OR — Pearl District</span>
        </div>
      </motion.div>
    </section>
  );
};
