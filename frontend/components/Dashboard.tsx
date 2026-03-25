import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, Calendar, Clock, User, Mail, Shield, Settings, LogOut, Key, Eye, EyeOff, CheckCircle, Lock, CreditCard, Receipt, ExternalLink, Play, Video, Sparkles, FileText, Heart, Info, ChevronRight, Save, Camera, X, History, ArrowRight } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { storage } from '../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import BookingCalendar from './booking/BookingCalendar';
import { Calendar as CalendarIcon, Phone } from 'lucide-react';

declare global {
    interface Window {
        VANTA: any;
    }
}

const Dashboard: React.FC = () => {
    const { user, logout, updateUserPassword, updateUserPhoto, getIdToken } = useAuth();
    const { openBookingModal } = useBooking();
    const navigate = useNavigate();
    const photoInputRef = useRef<HTMLInputElement>(null);

    // Vanta.js background effect
    const [vantaEffect, setVantaEffect] = useState<any>(null);
    const vantaRef = useRef(null);

    useEffect(() => {
        // Only initialize heavy WebGL effect on desktop/tablet to save mobile battery
        if (!vantaEffect && window.VANTA && window.innerWidth > 768) {
            setVantaEffect(window.VANTA.FOG({
                el: vantaRef.current,
                mouseControls: false,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                highlightColor: 0x3d3d3d,
                midtoneColor: 0x1f1f23,
                lowlightColor: 0x09090b,
                baseColor: 0x0B0B0D,
                blurFactor: 0.30,
                speed: 0.50,
                zoom: 1.00
            }));
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    // Primary layout state
    const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
    const [settingsTab, setSettingsTab] = useState<'profile' | 'security' | 'billings'>('profile');

    // Password change state
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // Sessions state
    const [sessions, setSessions] = useState<any[]>([]);
    const [loadingSessions, setLoadingSessions] = useState(true);

    // Profile state
    const [profile, setProfile] = useState<any>({
        age: '',
        dob: '',
        health: 'Good',
        bmi: '',
        goal: '',
        styleOfYoga: '',
        experienceLevel: '',
        otherPhysicalActivity: '',
        medicalCondition: 'None',
        historyOfInjury: 'None',
        annamaya: 5,
        pranamaya: 5,
        manomaya: 5,
        vijnanamaya: 5,
        anandamaya: 5,
        isComplete: false
    });
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState(false);
    const [profileError, setProfileError] = useState('');

    // Photo upload state
    const [photoUploading, setPhotoUploading] = useState(false);
    const [photoUploadProgress, setPhotoUploadProgress] = useState(0);
    const [photoError, setPhotoError] = useState('');
    const [photoSuccess, setPhotoSuccess] = useState(false);

    // Subscription state
    const [subscription, setSubscription] = useState<any>({
        planName: 'Free',
        status: 'inactive',
        totalSessions: 0,
        sessionsUsed: 0,
        expiryDate: null
    });
    const [loadingSubscription, setLoadingSubscription] = useState(true);

    // Payment History state
    const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
    const [loadingPaymentHistory, setLoadingPaymentHistory] = useState(true);
    const [imgError, setImgError] = useState(false);

    // Embedded Calendar State
    const [selectedSlots, setSelectedSlots] = useState<{date: Date, time: string}[]>([]);
    const [isBookingDetailsOpen, setIsBookingDetailsOpen] = useState(false);
    const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
    const [bookingSuccessMode, setBookingSuccessMode] = useState(false);
    const [bookingError, setBookingError] = useState('');

    const isAdmin = !!localStorage.getItem('adminToken');

    // Fetch sessions
    React.useEffect(() => {
        const fetchSessions = async () => {
            if (!user?.email) return;
            try {
                const token = await getIdToken();
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings/user/${user.email}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const result = await response.json();
                    setSessions(result.data || []);
                }
            } catch (error) {
                console.error('Failed to fetch sessions:', error);
            } finally {
                setLoadingSessions(false);
            }
        };

        fetchSessions();
    }, [user?.email, getIdToken]);

    // Fetch profile (and ensure minimal profile exists for new signups)
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.email) return;
            try {
                const token = await getIdToken();
                const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                let response = await fetch(`${API}/api/profiles/${user.email}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.status === 204) {
                    await fetch(`${API}/api/profiles/ensure`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    response = await fetch(`${API}/api/profiles/${user.email}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                }
                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data) setProfile(result.data);
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchProfile();
    }, [user?.email, getIdToken]);

    // Fetch subscription
    useEffect(() => {
        const fetchSubscription = async () => {
            if (!user) return;
            try {
                const token = await getIdToken();
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/subscriptions/status`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data) {
                        setSubscription(result.data);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch subscription:', error);
            } finally {
                setLoadingSubscription(false);
            }
        };

        fetchSubscription();
    }, [user, getIdToken]);

    // Fetch payment history
    useEffect(() => {
        const fetchPaymentHistory = async () => {
            if (!user) return;
            try {
                const token = await getIdToken();
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/history`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data) {
                        setPaymentHistory(result.data);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch payment history:', error);
            } finally {
                setLoadingPaymentHistory(false);
            }
        };

        fetchPaymentHistory();
    }, [user, getIdToken]);

    if (!user) return null;

    const handlePhotoUpload = async (file: File) => {
        setPhotoError('');
        setPhotoSuccess(false);

        if (!file.type.startsWith('image/')) {
            setPhotoError('Please select a valid image file.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setPhotoError('Image must be smaller than 5 MB.');
            return;
        }

        setPhotoUploading(true);
        setPhotoUploadProgress(0);

        try {
            const storageRef = ref(storage, `profile-photos/${user.uid}/avatar`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setPhotoUploadProgress(progress);
                },
                (error) => {
                    console.error('Upload error:', error);
                    setPhotoError('Upload failed. Please try again.');
                    setPhotoUploading(false);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    await updateUserPhoto(downloadURL);
                    setPhotoUploading(false);
                    setPhotoSuccess(true);
                    setTimeout(() => setPhotoSuccess(false), 3000);
                }
            );
        } catch (err) {
            console.error('Photo upload error:', err);
            setPhotoError('An error occurred. Please try again.');
            setPhotoUploading(false);
        }
    };

    const handlePhotoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handlePhotoUpload(file);
        // reset so same file can be re-selected
        e.target.value = '';
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingProfile(true);
        setProfileError('');
        setProfileSuccess(false);

        try {
            const token = await getIdToken();
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/profiles/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...profile,
                    email: user.email
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    setProfile(result.data);
                }
                setProfileSuccess(true);
                setTimeout(() => setProfileSuccess(false), 3000);
            } else {
                setProfileError('Failed to update profile');
            }
        } catch (error) {
            console.error('Update profile error:', error);
            setProfileError('An error occurred while updating profile');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess(false);

        if (newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        setIsUpdating(true);
        try {
            await updateUserPassword(newPassword);
            setPasswordSuccess(true);
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            if (err.code === 'auth/requires-recent-login') {
                setPasswordError('Please log out and sign back in to change your password for security reasons.');
            } else {
                setPasswordError(err.message || 'Failed to update password');
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const rawName = user.displayName || user.email?.split('@')[0] || '';
    const firstName = rawName.split(' ')[0];
    const formattedFirstName = firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase() : '';

    const now = new Date();
    const upcomingSessions = sessions.filter(s => s.status === 'confirmed');
    const completedSessions = sessions.filter(s => s.status === 'completed');
    const pastSessions = sessions.filter(s => new Date(s.date) < now).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const privateSessions = upcomingSessions.filter(s => !s.sessionType?.toLowerCase().includes('group'));
    const groupSessions = upcomingSessions.filter(s => s.sessionType?.toLowerCase().includes('group'));

    const getRadarPoints = (profile: any) => {
        const center = 100;
        const maxDist = 80;
        const koshas = [
            profile.annamaya || 5,
            profile.pranamaya || 5,
            profile.manomaya || 5,
            profile.vijnanamaya || 5,
            profile.anandamaya || 5
        ];

        // Angles for 5-sided polygon (72 degrees each, starting at -90 for Top)
        const points = koshas.map((val, i) => {
            const angle = (i * 72 - 90) * (Math.PI / 180);
            const dist = (val / 10) * maxDist;
            const x = center + dist * Math.cos(angle);
            const y = center + dist * Math.sin(angle);
            return `${x},${y}`;
        });

        return points.join(' ');
    };

    const getPointPos = (val: number, index: number) => {
        const center = 100;
        const maxDist = 80;
        const angle = (index * 72 - 90) * (Math.PI / 180);
        const dist = (val / 10) * maxDist;
        return {
            x: center + dist * Math.cos(angle),
            y: center + dist * Math.sin(angle)
        };
    };

    const getKoshaInsight = (profile: any) => {
        const scores = [
            { name: 'Physical', score: profile.annamaya || 5, text: "Your physical foundation is strong. Focus on grounding movements today." },
            { name: 'Energy', score: profile.pranamaya || 5, text: "Your vitality is peaking. A perfect time for Pranayama." },
            { name: 'Mental', score: profile.manomaya || 5, text: "Your mind is clear and calm. Deep meditation will come easily." },
            { name: 'Wisdom', score: profile.vijnanamaya || 5, text: "Your intuition is sharp. Trust your inner guidance during practice." },
            { name: 'Bliss', score: profile.anandamaya || 5, text: "You are in a state of deep connection and peace." }
        ];
        const highest = [...scores].sort((a, b) => b.score - a.score)[0];
        return highest.text;
    };

    const [showLinkWait, setShowLinkWait] = useState(false);
    const FALLBACK_MEET_LINK = "https://meet.google.com/ngs-doim-gqq";

    const handleJoinClick = (booking: any) => {
        if (!isJoinable(booking.date, booking.time)) {
            setShowLinkWait(true);
            setTimeout(() => setShowLinkWait(false), 4000);
            return;
        }

        const linkToUse = (booking.meetingLink && booking.meetingLink.startsWith('http') && booking.meetingLink !== "Pending...")
            ? booking.meetingLink
            : FALLBACK_MEET_LINK;

        window.open(linkToUse, '_blank');
    };

    const isJoinable = (dateStr: string, timeStr: string) => {
        if (!dateStr || !timeStr) return false;
        try {
            const [time, modifier] = timeStr.split(' ');
            let [hours, minutes] = time.split(':');
            let h = parseInt(hours, 10);
            if (h === 12) {
                h = modifier.toUpperCase() === 'AM' ? 0 : 12;
            } else if (modifier.toUpperCase() === 'PM') {
                h += 12;
            }
            const sessionTime = new Date(dateStr);
            sessionTime.setHours(h, parseInt(minutes, 10), 0, 0);

            const now = new Date();
            const diffMs = sessionTime.getTime() - now.getTime();
            const diffMins = diffMs / 60000;

            // Joinable if it's 15 minutes before the start time or already past the start time
            return diffMins <= 15;
        } catch (e) {
            return true;
        }
    };

    const hasActivePlan = subscription?.status === 'active' && subscription?.sessionsUsed < subscription?.totalSessions && (!subscription.expiryDate || new Date(subscription.expiryDate) >= new Date());
    
    // Calculate max selections based on subscription if active, else 0 or 1 for individual purchase flow
    const availableSessions = hasActivePlan ? (subscription.totalSessions - subscription.sessionsUsed) : 0;
    
    // Assuming for now that if they don't have an active plan, they can't book directly here OR they can only select 1 and be redirected to buy
    const maxSelections = hasActivePlan ? availableSessions : 1;
    
    const handleConfirmBookingClick = () => {
        if (!hasActivePlan) {
            // Redirect to purchase plan if no active plan
            // The modal can handle this or we can redirect to a specific page
            openBookingModal(); 
            return;
        }
        setIsBookingDetailsOpen(true);
    };

    const handleBulkBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsBookingSubmitting(true);
        setBookingError('');
        
        try {
            const token = await getIdToken();
            const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            
             // Create bookings array from selected slots
             const bookingsData = selectedSlots.map(slot => {
                 // Format the date carefully for standard processing
                 const date = new Date(slot.date);
                 date.setHours(12,0,0,0);
                 
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
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ bookings: bookingsData })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setBookingSuccessMode(true);
                    setSelectedSlots([]); // cleared
                    
                    // Refresh sessions to show the new ones immediately
                    const responseSessions = await fetch(`${API}/api/bookings/user/${user.email}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                     if (responseSessions.ok) {
                         const sessResult = await responseSessions.json();
                         setSessions(sessResult.data || []);
                     }
                     // Refresh subscription to show updated session usage immediately
                     const responseSub = await fetch(`${API}/api/subscriptions/status`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                     if (responseSub.ok) {
                         const subResult = await responseSub.json();
                         setSubscription(subResult.data);
                     }
                } else {
                     setBookingError(result.message || 'Failed to confirm bookings.');
                }
            } else {
                 const err = await response.json();
                 setBookingError(err.message || 'Failed to connect to server.');
            }
        } catch (error: any) {
            console.error('Bulk booking error:', error);
            setBookingError(error.message || 'An unexpected error occurred.');
        } finally {
            setIsBookingSubmitting(false);
        }
    };
    
    // For when success modal is closed
    const handleCloseSuccess = () => {
         setBookingSuccessMode(false);
         setIsBookingDetailsOpen(false);
    };

    return (
        <div className="relative min-h-screen text-white font-sans bg-[#0B0B0D]">
            {/* Hidden file input for photo upload */}
            <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoInputChange}
            />

            {/* Fixed full-screen Vanta background */}
            <div
                ref={vantaRef}
                className="fixed inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 0 }}
            />

            {/* Scrollable content on top */}
            <div className="relative pt-32 pb-20 px-4 md:px-8 lg:px-12" style={{ zIndex: 1 }}>
                <div className="max-w-[1400px] mx-auto">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6"
                    >
                        <div>
                            <h1 className="text-4xl md:text-6xl font-serif italic mb-2">
                                Welcome, <span className="text-stone-400 font-serif italic">{formattedFirstName}</span>
                            </h1>
                            <p className="text-stone-500 text-lg tracking-wide">Your sanctuary for growth and stillness.</p>
                        </div>

                    </motion.div>

                    {activeTab === 'overview' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col gap-6 lg:gap-8"
                        >
                            {/* Top Details Bar - Health/Medical/Style */}
                            <div className="gradient-border-card bg-white/5 rounded-[2.5rem] p-6 lg:p-8 backdrop-blur-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden group transition-all duration-500">
                                <div className="absolute top-[-50%] right-[-10%] w-[40%] h-[200%] bg-gradient-to-l from-white/5 to-transparent blur-3xl pointer-events-none transform rotate-12" />

                                <div className="flex items-center gap-6 relative z-10 w-full lg:w-auto">
                                    <div
                                        className="w-20 h-20 rounded-full bg-gradient-to-br from-stone-700 to-stone-900 border-2 border-white/20 flex flex-shrink-0 items-center justify-center overflow-hidden shadow-2xl relative cursor-pointer group/avatar"
                                        onClick={() => photoInputRef.current?.click()}
                                        title="Click to change profile photo"
                                    >
                                        {user.photoURL && !imgError ? (
                                            <img
                                                src={user.photoURL}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                                onError={() => setImgError(true)}
                                            />
                                        ) : (
                                            <User className="w-8 h-8 text-stone-300" />
                                        )}
                                        {/* Camera hover overlay */}
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200">
                                            {photoUploading
                                                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                : <Camera className="w-5 h-5 text-white" />}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-4 mb-2">
                                            <h3 className="text-2xl font-serif italic text-white leading-none whitespace-nowrap">
                                                {formattedFirstName}'s Profile
                                            </h3>
                                            <span className={`px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold rounded-full border whitespace-nowrap ${subscription.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                {subscription.status === 'active' ? 'Active Member' : 'Inactive Member'}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-stone-400">
                                            <span className="flex items-center gap-2"><Activity className="w-3.5 h-3.5 text-stone-500" /> Health: <strong className="text-stone-200">{profile.health || 'Neutral'}</strong></span>
                                            <span className="w-1 h-1 bg-stone-700 rounded-full hidden sm:block" />
                                            <span className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-stone-500" /> Goal: <strong className="text-stone-200">{profile.goal || 'Wellness'}</strong></span>
                                            <span className="w-1 h-1 bg-stone-700 rounded-full hidden sm:block" />
                                            <span className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-stone-500" /> Style: <strong className="text-stone-200">{profile.styleOfYoga || 'Balance'}</strong></span>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full lg:w-auto flex justify-end gap-3 relative z-10 mt-4 lg:mt-0">
                                    {!profile.isComplete && (
                                        <button
                                            onClick={() => navigate('/questionnaire')}
                                            className="px-8 py-3.5 rounded-full bg-white text-black font-bold uppercase text-[10px] tracking-widest hover:bg-stone-200 transition-all duration-300 whitespace-nowrap shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                        >
                                            Complete Assessment
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Plan Expiry / Upgrade Banner */}
                            {(() => {
                                const expiryDate = subscription?.expiryDate ? new Date(subscription.expiryDate) : null;
                                const daysLeft = expiryDate ? Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
                                const isExpiringSoon = daysLeft !== null && daysLeft <= 7 && daysLeft > 0 && subscription?.status === 'active';
                                const isExpiredOrEmpty = subscription?.status !== 'active' || availableSessions <= 0;

                                if (isExpiringSoon) return (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-amber-500/10 border border-amber-500/30 text-amber-100 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl">⏳</span>
                                            <div>
                                                <p className="font-bold text-sm">Your plan expires in <strong className="text-amber-300">{daysLeft} day{daysLeft !== 1 ? 's' : ''}</strong></p>
                                                <p className="text-xs opacity-75 mt-0.5">Renew now to avoid any break in your practice.</p>
                                            </div>
                                        </div>
                                        <button onClick={() => openBookingModal()} className="shrink-0 px-5 py-2.5 bg-amber-400 text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-amber-300 transition-colors whitespace-nowrap">
                                            Renew Plan →
                                        </button>
                                    </motion.div>
                                );

                                if (isExpiredOrEmpty && subscription?.planName !== 'Free') return (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-rose-500/10 border border-rose-500/30 text-rose-100 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl">🔒</span>
                                            <div>
                                                <p className="font-bold text-sm">Your plan has ended or sessions are exhausted</p>
                                                <p className="text-xs opacity-75 mt-0.5">Upgrade or renew to keep booking live classes.</p>
                                            </div>
                                        </div>
                                        <button onClick={() => openBookingModal()} className="shrink-0 px-5 py-2.5 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-stone-200 transition-colors whitespace-nowrap">
                                            Upgrade Plan →
                                        </button>
                                    </motion.div>
                                );

                                return null;
                            })()}

                            {/* SCHEDULE & CALENDAR SECTION */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                                {/* Interactive Booking Calendar */}
                                <div className="lg:col-span-12 gradient-border-card bg-white/5 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-2xl relative overflow-hidden group transition-all duration-500">
                                    <div className="flex items-center justify-between mb-8 relative z-10">
                                        <h4 className="text-sm uppercase tracking-[0.2em] text-stone-400 font-bold font-poppins not-italic flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-indigo-400" /> Book Your Next Session(s)
                                        </h4>
                                        <button 
                                            onClick={() => openBookingModal()}
                                            className="text-xs uppercase tracking-widest font-bold text-white/50 hover:text-white transition-colors flex items-center gap-2"
                                        >
                                            Buy Plan <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                    
                                    {hasActivePlan && availableSessions <= 0 && (
                                         <div className="bg-red-500/10 border border-red-500/20 text-red-100 p-6 rounded-2xl mb-8 flex items-center justify-between">
                                            <div>
                                                <h5 className="font-bold text-lg mb-1">Session Limit Reached</h5>
                                                <p className="text-sm opacity-80">You have used all {subscription.totalSessions} sessions in your current plan. Please renew or buy a new plan to continue booking.</p>
                                            </div>
                                            <button 
                                                onClick={() => openBookingModal()}
                                                className="px-6 py-3 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap"
                                            >
                                                Renew Now
                                            </button>
                                         </div>
                                    )}

                                    {!hasActivePlan && (
                                        <div className="bg-stone-800/50 border border-white/10 text-stone-200 p-6 rounded-2xl mb-8 flex items-center justify-between">
                                            <div>
                                                <h5 className="font-bold text-lg mb-1">No Active Membership</h5>
                                                <p className="text-sm opacity-80">You need an active membership plan to book sessions directly from your dashboard.</p>
                                            </div>
                                            <button 
                                                onClick={() => openBookingModal()}
                                                className="px-6 py-3 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap"
                                            >
                                                View Plans
                                            </button>
                                         </div>
                                    )}
                                    {/* Interactive Booking Calendar */}
                                    <div className="mb-1 relative group">
                                        <div className="absolute inset-0 bg-indigo-500/5 rounded-[3rem] blur-xl transition-all duration-500 group-hover:bg-indigo-500/10" />

                                        <div className={`bg-[#16161a] border border-white/10 rounded-[3rem] p-6 lg:p-10 relative z-10 shadow-2xl transition-opacity ${(!hasActivePlan || availableSessions <= 0) ? 'opacity-50 pointer-events-none' : ''}`}>
                                            
                                            {/* Combined Action Banner Header */}
                                            <div className="mb-10 flex flex-col lg:flex-row items-center justify-between p-6 bg-white/5 border border-white/10 rounded-[2rem] gap-6 transition-all">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-14 h-14 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 flex-shrink-0">
                                                        <Calendar className="w-7 h-7 text-indigo-400 animate-pulse" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl lg:text-3xl font-poppins text-white mb-1">Book your next sessions</h3>
                                                        <p className="text-white/40 text-sm font-medium">Select up to <strong className="text-indigo-400">{maxSelections}</strong> time slots from the calendar below.</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleConfirmBookingClick}
                                                    disabled={selectedSlots.length === 0 || isBookingSubmitting}
                                                    className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold uppercase tracking-[0.2em] text-sm hover:bg-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none flex items-center gap-3 whitespace-nowrap w-full lg:w-auto justify-center"
                                                >
                                                    {isBookingSubmitting ? (
                                                        <>Booking...</>
                                                    ) : (
                                                        <>
                                                            Confirm Selection <ArrowRight className="w-5 h-5" />
                                                        </>
                                                    )}
                                                </button>
                                            </div>

                                            <BookingCalendar
                                                onSelectSlot={(slots) => setSelectedSlots(slots)}
                                                selectedSlots={selectedSlots}
                                                maxSelections={maxSelections}
                                                darkMode={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                                    
                                     {/* Booking Details Modal Sub-Flow */}
                                     {isBookingDetailsOpen && (
                                         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
                                             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsBookingDetailsOpen(false)} />
                                             <motion.div
                                                 initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                                 animate={{ opacity: 1, scale: 1, y: 0 }}
                                                 className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                                             >
                                                {!bookingSuccessMode ? (
                                                    <div className="flex-1 overflow-y-auto">
                                                        <div className="bg-stone-50 p-6 sm:p-8 border-b border-stone-200 flex justify-between items-center sticky top-0 z-10">
                                                            <div>
                                                                <h2 className="text-2xl font-serif italic text-slate-800">Confirm Your Bookings</h2>
                                                                <p className="text-stone-500 text-sm mt-1">You are about to book {selectedSlots.length} session{selectedSlots.length > 1 ? 's' : ''}.</p>
                                                            </div>
                                                            <button onClick={() => setIsBookingDetailsOpen(false)} className="p-2 rounded-full hover:bg-stone-200 text-stone-500 transition-colors">
                                                                <X className="w-6 h-6" />
                                                            </button>
                                                        </div>
                                                        <div className="p-6 sm:p-8">
                                                            <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-5 mb-8">
                                                                <div className="flex items-start gap-4">
                                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                                                        <Info className="w-5 h-5 text-indigo-600" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-sm font-bold text-indigo-900 mb-1 leading-tight">Booking Summary</h4>
                                                                        <p className="text-sm text-indigo-700">
                                                                            These sessions will be deducted from your active <strong className="font-bold">{subscription.planName}</strong> plan.
                                                                            You currently have <strong className="font-bold">{availableSessions}</strong> sessions remaining.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <h3 className="text-slate-800 font-semibold mb-4 text-sm tracking-wide uppercase">Selected Dates & Times</h3>
                                                            <div className="space-y-3 mb-8 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar-black">
                                                                {selectedSlots.map((slot, index) => (
                                                                    <div key={index} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-200">
                                                                        <div className="flex items-center gap-4">
                                                                            <span className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-500 shrink-0">
                                                                                {index + 1}
                                                                            </span>
                                                                            <span className="font-medium text-slate-800 font-serif text-lg">
                                                                                {slot.date.toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
                                                                            </span>
                                                                        </div>
                                                                        <span className="px-3 py-1.5 bg-black text-white text-xs font-bold tracking-widest rounded-lg">
                                                                            {slot.time}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            {bookingError && (
                                                                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 border border-red-100 flex items-start gap-3">
                                                                    <Info className="w-5 h-5 shrink-0 mt-0.5" />
                                                                    {bookingError}
                                                                </div>
                                                            )}

                                                            <button 
                                                                onClick={handleBulkBookingSubmit}
                                                                disabled={isBookingSubmitting}
                                                                className="w-full bg-black text-white py-5 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-stone-800 transition-colors shadow-lg disabled:opacity-70 flex justify-center items-center gap-2"
                                                            >
                                                                {isBookingSubmitting ? (
                                                                    <>Processing {selectedSlots.length} Bookings...</>
                                                                ) : (
                                                                    <>Confirm & Book {selectedSlots.length} Sessions</>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                                                         <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                                            <CheckCircle className="w-12 h-12 text-green-500" />
                                                        </div>
                                                        <h2 className="text-3xl font-serif italic text-slate-900 mb-2">Bookings Confirmed!</h2>
                                                        <p className="text-stone-500 mb-8 max-w-sm mx-auto">
                                                            You have successfully scheduled <strong className="text-slate-800 font-bold">{selectedSlots.length} session{selectedSlots.length > 1 ? 's' : ''}</strong>. 
                                                            Your session calendar has been updated.
                                                        </p>
                                                        <button 
                                                            onClick={handleCloseSuccess}
                                                            className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-stone-800 transition-colors"
                                                        >
                                                            Back to Dashboard
                                                        </button>
                                                    </div>
                                                )}
                                             </motion.div>
                                         </div>
                                     )}
                                </div>

                            {/* Main Grid: Left (Package) | Right (Logs) */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                                {/* LEFT COLUMN: Package & Progress (5 cols) */}
                                <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8">

                                    {/* Your Package Card */}
                                    <div className="gradient-border-card bg-white/5 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-2xl relative overflow-hidden group transition-all duration-500">
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-all duration-700 group-hover:bg-white/10 group-hover:scale-125" />

                                        <div className="flex items-center justify-between mb-8 relative z-10">
                                            <h4 className="text-xs uppercase tracking-[0.2em] text-stone-400 font-semibold flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-indigo-400" /> Your Package
                                            </h4>
                                            <div className="p-2 bg-white/5 border border-white/10 rounded-full text-stone-300">
                                                <CreditCard className="w-4 h-4" />
                                            </div>
                                        </div>

                                        <div className="flex items-end justify-between mb-8 relative z-10">
                                            <div>
                                                <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-2 font-semibold">Package Type</p>
                                                <p className="text-3xl font-serif italic text-white leading-none">{subscription.planName || 'Discovery'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1 font-semibold">Status</p>
                                                <p className={`text-2xl font-light tracking-tight capitalize ${subscription.status === 'active' ? 'text-emerald-400' : 'text-red-400'}`}>{subscription.status}</p>
                                            </div>
                                        </div>

                                        <div className="h-px bg-white/10 w-full mb-8" />

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4 relative z-10">
                                            <div>
                                                <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1.5 font-semibold">Total Sessions</p>
                                                <p className="text-xl font-medium text-white tracking-wide">{subscription.totalSessions}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1.5 font-semibold">Completed Classes</p>
                                                <p className="text-xl font-medium text-white tracking-wide">{completedSessions.length}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1.5 font-semibold">Amount Paid</p>
                                                <p className={`text-xl font-medium tracking-wide ${subscription.amountPaid > 0 ? 'text-white' : 'text-green-400'}`}>
                                                    {subscription.amountPaid > 0 
                                                        ? `${subscription.currency === 'USD' ? '$' : '₹'}${subscription.amountPaid}` 
                                                        : (subscription.amountPaid === 0 ? 'Free (Promo)' : 'N/A')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1.5 font-semibold">Booked / Upcoming</p>
                                                <p className="text-lg font-medium text-stone-300 tracking-wide">{subscription.sessionsUsed - completedSessions.length}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1.5 font-semibold">Remaining to Book</p>
                                                <p className="text-lg font-medium text-stone-300 tracking-wide">{Math.max(0, subscription.totalSessions - subscription.sessionsUsed)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1.5 font-semibold">Expiration</p>
                                                <p className="text-lg font-medium text-stone-300 tracking-wide">
                                                    {subscription.expiryDate ? new Date(subscription.expiryDate).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Your Progress Cards */}
                                    <div className="grid grid-cols-2 gap-4 lg:gap-6">
                                        <div className="gradient-border-card-alt bg-white/5 rounded-[2.5rem] p-6 md:p-8 backdrop-blur-2xl flex flex-col justify-between transition-all duration-500 relative overflow-hidden group">
                                            <div className="absolute bottom-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-all duration-500"><User className="w-32 h-32" /></div>
                                            <div className="flex items-center justify-between mb-8 relative z-10">
                                                <div className="w-14 h-14 rounded-full bg-white/10 border border-white/5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                                                    <User className="w-6 h-6 text-stone-200" />
                                                </div>
                                            </div>
                                            <div className="relative z-10">
                                                <p className="text-5xl font-light text-white tracking-tight mb-2 drop-shadow-sm">{completedSessions.length}</p>
                                                <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em] font-bold mt-1">Completed Classes</p>
                                            </div>
                                        </div>

                                        <div className="gradient-border-card-alt bg-white/5 rounded-[2.5rem] p-6 md:p-8 backdrop-blur-2xl flex flex-col justify-between transition-all duration-500 relative overflow-hidden group">
                                            <div className="absolute bottom-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-all duration-500"><Activity className="w-32 h-32" /></div>
                                            <div className="flex items-center justify-between mb-8 relative z-10">
                                                <div className="w-14 h-14 rounded-full bg-stone-800 border border-white/5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                                                    <Activity className="w-6 h-6 text-stone-200" />
                                                </div>
                                            </div>
                                            <div className="relative z-10">
                                                <p className="text-5xl font-light text-white tracking-tight mb-2 drop-shadow-sm">{Math.max(0, subscription.totalSessions - subscription.sessionsUsed)}</p>
                                                <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em] font-bold mt-1">Available to Book</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recorded Video Links Button */}
                                    <button className="gradient-border-card-alt bg-white/5 rounded-full py-5 px-8 backdrop-blur-2xl flex justify-between items-center cursor-pointer hover:bg-white/10 transition-all duration-300 group shadow-lg">
                                        <span className="text-sm text-stone-200 font-bold tracking-widest uppercase">Recorded Video Links</span>
                                        <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 group-hover:bg-stone-200 transition-all duration-300 shadow-lg">
                                            <ExternalLink className="w-4 h-4" />
                                        </div>
                                    </button>

                                </div>

                                {/* RIGHT COLUMN: Class Logs & Usage (7 cols) */}
                                <div className="lg:col-span-7 flex flex-col h-full">

                                    {/* Class Logs Container */}
                                    <div className="gradient-border-card bg-white/5 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-2xl flex-1 flex flex-col relative overflow-hidden group transition-all duration-500 h-full">

                                        {/* Header */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 border-b border-white/10 pb-8">
                                            <h4 className="text-xs uppercase tracking-[0.2em] text-stone-400 font-bold flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Class Logs
                                            </h4>

                                            {/* Top-Right Pills */}
                                            <div className="flex p-1.5 bg-black/40 rounded-full border border-white/5 backdrop-blur-md">
                                                <button className="px-6 py-2 bg-white text-black rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl scale-100">Active Logs</button>
                                                <button className="px-6 py-2 text-stone-400 hover:text-white rounded-full text-[10px] font-bold uppercase tracking-widest transition-all">Add-ons</button>
                                            </div>
                                        </div>

                                        {!hasActivePlan ? (
                                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-black/40 rounded-3xl border border-white/10 backdrop-blur-md relative z-20">
                                                <Lock className="w-12 h-12 text-stone-500 mb-4" />
                                                <h3 className="text-2xl font-poppins mb-2 text-white">Plan Inactive</h3>
                                                <p className="text-stone-400 text-sm max-w-sm mb-6">Your plan is either expired or you have no sessions remaining. Please upgrade or renew your package to book new sessions and access class links.</p>
                                                <button onClick={() => navigate('/family-plan')} className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-stone-200 transition-colors">
                                                    View Packages
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-12 flex-1 relative z-10 transition-all duration-300">
                                                {/* Private Sessions */}
                                                <div className="space-y-6">
                                                    <h5 className="flex items-center gap-4 text-sm font-semibold tracking-widest uppercase text-stone-300">
                                                        <div className="p-2 rounded-full bg-white/10 border border-white/5"><User className="w-4 h-4 text-stone-200" /></div>
                                                        Private Sessions
                                                    </h5>
                                                    <div className="space-y-4">
                                                        {privateSessions.length > 0 ? (
                                                            privateSessions.slice(0, 2).map((session, i) => (
                                                                <div key={session._id || i} className="flex flex-col xl:flex-row xl:items-center justify-between p-5 rounded-3xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 gap-6 group/item">
                                                                    <div className="flex items-center gap-6 w-full xl:w-auto">
                                                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-stone-800 to-stone-900 border border-white/10 flex flex-col items-center justify-center shadow-inner flex-shrink-0 group-hover/item:border-white/30 transition-colors">
                                                                            <span className="text-[10px] text-stone-400 uppercase font-bold tracking-widest leading-tight">{new Date(session.date).toLocaleString('default', { month: 'short' }) || 'Oct'}</span>
                                                                            <span className="text-xl font-bold text-white leading-tight mt-0.5">{new Date(session.date).getDate() || (10 + i)}</span>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-white font-semibold text-base md:text-lg tracking-wide">{session.sessionType || '1:1 Coaching'}</p>
                                                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                                                <span className="text-[10px] text-stone-300 uppercase tracking-widest font-bold bg-black/40 px-2.5 py-1 rounded border border-white/5">{session.time || '10:00 AM'}</span>
                                                                                <span className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-stone-600" /> Amanda</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleJoinClick(session)}
                                                                        className={`w-full xl:w-auto px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-[1.02] whitespace-nowrap ${isJoinable(session.date, session.time) ? 'bg-white text-black hover:bg-stone-200' : 'bg-white/10 text-stone-500 cursor-not-allowed border border-white/5'}`}
                                                                    >
                                                                        <Video className={`w-4 h-4 ${isJoinable(session.date, session.time) ? 'fill-black' : 'fill-stone-500'}`} />
                                                                        {isJoinable(session.date, session.time) ? 'Join Class' : 'Unlocks 15m prior'}
                                                                    </button>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="flex flex-col items-center justify-center p-8 bg-white/[0.02] rounded-3xl border border-white/[0.05] border-dashed">
                                                                <User className="w-8 h-8 text-stone-600 mb-3" />
                                                                <p className="text-stone-400 font-medium text-sm">No private sessions booked.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Group Classes */}
                                                <div className="space-y-6">
                                                    <h5 className="flex items-center gap-4 text-sm font-semibold tracking-widest uppercase text-stone-300">
                                                        <div className="p-2 rounded-full bg-stone-800 border border-white/5"><Activity className="w-4 h-4 text-stone-200" /></div>
                                                        Group Classes
                                                    </h5>
                                                    <div className="space-y-4">
                                                        {groupSessions.length > 0 ? (
                                                            groupSessions.slice(0, 2).map((session, i) => (
                                                                <div key={session._id || i} className="flex flex-col xl:flex-row xl:items-center justify-between p-5 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 gap-6 group/item">
                                                                    <div className="flex items-center gap-6 w-full xl:w-auto">
                                                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-stone-800 to-stone-900 border border-white/10 flex flex-col items-center justify-center shadow-inner flex-shrink-0 group-hover/item:border-white/30 transition-colors">
                                                                            <span className="text-[10px] text-stone-400 uppercase font-bold tracking-widest leading-tight">{new Date(session.date).toLocaleString('default', { month: 'short' }) || 'Oct'}</span>
                                                                            <span className="text-xl font-bold text-white leading-tight mt-0.5">{new Date(session.date).getDate() || (20 + i)}</span>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-white font-semibold text-base md:text-lg tracking-wide">{session.focusArea || 'Breath & Mindfulness'}</p>
                                                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                                                <span className="text-[10px] text-stone-300 uppercase tracking-widest font-bold bg-black/40 px-2.5 py-1 rounded border border-white/5">{session.time || '18:00 PM'}</span>
                                                                                <span className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-stone-600" /> {session.sessionType}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleJoinClick(session)}
                                                                        className={`w-full xl:w-auto px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap hover:scale-[1.02] ${isJoinable(session.date, session.time) ? 'bg-white/10 text-white border border-white/30 hover:bg-white/20' : 'bg-transparent border border-white/20 text-stone-500 cursor-not-allowed'}`}
                                                                    >
                                                                        {isJoinable(session.date, session.time) ? (
                                                                            <><Video className="w-4 h-4 fill-white" /> Join Class</>
                                                                        ) : 'Unlocks 15m prior'}
                                                                    </button>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div onClick={() => openBookingModal()} className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 flex justify-between items-center group cursor-pointer border-dashed hover:border-solid">
                                                                <div className="flex items-center gap-6">
                                                                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center"><Calendar className="w-6 h-6 text-stone-400 group-hover:text-stone-200 transition-colors" /></div>
                                                                    <div>
                                                                        <p className="text-white font-semibold text-base tracking-wide group-hover:text-stone-200">Book a Group Class</p>
                                                                        <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-1.5 font-bold">Explore upcoming sessions</p>
                                                                    </div>
                                                                </div>
                                                                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-stone-400 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all shadow-lg"><ExternalLink className="w-4 h-4" /></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}


                                    </div>
                                </div>
                            </div>

                            {/* NEW ROW: Koshas Radar & Instructor Notes */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                                {/* Koshas Radar Chart (5 cols) */}
                                <div className="lg:col-span-5 gradient-border-card bg-white/5 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-2xl relative overflow-hidden group transition-all duration-500">
                                    <div className="flex items-center justify-between mb-8 relative z-10">
                                        <h4 className="text-xs uppercase tracking-[0.2em] text-stone-400 font-bold flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.8)]" /> Kosha Balance
                                        </h4>
                                        <div className="p-2 bg-white/5 border border-white/10 rounded-full text-stone-300">
                                            <Activity className="w-4 h-4" />
                                        </div>
                                    </div>

                                    {/* Custom SVG Radar */}
                                    <div className="relative w-full aspect-square max-w-[280px] mx-auto flex items-center justify-center">
                                        <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90 origin-center drop-shadow-2xl">
                                            {/* Background concentric polygons */}
                                            <polygon points="100,20 176,75 147,165 53,165 24,75" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                                            <polygon points="100,40 157,81 135,145 65,145 43,81" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                                            <polygon points="100,60 138,88 123,125 77,125 62,88" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
                                            <polygon points="100,80 119,94 112,105 88,105 81,94" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                                            {/* Axes lines */}
                                            <line x1="100" y1="100" x2="100" y2="20" stroke="rgba(255,255,255,0.1)" />
                                            <line x1="100" y1="100" x2="176" y2="75" stroke="rgba(255,255,255,0.1)" />
                                            <line x1="100" y1="100" x2="147" y2="165" stroke="rgba(255,255,255,0.1)" />
                                            <line x1="100" y1="100" x2="53" y2="165" stroke="rgba(255,255,255,0.1)" />
                                            <line x1="100" y1="100" x2="24" y2="75" stroke="rgba(255,255,255,0.1)" />

                                            {/* Data Polygon (Animated) */}
                                            <motion.polygon
                                                initial={{ points: "100,100 100,100 100,100 100,100 100,100" }}
                                                animate={{ points: getRadarPoints(profile) }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                fill="rgba(45,212,191,0.15)"
                                                stroke="#2dd4bf"
                                                strokeWidth="2"
                                            />

                                            {/* Data Points */}
                                            {[
                                                profile.annamaya || 5,
                                                profile.pranamaya || 5,
                                                profile.manomaya || 5,
                                                profile.vijnanamaya || 5,
                                                profile.anandamaya || 5
                                            ].map((val, i) => {
                                                const pos = getPointPos(val, i);
                                                return <circle key={i} cx={pos.x} cy={pos.y} r="4" fill="#fff" stroke="#2dd4bf" strokeWidth="2" />;
                                            })}
                                        </svg>

                                        {/* Labels overlaid via absolute positioning */}
                                        <div className="absolute top-0 inset-x-0 text-center -mt-2">
                                            <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest leading-none drop-shadow-md">Annamaya</p>
                                            <p className="text-[8px] text-stone-500 uppercase font-medium mt-0.5">Physical</p>
                                        </div>
                                        <div className="absolute right-[-10px] top-[30%] text-left">
                                            <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest leading-none drop-shadow-md">Pranamaya</p>
                                            <p className="text-[8px] text-stone-500 uppercase font-medium mt-0.5">Energy</p>
                                        </div>
                                        <div className="absolute right-5 bottom-0 text-left">
                                            <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest leading-none drop-shadow-md">Manomaya</p>
                                            <p className="text-[8px] text-stone-500 uppercase font-medium mt-0.5">Mental</p>
                                        </div>
                                        <div className="absolute left-0 bottom-0 text-right">
                                            <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest leading-none drop-shadow-md">Vijnanamaya</p>
                                            <p className="text-[8px] text-stone-500 uppercase font-medium mt-0.5">Wisdom</p>
                                        </div>
                                        <div className="absolute left-[-15px] top-[30%] text-right">
                                            <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest leading-none drop-shadow-md">Anandamaya</p>
                                            <p className="text-[8px] text-stone-500 uppercase font-medium mt-0.5">Bliss</p>
                                        </div>
                                    </div>
                                    <div className="text-center mt-6">
                                        {!profile?.isComplete ? (
                                            <div className="animate-pulse">
                                                <p className="text-[10px] text-stone-400 font-medium mb-3">Please fill the assessment form to know your Koshas progress.</p>
                                                <button onClick={() => navigate('/questionnaire')} className="px-5 py-2 rounded-full border border-teal-500/30 text-teal-400 hover:bg-teal-500/10 transition-colors text-[10px] font-bold uppercase tracking-widest">
                                                    Complete Assessment
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-stone-400 font-medium italic">"{getKoshaInsight(profile)}"</p>
                                        )}
                                    </div>
                                </div>

                                {/* Classes History (7 cols) */}
                                <div className="lg:col-span-7 gradient-border-card bg-white/5 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-2xl relative overflow-hidden group transition-all duration-500 flex flex-col justify-between h-full">
                                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

                                    <div className="flex items-center justify-between mb-8 relative z-10">
                                        <h4 className="text-xs uppercase tracking-[0.2em] text-stone-400 font-bold flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]" /> Classes History
                                        </h4>
                                        <div className="p-2 bg-white/5 border border-white/10 rounded-full text-stone-300">
                                            <History className="w-4 h-4" />
                                        </div>
                                    </div>

                                    <div className="relative z-10 flex-1 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                                        {pastSessions.length > 0 ? (
                                            <div className="space-y-4">
                                                {pastSessions.map((session, i) => (
                                                    <div key={session._id || i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 group/history-item">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-xl bg-stone-800 border border-white/10 flex flex-col items-center justify-center flex-shrink-0 group-hover/history-item:border-white/20 transition-colors">
                                                                <span className="text-[8px] text-stone-500 uppercase font-bold tracking-tighter">{new Date(session.date).toLocaleString('default', { month: 'short' })}</span>
                                                                <span className="text-sm font-bold text-white leading-tight">{new Date(session.date).getDate()}</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-stone-200 font-semibold text-sm tracking-wide">{session.sessionType || 'Yoga Session'}</p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className="text-[9px] text-stone-500 font-medium uppercase tracking-widest">{session.time}</span>
                                                                    <span className="w-1 h-1 rounded-full bg-stone-700" />
                                                                    <span className="text-[9px] text-green-500/80 font-bold uppercase tracking-widest">Completed</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button className="p-2 rounded-full bg-white/5 border border-white/10 text-stone-400 hover:text-white hover:bg-white/10 transition-all">
                                                            <FileText className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
                                                <History className="w-10 h-10 mb-3 text-stone-600" />
                                                <p className="text-sm font-medium tracking-wide">No past sessions found.</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-white/10 relative z-10 flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
                                        <span>Total Sessions Attended</span>
                                        <span className="text-white text-lg font-serif italic">{pastSessions.length}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'settings' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-10"
                        >
                            {/* Settings Sidebar */}
                            <div className="md:col-span-1 space-y-3">
                                <h4 className="text-xs uppercase tracking-[0.2em] text-stone-500 font-bold mb-6 px-4">Account Settings</h4>
                                <button
                                    onClick={() => setSettingsTab('profile')}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${settingsTab === 'profile' ? 'bg-white text-black font-bold shadow-lg' : 'text-stone-400 hover:bg-white/5 font-medium'}`}
                                >
                                    <User className="w-5 h-5" />
                                    <span className="text-sm">Profile Details</span>
                                </button>
                                <button
                                    onClick={() => setSettingsTab('security')}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${settingsTab === 'security' ? 'bg-white text-black font-bold shadow-lg' : 'text-stone-400 hover:bg-white/5 font-medium'}`}
                                >
                                    <Key className="w-5 h-5" />
                                    <span className="text-sm">Security & Password</span>
                                </button>
                                <button
                                    onClick={() => setSettingsTab('billings')}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${settingsTab === 'billings' ? 'bg-white text-black font-bold shadow-lg' : 'text-stone-400 hover:bg-white/5 font-medium'}`}
                                >
                                    <CreditCard className="w-5 h-5" />
                                    <span className="text-sm">Billings & Plans</span>
                                </button>
                            </div>

                            {/* Settings Content */}
                            <div className="md:col-span-3">
                                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-2xl min-h-[500px]">
                                    {settingsTab === 'profile' && (
                                        <div className="space-y-10">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/5">
                                                        <Settings className="w-6 h-6 text-stone-200" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-3xl font-serif italic text-white">Account Info</h3>
                                                        <p className="text-stone-500 text-sm mt-1">Manage your personal and health information</p>
                                                    </div>
                                                </div>
                                                {profileSuccess && (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                                                    >
                                                        <CheckCircle className="w-4 h-4" /> Profile Updated
                                                    </motion.div>
                                                )}
                                            </div>

                                            {/* Profile Photo Section */}
                                            <div className="flex flex-col sm:flex-row items-center gap-8 p-6 bg-black/20 rounded-3xl border border-white/10">
                                                <div className="relative flex-shrink-0">
                                                    <div
                                                        className="w-24 h-24 rounded-full bg-gradient-to-br from-stone-700 to-stone-900 border-2 border-white/20 flex items-center justify-center overflow-hidden shadow-2xl cursor-pointer group/photo relative"
                                                        onClick={() => photoInputRef.current?.click()}
                                                    >
                                                        {user.photoURL
                                                            ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                                            : <User className="w-10 h-10 text-stone-400" />}
                                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity duration-200 rounded-full">
                                                            {photoUploading
                                                                ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                                : <Camera className="w-6 h-6 text-white" />}
                                                        </div>
                                                    </div>
                                                    {photoUploading && (
                                                        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-stone-900 border border-white/20 flex items-center justify-center">
                                                            <span className="text-[9px] font-bold text-white">{photoUploadProgress}%</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 text-center sm:text-left">
                                                    <h4 className="text-white font-semibold text-lg mb-1">Profile Photo</h4>
                                                    <p className="text-stone-500 text-sm mb-4">Upload a JPG or PNG image, max 5 MB</p>
                                                    <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                                                        <button
                                                            type="button"
                                                            onClick={() => photoInputRef.current?.click()}
                                                            disabled={photoUploading}
                                                            className="px-5 py-2.5 rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-stone-200 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                                                        >
                                                            <Camera className="w-3.5 h-3.5" />
                                                            {photoUploading ? `Uploading ${photoUploadProgress}%…` : 'Change Photo'}
                                                        </button>
                                                        {user.photoURL && (
                                                            <button
                                                                type="button"
                                                                onClick={() => updateUserPhoto('')}
                                                                disabled={photoUploading}
                                                                className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-stone-400 text-xs font-bold uppercase tracking-widest hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                                                            >
                                                                <X className="w-3.5 h-3.5" /> Remove
                                                            </button>
                                                        )}
                                                    </div>
                                                    {photoSuccess && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: 4 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-green-400 text-xs font-bold uppercase tracking-widest mt-3 flex items-center gap-1.5"
                                                        >
                                                            <CheckCircle className="w-3.5 h-3.5" /> Photo updated!
                                                        </motion.p>
                                                    )}
                                                    {photoError && (
                                                        <p className="text-red-400 text-xs mt-3">{photoError}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <form onSubmit={handleProfileUpdate} className="space-y-8">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Basic Info */}
                                                    <div className="space-y-2">
                                                        <label className="text-stone-400 text-xs uppercase tracking-widest ml-2 font-bold">Full Name</label>
                                                        <div className="bg-black/30 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                                                            <User className="w-5 h-5 text-stone-500" />
                                                            <span className="text-white font-medium">{user.displayName || 'Not set'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-stone-400 text-xs uppercase tracking-widest ml-2 font-bold">Email Address</label>
                                                        <div className="bg-black/30 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                                                            <Mail className="w-5 h-5 text-stone-500" />
                                                            <span className="text-white font-medium">{user.email}</span>
                                                        </div>
                                                    </div>

                                                    {/* New Detailed Fields */}
                                                    <div className="space-y-2">
                                                        <label className="text-stone-400 text-xs uppercase tracking-widest ml-2 font-bold">Age</label>
                                                        <div className="bg-black/30 border border-white/10 rounded-2xl p-4 flex items-center gap-4 focus-within:border-white/30 transition-all">
                                                            <Activity className="w-5 h-5 text-stone-500" />
                                                            <input
                                                                type="text"
                                                                value={profile.age}
                                                                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                                                                placeholder="e.g. 28"
                                                                className="bg-transparent text-white outline-none flex-1 text-sm font-poppins placeholder:text-stone-600"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-stone-400 text-xs uppercase tracking-widest ml-2 font-bold">D.O.B.</label>
                                                        <div className="bg-black/30 border border-white/10 rounded-2xl p-4 flex items-center gap-4 focus-within:border-white/30 transition-all">
                                                            <Calendar className="w-5 h-5 text-stone-500" />
                                                            <input
                                                                type="text"
                                                                value={profile.dob}
                                                                onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                                                                placeholder="YYYY-MM-DD"
                                                                className="bg-transparent text-white outline-none flex-1 text-sm font-poppins placeholder:text-stone-600"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-stone-400 text-xs uppercase tracking-widest ml-2 font-bold">Health Status</label>
                                                        <div className="bg-black/30 border border-white/10 rounded-2xl p-4 flex items-center gap-4 focus-within:border-white/30 transition-all">
                                                            <Heart className="w-5 h-5 text-stone-500" />
                                                            <input
                                                                type="text"
                                                                value={profile.health}
                                                                onChange={(e) => setProfile({ ...profile, health: e.target.value })}
                                                                placeholder="e.g. Good, Excellent"
                                                                className="bg-transparent text-white outline-none flex-1 text-sm font-poppins placeholder:text-stone-600"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-stone-400 text-xs uppercase tracking-widest ml-2 font-bold">BMI (Height/Weight)</label>
                                                        <div className="bg-black/30 border border-white/10 rounded-2xl p-4 flex items-center gap-4 focus-within:border-white/30 transition-all">
                                                            <Activity className="w-5 h-5 text-stone-500" />
                                                            <input
                                                                type="text"
                                                                value={profile.bmi}
                                                                onChange={(e) => setProfile({ ...profile, bmi: e.target.value })}
                                                                placeholder="e.g. 22.5 (70kg/175cm)"
                                                                className="bg-transparent text-white outline-none flex-1 text-sm font-poppins placeholder:text-stone-600"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-stone-400 text-xs uppercase tracking-widest ml-2 font-bold">Main Goal</label>
                                                        <div className="bg-black/30 border border-white/10 rounded-2xl p-4 flex items-center gap-4 focus-within:border-white/30 transition-all">
                                                            <Sparkles className="w-5 h-5 text-stone-500" />
                                                            <input
                                                                type="text"
                                                                value={profile.goal}
                                                                onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
                                                                placeholder="e.g. Weight loss, Stress relief"
                                                                className="bg-transparent text-white outline-none flex-1 text-sm font-poppins placeholder:text-stone-600"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-stone-400 text-xs uppercase tracking-widest ml-2 font-bold">Style of Yoga</label>
                                                        <div className="bg-black/30 border border-white/10 rounded-2xl p-4 flex items-center gap-4 focus-within:border-white/30 transition-all">
                                                            <User className="w-5 h-5 text-stone-500" />
                                                            <input
                                                                type="text"
                                                                value={profile.styleOfYoga}
                                                                onChange={(e) => setProfile({ ...profile, styleOfYoga: e.target.value })}
                                                                placeholder="e.g. Vinyasa, Hatha"
                                                                className="bg-transparent text-white outline-none flex-1 text-sm font-poppins placeholder:text-stone-600"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2 md:col-span-2">
                                                        <label className="text-stone-400 text-xs uppercase tracking-widest ml-2 font-bold">Experience Level</label>
                                                        <div className="bg-black/30 border border-white/10 rounded-2xl p-4 flex items-center gap-4 focus-within:border-white/30 transition-all">
                                                            <Shield className="w-5 h-5 text-stone-500" />
                                                            <input
                                                                type="text"
                                                                value={profile.experienceLevel}
                                                                onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value })}
                                                                placeholder="e.g. Beginner (6 months), Intermediate"
                                                                className="bg-transparent text-white outline-none flex-1 text-sm font-poppins placeholder:text-stone-600"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2 md:col-span-2">
                                                        <label className="text-stone-400 text-xs uppercase tracking-widest ml-2 font-bold">Other Physical Activities/Sports</label>
                                                        <div className="bg-black/30 border border-white/10 rounded-2xl p-4 flex items-center gap-4 focus-within:border-white/30 transition-all">
                                                            <Activity className="w-5 h-5 text-stone-500" />
                                                            <input
                                                                type="text"
                                                                value={profile.otherPhysicalActivity}
                                                                onChange={(e) => setProfile({ ...profile, otherPhysicalActivity: e.target.value })}
                                                                placeholder="e.g. Running, Swimming"
                                                                className="bg-transparent text-white outline-none flex-1 text-sm font-poppins placeholder:text-stone-600"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-stone-400 text-xs uppercase tracking-widest ml-2 font-bold">Medical Conditions / Surgery</label>
                                                        <div className="bg-black/30 border border-white/10 rounded-2xl p-4 flex items-center gap-4 focus-within:border-white/30 transition-all">
                                                            <Shield className="w-5 h-5 text-stone-500" />
                                                            <input
                                                                type="text"
                                                                value={profile.medicalCondition}
                                                                onChange={(e) => setProfile({ ...profile, medicalCondition: e.target.value })}
                                                                placeholder="e.g. None, Hypertension"
                                                                className="bg-transparent text-white outline-none flex-1 text-sm font-poppins placeholder:text-stone-600"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-stone-400 text-xs uppercase tracking-widest ml-2 font-bold">History of Injury</label>
                                                        <div className="bg-black/30 border border-white/10 rounded-2xl p-4 flex items-center gap-4 focus-within:border-white/30 transition-all">
                                                            <Info className="w-5 h-5 text-stone-500" />
                                                            <input
                                                                type="text"
                                                                value={profile.historyOfInjury}
                                                                onChange={(e) => setProfile({ ...profile, historyOfInjury: e.target.value })}
                                                                placeholder="e.g. Knee injury (2020)"
                                                                className="bg-transparent text-white outline-none flex-1 text-sm font-poppins placeholder:text-stone-600"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end pt-4">
                                                    <button
                                                        type="submit"
                                                        disabled={isSavingProfile}
                                                        className="px-10 py-4 bg-white text-black rounded-full font-bold uppercase text-xs tracking-widest hover:bg-stone-200 transition-all shadow-lg flex items-center gap-3 disabled:opacity-50"
                                                    >
                                                        {isSavingProfile ? (
                                                            <>Updating...</>
                                                        ) : (
                                                            <>
                                                                <Save className="w-4 h-4" /> Update Profile
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}


                                    {settingsTab === 'security' && (
                                        <div className="space-y-10">
                                            <div className="flex items-center gap-5 mb-4">
                                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/5">
                                                    <Key className="w-6 h-6 text-stone-200" />
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl font-serif italic text-white">Security</h3>
                                                    <p className="text-stone-500 text-sm mt-1">Update your password for continued sanctuary safety</p>
                                                </div>
                                            </div>

                                            <form onSubmit={handlePasswordChange} className="max-w-md space-y-6">
                                                <AnimatePresence>
                                                    {passwordError && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0 }}
                                                            className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm font-medium"
                                                        >
                                                            {passwordError}
                                                        </motion.div>
                                                    )}
                                                    {passwordSuccess && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0 }}
                                                            className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-3"
                                                        >
                                                            <CheckCircle className="w-5 h-5" />
                                                            Password updated successfully!
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                <div className="space-y-2">
                                                    <label className="text-stone-400 text-xs uppercase tracking-widest ml-2 font-bold">New Password</label>
                                                    <div className="bg-black/30 border border-white/10 rounded-2xl p-5 flex items-center gap-4 focus-within:border-white/30 transition-all">
                                                        <Lock className="w-5 h-5 text-stone-500" />
                                                        <input
                                                            type={showPasswords ? "text" : "password"}
                                                            value={newPassword}
                                                            onChange={(e) => setNewPassword(e.target.value)}
                                                            placeholder="••••••••"
                                                            className="bg-transparent text-white outline-none flex-1 font-poppins text-sm placeholder:text-stone-600"
                                                            disabled={isUpdating}
                                                        />
                                                        <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="text-stone-500 hover:text-stone-300">
                                                            {showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-stone-400 text-xs uppercase tracking-widest ml-2 font-bold">Confirm New Password</label>
                                                    <div className="bg-black/30 border border-white/10 rounded-2xl p-5 flex items-center gap-4 focus-within:border-white/30 transition-all">
                                                        <Lock className="w-5 h-5 text-stone-500" />
                                                        <input
                                                            type={showPasswords ? "text" : "password"}
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            placeholder="••••••••"
                                                            className="bg-transparent text-white outline-none flex-1 font-poppins text-sm placeholder:text-stone-600"
                                                            disabled={isUpdating}
                                                        />
                                                    </div>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={isUpdating || !newPassword || !confirmPassword}
                                                    className="w-full bg-white text-black py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-stone-200 transition-all disabled:opacity-50 disabled:bg-stone-800 disabled:text-stone-500 shadow-lg mt-4"
                                                >
                                                    {isUpdating ? 'Updating...' : 'Update Password'}
                                                </button>
                                            </form>
                                        </div>
                                    )}

                                    {settingsTab === 'billings' && (
                                        <div className="space-y-10">
                                            <div className="flex items-center gap-5 mb-4">
                                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/5">
                                                    <CreditCard className="w-6 h-6 text-stone-200" />
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl font-serif italic text-white">Billings & Plans</h3>
                                                    <p className="text-stone-500 text-sm mt-1">Manage your subscriptions and payment history</p>
                                                </div>
                                            </div>

                                            <div className="bg-black/30 border border-white/10 rounded-[2rem] p-8 relative overflow-hidden group">
                                                <div className="flex justify-between items-start mb-10">
                                                    <div>
                                                        <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2 block font-bold">Active Plan</span>
                                                        <h4 className="text-3xl font-serif italic text-white">{subscription?.planName || 'Free'}</h4>
                                                    </div>
                                                    <div className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-300 border border-white/10">
                                                        {subscription?.planName?.includes('Immersive') ? 'Yearly' : 'Monthly'}
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-8 items-end justify-between">
                                                    <div className="space-y-1.5">
                                                        <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500 block font-bold">Expires On</span>
                                                        <p className="text-white font-medium">
                                                            {subscription?.expiryDate ? new Date(subscription.expiryDate).toLocaleDateString() : 'N/A'}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-4xl font-light text-white mb-2 tracking-tight">
                                                            {subscription?.planName?.includes('Immersive') ? '$84' : subscription?.planName?.includes('Family') ? '$51' : subscription?.planName?.includes('Personal') ? '$22' : '$0'}
                                                        </div>
                                                        <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">USD / {subscription?.planName?.includes('Immersive') ? 'year' : 'month'}</span>
                                                    </div>
                                                </div>

                                                {/* Progress Bar for sessions */}
                                                {subscription?.totalSessions > 0 && (
                                                    <div className="mt-8 pt-6 border-t border-white/5">
                                                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">
                                                            <span>Sessions Used</span>
                                                            <span className="text-white">{subscription.sessionsUsed} / {subscription.totalSessions}</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-teal-400 rounded-full"
                                                                style={{ width: `${Math.min((subscription.sessionsUsed / subscription.totalSessions) * 100, 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <h4 className="text-xs uppercase tracking-[0.2em] text-stone-500 font-bold mb-6 flex items-center gap-3">
                                                    <div className="p-1.5 bg-white/10 rounded-full"><Receipt className="w-3.5 h-3.5 text-stone-200" /></div> Payment History
                                                </h4>
                                                <div className="space-y-3">
                                                    {loadingPaymentHistory ? (
                                                        <div className="text-center py-6 text-stone-500 italic text-sm">Loading history...</div>
                                                    ) : paymentHistory.length > 0 ? (
                                                        paymentHistory.map((invoice, i) => (
                                                            <div key={invoice._id || i} className="flex items-center justify-between p-6 bg-black/20 border border-white/[0.05] rounded-[1.5rem] hover:bg-white/[0.03] transition-colors">
                                                                <div className="flex items-center gap-5">
                                                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-stone-400 text-sm font-bold">
                                                                        {i + 1}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-white font-medium text-sm md:text-base tracking-wide">{invoice.planName || 'Unknown Plan'}</p>
                                                                        <p className="text-stone-500 text-xs mt-1 font-medium">{new Date(invoice.createdAt).toLocaleDateString()}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-white font-bold text-base md:text-lg tracking-wide">${invoice.amount?.toFixed(2)}</p>
                                                                    <p className={`text-[10px] font-bold uppercase tracking-widest mt-1.5 ${invoice.status === 'captured' ? 'text-green-400' : invoice.status === 'failed' ? 'text-red-400' : 'text-yellow-400'}`}>
                                                                        {invoice.status}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-6 text-stone-500 italic text-sm">No payment history found.</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
            {/* Session Unlock Notification */}
            <AnimatePresence>
                {showLinkWait && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] bg-white text-black px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 border border-white/20 backdrop-blur-3xl"
                    >
                        <Clock className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-widest">Link will open 15 mins before class starts</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
