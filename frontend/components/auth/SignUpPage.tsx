import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Mail, Lock, User, Chrome } from 'lucide-react';
import { getAuthErrorMessage } from '../../utils/errorMapping';

const SignUpPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update profile with display name
            if (name.trim()) {
                await updateProfile(userCredential.user, {
                    displayName: name.trim()
                });
            }

            navigate('/dashboard');
        } catch (err: any) {
            setError(getAuthErrorMessage(err.code || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setError('');
        setLoading(true);

        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            navigate('/dashboard');
        } catch (err: any) {
            setError(getAuthErrorMessage(err.code || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative h-screen bg-black text-white flex items-center justify-center px-4 overflow-hidden">
            {/* Solid Black Background (handled by container bg-black) */}

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-2xl"
            >
                {/* Glassmorphic Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h1 className="text-3xl md:text-4xl font-poppins mb-2">Begin Your <span className="font-serif italic">Journey</span></h1>
                        <p className="text-stone-400 text-xs">Create your sanctuary account</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3 mb-4 text-red-400 text-xs"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Email/Password Form */}
                    <form onSubmit={handleEmailSignUp} className="space-y-4 mb-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-stone-400 text-xs uppercase tracking-widest ml-1">Full Name</label>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2 focus-within:border-white/30 transition-all">
                                    <User className="w-4 h-4 text-stone-500" />
                                    <input
                                        type="text"
                                        autoComplete="name"
                                        maxLength={50}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your Name"
                                        required
                                        className="bg-transparent outline-none text-white placeholder-stone-600 flex-1 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-stone-400 text-xs uppercase tracking-widest ml-1">Email</label>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2 focus-within:border-white/30 transition-all">
                                    <Mail className="w-4 h-4 text-stone-500" />
                                    <input
                                        type="email"
                                        autoComplete="email"
                                        maxLength={100}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value.trim())}
                                        placeholder="your@email.com"
                                        required
                                        className="bg-transparent outline-none text-white placeholder-stone-600 flex-1 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-stone-400 text-xs uppercase tracking-widest ml-1">Password</label>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2 focus-within:border-white/30 transition-all">
                                    <Lock className="w-4 h-4 text-stone-500" />
                                    <input
                                        type="password"
                                        autoComplete="new-password"
                                        maxLength={128}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                        className="bg-transparent outline-none text-white placeholder-stone-600 flex-1 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-stone-400 text-xs uppercase tracking-widest ml-1">Confirm Password</label>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2 focus-within:border-white/30 transition-all">
                                    <Lock className="w-4 h-4 text-stone-500" />
                                    <input
                                        type="password"
                                        autoComplete="new-password"
                                        maxLength={128}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                        className="bg-transparent outline-none text-white placeholder-stone-600 flex-1 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black rounded-full py-3 font-bold uppercase text-xs tracking-widest hover:bg-stone-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mb-5">
                        <div className="h-px bg-white/10 flex-1" />
                        <span className="text-stone-500 text-xs uppercase tracking-wider">Or</span>
                        <div className="h-px bg-white/10 flex-1" />
                    </div>

                    {/* Google Sign Up */}
                    <button
                        onClick={handleGoogleSignUp}
                        disabled={loading}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-full py-3 font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        <Chrome className="w-4 h-4" />
                        <span>Continue with Google</span>
                    </button>

                    {/* Sign In Link */}
                    <div className="text-center mt-5 text-xs">
                        <span className="text-stone-400">Already have an account? </span>
                        <Link to="/sign-in" className="text-white font-semibold hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>

                {/* Back to Home */}
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
