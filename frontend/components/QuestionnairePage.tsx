import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Heart, Shield, Sparkles, User, ArrowRight, ArrowLeft, CheckCircle, Info, FileText } from 'lucide-react';

const steps = [
    { id: 1, title: 'Personal Sanctuary', icon: <User className="w-5 h-5" /> },
    { id: 2, title: 'Yoga & Goals', icon: <Sparkles className="w-5 h-5" /> },
    { id: 3, title: 'Physical Health', icon: <Heart className="w-5 h-5" /> },
    { id: 4, title: 'Kosha Awareness', icon: <Activity className="w-5 h-5" /> },
    { id: 5, title: 'Sacred Agreement', icon: <Shield className="w-5 h-5" /> }
];

const QuestionnairePage: React.FC = () => {
    const { user, getIdToken } = useAuth();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        age: '',
        dob: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        goal: 'Wellness',
        styleOfYoga: 'Balance',
        experienceLevel: 'Beginner',
        medications: 'None',
        surgeries: 'None',
        cardioHealth: 'Good',
        respiratoryHealth: 'Good',
        isPregnant: false,
        historyOfInjury: 'None',
        annamaya: 5,
        pranamaya: 5,
        manomaya: 5,
        vijnanamaya: 5,
        anandamaya: 5,
        waiverAccepted: false
    });

    useEffect(() => {
        // Optionally pre-load existing profile data
        const fetchProfile = async () => {
            if (!user?.email) return;
            try {
                const token = await getIdToken();
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/profiles/${user.email}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data) {
                        setFormData(prev => ({ ...prev, ...result.data }));
                    }
                }
            } catch (err) {
                console.error('Failed to fetch profile:', err);
            }
        };
        fetchProfile();
    }, [user, getIdToken]);

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
    const handleBack = () => {
        if (currentStep === 1) {
            navigate(-1);
        } else {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        if (!formData.waiverAccepted) {
            setError('Please accept the waiver to continue.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const token = await getIdToken();
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/profiles/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    email: user?.email,
                    isComplete: true
                })
            });

            if (response.ok) {
                navigate('/dashboard');
            } else {
                setError('Failed to save assessment. Please try again.');
            }
        } catch (err) {
            console.error('Submission error:', err);
            setError('An error occurred during submission.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const stepVariants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div className="min-h-screen bg-[#0B0B0D] text-white pt-32 pb-20 px-4 relative">
            {/* Top Left Back Button */}
            <button
                onClick={handleBack}
                disabled={isSubmitting}
                className="fixed top-8 left-8 z-[110] flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-stone-400 hover:text-white hover:bg-white/10 transition-all text-[10px] font-bold uppercase tracking-widest backdrop-blur-xl group"
            >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                {currentStep === 1 ? 'Exit' : 'Back'}
            </button>

            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif italic mb-4">Wellness Intake</h1>
                    <p className="text-stone-500">Help us tailor your experience to your unique path.</p>
                </div>

                {/* Progress Stepper */}
                <div className="flex justify-between items-center mb-16 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -z-10" />
                    {steps.map(step => (
                        <div
                            key={step.id}
                            className={`flex flex-col items-center gap-3 bg-[#0B0B0D] px-4 transition-all duration-500 ${step.id <= currentStep ? 'opacity-100 scale-100' : 'opacity-40 scale-90'}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${step.id === currentStep ? 'bg-white text-black border-white' : step.id < currentStep ? 'bg-green-500 border-green-500 text-white' : 'border-white/20 text-stone-400'}`}>
                                {step.id < currentStep ? <CheckCircle className="w-5 h-5" /> : step.icon}
                            </div>
                            <span className="hidden md:block text-[10px] uppercase font-bold tracking-widest text-stone-500">{step.title}</span>
                        </div>
                    ))}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <Sparkles className="w-32 h-32" />
                    </div>

                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div key="step1" {...stepVariants} className="space-y-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <User className="w-6 h-6 text-stone-400" />
                                    <h2 className="text-2xl font-serif italic">Personal Sanctuary Details</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-stone-500 ml-2">Age</label>
                                        <input
                                            type="text"
                                            value={formData.age}
                                            onChange={e => setFormData({ ...formData, age: e.target.value })}
                                            placeholder="e.g. 32"
                                            className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 text-sm font-poppins focus:border-white/30 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-stone-500 ml-2">Date of Birth</label>
                                        <input
                                            type="text"
                                            value={formData.dob}
                                            onChange={e => setFormData({ ...formData, dob: e.target.value })}
                                            placeholder="YYYY-MM-DD"
                                            className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 text-sm font-poppins focus:border-white/30 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-stone-500 ml-2">Emergency Contact Name</label>
                                        <input
                                            type="text"
                                            value={formData.emergencyContactName}
                                            onChange={e => setFormData({ ...formData, emergencyContactName: e.target.value })}
                                            className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 text-sm font-poppins focus:border-white/30 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-stone-500 ml-2">Emergency Contact Phone</label>
                                        <input
                                            type="text"
                                            value={formData.emergencyContactPhone}
                                            onChange={e => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                                            className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 text-sm font-poppins focus:border-white/30 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div key="step2" {...stepVariants} className="space-y-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <Sparkles className="w-6 h-6 text-stone-400" />
                                    <h2 className="text-2xl font-serif italic">Your Yoga Journey</h2>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-stone-500 ml-2">Experience Level</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(level => (
                                                <button
                                                    key={level}
                                                    onClick={() => setFormData({ ...formData, experienceLevel: level })}
                                                    className={`p-3 rounded-2xl border text-xs font-bold transition-all ${formData.experienceLevel === level ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-stone-400 hover:bg-white/10'}`}
                                                >
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-stone-500 ml-2">Style Preference</label>
                                        <input
                                            type="text"
                                            value={formData.styleOfYoga}
                                            onChange={e => setFormData({ ...formData, styleOfYoga: e.target.value })}
                                            placeholder="e.g. Vinyasa, Hatha, Restorative"
                                            className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 text-sm font-poppins focus:border-white/30 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-stone-500 ml-2">Primary Wellness Goal</label>
                                        <input
                                            type="text"
                                            value={formData.goal}
                                            onChange={e => setFormData({ ...formData, goal: e.target.value })}
                                            placeholder="e.g. Flexibility, Peace of Mind, Strength"
                                            className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 text-sm font-poppins focus:border-white/30 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div key="step3" {...stepVariants} className="space-y-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <Heart className="w-6 h-6 text-stone-400" />
                                    <h2 className="text-2xl font-serif italic">Physical Health Assessment</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-stone-500 ml-2">Current Medications</label>
                                        <textarea
                                            value={formData.medications}
                                            onChange={e => setFormData({ ...formData, medications: e.target.value })}
                                            rows={2}
                                            className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 text-sm font-poppins focus:border-white/30 transition-all outline-none resize-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-stone-500 ml-2">Recent Surgeries (Last 2 Years)</label>
                                        <textarea
                                            value={formData.surgeries}
                                            onChange={e => setFormData({ ...formData, surgeries: e.target.value })}
                                            rows={2}
                                            className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 text-sm font-poppins focus:border-white/30 transition-all outline-none resize-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-stone-500 ml-2">Cardiovascular Health</label>
                                        <input
                                            type="text"
                                            value={formData.cardioHealth}
                                            onChange={e => setFormData({ ...formData, cardioHealth: e.target.value })}
                                            placeholder="e.g. Good, Managed Blood Pressure"
                                            className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 text-sm font-poppins focus:border-white/30 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-stone-500 ml-2">Respiratory Health</label>
                                        <input
                                            type="text"
                                            value={formData.respiratoryHealth}
                                            onChange={e => setFormData({ ...formData, respiratoryHealth: e.target.value })}
                                            className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 text-sm font-poppins focus:border-white/30 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl md:col-span-2">
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold uppercase tracking-widest text-stone-200">Are you currently pregnant?</h4>
                                            <p className="text-[10px] text-stone-500 mt-1">This helps us provide safe modifications.</p>
                                        </div>
                                        <button
                                            onClick={() => setFormData({ ...formData, isPregnant: !formData.isPregnant })}
                                            className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase transition-all ${formData.isPregnant ? 'bg-pink-500 text-white' : 'bg-white/5 text-stone-400 border border-white/10'}`}
                                        >
                                            {formData.isPregnant ? 'Yes' : 'No'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 4 && (
                            <motion.div key="step4" {...stepVariants} className="space-y-12">
                                <div className="flex items-center gap-4 mb-4">
                                    <Activity className="w-6 h-6 text-stone-400" />
                                    <h2 className="text-2xl font-serif italic">Kosha Balance Self-Assessment</h2>
                                </div>
                                <p className="text-sm text-stone-400 italic">Rate your current energy levels across the five layers of existence (1-10).</p>
                                <div className="space-y-10">
                                    {[
                                        { key: 'annamaya', label: 'Annamaya (Physical)', desc: 'Vitality, body awareness, and physical comfort' },
                                        { key: 'pranamaya', label: 'Pranamaya (Energy)', desc: 'Breath flow, vitality, and life force' },
                                        { key: 'manomaya', label: 'Manomaya (Mental)', desc: 'Thought patterns, emotional stability, and calm' },
                                        { key: 'vijnanamaya', label: 'Vijnanamaya (Wisdom)', desc: 'Intuition, discernment, and self-knowledge' },
                                        { key: 'anandamaya', label: 'Anandamaya (Bliss)', desc: 'Sense of joy, peace, and universal connection' }
                                    ].map(kosha => (
                                        <div key={kosha.key} className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <label className="text-sm font-bold uppercase tracking-widest text-stone-200">{kosha.label}</label>
                                                    <p className="text-[10px] text-stone-500 mt-0.5">{kosha.desc}</p>
                                                </div>
                                                <span className="text-2xl font-serif italic text-white">{(formData as any)[kosha.key]}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="1"
                                                max="10"
                                                step="1"
                                                value={(formData as any)[kosha.key]}
                                                onChange={e => setFormData({ ...formData, [kosha.key]: parseInt(e.target.value) })}
                                                className="w-full accent-white opacity-60 hover:opacity-100 transition-opacity"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 5 && (
                            <motion.div key="step5" {...stepVariants} className="space-y-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <Shield className="w-6 h-6 text-stone-400" />
                                    <h2 className="text-2xl font-serif italic">Sacred Agreement & Waiver</h2>
                                </div>
                                <div className="bg-black/40 border border-white/10 rounded-3xl p-8 max-h-[300px] overflow-y-auto custom-scrollbar space-y-4 text-sm text-stone-400 leading-relaxed font-light">
                                    <h4 className="text-white font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                                        <FileText className="w-3.5 h-3.5" /> Release of Liability
                                    </h4>
                                    <p>
                                        I, the participant, understand that yoga includes physical movements as well as an opportunity for relaxation, stress re-education and relief of muscular tension. As is the case with any physical activity, the risk of injury, even serious or disabling, is always present and cannot be entirely eliminated.
                                    </p>
                                    <p>
                                        I affirm that I am solely responsible to decide whether to practice yoga. I also understand that I am responsible for my own safety and well-being. I agree to listen to my body and practice at my own pace.
                                    </p>
                                    <p>
                                        In consideration of being permitted to participate in yoga classes, I agree to assume full responsibility for any risks, injuries or damages, known or unknown, which I might incur as a result of participating in the program.
                                    </p>
                                </div>
                                <div className="flex items-start gap-4 p-6 bg-white/5 border border-white/10 rounded-3xl group cursor-pointer" onClick={() => setFormData({ ...formData, waiverAccepted: !formData.waiverAccepted })}>
                                    <div className={`mt-1 h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${formData.waiverAccepted ? 'bg-white border-white' : 'border-white/20 group-hover:border-white/40'}`}>
                                        {formData.waiverAccepted && <CheckCircle className="w-3.5 h-3.5 text-black" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold uppercase tracking-widest text-white">I agree to the terms and waiver of liability</p>
                                        <p className="text-[10px] text-stone-500 mt-1">By checking this box, you confirm that you have read and understood the agreement.</p>
                                    </div>
                                </div>
                                {error && (
                                    <p className="text-red-400 text-xs font-bold uppercase tracking-widest text-center">{error}</p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Controls */}
                    <div className="mt-12 pt-12 border-t border-white/10 flex justify-between items-center">
                        <button
                            onClick={handleBack}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all text-stone-400 hover:text-white hover:bg-white/5"
                        >
                            <ArrowLeft className="w-4 h-4" /> {currentStep === 1 ? 'Exit' : 'Back'}
                        </button>

                        {currentStep === steps.length ? (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !formData.waiverAccepted}
                                className="bg-white text-stone-900 px-12 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center gap-3"
                            >
                                {isSubmitting ? 'Finalizing...' : <>Complete Assessment <ArrowRight className="w-4 h-4" /></>}
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className="bg-white/10 text-white border border-white/20 hover:bg-white hover:text-stone-900 px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                            >
                                Next <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionnairePage;
