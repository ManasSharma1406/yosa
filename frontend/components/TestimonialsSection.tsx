import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { Testimonial } from '../types';

const testimonials: Testimonial[] = [
    {
        id: "1",
        text: "The best!! really enjoyed Bhumika's lessons, she is AMAZING! she is so proffesional, gentle, sensitive, caring for the traineres, builds interesting and flowing routines! Her energy is so good! She is my favorite and im thankfull for the classes with her! ממליצה מאודד היא מושלמת באמת !",
        author: "Tali Itzhaki",
        role: "Member since 2023",
        image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=2070",
        countryCode: "IL"
    },
    {
        id: "2",
        text: "I’ve been attending yoga sessions at Yog Sanskara by Bhumika Hardia, and it’s been an amazing experience. Her classes blend modern fitness with traditional ashtanga and vinyasa flow, guided with calm energy and humility. The sound healing at the end is deeply relaxing — I always leave feeling balanced and recharged.",
        author: "Bhaskar Uplawdiya",
        role: "Member since 2022",
        image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&q=80&w=2070",
        countryCode: "IN"
    },
    {
        id: "3",
        text: "There once was a yogi named Bhumika,The best in all corners of India. She reads every part Of the body by heart, And her sound healing lifts your whole spirit up",
        author: "Shoham Saadia",
        role: "Remote Member",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=2040",
        countryCode: "IL"
    },
    {
        id: "4",
        text: "I’d like to warmly recommend Bhumika, a wonderful yoga teacher I practiced with in Kasar Devi, India. Her classes were grounding, inspiring, and deeply authentic. She creates a calm, welcoming space, explains each posture with clarity, and brings a beautiful balance of physical practice, breathwork, and mindfulness.",
        author: "Yuval hilel Antman ron",
        role: "Remote Member",
        image: "https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&q=80&w=2070",
        countryCode: "IL"
    },
    {
        id: "5",
        text: "Very experienced yoga instructor with a lot of useful insights. Had a great few sessions that helped me quickly get into a good routine. Definitely knows a lot about their profession..",
        author: "Ujjwal Kumar",
        role: "Remote Member",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=2062",
        countryCode: "IN"
    }
];

const TestimonialsSection: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    // Auto-scroll functionality
    useEffect(() => {
        const interval = setInterval(() => {
            next();
        }, 10000); // Change testimonial every 10 seconds

        return () => clearInterval(interval);
    }, [currentIndex]);

    return (
        <section className="py-40 bg-black text-white relative overflow-hidden">

            {/* Matching layout container */}
            <div className="max-w-[1700px] mx-auto px-6 md:px-12 relative z-10">
                <div className="mb-20">
                    <div className="w-full h-[1px] bg-white/20 mb-12"></div>
                    <h2 className="text-5xl md:text-7xl font-sans font-light text-white mb-4 tracking-tight">
                        Stories of <br />
                        <span className="font-serif italic text-stone-400">Transformation</span>
                    </h2>
                    <p className="text-stone-400 text-sm mt-6 font-poppins tracking-wide">Hear how yoga has changed lives, mentally, physically, and spiritually.</p>

                </div>

                <div className="relative bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[3rem] p-8 md:p-20 overflow-hidden">
                    <Quote className="absolute top-12 left-12 w-24 h-24 text-white/5 rotate-180" />

                    <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
                        <div className="w-full md:w-[400px] shrink-0">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={testimonials[currentIndex].image}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.6 }}
                                    className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                                >
                                    <img src={testimonials[currentIndex].image} alt="User" decoding="async" className="w-full h-full object-cover opacity-90" />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="w-full md:flex-1">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {/* 5-Star Rating */}
                                    <div className="flex gap-1 mb-6">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="w-5 h-5" viewBox="0 0 24 24" fill="#f59e0b">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        ))}
                                    </div>

                                    <p className="text-2xl md:text-4xl font-poppins font-light leading-snug text-stone-200 mb-12 tracking-tight">
                                        "{testimonials[currentIndex].text}"
                                    </p>
                                    <div>
                                        <h4 className="font-serif italic text-3xl text-white mb-2 flex items-center gap-3">
                                            {testimonials[currentIndex].author}
                                            {testimonials[currentIndex].countryCode && (
                                                <img
                                                    src={`https://flagcdn.com/w40/${testimonials[currentIndex].countryCode.toLowerCase()}.png`}
                                                    alt={testimonials[currentIndex].countryCode}
                                                    decoding="async"
                                                    className="h-6 w-auto rounded-sm inline-block"
                                                />
                                            )}
                                        </h4>
                                        <p className="text-stone-500 text-xs uppercase tracking-[0.2em] font-poppins font-semibold">{testimonials[currentIndex].role}</p>
                                    </div>

                                </motion.div>
                            </AnimatePresence>

                            <div className="flex gap-4 mt-16">
                                <button onClick={prev} className="w-14 h-14 rounded-full border border-white/20 bg-white/5 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 group">
                                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                </button>
                                <button onClick={next} className="w-14 h-14 rounded-full border border-white/20 bg-white/5 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 group">
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;