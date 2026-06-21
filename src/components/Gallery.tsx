import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GALLERY_IMAGES, GalleryItem } from '../data/coffeeData';
import { Maximize2, X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

export const Gallery: React.FC = () => {
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [index, setIndex] = useState(0);

  const open = (item: GalleryItem, i: number) => { setSelected(item); setIndex(i); };
  const close = useCallback(() => { setSelected(null); }, []);

  const next = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.stopPropagation();
    const i = (index + 1) % GALLERY_IMAGES.length;
    setIndex(i); setSelected(GALLERY_IMAGES[i]);
  };
  const prev = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.stopPropagation();
    const i = (index - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
    setIndex(i); setSelected(GALLERY_IMAGES[i]);
  };

  // Focus trap + Escape key for lightbox (WCAG 2.1.2, 2.4.3)
  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [selected, index, close]);

  return (
    <section id="gallery" aria-labelledby="gallery-heading" className="py-28 bg-[#1C130F] relative overflow-hidden">
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#A67C52]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#A67C52]/30 bg-[#281C16] mb-4 text-[#C4956A] text-xs uppercase tracking-[0.25em] font-semibold">
            <Camera className="w-3.5 h-3.5" aria-hidden="true" /><span>The Atmosphere</span>
          </motion.div>
          <motion.h2 id="gallery-heading" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            A Visual <span className="warm-gradient-text">Journey</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[250px]">
          {GALLERY_IMAGES.map((item, idx) => (
            <button key={item.id}
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => open(item, idx)}
              onKeyDown={(e) => e.key === 'Enter' && open(item, idx)}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer border border-[#A67C52]/15 hover:border-[#A67C52]/60 shadow-xl transition-all duration-500 bg-[#281C16] ${item.span} text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C4956A]`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C130F] via-transparent to-black/20 z-10 opacity-60 group-hover:opacity-30 transition-opacity" />
              <img src={item.image} alt={item.title} loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1 rounded-full bg-[#281C16]/80 backdrop-blur-md border border-[#A67C52]/30 text-[#C4956A] text-[10px] font-semibold uppercase tracking-widest">{item.category}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 z-20 bg-gradient-to-t from-[#1C130F] to-transparent">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-white">{item.title}</h3>
                  <Maximize2 className="w-4 h-4 text-[#C4956A] opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={`Lightbox: ${selected.title}`}
            className="fixed inset-0 z-50 bg-[#1C130F]/95 backdrop-blur-2xl flex items-center justify-center p-4"
          >
            <button onClick={close}
              aria-label="Close lightbox"
              className="absolute top-6 right-6 z-50 p-3 rounded-full bg-[#281C16] border border-[#A67C52]/30 text-[#C4956A] hover:bg-[#A67C52] hover:text-[#1C130F] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <X className="w-6 h-6" aria-hidden="true" />
            </button>
            <button onClick={prev}
              aria-label="Previous image"
              className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-[#281C16] border border-[#A67C52]/30 text-[#C4956A] hover:bg-[#A67C52] hover:text-[#1C130F] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <ChevronLeft className="w-6 h-6" aria-hidden="true" />
            </button>
            <button onClick={next}
              aria-label="Next image"
              className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-[#281C16] border border-[#A67C52]/30 text-[#C4956A] hover:bg-[#A67C52] hover:text-[#1C130F] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <ChevronRight className="w-6 h-6" aria-hidden="true" />
            </button>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[85vh] bg-[#281C16] border border-[#A67C52]/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
              <div className="relative flex-1 min-h-[300px] sm:min-h-[500px] bg-[#1C130F]">
                <img src={selected.image} alt={selected.title} loading="lazy" className="w-full h-full object-cover max-h-[70vh]" />
              </div>
              <div className="p-6 bg-[#281C16] border-t border-[#A67C52]/20 flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-white">{selected.title}</h3>
                <span className="text-xs text-[#C4956A] font-medium" aria-live="polite">{index + 1} of {GALLERY_IMAGES.length}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
