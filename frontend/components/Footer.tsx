
import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
    const navigate = useNavigate();

    return (
        <footer className="relative bg-black text-white pt-24 pb-12 overflow-hidden">
            <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12">

                {/* Main Content Grid */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-24">

                    {/* Left Column: Heading & Description */}
                    <div className="max-w-4xl">
                        <h2 className="text-5xl md:text-7xl font-sans font-normal tracking-tight leading-[1.1] mb-8">
                            <span className="whitespace-nowrap">One Decision Can Change</span> <br />
                            Your <span className="font-serif italic">Life</span>
                        </h2>
                        <p className="text-stone-400 font-light text-base leading-relaxed max-w-md">
                            Join thousands who have transformed their well-being. Whether you have a question or just want to say hello, we'd love to hear from you.
                        </p>
                    </div>

                    {/* Right Column: Contact & Social Info */}
                    <div className="flex flex-col items-end text-right gap-12">
                        {/* Email section */}
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold mb-2">Email Us</p>
                            <a href="mailto: yogsamskara02@gmail.com" className="text-2xl md:text-3xl font-serif italic text-white hover:text-stone-300 transition-colors">
                                yogsamskara02@gmail.com
                            </a>
                        </div>

                        {/* Social Icons section (Replacing VISIT US) */}
                        <div className="flex flex-col items-end">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold mb-4">Follow Us</p>
                            <div className="flex gap-4">
                                <a href="https://facebook.com/yogsamskara" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all text-stone-400">
                                    <Facebook className="w-4 h-4" />
                                </a>
                                <a href="https://instagram.com/yogsamskara" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all text-stone-400">
                                    <Instagram className="w-4 h-4" />
                                </a>
                                <a href="https://twitter.com/yogsamskara" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all text-stone-400">
                                    <Twitter className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        {/* Call section */}
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold mb-2">Call Us</p>
                            <a href="tel:+919399441405" className="text-xl md:text-2xl font-sans text-white hover:text-stone-300 transition-colors block mb-1">
                                +91 93994 41405
                            </a>
                            <p className="text-xs text-stone-500 font-light">Mon-Fri, 8am - 6pm</p>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-stone-600 text-[10px] uppercase tracking-widest font-medium gap-4">
                    <p>&copy; 2024 YogSamskara. All rights reserved.</p>
                    <div className="flex gap-8">
                        <span className="hover:text-stone-400 cursor-pointer transition-colors" onClick={() => navigate('/faq')}>FAQ</span>
                        <span className="hover:text-stone-400 cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="hover:text-stone-400 cursor-pointer transition-colors">Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
