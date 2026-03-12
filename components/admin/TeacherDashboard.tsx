import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Calendar, Settings, LogOut, CheckCircle, Clock, Link as LinkIcon, Plus, ChevronLeft, ArrowLeft, Mail, Info, Heart, Activity, RefreshCw } from 'lucide-react';
import { API_BASE } from '../../lib/api';

const TeacherDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'customerDetails'>('overview');
    const [customers, setCustomers] = useState<any[]>([]);
    const [selectedCustomerEmail, setSelectedCustomerEmail] = useState<string | null>(null);
    const [customerDetail, setCustomerDetail] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingLinkFor, setEditingLinkFor] = useState<string | null>(null);
    const [newLinkValue, setNewLinkValue] = useState('');
    const vantaRef = useRef<HTMLDivElement>(null);
    const [vantaEffect, setVantaEffect] = useState<any>(null);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('adminToken');
        navigate('/sign-in');
    }, [navigate]);

    const fetchCustomers = useCallback(async (token: string) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE}/api/admin/customers`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setCustomers(data.data);
            } else {
                setError(data.message || 'Failed to fetch customers');
                if (data.message === 'Not authorized as an admin') {
                    handleLogout();
                }
            }
        } catch (err) {
            setError('Error connecting to server. Please ensure the backend is running and Firebase is configured.');
        } finally {
            setLoading(false);
        }
    }, [handleLogout]);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/sign-in');
            return;
        }
        fetchCustomers(token);

        // Load Vanta background
        const loadVanta = async () => {
            if (!(window as any).THREE) {
                const threeScript = document.createElement('script');
                threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
                threeScript.onload = () => {
                    const vantaScript = document.createElement('script');
                    vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js';
                    vantaScript.onload = () => {
                        if (vantaRef.current && (window as any).VANTA) {
                            const effect = (window as any).VANTA.WAVES({
                                el: vantaRef.current,
                                mouseControls: true,
                                touchControls: true,
                                gyroControls: false,
                                minHeight: 200.00,
                                minWidth: 200.00,
                                scale: 1.00,
                                scaleMobile: 1.00,
                                color: 0x070708,
                                shininess: 30.00,
                                waveHeight: 15.00,
                                waveSpeed: 0.50,
                                zoom: 0.85
                            });
                            setVantaEffect(effect);
                        }
                    };
                    document.head.appendChild(vantaScript);
                };
                document.head.appendChild(threeScript);
            }
        };

        loadVanta();

        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [fetchCustomers]);

    // Real-time polling: refresh customers every 25 seconds
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token || activeTab !== 'overview') return;
        const interval = setInterval(() => fetchCustomers(token), 25000);
        return () => clearInterval(interval);
    }, [activeTab, fetchCustomers]);

    // Real-time polling: refresh customer detail when viewing a student (silent - no loading spinner)
    useEffect(() => {
        if (!selectedCustomerEmail) return;
        const interval = setInterval(() => fetchCustomerDetail(selectedCustomerEmail, true), 30000);
        return () => clearInterval(interval);
    }, [selectedCustomerEmail]);

    const fetchCustomerDetail = async (email: string, silent = false) => {
        const token = localStorage.getItem('adminToken');
        if (!silent) setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/admin/customer/${encodeURIComponent(email)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setCustomerDetail(data.data);
                setSelectedCustomerEmail(email);
                if (!silent) setActiveTab('customerDetails');
            } else {
                if (!silent) setError(data.message || 'Failed to fetch details');
            }
        } catch (err) {
            if (!silent) setError('Error connecting to server');
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const handleUpdateLink = async (bookingId: string) => {
        const token = localStorage.getItem('adminToken');
        try {
            const res = await fetch(`${API_BASE}/api/admin/booking/${bookingId}/meet-link`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ meetingLink: newLinkValue })
            });

            const data = await res.json();
            if (data.success) {
                if (customerDetail) {
                    setCustomerDetail({
                        ...customerDetail,
                        bookings: customerDetail.bookings.map((b: any) => b.id === bookingId ? { ...b, meetingLink: newLinkValue } : b)
                    });
                }
                setEditingLinkFor(null);
                setNewLinkValue('');
            } else {
                alert(data.message || 'Failed to update link');
            }
        } catch (err) {
            alert('Error updating link');
        }
    };

    return (
        <div className="relative min-h-screen text-white font-sans bg-[#0B0B0D] overflow-x-hidden">
            {/* Vanta Background */}
            <div
                ref={vantaRef}
                className="fixed inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 0 }}
            />

            {/* Back to Home Button */}
            <div className="fixed top-8 left-8 z-50">
                <button
                    onClick={() => {
                        window.scrollTo(0, 0);
                        navigate('/');
                    }}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-2xl text-stone-300 hover:text-white hover:bg-white/10 transition-all duration-300 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Back to Home</span>
                </button>
            </div>

            <div className="relative pt-32 pb-20 px-4 md:px-8 lg:px-12" style={{ zIndex: 1 }}>
                <div className="max-w-[1400px] mx-auto">

                    {/* Header Section */}
                    <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-serif italic mb-2">
                                Instructor <span className="text-stone-400">Portal</span>
                            </h1>
                            <p className="text-stone-500 text-lg tracking-wide">Real-time view of students, bookings, and meeting links.</p>
                        </div>

                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-1.5 rounded-full backdrop-blur-2xl shadow-xl shrink-0">
                            <button
                                onClick={() => { setActiveTab('overview'); setSelectedCustomerEmail(null); setError(''); }}
                                className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === 'overview' ? 'bg-white text-black shadow-lg' : 'text-stone-400 hover:text-white hover:bg-white/5'}`}
                            >
                                Overview
                            </button>
                            {selectedCustomerEmail && (
                                <button className="px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest bg-white text-black shadow-lg">
                                    Student Detail
                                </button>
                            )}
                            <button
                                onClick={() => { const t = localStorage.getItem('adminToken'); if (t) fetchCustomers(t); setError(''); }}
                                title="Refresh list"
                                className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest bg-white text-black shadow-lg hover:bg-stone-200 transition-all duration-300"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-white/5 transition-all duration-300"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-3xl backdrop-blur-xl flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <Info className="w-5 h-5" />
                                    <span className="font-medium tracking-wide">{error}</span>
                                </div>
                                <button onClick={() => setError('')} className="p-2 hover:bg-white/5 rounded-full">✕</button>
                            </motion.div>
                        )}

                        {loading ? (
                            <div className="flex justify-center items-center py-40">
                                <div className="relative">
                                    <div className="w-20 h-20 border-2 border-white/5 rounded-full" />
                                    <div className="absolute inset-0 w-20 h-20 border-t-2 border-white rounded-full animate-spin" />
                                </div>
                            </div>
                        ) : (
                            <AnimatePresence mode="wait">
                                {activeTab === 'overview' && (
                                    <motion.div
                                        key="overview"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-2xl overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="border-b border-white/5">
                                                            <th className="px-8 py-6 text-xs font-bold text-stone-500 uppercase tracking-[0.2em]">Student</th>
                                                            <th className="px-8 py-6 text-xs font-bold text-stone-500 uppercase tracking-[0.2em]">Status</th>
                                                            <th className="px-8 py-6 text-xs font-bold text-stone-500 uppercase tracking-[0.2em]">Sessions</th>
                                                            <th className="px-8 py-6 text-xs font-bold text-stone-500 uppercase tracking-[0.2em] text-right">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-white/5">
                                                        {customers.map((c) => (
                                                            <tr key={c.id} className="group hover:bg-white/[0.02] transition-colors">
                                                                <td className="px-8 py-6">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-500 to-stone-700 flex items-center justify-center text-xs font-bold">
                                                                            {c.name?.charAt(0) || <Users className="w-4 h-4" />}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-bold tracking-wide">{c.name}</p>
                                                                            <p className="text-xs text-stone-500">{c.email}</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-8 py-6">
                                                                    {c.subscription ? (
                                                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${c.subscription.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                                            {c.subscription.planName}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-stone-600 text-[10px] font-bold uppercase tracking-widest">No Active Plan</span>
                                                                    )}
                                                                </td>
                                                                <td className="px-8 py-6">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                                            <div
                                                                                className="h-full bg-white/40 rounded-full"
                                                                                style={{ width: `${c.subscription ? (c.subscription.sessionsUsed / c.subscription.totalSessions) * 100 : 0}%` }}
                                                                            />
                                                                        </div>
                                                                        <span className="text-xs font-bold text-stone-400">
                                                                            {c.subscription ? `${c.subscription.sessionsUsed}/${c.subscription.totalSessions}` : '0/0'}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-8 py-6 text-right">
                                                                    <button
                                                                        onClick={() => fetchCustomerDetail(c.email)}
                                                                        className="px-6 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
                                                                    >
                                                                        Manage
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {customers.length === 0 && (
                                                            <tr>
                                                                <td colSpan={4} className="px-8 py-20 text-center text-stone-500">
                                                                    No students yet. New signups and bookings will appear here in real-time.
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'customerDetails' && customerDetail && (
                                    <motion.div
                                        key="details"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                                    >
                                        {/* Left Side: Profile Information */}
                                        <div className="lg:col-span-1 space-y-8">
                                            <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-2xl">
                                                <div className="flex flex-col items-center text-center mb-8">
                                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-stone-700 to-stone-900 border-2 border-white/20 flex items-center justify-center mb-4">
                                                        <Users className="w-10 h-10 text-stone-300" />
                                                    </div>
                                                    <h3 className="text-2xl font-serif italic">{customerDetail.profile.displayName || 'Unnamed Student'}</h3>
                                                    <p className="text-stone-500 text-sm mt-1 mb-4">{customerDetail.profile.email}</p>

                                                    {customerDetail.subscription ? (
                                                        <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/10 w-full">
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1">Active Plan</p>
                                                            <p className="font-bold tracking-tight">{customerDetail.subscription.planName}</p>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-red-500/5 px-4 py-2 rounded-2xl border border-red-500/10 w-full">
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-red-400">No Plan</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="flex items-start gap-4">
                                                        <Heart className="w-5 h-5 text-stone-600 shrink-0 mt-1" />
                                                        <div>
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Main Goal</p>
                                                            <p className="text-sm font-medium text-stone-200">{customerDetail.profile.goal || 'Not specified'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-4">
                                                        <Activity className="w-5 h-5 text-stone-600 shrink-0 mt-1" />
                                                        <div>
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Medical Condition</p>
                                                            <p className="text-sm font-medium text-stone-200">{customerDetail.profile.medicalCondition || 'None reported'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-4 border-t border-white/5 pt-6 mt-6">
                                                        <Info className="w-5 h-5 text-stone-600 shrink-0 mt-1" />
                                                        <div>
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Yoga Style</p>
                                                            <p className="text-sm font-medium text-stone-200">{customerDetail.profile.styleOfYoga || 'General'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Kosha Balance */}
                                            <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-2xl">
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-6">Kosha Analysis</h4>
                                                <div className="space-y-4">
                                                    {['annamaya', 'pranamaya', 'manomaya', 'vijnanamaya', 'anandamaya'].map(k => (
                                                        <div key={k} className="flex justify-between items-center group">
                                                            <span className="text-xs text-stone-400 capitalize">{k}</span>
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-white/40"
                                                                        style={{ width: `${(customerDetail.profile[k] || 0) * 10}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-xs font-bold w-4 text-right">{customerDetail.profile[k] || '-'}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side: Class Management */}
                                        <div className="lg:col-span-2 space-y-8">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-2xl font-serif italic">Class Schedule</h3>
                                                <div className="flex items-center gap-2 text-stone-500 text-xs font-bold tracking-widest uppercase bg-white/5 px-4 py-2 rounded-full border border-white/10">
                                                    <Calendar className="w-4 h-4" />
                                                    {customerDetail.bookings.length} Sessions
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                {customerDetail.bookings.map((booking: any) => (
                                                    <motion.div
                                                        key={booking.id}
                                                        layout
                                                        className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden group"
                                                    >
                                                        <div className="relative z-10 flex-1">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <span className="bg-white text-black px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                                                    {booking.sessionType}
                                                                </span>
                                                                <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${booking.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                                                                    {booking.status}
                                                                </span>
                                                            </div>
                                                            <p className="text-3xl font-serif italic mb-2">{booking.date}</p>
                                                            <p className="text-stone-400 font-medium tracking-wide">at {booking.time}</p>
                                                            <p className="text-xs text-stone-500 mt-4 uppercase tracking-[0.2em]">Intensity: {booking.intensity}%</p>
                                                        </div>

                                                        <div className="w-full md:w-[350px] relative z-10">
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-3 flex items-center gap-2">
                                                                <LinkIcon className="w-3 h-3" /> Meet Link
                                                            </p>
                                                            {editingLinkFor === booking.id ? (
                                                                <div className="flex flex-col gap-3">
                                                                    <input
                                                                        type="text"
                                                                        value={newLinkValue}
                                                                        onChange={(e) => setNewLinkValue(e.target.value)}
                                                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:border-white outline-none transition-all backdrop-blur-3xl"
                                                                        placeholder="https://meet.google.com/..."
                                                                    />
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            onClick={() => handleUpdateLink(booking.id)}
                                                                            className="flex-1 bg-white text-black py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all"
                                                                        >
                                                                            Save Link
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setEditingLinkFor(null)}
                                                                            className="px-6 border border-white/10 text-stone-500 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    onClick={() => { setEditingLinkFor(booking.id); setNewLinkValue(booking.meetingLink || ''); }}
                                                                    className="group/link flex items-center justify-between text-sm bg-black/40 border border-white/10 rounded-2xl px-5 py-4 cursor-pointer hover:border-white/30 transition-all backdrop-blur-3xl shadow-lg"
                                                                >
                                                                    <span className="truncate text-stone-400 group-hover/link:text-white transition-colors">
                                                                        {booking.meetingLink || 'Loading link...'}
                                                                    </span>
                                                                    <Settings className="w-4 h-4 text-stone-600 group-hover/link:text-white transition-colors" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-white/[0.02] rounded-full blur-3xl pointer-events-none group-hover:bg-white/[0.05] transition-all duration-700" />
                                                    </motion.div>
                                                ))}

                                                {customerDetail.bookings.length === 0 && (
                                                    <div className="bg-white/5 border border-white/10 p-20 rounded-[2.5rem] text-center backdrop-blur-2xl">
                                                        <Calendar className="w-12 h-12 text-stone-700 mx-auto mb-4" />
                                                        <p className="text-stone-500 font-medium font-serif italic text-lg">No classes scheduled yet.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
