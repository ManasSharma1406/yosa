import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Mail, Chrome, User, Phone } from 'lucide-react';
import { getAuthErrorMessage } from '../../utils/errorMapping';

const SignUpPage: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // The Google button is disabled until all fields are basically filled
    const isFormValid = firstName.trim() && lastName.trim() && email.trim() && whatsappNumber.trim().length >= 10;

    const handleGoogleSignUp = async () => {
        if (!isFormValid) {
            setError('Please complete all fields above before signing up.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const provider = new GoogleAuthProvider();
            // Optional: force prompt to select account
            provider.setCustomParameters({ prompt: 'select_account' });
            
            const result = await signInWithPopup(auth, provider);
            
            // Immediately sync with backend
            const token = await result.user.getIdToken();
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            
            const response = await fetch(`${apiUrl}/api/profiles/ensure`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    whatsappNumber: whatsappNumber.trim()
                    // email is automatically inferred by backend from the secure token
                })
            });

            if (!response.ok) {
                console.warn('Profile ensure issue', await response.text());
                // We proceed anyway to dashboard even if profile fails to ensure perfectly, 
                // but usually this succeeds.
            }

            navigate('/dashboard');
        } catch (err: any) {
            setError(getAuthErrorMessage(err.code || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-black text-white flex items-center justify-center px-4 py-8 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-2xl"
            >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl md:text-4xl font-poppins mb-2">Begin Your <span className="font-serif italic">Journey</span></h1>
                        <p className="text-stone-400 text-sm">Please fill your details below to create your profile.</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3 mb-4 text-red-400 text-xs text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="space-y-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-stone-400 text-xs uppercase tracking-widest ml-1">First Name</label>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2 focus-within:border-white/30 transition-all">
                                    <User className="w-4 h-4 text-stone-500" />
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="First Name"
                                        className="bg-transparent outline-none text-white placeholder-stone-600 flex-1 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-stone-400 text-xs uppercase tracking-widest ml-1">Last Name</label>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2 focus-within:border-white/30 transition-all">
                                    <User className="w-4 h-4 text-stone-500" />
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Last Name"
                                        className="bg-transparent outline-none text-white placeholder-stone-600 flex-1 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-stone-400 text-xs uppercase tracking-widest ml-1">Email</label>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2 focus-within:border-white/30 transition-all">
                                    <Mail className="w-4 h-4 text-stone-500" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value.trim())}
                                        placeholder="your@email.com"
                                        className="bg-transparent outline-none text-white placeholder-stone-600 flex-1 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-stone-400 text-xs uppercase tracking-widest ml-1">WhatsApp Number</label>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2 focus-within:border-white/30 transition-all">
                                    <Phone className="w-4 h-4 text-stone-500" />
                                    <input
                                        type="tel"
                                        value={whatsappNumber}
                                        onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ''))}
                                        placeholder="Country Code + Phone"
                                        className="bg-transparent outline-none text-white placeholder-stone-600 flex-1 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleSignUp}
                        disabled={loading || !isFormValid}
                        className={`w-full text-black rounded-full py-3 font-semibold flex items-center justify-center gap-2 transition-all text-sm
                            ${isFormValid 
                                ? 'bg-white hover:bg-stone-200 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                                : 'bg-white/30 cursor-not-allowed text-stone-300'
                            }`}
                    >
                        <Chrome className="w-4 h-4" />
                        <span>{loading ? 'Connecting...' : 'Sign Up with Google'}</span>
                    </button>
                    {!isFormValid && <p className="text-[10px] text-stone-500 text-center mt-2">Fill all fields to enable Google Sign Up</p>}

                    <div className="text-center mt-8 text-xs">
                        <span className="text-stone-400">Already a member? </span>
                        <Link to="/sign-in" className="text-white font-semibold hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>

                <div className="text-center mt-4">
                    <Link to="/" className="text-stone-400 text-xs hover:text-white transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default SignUpPage;
