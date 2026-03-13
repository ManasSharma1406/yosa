import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0B0B0D] flex flex-col items-center justify-center text-white px-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center z-10"
            >
                <h1 className="text-9xl md:text-[12rem] font-serif italic text-transparent bg-clip-text bg-gradient-to-br from-white to-white/20 leading-none drop-shadow-2xl">
                    404
                </h1>
                <h2 className="text-3xl md:text-5xl font-light tracking-tight mt-6 mb-8 text-stone-300">
                    Page Not Found
                </h2>
                <p className="text-stone-500 text-sm md:text-base max-w-md mx-auto mb-12 font-poppins">
                    The path you are looking for seems to have drifted away like a cloud. Let's guide you back to your sanctuary.
                </p>

                <button
                    onClick={() => navigate('/')}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold uppercase text-[10px] sm:text-xs tracking-widest overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span className="relative z-10">Return Home</span>
                    <div className="absolute inset-0 bg-stone-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
            </motion.div>
        </div>
    );
};

export default NotFoundPage;
