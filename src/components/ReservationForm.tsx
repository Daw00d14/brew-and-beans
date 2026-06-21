import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Users, Mail, Phone, User, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface FormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  requests: string;
}

const INITIAL_FORM: FormData = {
  name: '', email: '', phone: '', date: '', time: '', guests: 2, requests: ''
};

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30'
];

export const ReservationForm: React.FC = () => {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ id: string; message: string } | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const update = (field: keyof FormData, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  const getMinDate = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 2);
    return d.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors([]);

    try {
      const res = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.details || [data.error || 'Something went wrong']);
      } else {
        setSuccess({ id: data.reservation.id, message: data.message });
      }
    } catch {
      setErrors(['Could not connect to the server. Make sure the server is running.']);
    }

    setSubmitting(false);
  };

  if (success) {
    return (
      <section id="reservation" className="py-28 bg-gradient-to-b from-[#1C130F] to-[#281C16] relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#A67C52]/8 rounded-full blur-[180px] pointer-events-none" aria-hidden="true" />
        <div className="max-w-lg mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-24 h-24 rounded-full bg-[#A67C52]/20 border-2 border-[#A67C52] flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle className="w-12 h-12 text-[#C4956A]" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-3xl sm:text-4xl text-white font-bold mb-4"
          >
            {success.message}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 mb-8"
          >
            We&apos;ll see you at <span className="text-[#C4956A] font-semibold">Brew &amp; Bean</span>!
            A confirmation has been sent to your email.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card rounded-2xl p-6 max-w-sm mx-auto text-left space-y-3"
          >
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-[#C4956A]" aria-hidden="true" />
              <span className="text-gray-300">{form.date}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-[#C4956A]" aria-hidden="true" />
              <span className="text-gray-300">{form.time}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Users className="w-4 h-4 text-[#C4956A]" aria-hidden="true" />
              <span className="text-gray-300">{form.guests} {form.guests === 1 ? 'guest' : 'guests'}</span>
            </div>
          </motion.div>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={() => { setSuccess(null); setForm(INITIAL_FORM); setStep(1); }}
            className="mt-8 px-6 py-3 rounded-full border border-[#A67C52]/60 text-[#C4956A] font-semibold text-sm hover:bg-[#A67C52]/10 transition-all duration-300"
          >
            Make Another Reservation
          </motion.button>
        </div>
      </section>
    );
  }

  return (
    <section id="reservation" className="py-28 bg-gradient-to-b from-[#281C16] via-[#1C130F] to-[#281C16] relative overflow-hidden">
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#A67C52]/5 rounded-full blur-[150px] pointer-events-none" aria-hidden="true" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#A67C52]/30 bg-[#1C130F]/80 mb-6 text-[#C4956A] text-xs uppercase tracking-[0.25em] font-semibold">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" /><span>Book a Table</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
            Reserve Your{' '}
            <span className="warm-gradient-text">Experience</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            Join us for handcrafted coffee and warm conversation.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step === 1 ? 'bg-[#A67C52] text-[#1C130F]' : 'bg-[#A67C52]/30 text-gray-400'}`}>1</div>
          <div className="w-12 h-0.5 bg-[#A67C52]/30" />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step === 2 ? 'bg-[#A67C52] text-[#1C130F]' : 'bg-[#A67C52]/30 text-gray-400'}`}>2</div>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 sm:p-10">
          {errors.length > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30" role="alert">
              <p className="text-red-400 text-sm font-semibold mb-1">Please fix the following:</p>
              <ul className="list-disc list-inside text-red-300 text-xs space-y-0.5">
                {errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <h3 className="text-white font-semibold text-lg mb-6">When are you coming?</h3>

                <div>
                  <label htmlFor="res-date" className="block text-sm text-gray-300 mb-2 font-medium"><Calendar className="w-3.5 h-3.5 inline mr-1.5 text-[#C4956A]" aria-hidden="true" />Date</label>
                  <input id="res-date" type="date" value={form.date} onChange={e => update('date', e.target.value)} min={getMinDate()} max={getMaxDate()}
                    className="w-full px-4 py-3 rounded-xl bg-[#1C130F] border border-[#A67C52]/30 text-white focus:border-[#A67C52] focus:outline-none transition-colors" required />
                </div>

                <div>
                  <label htmlFor="res-time" className="block text-sm text-gray-300 mb-2 font-medium"><Clock className="w-3.5 h-3.5 inline mr-1.5 text-[#C4956A]" aria-hidden="true" />Time</label>
                  <select id="res-time" value={form.time} onChange={e => update('time', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#1C130F] border border-[#A67C52]/30 text-white focus:border-[#A67C52] focus:outline-none transition-colors" required>
                    <option value="">Select a time</option>
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="res-guests" className="block text-sm text-gray-300 mb-2 font-medium"><Users className="w-3.5 h-3.5 inline mr-1.5 text-[#C4956A]" aria-hidden="true" />Number of Guests</label>
                  <div className="flex items-center gap-4">
                    <button type="button" onClick={() => update('guests', Math.max(1, form.guests - 1))} className="w-10 h-10 rounded-full border border-[#A67C52]/40 text-[#C4956A] hover:bg-[#A67C52]/10 transition-all text-lg font-bold">−</button>
                    <span className="text-white text-2xl font-bold w-8 text-center">{form.guests}</span>
                    <button type="button" onClick={() => update('guests', Math.min(20, form.guests + 1))} className="w-10 h-10 rounded-full border border-[#A67C52]/40 text-[#C4956A] hover:bg-[#A67C52]/10 transition-all text-lg font-bold">+</button>
                  </div>
                </div>

                <button type="button" onClick={() => setStep(2)}
                  className="w-full mt-6 px-6 py-3.5 rounded-full bg-[#A67C52] text-[#1C130F] font-bold text-sm hover:bg-[#C4956A] transition-all duration-300 flex items-center justify-center gap-2">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
                <h3 className="text-white font-semibold text-lg mb-6">Your Details</h3>

                <div>
                  <label htmlFor="res-name" className="block text-sm text-gray-300 mb-2 font-medium"><User className="w-3.5 h-3.5 inline mr-1.5 text-[#C4956A]" aria-hidden="true" />Name</label>
                  <input id="res-name" type="text" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl bg-[#1C130F] border border-[#A67C52]/30 text-white placeholder:text-gray-600 focus:border-[#A67C52] focus:outline-none transition-colors" required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="res-email" className="block text-sm text-gray-300 mb-2 font-medium"><Mail className="w-3.5 h-3.5 inline mr-1.5 text-[#C4956A]" aria-hidden="true" />Email</label>
                    <input id="res-email" type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#1C130F] border border-[#A67C52]/30 text-white placeholder:text-gray-600 focus:border-[#A67C52] focus:outline-none transition-colors" required />
                  </div>
                  <div>
                    <label htmlFor="res-phone" className="block text-sm text-gray-300 mb-2 font-medium"><Phone className="w-3.5 h-3.5 inline mr-1.5 text-[#C4956A]" aria-hidden="true" />Phone</label>
                    <input id="res-phone" type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="(503) 555-1234"
                      className="w-full px-4 py-3 rounded-xl bg-[#1C130F] border border-[#A67C52]/30 text-white placeholder:text-gray-600 focus:border-[#A67C52] focus:outline-none transition-colors" required />
                  </div>
                </div>

                <div>
                  <label htmlFor="res-requests" className="block text-sm text-gray-300 mb-2 font-medium"><MessageSquare className="w-3.5 h-3.5 inline mr-1.5 text-[#C4956A]" aria-hidden="true" />Special Requests (optional)</label>
                  <textarea id="res-requests" value={form.requests} onChange={e => update('requests', e.target.value)} placeholder="Allergies, celebrations, seating preferences..." rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-[#1C130F] border border-[#A67C52]/30 text-white placeholder:text-gray-600 focus:border-[#A67C52] focus:outline-none transition-colors resize-none" />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(1)}
                    className="px-6 py-3.5 rounded-full border border-[#A67C52]/60 text-[#C4956A] font-semibold text-sm hover:bg-[#A67C52]/10 transition-all duration-300">
                    Back
                  </button>
                  <button type="submit" disabled={submitting}
                    className="flex-1 px-6 py-3.5 rounded-full bg-[#A67C52] text-[#1C130F] font-bold text-sm hover:bg-[#C4956A] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {submitting ? (
                      <><span className="animate-spin w-4 h-4 border-2 border-[#1C130F] border-t-transparent rounded-full" /> Confirming...</>
                    ) : (
                      <><CheckCircle className="w-4 h-4" /> Confirm Reservation</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </section>
  );
};
