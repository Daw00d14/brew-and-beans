import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Lock, LogOut, Calendar, Clock, Mail, Phone, Search, X, ArrowLeft, Coffee, RefreshCw } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  requests: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

export const AdminDashboard: React.FC = () => {
  const [password, setPassword] = useState('');
  // Persist auth in sessionStorage so it survives component re-mounts
const [authenticated, setAuthenticated] = useState(() => {
  const stored = sessionStorage.getItem('brew_admin_auth');
  return stored === 'true';
});

// Sync authentication state to sessionStorage
useEffect(() => {
  sessionStorage.setItem('brew_admin_auth', String(authenticated));
}, [authenticated]);
  const [authError, setAuthError] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, cancelled: 0, today: 0 });

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/reservations`);
      const data = await res.json();
      const list = data.reservations || [];
      setReservations(list);
      
      const today = new Date().toISOString().split('T')[0];
      setStats({
        total: list.length,
        confirmed: list.filter((r: Reservation) => r.status === 'confirmed').length,
        cancelled: list.filter((r: Reservation) => r.status === 'cancelled').length,
        today: list.filter((r: Reservation) => r.date === today && r.status === 'confirmed').length,
      });
    } catch {
      setReservations([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authenticated) fetchReservations();
  }, [authenticated, fetchReservations]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;
    setCancelling(id);
    try {
      await fetch(`${API_URL}/reservations/${id}`, { method: 'DELETE' });
      await fetchReservations();
    } catch {}
    setCancelling(null);
  };

  const filtered = reservations.filter(r => {
    const matchSearch = !search || 
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search);
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const goBack = () => {
    sessionStorage.removeItem('brew_admin_auth');
    window.location.hash = '';
    window.location.reload();
  };

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#1C130F] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#A67C52]/20 border-2 border-[#A67C52]/40 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-[#C4956A]" />
            </div>
            <h1 className="font-serif text-2xl text-white font-bold">Admin Access</h1>
            <p className="text-gray-400 text-sm mt-1">Brew &amp; Bean Management</p>
          </div>

          <form onSubmit={handleLogin} className="glass-card rounded-2xl p-6 space-y-4">
            {authError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                Incorrect password
              </div>
            )}
            <div>
              <label htmlFor="admin-pass" className="block text-sm text-gray-300 mb-1.5 font-medium">Password</label>
              <input id="admin-pass" type="password" value={password} onChange={e => { setPassword(e.target.value); setAuthError(false); }}
                placeholder="Enter admin password" autoFocus
                className="w-full px-4 py-3 rounded-xl bg-[#1C130F] border border-[#A67C52]/30 text-white placeholder:text-gray-600 focus:border-[#A67C52] focus:outline-none transition-colors" />
            </div>
            <button type="submit" 
              className="w-full py-3 rounded-full bg-[#A67C52] text-[#1C130F] font-bold hover:bg-[#C4956A] transition-all duration-300">
              Sign In
            </button>
          </form>

          <button onClick={goBack} className="mt-6 w-full text-center text-gray-500 text-xs hover:text-[#C4956A] transition-colors">
            ← Back to website
          </button>
        </motion.div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-[#1C130F]">
      {/* Top bar */}
      <header className="glass-nav px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={goBack} className="w-9 h-9 rounded-full border border-[#A67C52]/30 flex items-center justify-center text-[#C4956A] hover:bg-[#A67C52]/10 transition-all" title="Back to website">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <Coffee className="w-5 h-5 text-[#C4956A]" />
              <span className="font-serif text-lg text-white font-bold hidden sm:inline">Brew &amp; Bean</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#A67C52]/20 text-[#C4956A] font-semibold">Admin</span>
            </div>
          </div>
          <button onClick={() => { setAuthenticated(false); sessionStorage.removeItem('brew_admin_auth'); }} className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#A67C52]/30 text-[#C4956A] text-sm hover:bg-[#A67C52]/10 transition-all">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'text-white' },
            { label: 'Confirmed', value: stats.confirmed, color: 'text-emerald-400' },
            { label: 'Today', value: stats.today, color: 'text-[#C4956A]' },
            { label: 'Cancelled', value: stats.cancelled, color: 'text-red-400' },
          ].map(s => (
            <div key={s.label} className="glass-card rounded-2xl p-4 text-center">
              <p className={`text-3xl font-bold font-serif ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, or phone..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#281C16] border border-[#A67C52]/20 text-white placeholder:text-gray-600 focus:border-[#A67C52] focus:outline-none text-sm transition-colors" />
          </div>
          <div className="flex gap-2">
            {['all', 'confirmed', 'cancelled', 'completed'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  statusFilter === s 
                    ? 'bg-[#A67C52] text-[#1C130F]' 
                    : 'bg-[#281C16] text-gray-400 hover:text-white border border-[#A67C52]/20'
                }`}>
                {s}
              </button>
            ))}
          </div>
          <button onClick={fetchReservations} className="px-3 py-2 rounded-xl bg-[#281C16] border border-[#A67C52]/20 text-[#C4956A] hover:text-white transition-all">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Reservations table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-[#A67C52] border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-400 text-sm">Loading reservations...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-[#A67C52]/10 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-gray-400">No reservations found</p>
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="sm:hidden space-y-3">
              {filtered.map(r => (
                <div key={r.id} className="glass-card rounded-2xl p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white font-semibold">{r.name}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[r.status]}`}>
                          {r.status}
                        </span>
                        <span className="text-xs text-gray-500">{r.guests} {r.guests === 1 ? 'guest' : 'guests'}</span>
                      </div>
                    </div>
                    {r.status === 'confirmed' && (
                      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCancel(r.id); }} disabled={cancelling === r.id}
                        className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-500/20" title="Cancel reservation">
                        {cancelling === r.id ? <div className="animate-spin w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                    <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-[#C4956A]" />{r.date}</div>
                    <div className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-[#C4956A]" />{r.time}</div>
                    <div className="flex items-center gap-1.5 col-span-2"><Mail className="w-3 h-3 text-[#C4956A]" />{r.email}</div>
                    <div className="flex items-center gap-1.5 col-span-2"><Phone className="w-3 h-3 text-[#C4956A]" />{r.phone}</div>
                  </div>
                  {r.requests && <p className="text-xs text-gray-500 italic">"{r.requests}"</p>}
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#A67C52]/15">
                      {['Guest', 'Contact', 'Date', 'Time', 'Guests', 'Status', 'Notes', ''].map(h => (
                        <th key={h} className="px-4 py-3.5 text-left text-xs uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#A67C52]/10">
                    {filtered.map(r => (
                      <tr key={r.id} className="hover:bg-[#A67C52]/5 transition-colors">
                        <td className="px-4 py-3.5">
                          <p className="text-white font-medium">{r.name}</p>
                        </td>
                        <td className="px-4 py-3.5 text-gray-400">
                          <p>{r.email}</p>
                          <p className="text-xs">{r.phone}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 text-gray-300">
                            <Calendar className="w-3.5 h-3.5 text-[#C4956A]" />
                            {r.date}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 text-gray-300">
                            <Clock className="w-3.5 h-3.5 text-[#C4956A]" />
                            {r.time}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-gray-300">{r.guests}</td>
                        <td className="px-4 py-3.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[r.status]}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 text-xs max-w-[150px] truncate">
                          {r.requests || '—'}
                        </td>
                        <td className="px-4 py-3.5">
                          {r.status === 'confirmed' && (
                            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCancel(r.id); }} disabled={cancelling === r.id}
                              className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all" title="Cancel reservation">
                              {cancelling === r.id ? <div className="animate-spin w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full" /> : <X className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-gray-500 text-xs mt-4 text-center">
              Showing {filtered.length} of {reservations.length} reservations
            </p>
          </>
        )}
      </main>
    </div>
  );
};
