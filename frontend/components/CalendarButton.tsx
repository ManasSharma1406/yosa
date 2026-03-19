import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, CalendarCheck, ArrowRight, Clock, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BookingCalendar, { SelectedSlot } from './booking/BookingCalendar';

const CalendarButton: React.FC = () => {
    const { user, getIdToken } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [subscription, setSubscription] = useState<any>(null);
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);
    const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingError, setBookingError] = useState('');

    const hasActivePlan = subscription?.status === 'active' &&
        subscription?.sessionsUsed < subscription?.totalSessions &&
        (!subscription.expiryDate || new Date(subscription.expiryDate) >= new Date());

    const availableSessions = hasActivePlan ? (subscription.totalSessions - subscription.sessionsUsed) : 0;
    const maxSelections = hasActivePlan ? availableSessions : 0;

    const now = new Date();
    const upcomingSessions = sessions.filter(s => new Date(s.date) >= now);

    useEffect(() => {
        if (!isOpen || !user) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = await getIdToken();
                const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

                const [subRes, sessRes] = await Promise.all([
                    fetch(`${API}/api/subscriptions/status`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${API}/api/bookings/user/${user.email}`, { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                if (subRes.ok) {
                    const subData = await subRes.json();
                    if (subData.success && subData.data) setSubscription(subData.data);
                }
                if (sessRes.ok) {
                    const sessData = await sessRes.json();
                    setSessions(sessData.data || []);
                }
            } catch (e) {
                console.error('CalendarButton fetch error', e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [isOpen, user]);

    const handleConfirmBooking = async () => {
        if (!user || selectedSlots.length === 0) return;
        setIsBookingSubmitting(true);
        setBookingError('');
        try {
            const token = await getIdToken();
            const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const bookingsData = selectedSlots.map(slot => {
                const date = new Date(slot.date);
                date.setHours(12, 0, 0, 0);
                return {
                    userId: user.uid,
                    sessionType: 'Private 1:1 Session',
                    date: date.toISOString(),
                    time: slot.time,
                    duration: 60,
                    price: 0,
                    addons: []
                };
            });

            const response = await fetch(`${API}/api/bookings/bulk-create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ bookings: bookingsData })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setBookingSuccess(true);
                    setSelectedSlots([]);
                    // Refresh sessions
                    const sessRes = await fetch(`${API}/api/bookings/user/${user.email}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (sessRes.ok) {
                        const sessData = await sessRes.json();
                        setSessions(sessData.data || []);
                    }
                    setTimeout(() => setBookingSuccess(false), 3000);
                } else {
                    setBookingError(result.message || 'Booking failed.');
                }
            } else {
                const err = await response.json();
                setBookingError(err.message || 'Server error.');
            }
        } catch (e: any) {
            setBookingError(e.message || 'Unexpected error.');
        } finally {
            setIsBookingSubmitting(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-4 left-8 z-[100]"
            >
                <button
                    onClick={() => setIsOpen(true)}
                    className="relative bg-indigo-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center group"
                    aria-label="Open Booking Calendar"
                >
                    <Calendar className="w-7 h-7" />
                    {/* Tooltip */}
                    <span className="absolute left-full ml-4 px-4 py-2 bg-white text-stone-900 text-sm font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-stone-100">
                        Book a Session
                    </span>
                    {/* Pulse ring */}
                    <span className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-20 -z-10" />
                </button>
            </motion.div>

            {/* Popup Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: 60, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 60, scale: 0.97 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="relative w-full sm:max-w-4xl bg-[#111113] border border-white/10 rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
                            style={{ maxHeight: '92vh' }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 sm:p-8 border-b border-white/10 flex-shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                        <CalendarCheck className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-poppins text-white leading-tight">Book a Session</h2>
                                        <p className="text-xs text-white/40 font-medium mt-0.5">
                                            {hasActivePlan
                                                ? `${availableSessions} session${availableSessions !== 1 ? 's' : ''} available`
                                                : 'No active plan'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                                {loading ? (
                                    <div className="flex items-center justify-center h-48">
                                        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                                    </div>
                                ) : !user ? (
                                    /* Not logged in */
                                    <div className="flex flex-col items-center justify-center h-48 text-center gap-5">
                                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                            <Calendar className="w-8 h-8 text-white/30" />
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold mb-1">Sign in to book a session</p>
                                            <p className="text-white/40 text-sm">Create an account or log in to get started.</p>
                                        </div>
                                        <a
                                            href="/sign-in"
                                            className="px-6 py-3 bg-white text-black rounded-full font-bold uppercase text-xs tracking-widest hover:bg-stone-200 transition-colors"
                                        >
                                            Sign In
                                        </a>
                                    </div>
                                ) : !hasActivePlan ? (
                                    /* No active plan */
                                    <div className="flex flex-col items-center justify-center text-center gap-6 py-8">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center">
                                            <Leaf className="w-10 h-10 text-indigo-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-poppins text-white mb-2">No Active Plan</h3>
                                            <p className="text-white/50 text-sm max-w-xs mx-auto leading-relaxed">
                                                You need an active membership plan to book sessions. Choose a plan to get started on your wellness journey.
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <a
                                                href="/group-offerings"
                                                onClick={() => setIsOpen(false)}
                                                className="px-6 py-3 bg-indigo-600 text-white rounded-full font-bold uppercase text-xs tracking-widest hover:bg-indigo-700 transition-colors flex items-center gap-2 justify-center"
                                            >
                                                Group Plans <ArrowRight className="w-4 h-4" />
                                            </a>
                                            <a
                                                href="/personal-yoga"
                                                onClick={() => setIsOpen(false)}
                                                className="px-6 py-3 border border-white/20 text-white rounded-full font-bold uppercase text-xs tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2 justify-center"
                                            >
                                                Personal Yoga <ArrowRight className="w-4 h-4" />
                                            </a>
                                            <a
                                                href="/family-yoga"
                                                onClick={() => setIsOpen(false)}
                                                className="px-6 py-3 border border-white/20 text-white rounded-full font-bold uppercase text-xs tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2 justify-center"
                                            >
                                                Family Yoga <ArrowRight className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    /* Has active plan – show calendar + booked sessions */
                                    <div className="flex flex-col gap-8">
                                        {/* Success banner */}
                                        <AnimatePresence>
                                            {bookingSuccess && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    className="bg-green-500/10 border border-green-500/30 text-green-300 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium"
                                                >
                                                    ✓ Sessions booked successfully!
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {bookingError && (
                                            <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-2xl text-sm">
                                                {bookingError}
                                            </div>
                                        )}

                                        {/* Calendar */}
                                        <BookingCalendar
                                            selectedSlots={selectedSlots}
                                            onSelectSlot={setSelectedSlots}
                                            maxSelections={maxSelections}
                                            darkMode={true}
                                        />

                                        {/* Confirm button */}
                                        {selectedSlots.length > 0 && (
                                            <button
                                                onClick={handleConfirmBooking}
                                                disabled={isBookingSubmitting}
                                                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                            >
                                                {isBookingSubmitting ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Booking...
                                                    </>
                                                ) : (
                                                    <>
                                                        Confirm {selectedSlots.length} Session{selectedSlots.length > 1 ? 's' : ''} <ArrowRight className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        {/* Upcoming booked sessions */}
                                        {upcomingSessions.length > 0 && (
                                            <div>
                                                <h3 className="text-sm uppercase tracking-widest text-white/40 font-semibold mb-4 flex items-center gap-2">
                                                    <Clock className="w-4 h-4" /> Upcoming Sessions
                                                </h3>
                                                <div className="space-y-3">
                                                    {upcomingSessions.slice(0, 5).map((s, i) => (
                                                        <div key={i} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                                                            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                                                                <CalendarCheck className="w-5 h-5 text-indigo-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-white/80 text-sm font-semibold">
                                                                    {new Date(s.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                                                </p>
                                                                <p className="text-white/40 text-xs">{s.time} · {s.sessionType || 'Session'}</p>
                                                            </div>
                                                            <span className="ml-auto px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                                                                Upcoming
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CalendarButton;
