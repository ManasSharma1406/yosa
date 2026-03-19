import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useBooking } from '../context/BookingContext';

const offers = [
    {
        title: "1:1 ONLINE CLASSES",
        image: "/personal.jpg",
        points: [
            "Personalized attention & guidance",
            "Tailored to your specific goals",
            "Flexible scheduling options"
        ],
        link: "/personal-yoga"
    },
    {
        title: "GROUP ONLINE CLASSES",
        image: "/group.jpg",
        points: [
            "Energizing community atmosphere",
            "Diverse daily class schedules",
            "Affordable access for everyone"
        ],
        link: "/group-offerings"
    },
    {
        title: "Family Wellness Plan",
        image: "/family.jpg",
        points: [
            "Fun activities for all ages",
            "Strengthen family bonds",
            "Build healthy habits together"
        ],
        link: "/family-plan"
    }
];

const WhatWeOffer: React.FC = () => {
    const navigate = useNavigate();
    const { openBookingModal } = useBooking();

    return (
        <section className="relative isolate min-h-screen w-full text-white py-24 px-6 md:px-12 flex flex-col items-center justify-center overflow-hidden">

            {/* CSS gradient background replacing the Silk shader */}
            <div className="absolute inset-0 -z-20 w-full h-full" style={{
                background: 'linear-gradient(135deg, #1c1917 0%, #0f0f0e 40%, #1c1917 70%, #292524 100%)',
                backgroundSize: '400% 400%',
            }} />


            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40 -z-10" />


            <div className="relative z-10 w-full max-w-[1400px] flex flex-col items-center">

                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-sm md:text-base font-sans tracking-[0.2em] uppercase text-stone-400 mb-8"
                >
                    What We Offer
                </motion.h2>

                {/* Quote */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-5xl lg:text-6xl font-light text-center leading-tight max-w-4xl mb-20"
                >
                    <span className="font-serif italic pr-2" style={{ color: '#C01823', textShadow: '0 0 5px #C01823' }}>Spaces</span>
                    to breathe, move, and come home to yourself.
                </motion.div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-20">
                    {offers.map((offer, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + (index * 0.1) }}
                            className="group relative h-[600px] rounded-[2rem] overflow-hidden cursor-pointer"
                            onClick={() => navigate(offer.link)}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0 w-full h-full">
                                <img
                                    src={offer.image}
                                    alt={offer.title}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                            </div>

                            {/* Glass Content */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6">
                                    <h3 className="text-xl font-poppins font-medium tracking-wide mb-4 uppercase">{offer.title}</h3>
                                    <ul className="space-y-2">
                                        {offer.points.map((point, i) => (
                                            <li key={i} className="text-stone-200 text-sm flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="px-[42px] py-[21px] bg-white/5 backdrop-blur-xl border border-white/20 rounded-full text-[13px] md:text-[15px] uppercase tracking-[0.15em] hover:bg-white hover:text-stone-900 transition-all duration-500 flex items-center gap-3 group"
                    onClick={() => window.open('https://wa.me/919399441405?text=I\'d%20like%20to%20book%20a%20free%2030-min%20consultation', '_blank')}
                >
                    Book - 30 Min Free Consultation!
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>

            </div>
        </section>
    );
};

export default WhatWeOffer;
