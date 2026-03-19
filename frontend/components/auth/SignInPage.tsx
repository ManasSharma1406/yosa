import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Mail, Lock, Chrome } from 'lucide-react';
import { getAuthErrorMessage } from '../../utils/errorMapping';

const SignInPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isTeacherLogin, setIsTeacherLogin] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (isTeacherLogin) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();

                if (data.success) {
                    localStorage.setItem('adminToken', data.token);
                    navigate('/teacher-dashboard');
                } else {
                    setError(data.message || 'Invalid admin credentials');
                }
            } catch (err) {
                setError('Failed to connect to server');
            } finally {
                setLoading(false);
            }
        } else {
            try {
                await signInWithEmailAndPassword(auth, email, password);
                navigate('/dashboard');
            } catch (err: any) {
                setError(getAuthErrorMessage(err.code || err.message));
            } finally {
                setLoading(false);
            }
        }
    };

    const handleGoogleSignIn = async () => {
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
                    <div className="text-center mb-6 relative">
                        <button
                            type="button"
                            onClick={() => setIsTeacherLogin(!isTeacherLogin)}
                            className="absolute -top-2 right-0 text-[10px] uppercase tracking-widest text-stone-500 hover:text-white"
                        >
                            {isTeacherLogin ? 'Student Login' : 'Admin Login'}
                        </button>
                        <h1 className="text-3xl md:text-4xl font-poppins mb-2">{isTeacherLogin ? 'Instructor Portal' : 'Welcome Back'}</h1>
                        <p className="text-stone-400 text-xs">{isTeacherLogin ? 'Access your dashboard' : 'Enter your sanctuary of stillness'}</p>
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
                    <form onSubmit={handleSubmit} className="space-y-4 mb-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                            <div className="space-y-1.5">
                                <label className="text-stone-400 text-xs uppercase tracking-widest ml-1">Password</label>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2 focus-within:border-white/30 transition-all">
                                    <Lock className="w-4 h-4 text-stone-500" />
                                    <input
                                        type="password"
                                        autoComplete="current-password"
                                        maxLength={128}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
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
                            {loading ? 'Logging in...' : (isTeacherLogin ? 'Access Portal' : 'Sign In')}
                        </button>
                    </form>

                    {!isTeacherLogin && (
                        <>
                            {/* Divider */}
                            <div className="flex items-center gap-4 mb-5">
                                <div className="h-px bg-white/10 flex-1" />
                                <span className="text-stone-500 text-xs uppercase tracking-wider">Or</span>
                                <div className="h-px bg-white/10 flex-1" />
                            </div>

                            {/* Google Sign In */}
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="w-full bg-white/5 border border-white/10 text-white rounded-full py-3 font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                <Chrome className="w-4 h-4" />
                                <span>Continue with Google</span>
                            </button>

                            {/* Sign Up Link */}
                            <div className="text-center mt-5 text-xs">
                                <span className="text-stone-500">Don't have an account? </span>
                                <Link to="/sign-up" className="text-white font-semibold hover:underline">
                                    Sign Up
                                </Link>
                            </div>
                        </>
                    )}
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

export default SignInPage;
