import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ContactPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const ContactPopup: React.FC<ContactPopupProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 md:px-0">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        className="relative w-full max-w-5xl bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-8 p-2 text-stone-500 hover:text-white transition-colors z-[110]"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Left Column: Branding & Info */}
                        <div className="md:w-2/5 p-10 md:p-16 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#1a2b3c] via-[#0a0a0a] to-[#0a0a0a]">
                            {/* Decorative background effects */}
                            <div className="absolute -top-20 -left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-cyan-500/5 to-transparent blur-[80px] pointer-events-none" />

                            <div className="relative z-10">
                                <div className="inline-block px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-stone-400 text-xs tracking-widest uppercase mb-12">
                                    Contact
                                </div>
                                <h2 className="text-4xl md:text-6xl font-sans font-light text-white leading-tight mb-8">
                                    Get In touch <br />
                                    <span className="font-light">with us!</span>
                                </h2>
                                <p className="text-stone-400 text-lg md:text-xl font-light leading-relaxed max-w-sm">
                                    Have questions or ideas? We'd love to hear from you. Reach out anytime and let's connect.
                                </p>
                            </div>

                            <div className="mt-12 relative z-10">
                                <div className="inline-flex px-8 py-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-semibold tracking-wide">
                                    Contact Us
                                </div>
                            </div>
                        </div>

                        {/* Right Column: The Form */}
                        <div className="md:w-3/5 p-10 md:p-16 bg-[#111] relative border-l border-white/5">
                            <h3 className="text-3xl font-sans font-light text-white mb-12">Contact Us</h3>

                            <form className="space-y-10" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-stone-600"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            placeholder="Last Name"
                                            className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-stone-600"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            placeholder="Postal Code"
                                            className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-stone-600"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-stone-600"
                                        />
                                    </div>
                                </div>

                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder="Message"
                                        className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-stone-600"
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="px-12 py-3.5 bg-[#78dcca] text-black rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-[#68cbba] transition-all transform hover:scale-[1.02] shadow-[0_10px_30px_rgba(120,220,202,0.2)]"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ContactPopup;
