import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
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

    const handleTeacherSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

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
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            
            // Before letting them proceed, check if they exist in OUR database
            const token = await result.user.getIdToken();
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            
            const profileResponse = await fetch(`${apiUrl}/api/profiles/${encodeURIComponent(result.user.email || '')}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (profileResponse.status === 204) {
                // Return 204 means user doesn't exist
                await auth.signOut();
                setError('Account not found. Please Sign Up first.');
                return;
            }

            // Ensure we successfully fetched
            if (!profileResponse.ok) {
                const text = await profileResponse.text();
                // Usually means fetch error, but if they DO exist, it shouldn't hit this
                console.warn('Profile fetch issue:', text);
            }

            navigate('/dashboard');
        } catch (err: any) {
            if (err?.code !== 'auth/popup-closed-by-user') {
                setError(getAuthErrorMessage(err.code || err.message));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-black text-white flex items-center justify-center px-4 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-2xl mt-8"
            >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative">
                    <button
                        type="button"
                        onClick={() => {
                            setIsTeacherLogin(!isTeacherLogin);
                            setError('');
                        }}
                        className="absolute top-4 right-6 text-[10px] uppercase tracking-widest text-stone-500 hover:text-white"
                    >
                        {isTeacherLogin ? 'Student Login' : 'Admin Login'}
                    </button>
                    
                    <div className="text-center mb-8 mt-4">
                        <h1 className="text-3xl md:text-4xl font-poppins mb-2">{isTeacherLogin ? 'Instructor Portal' : 'Welcome Back'}</h1>
                        <p className="text-stone-400 text-xs">{isTeacherLogin ? 'Access your dashboard' : 'Enter your sanctuary of stillness'}</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3 mb-6 text-red-400 text-xs text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    {isTeacherLogin ? (
                        <form onSubmit={handleTeacherSubmit} className="space-y-4 mb-5 max-w-sm mx-auto">
                            <div className="space-y-1.5 max-md:space-y-0 relative">
                                <label className="text-stone-400 text-xs uppercase tracking-widest ml-1 max-md:hidden">Admin Email</label>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-3 max-md:p-4 flex items-center gap-2 max-md:gap-3 focus-within:border-white/30 transition-all relative">
                                    <Mail className="w-4 h-4 text-stone-500 max-md:w-5 max-md:h-5 z-10" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value.trim())}
                                        placeholder="admin@email.com"
                                        required
                                        className="peer bg-transparent outline-none text-white placeholder-stone-600 flex-1 text-sm max-md:text-base max-md:placeholder-transparent z-10"
                                    />
                                    {/* Mobile Floating Label */}
                                    <label className="hidden max-md:block absolute left-[3.25rem] text-stone-500 text-base transition-all duration-200 peer-focus:-top-2 peer-focus:text-[10px] peer-focus:bg-black peer-focus:px-1 peer-focus:text-stone-300 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:bg-black peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:text-stone-300 pointer-events-none z-20">
                                        Admin Email
                                    </label>
                                </div>
                            </div>
                            <div className="space-y-1.5 max-md:space-y-0 relative max-md:mt-4">
                                <label className="text-stone-400 text-xs uppercase tracking-widest ml-1 max-md:hidden">Password</label>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-3 max-md:p-4 flex items-center gap-2 max-md:gap-3 focus-within:border-white/30 transition-all relative">
                                    <Lock className="w-4 h-4 text-stone-500 max-md:w-5 max-md:h-5 z-10" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="peer bg-transparent outline-none text-white placeholder-stone-600 flex-1 text-sm max-md:text-base max-md:placeholder-transparent z-10"
                                    />
                                     {/* Mobile Floating Label */}
                                     <label className="hidden max-md:block absolute left-[3.25rem] text-stone-500 text-base transition-all duration-200 peer-focus:-top-2 peer-focus:text-[10px] peer-focus:bg-black peer-focus:px-1 peer-focus:text-stone-300 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:bg-black peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:text-stone-300 pointer-events-none z-20">
                                        Password
                                    </label>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 bg-white text-black rounded-full py-3 font-bold uppercase text-xs tracking-widest hover:bg-stone-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Logging in...' : 'Access Portal'}
                            </button>
                        </form>
                    ) : (
                        <div className="max-w-sm mx-auto flex flex-col items-center">
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="w-full bg-white text-black rounded-full py-4 px-6 max-md:py-5 max-md:text-base font-semibold flex items-center justify-center gap-3 hover:bg-stone-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.15)] mt-4"
                            >
                                <Chrome className="w-5 h-5 max-md:w-6 max-md:h-6" />
                                <span>{loading ? 'Connecting...' : 'Sign In with Google'}</span>
                            </button>

                            <div className="text-center mt-8 text-xs">
                                <span className="text-stone-500">Don't have an account? </span>
                                <Link to="/sign-up" className="text-white font-semibold hover:underline">
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                <div className="text-center mt-6">
                    <Link to="/" className="text-stone-400 text-xs hover:text-white transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default SignInPage;
