import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Lock, LogOut, Calendar, Clock, Mail, Phone, Search, X, ArrowLeft, Coffee, RefreshCw, Plus, Edit3, Trash2, CheckCircle, AlertCircle, Save } from 'lucide-react';
import { CATEGORIES, type MenuCategory } from '../data/coffeeData';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

// ─── Types ─────────────────────────────────────────────────────────────────

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

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: MenuCategory;
  image: string;
  in_stock: boolean | number;
  featured: boolean | number;
  created_at: string;
}

type DashboardTab = 'reservations' | 'menu';

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

const EMPTY_MENU_FORM = { name: '', description: '', price: '', category: 'Espresso' as MenuCategory, image: '' };

// ─── Component ─────────────────────────────────────────────────────────────

export const AdminDashboard: React.FC = () => {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(() => {
    return sessionStorage.getItem('brew_admin_auth') === 'true';
  });

  useEffect(() => {
    sessionStorage.setItem('brew_admin_auth', String(authenticated));
  }, [authenticated]);

  const [authError, setAuthError] = useState(false);
  const [tab, setTab] = useState<DashboardTab>('reservations');

  // ── Reservations state ─────────────────────────────────────────────────
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [resLoading, setResLoading] = useState(true);
  const [resSearch, setResSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, cancelled: 0, today: 0 });

  // ── Menu state ─────────────────────────────────────────────────────────
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuSearch, setMenuSearch] = useState('');
  const [menuFilter, setMenuFilter] = useState<string>('all');
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [menuForm, setMenuForm] = useState(EMPTY_MENU_FORM);
  const [saving, setSaving] = useState(false);
  const [menuMsg, setMenuMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // ── Fetch reservations ─────────────────────────────────────────────────
  const fetchReservations = useCallback(async () => {
    setResLoading(true);
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
    setResLoading(false);
  }, []);

  // ── Fetch menu ─────────────────────────────────────────────────────────
  const fetchMenu = useCallback(async () => {
    setMenuLoading(true);
    try {
      const res = await fetch(`${API_URL}/menu`);
      const data = await res.json();
      setMenuItems(data.items || []);
    } catch {
      setMenuItems([]);
    }
    setMenuLoading(false);
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchReservations();
      fetchMenu();
    }
  }, [authenticated, fetchReservations, fetchMenu]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  // ── Reservation actions ───────────────────────────────────────────────
  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;
    setCancelling(id);
    try {
      await fetch(`${API_URL}/reservations?id=${id}`, { method: 'DELETE' });
      await fetchReservations();
    } catch {}
    setCancelling(null);
  };

  // ── Menu actions ──────────────────────────────────────────────────────
  const showMsg = (type: 'success' | 'error', text: string) => {
    setMenuMsg({ type, text });
    setTimeout(() => setMenuMsg(null), 3000);
  };

  const handleToggleStock = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/menu`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'toggle_stock' }),
      });
      if (res.ok) {
        await fetchMenu();
        showMsg('success', 'Stock status updated');
      }
    } catch {
      showMsg('error', 'Failed to update stock');
    }
  };

  const openAddForm = () => {
    setEditingItem(null);
    setMenuForm(EMPTY_MENU_FORM);
    setShowMenuForm(true);
  };

  const openEditForm = (item: MenuItem) => {
    setEditingItem(item);
    setMenuForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
    });
    setShowMenuForm(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMenuMsg(null);
    try {
      if (editingItem) {
        const res = await fetch(`${API_URL}/menu`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingItem.id, ...menuForm }),
        });
        if (!res.ok) throw new Error('Update failed');
        showMsg('success', 'Menu item updated');
      } else {
        const res = await fetch(`${API_URL}/menu`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...menuForm, featured: false }),
        });
        if (!res.ok) throw new Error('Create failed');
        showMsg('success', 'Menu item added');
      }
      setShowMenuForm(false);
      setEditingItem(null);
      await fetchMenu();
    } catch {
      showMsg('error', 'Failed to save menu item');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this menu item? This cannot be undone.')) return;
    setDeleting(id);
    try {
      const res = await fetch(`${API_URL}/menu?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchMenu();
        showMsg('success', 'Menu item deleted');
      }
    } catch {
      showMsg('error', 'Failed to delete item');
    }
    setDeleting(null);
  };

  // ── Filtering ─────────────────────────────────────────────────────────
  const filteredReservations = reservations.filter(r => {
    const matchSearch = !resSearch ||
      r.name.toLowerCase().includes(resSearch.toLowerCase()) ||
      r.email.toLowerCase().includes(resSearch.toLowerCase()) ||
      r.phone.includes(resSearch);
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredMenu = menuItems.filter(item => {
    const matchSearch = !menuSearch ||
      item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(menuSearch.toLowerCase());
    const matchCat = menuFilter === 'all' || item.category === menuFilter;
    return matchSearch && matchCat;
  });

  const goBack = () => {
    sessionStorage.removeItem('brew_admin_auth');
    window.location.hash = '';
    window.location.reload();
  };

  const isInStock = (item: MenuItem) => item.in_stock === 1 || item.in_stock === true;

  // ── Login screen ──────────────────────────────────────────────────────
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

  // ── Dashboard ─────────────────────────────────────────────────────────
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
          <button onClick={() => { setAuthenticated(false); sessionStorage.removeItem('brew_admin_auth'); }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#A67C52]/30 text-[#C4956A] text-sm hover:bg-[#A67C52]/10 transition-all">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Toast message */}
      {menuMsg && (
        <div className={`fixed top-20 right-4 z-[60] px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 ${
          menuMsg.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
        }`}>
          {menuMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {menuMsg.text}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab switcher */}
        <div className="flex gap-1 mb-8 p-1 rounded-2xl bg-[#281C16] border border-[#A67C52]/20 w-fit">
          {([
            { id: 'reservations' as DashboardTab, label: 'Reservations', icon: Calendar },
            { id: 'menu' as DashboardTab, label: 'Menu', icon: Coffee },
          ]).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                tab === t.id ? 'bg-[#A67C52] text-[#1C130F] shadow-lg' : 'text-gray-400 hover:text-white'
              }`}>
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Reservations Tab ────────────────────────────────────────── */}
        {tab === 'reservations' && (
          <>
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
                <input type="text" value={resSearch} onChange={e => setResSearch(e.target.value)} placeholder="Search by name, email, or phone..."
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
                <RefreshCw className={`w-4 h-4 ${resLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Table */}
            {resLoading ? (
              <div className="text-center py-20">
                <div className="animate-spin w-8 h-8 border-2 border-[#A67C52] border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-400 text-sm">Loading reservations...</p>
              </div>
            ) : filteredReservations.length === 0 ? (
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
                  {filteredReservations.map(r => (
                    <div key={r.id} className="glass-card rounded-2xl p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white font-semibold">{r.name}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                            <span className="text-xs text-gray-500">{r.guests} {r.guests === 1 ? 'guest' : 'guests'}</span>
                          </div>
                        </div>
                        {r.status === 'confirmed' && (
                          <button onClick={() => handleCancel(r.id)} disabled={cancelling === r.id}
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
                        {filteredReservations.map(r => (
                          <tr key={r.id} className="hover:bg-[#A67C52]/5 transition-colors">
                            <td className="px-4 py-3.5"><p className="text-white font-medium">{r.name}</p></td>
                            <td className="px-4 py-3.5 text-gray-400"><p>{r.email}</p><p className="text-xs">{r.phone}</p></td>
                            <td className="px-4 py-3.5"><div className="flex items-center gap-1.5 text-gray-300"><Calendar className="w-3.5 h-3.5 text-[#C4956A]" />{r.date}</div></td>
                            <td className="px-4 py-3.5"><div className="flex items-center gap-1.5 text-gray-300"><Clock className="w-3.5 h-3.5 text-[#C4956A]" />{r.time}</div></td>
                            <td className="px-4 py-3.5 text-gray-300">{r.guests}</td>
                            <td className="px-4 py-3.5"><span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[r.status]}`}>{r.status}</span></td>
                            <td className="px-4 py-3.5 text-gray-500 text-xs max-w-[150px] truncate">{r.requests || '—'}</td>
                            <td className="px-4 py-3.5">
                              {r.status === 'confirmed' && (
                                <button onClick={() => handleCancel(r.id)} disabled={cancelling === r.id}
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
                <p className="text-gray-500 text-xs mt-4 text-center">Showing {filteredReservations.length} of {reservations.length} reservations</p>
              </>
            )}
          </>
        )}

        {/* ── Menu Tab ────────────────────────────────────────────────── */}
        {tab === 'menu' && (
          <>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" value={menuSearch} onChange={e => setMenuSearch(e.target.value)} placeholder="Search the menu..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#281C16] border border-[#A67C52]/20 text-white placeholder:text-gray-600 focus:border-[#A67C52] focus:outline-none text-sm transition-colors" />
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {['all', ...CATEGORIES].map(c => (
                  <button key={c} onClick={() => setMenuFilter(c)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-200 ${
                      menuFilter === c
                        ? 'bg-[#A67C52] text-[#1C130F]'
                        : 'bg-[#281C16] text-gray-400 hover:text-white border border-[#A67C52]/20'
                    }`}>
                    {c}
                  </button>
                ))}
              </div>
              <button onClick={fetchMenu} className="px-3 py-2 rounded-xl bg-[#281C16] border border-[#A67C52]/20 text-[#C4956A] hover:text-white transition-all">
                <RefreshCw className={`w-4 h-4 ${menuLoading ? 'animate-spin' : ''}`} />
              </button>
              <button onClick={openAddForm}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#A67C52] text-[#1C130F] font-bold text-sm hover:bg-[#C4956A] transition-all">
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>

            {/* Loading / Empty */}
            {menuLoading ? (
              <div className="text-center py-20">
                <div className="animate-spin w-8 h-8 border-2 border-[#A67C52] border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-400 text-sm">Loading menu...</p>
              </div>
            ) : filteredMenu.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full bg-[#A67C52]/10 flex items-center justify-center mx-auto mb-4">
                  <Coffee className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-400 mb-4">No menu items found</p>
                <button onClick={openAddForm} className="px-5 py-2.5 rounded-full bg-[#A67C52] text-[#1C130F] font-bold text-sm hover:bg-[#C4956A] transition-all">
                  Add Your First Item
                </button>
              </div>
            ) : (
              <>
                {/* Mobile cards */}
                <div className="sm:hidden space-y-3">
                  {filteredMenu.map(item => (
                    <div key={item.id} className={`glass-card rounded-2xl p-4 space-y-3 ${!isInStock(item) ? 'opacity-60' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold truncate">{item.name}</p>
                          <p className="text-[#C4956A] text-sm font-bold mt-0.5">{item.price}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ml-2 ${isInStock(item) ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                          {isInStock(item) ? 'In Stock' : 'Out'}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{item.description}</p>
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => handleToggleStock(item.id)}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                            isInStock(item) ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                          }`}>
                          {isInStock(item) ? 'Mark Out' : 'Mark In'}
                        </button>
                        <button onClick={() => openEditForm(item)}
                          className="px-3 py-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 transition-all text-xs font-bold uppercase tracking-wider">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id}
                          className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all text-xs font-bold uppercase tracking-wider">
                          {deleting === item.id ? <div className="animate-spin w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop table */}
                <div className="hidden sm:block glass-card rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#A67C52]/15">
                          {['Name', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                            <th key={h} className="px-4 py-3.5 text-left text-xs uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#A67C52]/10">
                        {filteredMenu.map(item => (
                          <tr key={item.id} className={`hover:bg-[#A67C52]/5 transition-colors ${!isInStock(item) ? 'opacity-60' : ''}`}>
                            <td className="px-4 py-3.5">
                              <p className="text-white font-medium">{item.name}</p>
                              <p className="text-gray-500 text-xs max-w-[300px] truncate">{item.description}</p>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-[#A67C52]/15 text-[#C4956A] border border-[#A67C52]/30">{item.category}</span>
                            </td>
                            <td className="px-4 py-3.5 text-[#C4956A] font-bold">{item.price}</td>
                            <td className="px-4 py-3.5">
                              <span className={`text-xs px-2 py-0.5 rounded-full border ${
                                isInStock(item) ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                              }`}>
                                {isInStock(item) ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2">
                                <button onClick={() => handleToggleStock(item.id)}
                                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border ${
                                    isInStock(item) ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                  }`} title={isInStock(item) ? 'Mark as out of stock' : 'Mark as in stock'}>
                                  {isInStock(item) ? <X className="w-3.5 h-3.5 mx-auto" /> : <CheckCircle className="w-3.5 h-3.5 mx-auto" />}
                                </button>
                                <button onClick={() => openEditForm(item)}
                                  className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 transition-all flex items-center justify-center" title="Edit item">
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id}
                                  className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all flex items-center justify-center" title="Delete item">
                                  {deleting === item.id ? <div className="animate-spin w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full" /> : <Trash2 className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <p className="text-gray-500 text-xs mt-4 text-center">Showing {filteredMenu.length} of {menuItems.length} items</p>
              </>
            )}

            {/* Add/Edit Form Modal */}
            {showMenuForm && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowMenuForm(false)}>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-lg bg-[#281C16] border border-[#A67C52]/30 rounded-3xl p-6 sm:p-8 shadow-2xl"
                  onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-serif text-xl text-white font-bold">{editingItem ? 'Edit Item' : 'Add Menu Item'}</h3>
                    <button onClick={() => setShowMenuForm(false)} className="w-8 h-8 rounded-full border border-[#A67C52]/30 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveItem} className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1.5 font-medium">Name</label>
                      <input type="text" required value={menuForm.name} onChange={e => setMenuForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Item name"
                        className="w-full px-4 py-3 rounded-xl bg-[#1C130F] border border-[#A67C52]/30 text-white placeholder:text-gray-600 focus:border-[#A67C52] focus:outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1.5 font-medium">Description</label>
                      <textarea required rows={2} value={menuForm.description} onChange={e => setMenuForm(f => ({ ...f, description: e.target.value }))}
                        placeholder="Brief description"
                        className="w-full px-4 py-3 rounded-xl bg-[#1C130F] border border-[#A67C52]/30 text-white placeholder:text-gray-600 focus:border-[#A67C52] focus:outline-none transition-colors resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-300 mb-1.5 font-medium">Price</label>
                        <input type="text" required value={menuForm.price} onChange={e => setMenuForm(f => ({ ...f, price: e.target.value }))}
                          placeholder="$5.00"
                          className="w-full px-4 py-3 rounded-xl bg-[#1C130F] border border-[#A67C52]/30 text-white placeholder:text-gray-600 focus:border-[#A67C52] focus:outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-1.5 font-medium">Category</label>
                        <select value={menuForm.category} onChange={e => setMenuForm(f => ({ ...f, category: e.target.value as MenuCategory }))}
                          className="w-full px-4 py-3 rounded-xl bg-[#1C130F] border border-[#A67C52]/30 text-white focus:border-[#A67C52] focus:outline-none transition-colors">
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1.5 font-medium">Image URL</label>
                      <input type="url" value={menuForm.image} onChange={e => setMenuForm(f => ({ ...f, image: e.target.value }))}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-4 py-3 rounded-xl bg-[#1C130F] border border-[#A67C52]/30 text-white placeholder:text-gray-600 focus:border-[#A67C52] focus:outline-none transition-colors" />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setShowMenuForm(false)}
                        className="flex-1 py-3 rounded-full border border-[#A67C52]/60 text-[#C4956A] font-semibold text-sm hover:bg-[#A67C52]/10 transition-all">
                        Cancel
                      </button>
                      <button type="submit" disabled={saving}
                        className="flex-1 py-3 rounded-full bg-[#A67C52] text-[#1C130F] font-bold text-sm hover:bg-[#C4956A] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        {saving ? (
                          <><div className="animate-spin w-4 h-4 border-2 border-[#1C130F] border-t-transparent rounded-full" /> Saving...</>
                        ) : (
                          <><Save className="w-4 h-4" /> {editingItem ? 'Update Item' : 'Add Item'}</>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
