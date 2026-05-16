import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
interface ContactPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const ContactPopup: React.FC<ContactPopupProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        age: '',
        gender: '',
        occupation: '',
        healthGoals: '',
        medicalHistory: '',
        yogaExperience: 'Beginner',
        preferredTime: ''
    });

    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const isSubmitted = localStorage.getItem('yosa_lead_submitted');
            if (!isSubmitted) {
                setIsVisible(true);
            } else {
                // If it was already submitted but App.tsx tried to open it, close it immediately
                onClose();
            }
        } else {
            setIsVisible(false);
        }
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isVisible) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => document.body.classList.remove('modal-open');
    }, [isVisible]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.post(`${apiBase}/api/leads`, formData);
            
            // Mark as submitted in localStorage
            localStorage.setItem('yosa_lead_submitted', 'true');
            setStatus('success');
            
            // Close after success
            setTimeout(() => {
                setIsVisible(false);
                onClose();
            }, 2500);
        } catch (error) {
            console.error('Lead submission failed:', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[200] font-['Poppins']">
                    {/* Backdrop - Fixed & Non-scrolling */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => {
                            if (status !== 'success') {
                                setIsVisible(false);
                                onClose();
                            }
                        }}
                        className="fixed inset-0 bg-black/95 backdrop-blur-xl"
                    />

                    {/* Scrolling Container */}
                    <div className="absolute inset-0 overflow-y-auto no-scrollbar py-8 md:py-20 px-4 md:px-8 flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="relative w-full max-w-5xl max-h-[90vh] md:max-h-none bg-[#0a0a0a] rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10"
                        >
                            {/* Close Button - Disabled after success */}
                            {status !== 'success' && (
                                <button
                                    onClick={() => {
                                        setIsVisible(false);
                                        onClose();
                                    }}
                                    className="absolute top-4 right-4 md:top-6 md:right-8 p-2 text-stone-500 hover:text-white transition-colors z-[210] bg-black/50 rounded-full md:bg-transparent"
                                >
                                    <X className="w-5 h-5 md:w-6 md:h-6" />
                                </button>
                            )}

                        {/* Left Section: Branding & Inspiration */}
                        <div className="w-full md:w-1/3 bg-gradient-to-b from-stone-900 to-black p-8 md:p-10 flex flex-col justify-between relative overflow-hidden shrink-0">
                            <div className="absolute top-0 left-0 w-full h-full opacity-20">
                                <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-emerald-500/10" />
                            </div>
                            
                            <div className="relative z-10">
                                <h2 className="text-2xl md:text-5xl font-semibold text-white leading-tight mb-4 md:mb-6 !font-['Poppins']">
                                    Your Path <br />
                                    to <span className="text-[#78dcca] italic">Vitality</span>
                                </h2>
                                <p className="text-stone-400 text-xs md:text-sm font-light leading-relaxed !font-['Poppins']">
                                    Help us understand your journey so we can tailor the perfect yoga practice for your unique needs.
                                </p>
                            </div>

                            <div className="relative z-10 pt-8 md:pt-10 hidden md:block">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#78dcca]">
                                            <span className="text-xs font-bold">01</span>
                                        </div>
                                        <p className="text-xs uppercase tracking-widest text-stone-500 !font-['Poppins']">Holistic Assessment</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#78dcca]">
                                            <span className="text-xs font-bold">02</span>
                                        </div>
                                        <p className="text-xs uppercase tracking-widest text-stone-500 !font-['Poppins']">Expert Guidance</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#78dcca]">
                                            <span className="text-xs font-bold">03</span>
                                        </div>
                                        <p className="text-xs uppercase tracking-widest text-stone-500 !font-['Poppins']">Lasting Transformation</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Section: Detailed Form */}
                        <div className="w-full md:w-2/3 p-6 md:p-12 flex-1 min-h-0 overflow-y-auto no-scrollbar overscroll-contain bg-black/40" data-lenis-prevent>
                            {status === 'success' ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="h-full flex flex-col items-center justify-center text-center space-y-6"
                                >
                                    <CheckCircle2 className="w-20 h-20 text-[#78dcca]" />
                                    <h3 className="text-3xl font-semibold text-white !font-['Poppins']">Thank You!</h3>
                                    <p className="text-stone-400 max-w-sm !font-['Poppins']">Your information has been received. Our instructor will review your details and connect with you soon.</p>
                                </motion.div>
                            ) : (
                                <>
                                    <div className="mb-10">
                                        <h3 className="text-2xl font-semibold text-white mb-2 !font-['Poppins']">Student Intake Form</h3>
                                        <p className="text-stone-500 text-sm !font-['Poppins']">Please fill out these details to help us prepare for your session.</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {/* Personal Info Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold ml-1">First Name</label>
                                                <input
                                                    required
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    type="text"
                                                    placeholder="John"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#78dcca] transition-all placeholder:text-stone-700"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold ml-1">Last Name</label>
                                                <input
                                                    required
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    type="text"
                                                    placeholder="Doe"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#78dcca] transition-all placeholder:text-stone-700"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold ml-1">Email Address</label>
                                                <input
                                                    required
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#78dcca] transition-all placeholder:text-stone-700"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold ml-1">WhatsApp Number</label>
                                                <input
                                                    required
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    type="tel"
                                                    placeholder="+91 00000 00000"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#78dcca] transition-all placeholder:text-stone-700"
                                                />
                                            </div>
                                        </div>

                                        {/* Physical Stats Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold ml-1">Age</label>
                                                <input
                                                    name="age"
                                                    value={formData.age}
                                                    onChange={handleChange}
                                                    type="number"
                                                    placeholder="25"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#78dcca] transition-all placeholder:text-stone-700"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold ml-1">Gender</label>
                                                <select
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleChange}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#78dcca] transition-all appearance-none"
                                                >
                                                    <option value="" className="bg-[#0a0a0a]">Select</option>
                                                    <option value="Male" className="bg-[#0a0a0a]">Male</option>
                                                    <option value="Female" className="bg-[#0a0a0a]">Female</option>
                                                    <option value="Other" className="bg-[#0a0a0a]">Other</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold ml-1">Yoga Experience</label>
                                                <select
                                                    name="yogaExperience"
                                                    value={formData.yogaExperience}
                                                    onChange={handleChange}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#78dcca] transition-all appearance-none"
                                                >
                                                    <option value="Beginner" className="bg-[#0a0a0a]">Beginner</option>
                                                    <option value="Intermediate" className="bg-[#0a0a0a]">Intermediate</option>
                                                    <option value="Advanced" className="bg-[#0a0a0a]">Advanced</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold ml-1">Health & Wellness Goals</label>
                                            <input
                                                name="healthGoals"
                                                value={formData.healthGoals}
                                                onChange={handleChange}
                                                type="text"
                                                placeholder="e.g. Weight loss, Stress relief, Flexibility..."
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#78dcca] transition-all placeholder:text-stone-700"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold ml-1">Medical History / Previous Injuries</label>
                                            <textarea
                                                name="medicalHistory"
                                                value={formData.medicalHistory}
                                                onChange={handleChange}
                                                rows={3}
                                                placeholder="Any surgeries, chronic pain, or medical conditions we should know about?"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#78dcca] transition-all placeholder:text-stone-700 resize-none"
                                            />
                                        </div>

                                        <div className="pt-4 flex items-center justify-between">
                                            {status === 'error' && (
                                                <div className="flex items-center gap-2 text-red-500 text-xs">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span>Submission failed. Please try again.</span>
                                                </div>
                                            )}
                                            
                                            <button
                                                type="submit"
                                                disabled={status === 'submitting'}
                                                className={`px-12 py-4 bg-[#78dcca] text-black rounded-xl font-bold uppercase tracking-widest text-xs transition-all transform hover:scale-[1.02] shadow-[0_20px_40px_rgba(120,220,202,0.15)] ml-auto ${status === 'submitting' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#68cbba]'}`}
                                            >
                                                {status === 'submitting' ? 'Submitting...' : 'Begin Journey'}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
            )}
        </AnimatePresence>
    );
};

export default ContactPopup;

