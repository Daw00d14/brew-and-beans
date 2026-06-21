import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { MenuSection } from './components/MenuSection';
import { Gallery } from './components/Gallery';
import { Testimonials } from './components/Testimonials';
import { Location } from './components/Location';
import { ReservationForm } from './components/ReservationForm';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkRoute = () => {
      setIsAdmin(window.location.hash === '#admin' || window.location.pathname === '/admin');
    };
    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    return () => window.removeEventListener('hashchange', checkRoute);
  }, []);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <div className="bg-[#1C130F] min-h-screen text-[#F5F0EB] relative selection:bg-[#A67C52] selection:text-[#1C130F]">
      <a href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-3 focus:bg-[#A67C52] focus:text-[#1C130F] focus:font-bold focus:text-sm focus:rounded-lg focus:outline-2 focus:outline-offset-2 focus:outline-white">
        Skip to main content
      </a>

      {/* Admin link in corner (subtle) */}
      <a href="#admin" 
        className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full bg-[#281C16] border border-[#A67C52]/20 flex items-center justify-center text-gray-600 hover:text-[#C4956A] hover:border-[#A67C52]/40 transition-all opacity-60 hover:opacity-100"
        title="Admin Dashboard"
        aria-label="Admin Dashboard">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
      </a>

      <Navbar onBookClick={() => scrollTo('#reservation')} />
      <main id="main-content">
        <Hero onBookClick={() => scrollTo('#reservation')} onMenuClick={() => scrollTo('#menu')} />
        <About />
        <MenuSection onOrderSelect={() => scrollTo('#location')} />
        <Gallery />
        <Testimonials />
        <Location />
        <ReservationForm />
      </main>
      <Footer />
    </div>
  );
};

export default App;
