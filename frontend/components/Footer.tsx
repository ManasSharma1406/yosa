
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Send } from 'lucide-react';

const Footer: React.FC = () => {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0.8, 1], [0, -100]);

    return (
        <footer className="relative bg-[#1c1917] text-white pt-32 pb-12 overflow-hidden">
            {/* Background Parallax */}
            <motion.div style={{ y }} className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none">
                <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2670&auto=format&fit=crop" loading="lazy" className="w-full h-full object-cover grayscale" alt="mountains" />
            </motion.div>

            <div className="relative z-10 max-w-[1700px] mx-auto px-6 md:px-12">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">

                    {/* Left Content */}
                    <div className="flex flex-col justify-between h-full">
                        <div className="mb-12">
                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-5xl md:text-7xl font-sans font-light mb-8 leading-tight tracking-tighter"
                            >
                                One Decision Can Change Your <span className="font-serif italic text-stone-300">Life</span>
                            </motion.h2>
                            <p className="text-stone-400 max-w-md text-lg font-light">
                                Join thousands who have transformed their well-being. Whether you have a question or just want to say hello, we'd love to hear from you.
                            </p>
                        </div>

                        <div className="invisible h-0">
                            {/* Spacing or other content */}
                        </div>
                    </div>

                    {/* Right Content: Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-end text-right space-y-12"
                    >
                        <div>
                            <p className="text-stone-500 text-xs uppercase tracking-widest mb-3">Email Us</p>
                            <a href="mailto:contact@yogsamskara.com" className="text-3xl md:text-4xl font-serif italic hover:text-stone-300 transition-colors">contact@yogsamskara.com</a>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 w-full max-w-md ml-auto">
                            <div>
                                <p className="text-stone-500 text-xs uppercase tracking-widest mb-3">Visit Us</p>
                                <p className="text-stone-300 font-light leading-relaxed text-lg">88 Serenity Avenue<br />Harmony District, Yogaville 12345</p>
                            </div>
                            <div>
                                <p className="text-stone-500 text-xs uppercase tracking-widest mb-3">Call Us</p>
                                <p className="text-stone-300 font-light leading-relaxed text-lg">+91 93994 41405<br />Mon-Fri, 8am - 6pm</p>
                            </div>
                        </div>
                    </motion.div>

                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-stone-500 text-xs font-light">
                    <p>&copy; 2024 YogSamskara. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
