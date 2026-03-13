import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Mail, Activity, CheckCircle, Clock, Filter, Search, ChevronDown, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Booking {
    _id: string;
    userName: string;
    userEmail: string;
    date: string;
    time: string;
    sessionType: string;
    focusArea: string;
    intensity: number;
    status: string;
    createdAt: string;
}

const AdminDashboard: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchBookings = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings/all`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setBookings(data.data);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                setBookings(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b));
            }
        } catch (err) {
            console.error('Update failed', err);
        }
    };

    const filteredBookings = bookings
        .filter(b => filter === 'all' || b.status === filter)
        .filter(b =>
            b.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <div className="min-h-screen bg-stone-50 pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-serif italic text-stone-900 mb-2">Sanctuary Manager</h1>
                        <p className="text-stone-500">Overview of all booked sessions and practitioner journeys.</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-stone-200 shadow-sm">
                        <div className="flex items-center gap-2 px-4 border-r border-stone-100">
                            <Search className="w-4 h-4 text-stone-400" />
                            <input
                                type="text"
                                placeholder="Search practitioners..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent outline-none text-sm text-stone-900 placeholder-stone-400 w-48"
                            />
                        </div>
                        <div className="flex items-center gap-2 px-4">
                            <Filter className="w-4 h-4 text-stone-400" />
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="bg-transparent outline-none text-sm text-stone-900 cursor-pointer pr-4"
                            >
                                <option value="all">All Status</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-stone-900"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-6 rounded-3xl border border-red-100 text-center italic">
                        {error}
                    </div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-stone-50 border-b border-stone-100">
                                        <th className="p-6 text-xs uppercase tracking-widest text-stone-400 font-semibold">Practitioner</th>
                                        <th className="p-6 text-xs uppercase tracking-widest text-stone-400 font-semibold">Session</th>
                                        <th className="p-6 text-xs uppercase tracking-widest text-stone-400 font-semibold">Intensity</th>
                                        <th className="p-6 text-xs uppercase tracking-widest text-stone-400 font-semibold">Status</th>
                                        <th className="p-6 text-xs uppercase tracking-widest text-stone-400 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {filteredBookings.map((booking) => (
                                        <motion.tr
                                            key={booking._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-stone-50/50 transition-colors"
                                        >
                                            <td className="p-6">
                                                <div className="flex flex-col">
                                                    <span className="text-stone-900 font-medium">{booking.userName}</span>
                                                    <span className="text-stone-400 text-xs">{booking.userEmail}</span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2 text-stone-700 text-sm mb-1">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {booking.date}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-stone-400 text-xs">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {booking.time} • <span className="italic">{booking.sessionType}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-16 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-stone-900"
                                                            style={{ width: `${booking.intensity}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-stone-500 font-medium">{booking.intensity}%</span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${booking.status === 'confirmed' ? 'bg-green-50 text-green-600 border border-green-100' :
                                                    booking.status === 'completed' ? 'bg-stone-900 text-white' :
                                                        'bg-red-50 text-red-600 border border-red-100'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {booking.status === 'confirmed' && (
                                                        <button
                                                            onClick={() => updateStatus(booking._id, 'completed')}
                                                            className="p-2 border border-stone-200 rounded-full hover:bg-stone-900 hover:text-white transition-all text-stone-400"
                                                            title="Mark Completed"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <select
                                                        onChange={(e) => updateStatus(booking._id, e.target.value)}
                                                        className="text-xs bg-transparent border border-stone-200 rounded-full py-1 px-3 outline-none text-stone-500 hover:border-stone-400 cursor-pointer"
                                                        value={booking.status}
                                                    >
                                                        <option value="confirmed">Confirm</option>
                                                        <option value="completed">Complete</option>
                                                        <option value="cancelled">Cancel</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredBookings.length === 0 && (
                            <div className="p-12 text-center text-stone-400 italic">
                                No practitioner sessions found matching your criteria.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
