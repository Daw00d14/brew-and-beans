import React, { useState, useEffect } from 'react';
import { Menu, X, Coffee } from 'lucide-react';

interface NavbarProps {
  onBookClick: () => void;
}

const NAV_LINKS = [
  { name: 'Home', href: '#home' },
  { name: 'Story', href: '#about' },
  { name: 'Menu', href: '#menu' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Visit', href: '#location' },
];

export const Navbar: React.FC<NavbarProps> = ({ onBookClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on Escape (WCAG 2.1.2)
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'glass-nav py-3' : 'bg-transparent py-5'
        }`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <a href="#home" onClick={e => { e.preventDefault(); scrollTo('#home'); }}
             className="flex items-center gap-3 group" aria-label="Brew & Bean - Go to home">
            <div className="relative w-11 h-11 rounded-full bg-[#A67C52]/20 border border-[#A67C52]/50 flex items-center justify-center group-hover:bg-[#A67C52]/30 transition-colors">
              <Coffee className="w-5 h-5 text-[#C4956A]" aria-hidden="true" />
            </div>
            <div>
              <span className="font-serif text-lg sm:text-xl font-bold text-[#F5F0EB]">Brew & Bean</span>
              <span className="hidden sm:block text-[10px] tracking-[0.25em] uppercase text-[#A67C52] font-medium">Artisan Coffee House</span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {NAV_LINKS.map(link => (
              <a key={link.name} href={link.href}
                 onClick={e => { e.preventDefault(); scrollTo(link.href); }}
                 className="relative py-2 text-sm font-medium text-gray-300 hover:text-[#C4956A] transition-colors group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C4956A]">
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#C4956A] transition-all group-hover:w-full" aria-hidden="true" />
              </a>
            ))}
          </nav>

          <button onClick={onBookClick}
            className="hidden lg:inline-flex px-5 py-2.5 rounded-full bg-[#A67C52] text-[#1C130F] text-sm font-semibold hover:bg-[#C4956A] transition-all shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            style={{ minHeight: '44px', minWidth: '44px' }}>
            Reserve a Table
          </button>

          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2.5 rounded-lg border border-[#A67C52]/40 text-[#C4956A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            style={{ minHeight: '44px', minWidth: '44px' }}>
            {mobileOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#1C130F]/95 backdrop-blur-xl md:hidden flex flex-col pt-28 px-6 pb-8"
          role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="flex flex-col gap-6 text-center" role="navigation" aria-label="Mobile navigation">
            {NAV_LINKS.map(link => (
              <a key={link.name} href={link.href}
                 onClick={e => { e.preventDefault(); scrollTo(link.href); }}
                 className="font-serif text-2xl text-gray-200 hover:text-[#C4956A] transition-colors py-3 border-b border-[#A67C52]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C4956A]">
                {link.name}
              </a>
            ))}
            <button onClick={() => { setMobileOpen(false); onBookClick(); }}
              className="w-full py-4 rounded-full bg-[#A67C52] text-[#1C130F] font-bold text-lg mt-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              style={{ minHeight: '44px' }}>
              Reserve a Table
            </button>
          </div>
        </div>
      )}
    </>
  );
};
