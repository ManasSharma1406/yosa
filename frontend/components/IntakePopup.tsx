import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, X } from 'lucide-react';

const IntakePopup: React.FC = () => {
    const { user, getIdToken } = useAuth();
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkProfileStatus = async () => {
            if (!user?.email) {
                setLoading(false);
                return;
            }

            try {
                const token = await getIdToken();
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/profiles/${user.email}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const result = await response.json();
                    // Show popup if profile is not complete
                    if (result.success && !result.data.isComplete) {
                        setIsVisible(true);
                    }
                } else if (response.status === 404) {
                    // If profile doesn't exist, it's definitely not complete
                    setIsVisible(true);
                }
            } catch (error) {
                console.error('Failed to check profile status:', error);
            } finally {
                setLoading(false);
            }
        };

        checkProfileStatus();
    }, [user, getIdToken]);

    if (loading || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                className="fixed top-24 left-8 right-8 md:right-auto md:left-8 md:w-[400px] z-[100]"
            >
                <div className="bg-stone-900/90 backdrop-blur-2xl border border-white/20 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4">
                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-2 rounded-full hover:bg-white/10 text-stone-400 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>

                        <h3 className="text-2xl font-serif italic text-white mb-2 leading-tight">
                            Personalize Your Sanctuary
                        </h3>

                        <p className="text-stone-400 text-sm mb-8 leading-relaxed">
                            Complete your wellness assessment and discover your Kosha Balance to unlock a tailored yoga journey.
                        </p>

                        <button
                            onClick={() => navigate('/questionnaire')}
                            className="w-full bg-white text-stone-900 py-4 rounded-full font-bold uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-stone-200 transition-all shadow-lg active:scale-[0.98]"
                        >
                            Start Assessment <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default IntakePopup;
