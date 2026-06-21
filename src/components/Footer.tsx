import React from 'react';
import { Coffee, Heart, Instagram, Globe, Twitter, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1C130F] border-t border-[#A67C52]/20 relative overflow-hidden pt-16 pb-8">
      <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #A67C52 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-[#A67C52]/20">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#A67C52]/20 border border-[#A67C52]/40 flex items-center justify-center" aria-hidden="true">
                <Coffee className="w-5 h-5 text-[#C4956A]" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-white">Brew & Bean</span>
                <span className="block text-xs text-gray-500 tracking-wide">Est. 2019</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Handcrafted coffee, warm community, and a space to slow down. Every cup served with intention.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" aria-label="Follow us on Instagram" className="w-10 h-10 rounded-full border border-[#A67C52]/30 flex items-center justify-center text-[#C4956A] hover:bg-[#A67C52]/20 hover:scale-110 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A67C52]">
                <Instagram className="w-4 h-4" aria-hidden="true" />
              </a>
              <a href="#" aria-label="Visit our website" className="w-10 h-10 rounded-full border border-[#A67C52]/30 flex items-center justify-center text-[#C4956A] hover:bg-[#A67C52]/20 hover:scale-110 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A67C52]">
                <Globe className="w-4 h-4" aria-hidden="true" />
              </a>
              <a href="#" aria-label="Follow us on Twitter" className="w-10 h-10 rounded-full border border-[#A67C52]/30 flex items-center justify-center text-[#C4956A] hover:bg-[#A67C52]/20 hover:scale-110 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A67C52]">
                <Twitter className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold text-white mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Our Story', href: '#about' },
                { label: 'Menu', href: '#menu' },
                { label: 'Gallery', href: '#gallery' },
                { label: 'Location', href: '#location' },
              ].map(link => (
                <li key={link.href}>
                  <a href={link.href} className="text-gray-400 hover:text-[#C4956A] transition-colors duration-200 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A67C52] rounded">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold text-white mb-5">Hours</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Mon — Fri</span>
                <span className="text-gray-300">7:00 AM — 7:00 PM</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Saturday</span>
                <span className="text-gray-300">8:00 AM — 9:00 PM</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Sunday</span>
                <span className="text-gray-300">8:00 AM — 5:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-gray-500 text-xs">
            &copy; {year} Brew &amp; Bean Coffee Co. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <span className="text-gray-500 text-xs">Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#C4956A] mx-1" aria-label="love" />
            <span className="text-gray-500 text-xs">in Portland, OR</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
