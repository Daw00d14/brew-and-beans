import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MENU_ITEMS, CoffeeItem } from '../data/coffeeData';
import { Search, Coffee } from 'lucide-react';

interface MenuSectionProps {
  onOrderSelect: (item: CoffeeItem) => void;
}

const CATEGORIES = ['All', 'Espresso', 'Pour Over', 'Cold Brew', 'Signature', 'Pastries'] as const;

export const MenuSection: React.FC<MenuSectionProps> = ({ onOrderSelect }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = MENU_ITEMS.filter(item => {
    const matchCat = activeCategory === 'All' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section id="menu" aria-labelledby="menu-heading" className="py-28 bg-gradient-to-b from-[#1C130F] via-[#281C16] to-[#1C130F] relative overflow-hidden">
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#A67C52]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#A67C52]/30 bg-[#1C130F]/80 mb-4 text-[#C4956A] text-xs uppercase tracking-[0.25em] font-semibold"
          >
            <Coffee className="w-3.5 h-3.5" aria-hidden="true" />
            <span>The Menu</span>
          </motion.div>
          <motion.h2 id="menu-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Crafted <span className="warm-gradient-text">Elixirs</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gray-300 text-base sm:text-lg font-light font-instrument italic"
          >
            From the perfect espresso shot to our signature smoked creations — each drink is a labor of love.
          </motion.p>
        </div>

        {/* Search - WCAG: aria-label instead of placeholder-only */}
        <div className="max-w-md mx-auto mb-10">
          <label htmlFor="menu-search" className="sr-only">Search the menu</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A67C52]" aria-hidden="true" />
            <input id="menu-search" type="text" value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search the menu..."
              className="w-full pl-12 pr-4 py-3 bg-[#281C16]/80 border border-[#A67C52]/30 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-[#C4956A] focus:ring-1 focus:ring-[#C4956A]/40 text-sm"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-4 overflow-x-auto py-2 mb-12 no-scrollbar px-4 sm:px-2 scroll-px-4" role="tablist" aria-label="Filter menu by category">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              role="tab"
              aria-selected={activeCategory === cat}
              className={`px-5 py-2.5 rounded-full text-sm font-serif font-bold transition-all duration-300 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C4956A] ${
                activeCategory === cat
                  ? 'bg-[#A67C52] text-[#1C130F] shadow-lg scale-105'
                  : 'bg-[#281C16] text-gray-300 border border-[#A67C52]/30 hover:border-[#C4956A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="group flex bg-[#281C16]/80 border border-[#A67C52]/15 rounded-2xl overflow-hidden hover:border-[#A67C52]/50 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(166,124,82,0.15)]"
              >
                <div className="w-28 sm:w-36 h-28 sm:h-36 flex-shrink-0 overflow-hidden bg-[#1C130F]">
                  <img src={item.image} alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#C4956A] transition-colors">{item.name}</h3>
                      <span className="font-serif text-base font-bold text-[#C4956A] whitespace-nowrap">{item.price}</span>
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm font-light leading-relaxed mt-1.5">{item.description}</p>
                  </div>
                  <button onClick={() => onOrderSelect(item)}
                    aria-label={`Order ${item.name}`}
                    className="self-end mt-2 px-4 py-2 rounded-lg bg-[#A67C52]/10 hover:bg-[#A67C52] text-[#C4956A] hover:text-[#1C130F] text-xs font-bold uppercase tracking-wider transition-all duration-300 border border-[#A67C52]/30 hover:border-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C4956A]"
                    style={{ minHeight: '44px', minWidth: '44px' }}
                  >
                    Order
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
