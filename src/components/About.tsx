import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Coffee, Wheat, Users } from 'lucide-react';

const STATS = [
  { label: 'Coffee Origins', value: '12+', icon: Coffee },
  { label: 'Cups Served', value: '50K+', icon: Heart },
  { label: 'Hours Roasting', value: '200+', icon: Wheat },
  { label: 'Roasteries', value: '3', icon: Users },
];

export const About: React.FC = () => {
  return (
    <section id="about" className="py-28 bg-[#1C130F] relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#A67C52]/5 rounded-full blur-[150px] pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border border-[#A67C52]/20 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1498804103079-a6351b050096?w=960&q=80"
                alt="Barista carefully preparing a pour-over coffee with steam rising"
                loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C130F]/60 via-transparent to-transparent" aria-hidden="true" />
            </div>
            {/* Quote overlay */}
            <div className="absolute -bottom-6 -right-6 hidden sm:block">
              <div className="glass-card px-6 py-4 rounded-2xl max-w-[260px]">
                <p className="text-sm text-gray-300 font-instrument italic leading-relaxed">
                  "Coffee is our love language, served one cup at a time."
                </p>
                <p className="text-xs text-[#C4956A] mt-2 font-semibold tracking-wide">— Elena Vasquez, Head Roaster</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#A67C52]/30 bg-[#1C130F]/80 mb-6 text-[#C4956A] text-xs uppercase tracking-[0.25em] font-semibold">
              <Heart className="w-3.5 h-3.5" aria-hidden="true" /><span>Our Story</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              Crafting the Perfect{' '}
              <span className="warm-gradient-text">Experience</span>
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                What started as a shared dream between two friends roasting beans in a garage has grown into Portland&apos;s most beloved neighborhood coffee house. We source our beans directly from small farms across Ethiopia, Colombia, and Guatemala — building relationships that go far beyond fair trade.
              </p>
              <p>
                Every roast is a labor of love. Every drink is a ceremony. We believe coffee should be an experience — one that slows you down, wakes up your senses, and connects you to the people and places behind every sip.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-10">
              {STATS.map(stat => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="glass-card rounded-2xl p-5 text-center hover:border-[#A67C52]/40 transition-all duration-300">
                    <Icon className="w-6 h-6 text-[#C4956A] mx-auto mb-2" aria-hidden="true" />
                    <p className="text-2xl font-bold text-white font-serif">{stat.value}</p>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
