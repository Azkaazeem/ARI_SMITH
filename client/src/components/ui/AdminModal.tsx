import React, { useState, useEffect } from 'react';
import { X, Lock, CheckCircle, XCircle, Plus, Shield, RefreshCw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { 
  adminLogin, 
  fetchAdminBookings, 
  updateAdminBooking, 
  fetchAdminSettings, 
  updateAdminSettings 
} from '../../utils/api';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AdminBooking {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  venueCity: string;
  guestCount: number;
  priceQuote: string;
  status: 'pending' | 'confirmed' | 'declined';
  specialRequests?: string;
  createdAt: string;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const { themeMeta } = useTheme();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ari_admin_token'));
  const [username, setUsername] = useState('ari@smith-illusion.co.uk');
  const [password, setPassword] = useState('theillusionist');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<'bookings' | 'settings'>('bookings');
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [activeNotice, setActiveNotice] = useState('');
  const [newDateInput, setNewDateInput] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  const loadAdminData = async (authToken: string) => {
    setIsLoading(true);
    try {
      const bRes = await fetchAdminBookings(authToken);
      if (bRes.success) setBookings(bRes.bookings);

      const sRes = await fetchAdminSettings(authToken);
      if (sRes.success && sRes.settings) {
        setBlockedDates(sRes.settings.blockedDates || []);
        setActiveNotice(sRes.settings.activeNotice || '');
      }
    } catch (err) {
      setToken(null);
      localStorage.removeItem('ari_admin_token');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      loadAdminData(token);
    }
  }, [isOpen, token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
      const res = await adminLogin({ username, password });
      if (res.success && res.token) {
        setToken(res.token);
        localStorage.setItem('ari_admin_token', res.token);
        loadAdminData(res.token);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Mystic phrase invalid.';
      setLoginError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: 'confirmed' | 'declined') => {
    if (!token) return;
    try {
      const res = await updateAdminBooking(token, id, { status });
      if (res.success) {
        setBookings(prev =>
          prev.map(b => ((b._id || b.id) === id ? { ...b, status } : b))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddBlockedDate = () => {
    if (!newDateInput || blockedDates.includes(newDateInput)) return;
    const updated = [...blockedDates, newDateInput].sort();
    setBlockedDates(updated);
    setNewDateInput('');
  };

  const handleRemoveBlockedDate = (dateToRemove: string) => {
    setBlockedDates(prev => prev.filter(d => d !== dateToRemove));
  };

  const handleSaveSettings = async () => {
    if (!token) return;
    setIsLoading(true);
    setSaveStatus('');
    try {
      await updateAdminSettings(token, { blockedDates, activeNotice });
      setSaveStatus('Sanctum settings successfully sealed.');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      setSaveStatus('Failed to update settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('ari_admin_token');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl max-h-[90vh] border border-white/20 bg-[#0A0A0A] shadow-2xl overflow-hidden z-10 flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/50">
          <div className="flex items-center gap-3">
            <div
              className="p-2 border border-white/15 bg-white/5"
              style={{ color: themeMeta.accentHex }}
            >
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-serif font-bold text-white tracking-widest uppercase">
                Ari&apos;s Secret Sanctum (MongoDB Control)
              </h3>
              <p className="text-[10px] font-mono text-white/50">
                Master Booking Authority & Date Sealing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {token && (
              <button
                onClick={handleLogout}
                className="text-[11px] font-mono text-white/50 hover:text-rose-400 transition-colors"
              >
                Seal Sanctum (Logout)
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 border border-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!token ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center max-w-md mx-auto w-full text-center">
            <div
              className="w-12 h-12 border border-white/20 flex items-center justify-center mb-6 bg-white/5"
              style={{ borderColor: themeMeta.accentHex }}
            >
              <Lock className="w-6 h-6" style={{ color: themeMeta.accentHex }} />
            </div>
            <h4 className="text-base font-serif font-bold tracking-widest text-white uppercase mb-2">
              Identify Yourself
            </h4>
            <p className="text-xs text-white/60 mb-6 leading-relaxed">
              Enter the master passphrase to view MongoDB inquiries and sealed tour dates.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4 text-left">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/50 block mb-1">
                  Master Identifier
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 border border-white/15 bg-black text-xs text-white focus:outline-none focus:border-white/40"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/50 block mb-1">
                  Mystic Passphrase
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-white/15 bg-black text-xs text-white focus:outline-none focus:border-white/40"
                  required
                />
                <p className="text-[10px] font-mono text-white/30 mt-1">
                  Default credentials: <code>ari@smith-illusion.co.uk</code> / <code>theillusionist</code>
                </p>
              </div>

              {loginError && (
                <div className="text-xs text-rose-400 font-mono py-1">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 border font-serif text-xs font-bold tracking-widest uppercase transition-all duration-300 hover:brightness-110 active:scale-95 disabled:opacity-40 text-white"
                style={{
                  borderColor: themeMeta.accentHex,
                  backgroundColor: 'rgba(255,255,255,0.08)'
                }}
              >
                {isLoading ? 'Opening Gate...' : 'Unlock Sanctum'}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 border-b border-white/10 flex gap-4 bg-black/30 text-xs font-serif tracking-widest uppercase">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-3.5 border-b-2 transition-all duration-200 ${
                  activeTab === 'bookings'
                    ? 'border-white text-white font-bold'
                    : 'border-transparent text-white/50 hover:text-white/80'
                }`}
              >
                Client Inquiries ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-3.5 border-b-2 transition-all duration-200 ${
                  activeTab === 'settings'
                    ? 'border-white text-white font-bold'
                    : 'border-transparent text-white/50 hover:text-white/80'
                }`}
              >
                Sealed Dates & Announcements
              </button>
            </div>

            {activeTab === 'bookings' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-white/60">
                    Live Booking Dossiers ({bookings.length} in MongoDB)
                  </span>
                  <button
                    onClick={() => token && loadAdminData(token)}
                    className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Sync</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {bookings.map((b) => {
                    const id = b._id || b.id || '';
                    return (
                      <div
                        key={id}
                        className="p-4 border border-white/15 bg-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-sm font-bold text-white">
                              {b.name}
                            </span>
                            <span
                              className={`text-[9px] font-mono px-2 py-0.5 uppercase tracking-wider ${
                                b.status === 'confirmed'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : b.status === 'declined'
                                  ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                  : 'bg-amber-950 text-amber-400 border border-amber-800'
                              }`}
                            >
                              {b.status}
                            </span>
                          </div>
                          <div className="text-xs text-white/70">
                            <strong>{b.eventType}</strong> &bull; {b.venueCity} &bull; {b.guestCount} guests
                          </div>
                          <div className="text-[11px] font-mono text-white/40">
                            Date: <span className="text-white/80">{b.eventDate}</span> | Email: {b.email} | Phone: {b.phone}
                          </div>
                          {b.specialRequests && (
                            <div className="text-[11px] text-white/50 italic bg-black p-2 border border-white/5">
                              &ldquo;{b.specialRequests}&rdquo;
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStatusChange(id, 'confirmed')}
                            className="flex items-center gap-1 px-3 py-1.5 border border-emerald-800/50 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 text-xs font-mono transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Confirm</span>
                          </button>
                          <button
                            onClick={() => handleStatusChange(id, 'declined')}
                            className="flex items-center gap-1 px-3 py-1.5 border border-rose-800/50 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 text-xs font-mono transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Decline</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-white/60 block mb-2">
                    Active Tour Notice / Public Announcement
                  </label>
                  <input
                    type="text"
                    value={activeNotice}
                    onChange={(e) => setActiveNotice(e.target.value)}
                    placeholder="e.g. Now accepting select dates for Manchester and London..."
                    className="w-full px-4 py-2.5 border border-white/15 bg-black text-xs text-white focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-white/60 block mb-2">
                    Dates Sealed by Mystery (Unavailable to Public)
                  </label>
                  
                  <div className="flex gap-2 mb-4">
                    <input
                      type="date"
                      value={newDateInput}
                      onChange={(e) => setNewDateInput(e.target.value)}
                      className="px-3.5 py-2 border border-white/15 bg-black text-xs text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddBlockedDate}
                      className="flex items-center gap-1.5 px-4 py-2 border border-white/20 bg-white/10 hover:bg-white/20 text-xs font-serif text-white tracking-wider uppercase transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Seal Date</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {blockedDates.map((d) => (
                      <span
                        key={d}
                        className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/20 bg-white/5 text-xs font-mono text-white/90"
                      >
                        <span>{d}</span>
                        <button
                          onClick={() => handleRemoveBlockedDate(d)}
                          className="hover:text-rose-400 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400">
                    {saveStatus}
                  </span>
                  <button
                    onClick={handleSaveSettings}
                    disabled={isLoading}
                    className="px-6 py-2.5 border font-serif text-xs font-bold tracking-widest uppercase transition-all duration-300 hover:brightness-110 text-white"
                    style={{
                      borderColor: themeMeta.accentHex,
                      backgroundColor: 'rgba(255,255,255,0.08)'
                    }}
                  >
                    {isLoading ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>

              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
