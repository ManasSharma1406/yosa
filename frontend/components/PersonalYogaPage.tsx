import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Heart, ArrowRight, Sparkles, Wind, Activity } from 'lucide-react';
import ScheduleModal from './ScheduleModal';

// Section 2 Data
const whyData = [
    {
        icon: <Sparkles className="w-6 h-6" />,
        title: "Personalized to You",
        desc: "Your sessions evolve week by week, based on your energy, lifestyle, and healing needs."
    },
    {
        icon: <Heart className="w-6 h-6" />,
        title: "Deep Therapeutic Attention",
        desc: "You receive attuned guidance — for movement, breath, alignment, and emotional grounding."
    },
    {
        icon: <Activity className="w-6 h-6" />,
        title: "Rooted in Science & Ancient Practice",
        desc: "Evidence-based yoga therapy meets traditional yogic wisdom for long-term wellbeing."
    },
    {
        icon: <Wind className="w-6 h-6" />,
        title: "Space to Feel, Release & Renew",
        desc: "Every session is crafted to help your body soften, your mind clear, and your breath deepen."
    }
];

// Section 3 Data
const journeyIncludes = [
    { title: "Ashtanga Therapeutic Approach", desc: "Strength, structure, and mindful discipline." },
    { title: "Hatha Yoga", desc: "Grounded postures, breathwork, balance." },
    { title: "Vinyasa Flow", desc: "Fluid sequence work to reconnect breath and movement." },
    { title: "Stretching & Mobility", desc: "Releasing tension where the body holds it most." },
    { title: "Breathwork & Nervous System Reset", desc: "Practices for calm, clarity, and emotional spaciousness." },
    { title: "Body Scan & Mindfulness", desc: "Awareness-based healing for inner stillness." }
];

const therapyAreas = [
    "Back & spine health",
    "Knee & joint pain",
    "Anxiety & sleep issues",
    "Metabolic and hormonal balance",
    "Posture, mobility & fatigue",
    "Stress patterns and emotional regulation"
];

const PersonalYogaPage: React.FC = () => {
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string>('');

    const handleBookNow = (planName: string) => {
        setSelectedPlan(planName);
        setIsScheduleModalOpen(true);
    };

    return (
        <div className="pt-32 pb-20 bg-black min-h-screen text-white">

            {/* Hero Section (UNTOUCHED) */}
            <section className="max-w-[1700px] mx-auto px-6 md:px-12 mb-24">
                <div className="relative rounded-[3rem] overflow-hidden h-[60vh] md:h-[80vh] w-full border border-white/10">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/personal.jpg"
                            alt="Personal Yoga Background"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover opacity-80"
                        />
                    </div>

                    {/* Dark Overlay for contrast */}
                    <div className="absolute inset-0 bg-stone-900/20 z-10 pointer-events-none" />

                    <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4 pointer-events-none">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            className="text-6xl md:text-9xl font-light text-white tracking-tighter mb-6 mix-blend-overlay"
                        >
                            Personal <span className="font-serif italic text-white/90">Yoga</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 1 }}
                            className="text-white/80 text-lg md:text-xl font-light max-w-xl leading-relaxed"
                        >
                            A practice dedicated entirely to you. Deepen your connection to body and mind with one-on-one guidance.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* SECTION 1 - INTRO */}
            <section className="max-w-4xl mx-auto px-6 md:px-12 mb-32 text-center">
                <h2 className="text-4xl md:text-5xl font-light text-white mb-8 leading-tight">
                    A Practice That <br />
                    <span className="font-serif italic text-stone-400">Moves With You</span>
                </h2>
                <div className="text-stone-400 text-lg leading-relaxed font-light space-y-6">
                    <p>
                        Your body speaks in subtle ways.
                        Your breath reveals what words cannot.
                        Your practice becomes the place where these layers are understood — gently, privately, and with intention.
                    </p>
                    <p className="text-xl text-white font-poppins pl-4">
                        "These sessions aren’t classes. They are a journey inward."
                    </p>
                </div>
            </section>

            {/* SECTION 2 - WHY 1:1 MATTERS */}
            <section className="max-w-[1400px] mx-auto px-6 md:px-12 mb-32">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-light text-white mb-2">Why Begin This Journey</h2>
                    <div className="w-24 h-[1px] bg-white/20 mx-auto mt-6"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {whyData.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white/5 p-8 rounded-3xl shadow-sm border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors duration-300"
                        >
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white mb-6">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-poppins text-white mb-3">{item.title}</h3>
                            <p className="text-stone-400 text-sm leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* SECTION 3 - WHAT YOUR JOURNEY CAN INCLUDE */}
            <section className="bg-stone-900/50 border-y border-white/5 py-32 mb-32">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    <h2 className="text-4xl md:text-6xl font-light text-white mb-16 text-center">
                        Your Journey May <span className="font-poppins text-stone-400">Explore</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        {/* Left Column: Approaches */}
                        <div className="space-y-8">
                            {journeyIncludes.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex flex-col"
                                >
                                    <h4 className="text-xl font-poppins text-white mb-1">{item.title}</h4>
                                    <p className="text-stone-400 text-sm">{item.desc}</p>
                                    <div className="w-full h-[1px] bg-white/5 mt-4" />
                                </motion.div>
                            ))}
                        </div>

                        {/* Right Column: Therapy Areas */}
                        <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                            <h3 className="text-2xl font-light text-white mb-8 border-b border-white/10 pb-4">Specialized Yoga Therapy For:</h3>
                            <ul className="space-y-4">
                                {therapyAreas.map((area, index) => (
                                    <li key={index} className="flex items-center gap-3 text-stone-300 text-lg">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                                        {area}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>


            {/* SECTION 4 - THE EXPERIENCE */}
            <section className="max-w-4xl mx-auto px-6 md:px-12 mb-32 text-center">
                <h2 className="text-3xl md:text-5xl font-light text-white mb-12">Your Session Is...</h2>
                <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                    {["Quietly guided", "Respectful of your pace", "Tailored to your daily state", "Rooted in mindful presence", "Designed for lasting change"].map((text, i) => (
                        <span key={i} className="px-6 py-3 rounded-full border border-white/20 text-stone-300 text-sm md:text-base uppercase tracking-wider hover:bg-white/10 transition-colors cursor-default">
                            {text}
                        </span>
                    ))}
                </div>
                <p className="mt-12 text-xl font-serif italic text-stone-400">"This is your time — your sanctuary."</p>
            </section>


            {/* SECTION 5 - PACKAGES */}
            <section className="max-w-[1400px] mx-auto px-6 md:px-12 mb-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-light text-white mb-4">Private 1:1 Sessions</h2>
                    <p className="text-stone-400">"Choose the pace and depth that feel right for you."</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-start">

                    {/* Drop-In */}
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col backdrop-blur-md hover:border-white/20 transition-all duration-300 h-full">
                        <h3 className="text-xl font-poppins text-white mb-2">Drop-In</h3>
                        <p className="text-stone-500 text-sm mb-6">1 Session</p>
                        <div className="text-4xl font-light mb-2 text-white">$25</div>
                        <p className="text-stone-500 text-xs mb-6">$25 / session</p>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> One-on-one guidance</li>
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> Personalized session</li>
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> No commitment</li>
                        </ul>
                        <button
                            onClick={() => handleBookNow('Drop-In (1:1 Private)')}
                            className="w-full py-3 border border-white/30 rounded-full hover:bg-white hover:text-black transition-all uppercase text-xs tracking-widest text-white"
                        >
                            Book Now
                        </button>
                    </div>

                    {/* 8 Sessions */}
                    <div className="bg-white p-8 rounded-3xl text-black shadow-2xl flex flex-col border border-white/20 z-10 h-full">
                        <div className="flex justify-end mb-3">
                            <span className="px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Popular</span>
                        </div>
                        <h3 className="text-xl font-poppins mb-2">4-Week Journey</h3>
                        <p className="text-stone-500 text-sm mb-6">8 Sessions · 4 Weeks</p>
                        <div className="text-4xl font-light mb-2">$190</div>
                        <p className="text-stone-500 text-xs mb-6">$23.75 / session</p>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex gap-3 text-sm text-stone-700"><Check className="w-4 h-4 shrink-0" /> Personalized weekly plan</li>
                            <li className="flex gap-3 text-sm text-stone-700"><Check className="w-4 h-4 shrink-0" /> Progress tracking</li>
                            <li className="flex gap-3 text-sm text-stone-700"><Check className="w-4 h-4 shrink-0" /> Email support</li>
                        </ul>
                        <button
                            onClick={() => handleBookNow('4-Week Journey (1:1 Private)')}
                            className="w-full py-3 bg-black text-white rounded-full hover:bg-stone-800 transition-all uppercase text-xs tracking-widest font-bold"
                        >
                            Book Now
                        </button>
                    </div>

                    {/* 12 Sessions */}
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col backdrop-blur-md hover:border-white/20 transition-all duration-300 h-full">
                        <h3 className="text-xl font-poppins text-white mb-2">Deep Foundation</h3>
                        <p className="text-stone-500 text-sm mb-6">12 Sessions · 4 Weeks</p>
                        <div className="text-4xl font-light mb-2 text-white">$270</div>
                        <p className="text-stone-500 text-xs mb-6">$22.50 / session</p>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> Therapeutic sequences</li>
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> Breathwork & meditation</li>
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> Ongoing support</li>
                        </ul>
                        <button
                            onClick={() => handleBookNow('Deep Foundation (1:1 Private)')}
                            className="w-full py-3 border border-white/30 rounded-full hover:bg-white hover:text-black transition-all uppercase text-xs tracking-widest text-white"
                        >
                            Book Now
                        </button>
                    </div>

                    {/* 16 Sessions */}
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col backdrop-blur-md hover:border-white/20 transition-all duration-300 h-full">
                        <h3 className="text-xl font-poppins text-white mb-2">Transformation</h3>
                        <p className="text-stone-500 text-sm mb-6">16 Sessions · 4 Weeks</p>
                        <div className="text-4xl font-light mb-2 text-white">$340</div>
                        <p className="text-stone-500 text-xs mb-6">$21.25 / session</p>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> Comprehensive plan</li>
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> Alignment & therapy focus</li>
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> Full lifestyle guidance</li>
                        </ul>
                        <button
                            onClick={() => handleBookNow('Transformation (1:1 Private)')}
                            className="w-full py-3 border border-white/30 rounded-full hover:bg-white hover:text-black transition-all uppercase text-xs tracking-widest text-white"
                        >
                            Book Now
                        </button>
                    </div>

                    {/* 20 Sessions */}
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col backdrop-blur-md hover:border-white/20 transition-all duration-300 h-full">
                        <h3 className="text-xl font-poppins text-white mb-2">Total Immersion</h3>
                        <p className="text-stone-500 text-sm mb-6">20 Sessions · 4 Weeks</p>
                        <div className="text-4xl font-light mb-2 text-white">$400</div>
                        <p className="text-stone-500 text-xs mb-6">$20 / session</p>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> Maximum savings</li>
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> Daily practice support</li>
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> Advanced therapeutic care</li>
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> Priority scheduling</li>
                        </ul>
                        <button
                            onClick={() => handleBookNow('Total Immersion (1:1 Private)')}
                            className="w-full py-3 border border-white/30 rounded-full hover:bg-white hover:text-black transition-all uppercase text-xs tracking-widest text-white"
                        >
                            Book Now
                        </button>
                    </div>
                </div>

                {/* Add-ons */}
                <div className="mt-16 bg-white/5 rounded-2xl p-8 border border-white/5 max-w-3xl mx-auto backdrop-blur-sm">
                    <h4 className="text-center font-poppins text-white text-xl mb-6">Optional Add-ons</h4>
                    <div className="flex flex-col md:flex-row justify-center gap-8 text-stone-300 text-sm">
                        <div className="flex justify-between md:block w-full text-center">
                            <span>Guided Body Scan Meditation:</span> <span className="font-bold text-white ml-2">$12 / session</span>
                        </div>
                        <div className="hidden md:block w-[1px] bg-white/10 h-6"></div>
                        <div className="flex justify-between md:block w-full text-center">
                            <span>Breathwork & Nervous System Reset:</span> <span className="font-bold text-white ml-2">$18 / session</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="max-w-4xl mx-auto px-6 text-center py-20 bg-gradient-to-t from-white/5 to-transparent rounded-t-[3rem] mt-20">
                <h3 className="text-3xl md:text-5xl font-poppins text-white mb-6">Book Your Free 30-Min Consultation</h3>
                <p className="text-stone-400 mb-8 max-w-xl mx-auto text-lg">(No pressure. Just a conversation to start your journey.)</p>
                <p className="text-stone-500 text-sm mb-12">Just a gentle conversation with your body’s needs at the center.</p>
                <div className="flex flex-col md:flex-row justify-center gap-6">
                    <button
                        onClick={() => window.open('https://wa.me/919399441405?text=I\'d%20like%20to%20book%20a%20free%2030-min%20consultation', '_blank')}
                        className="px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs hover:bg-stone-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                        Start Your Journey
                    </button>
                </div>
            </section>

            <ScheduleModal
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                initialPlan={selectedPlan}
            />
        </div>
    );
};

export default PersonalYogaPage;
