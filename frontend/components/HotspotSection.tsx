import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const hotspots = [
    {
        id: 1,
        label: "1️. Annamaya Kosha — The Physical Body",
        content: [
            "Represented by the outermost layer.",
            "“Anna” means food.",
            "This sheath is your physical body — bones, muscles, organs, skin, etc.",
            "It is sustained by food, water, and air.",
            "It is the most tangible and easiest to observe.",
            "Balanced when: you eat well, sleep well, exercise, and take care of your body.",
            "Practices: Hatha yoga, proper diet, physical activity."
        ],
        // 1: Outer layer (Top Right)
        x: 72,
        y: 34,
        position: 'right'
    },
    {
        id: 2,
        label: "2️. Pranamaya Kosha — The Energy Body",
        content: [
            "Second layer inward.",
            "Governs prana (life-force), breath, and circulation.",
            "Includes the flow of energy through nadis (channels) and chakras.",
            "A bridge between the body and the mind.",
            "Balanced when: breathing is steady; you feel energetic and alive.",
            "Practices: Pranayama, breath awareness, energy balancing."
        ],
        // 2: Second layer (Mid Right)
        x: 80,
        y: 55,
        position: 'right'
    },
    {
        id: 3,
        label: "3️. Manomaya Kosha — The Mental-Emotional Body",
        content: [
            "Third layer inward.",
            "Deals with the mind, thoughts, emotions, and sensory processing.",
            "This is where stress, overthinking, fear live.",
            "Responsible for emotional reactions and habits.",
            "Balanced when: thoughts are calm, emotions stable, mind clear.",
            "Practices: Mindfulness, chanting, positive affirmations, guided meditation."
        ],
        // 3: Third layer (Lower Right)
        x: 58,
        y: 16,
        position: 'right'
    },
    {
        id: 4,
        label: "4️. Vijnanamaya Kosha — The Wisdom / Intellect Body",
        content: [
            "Fourth layer inward.",
            "“Vijnana” means higher knowledge or insight.",
            "Governs: intellect, intuition, inner guidance, self-reflection.",
            "This sheath helps distinguish truth from illusion.",
            "Balanced when: decisions are clear, intuition strong, awareness sharp.",
            "Practices: Self-inquiry, studying scriptures, deep meditation."
        ],
        // 4: Fourth layer (Mid Left)
        x: 29,
        y: 50,
        position: 'left'
    },
    {
        id: 5,
        label: "5️. Anandamaya Kosha — The Bliss Body",
        content: [
            "Innermost layer (center).",
            "“Ananda” means bliss.",
            "It is not emotional happiness — it is pure, serene joy.",
            "The state experienced in deep meditation or deep sleep.",
            "Closest to the true Self (Ātman).",
            "Balanced when: you experience inner peace, compassion, unity, and serenity.",
            "Practices: Deep meditation, devotion (bhakti), silence, connection with the Self."
        ],
        // 5: Center
        x: 49,
        y: 43,
        position: 'left'
    }
];

const HotspotSection: React.FC = () => {
    const [activeSpot, setActiveSpot] = useState<number | null>(null);

    return (
        <section className="py-32 bg-black w-full min-h-screen relative overflow-hidden flex items-center justify-center">
            {/* Instructional Banner Text in Background */}
            <div className="absolute top-24 right-4 md:right-12 flex flex-col items-end pointer-events-none z-10 select-none font-poppins text-white uppercase overflow-hidden">
                <div className="flex items-baseline gap-1.5 leading-none">
                    <span className="text-[10px] md:text-xs tracking-widest font-light">Hover</span>
                    <span className="text-[8px] md:text-[10px]">On</span>
                    <span className="text-xl md:text-3xl font-bold tracking-tighter text-white">Dots</span>
                </div>
                <div className="flex items-baseline gap-1.5 leading-none mt-1 text-white">
                    <span className="text-[8px] md:text-[10px]">For</span>
                    <span className="text-sm md:text-lg font-medium tracking-wide">Detailed</span>
                    <span className="text-2xl md:text-4xl font-black tracking-tightest italic">Representation</span>
                </div>
            </div>

            <div className="relative w-full max-w-[1200px] flex justify-center">
                <div className="relative inline-block">
                    <img
                        src="/koshas.jpg"
                        alt="The Five Koshas"
                        loading="lazy"
                        decoding="async"
                        className="max-w-full h-auto object-contain max-h-[85vh] opacity-90"
                    />

                    {/* Render Hotspots */}
                    {hotspots.map((spot) => (
                        <div
                            key={spot.id}
                            className="absolute cursor-pointer z-20"
                            style={{ top: `${spot.y}%`, left: `${spot.x}%`, transform: 'translate(-50%, -50%)' }}
                            onClick={() => {
                                if (window.innerWidth < 768) {
                                    setActiveSpot(activeSpot === spot.id ? null : spot.id);
                                }
                            }}
                            onMouseEnter={() => {
                                if (window.innerWidth >= 768) {
                                    setActiveSpot(spot.id);
                                }
                            }}
                            onMouseLeave={() => {
                                if (window.innerWidth >= 768) {
                                    setActiveSpot(null);
                                }
                            }}
                        >
                            {/* The Dot */}
                            <motion.div
                                className="w-6 h-6 md:w-8 md:h-8 bg-white/40 backdrop-blur-sm rounded-full border border-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.6)] relative z-10"
                                animate={{ scale: activeSpot === spot.id ? 1.2 : 1 }}
                                whileHover={{ scale: 1.2 }}
                            >
                                <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full"></div>
                                <motion.div
                                    className="absolute inset-0 rounded-full bg-white"
                                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                />
                            </motion.div>

                            {/* The Card & Connector Line (DESKTOP ONLY) */}
                            <div className="hidden md:block">
                                <AnimatePresence>
                                    {activeSpot === spot.id && (
                                    <>
                                        {/* Connector Line */}
                                        <motion.div
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: 100, opacity: 1 }}
                                            exit={{ width: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className={`absolute top-1/2 h-[1px] bg-white/50 z-0 pointer-events-none max-md:hidden ${spot.position === 'right' ? 'left-full' : 'right-full'
                                                }`}
                                        />

                                        {/* Info Card */}
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9, x: spot.position === 'right' ? 20 : -20 }}
                                            animate={{ opacity: 1, scale: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, x: spot.position === 'right' ? 10 : -10 }}
                                            transition={{ duration: 0.3 }}
                                            className={`absolute top-1/2 -translate-y-1/2 w-[400px] bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl z-50 text-left ${spot.position === 'right'
                                                ? 'left-full ml-[100px]'
                                                : 'right-full mr-[100px]'
                                                }`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="flex justify-between items-start mb-4 border-b border-white/20 pb-2">
                                                <h4 className="font-serif italic text-white text-xl md:text-2xl pr-4">
                                                    {spot.label}
                                                </h4>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveSpot(null);
                                                    }}
                                                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
                                                >
                                                    <X className="w-4 h-4 md:w-5 md:h-5" />
                                                </button>
                                            </div>
                                            <ul className="space-y-2">
                                                {spot.content.map((line, i) => (
                                                    <li key={i} className="text-stone-300 text-sm font-light leading-relaxed flex items-start gap-2">
                                                        <span className="w-1 h-1 bg-white/50 rounded-full mt-2 shrink-0"></span>
                                                        {line}
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    </>
                                )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Full Screen Modal */}
            <AnimatePresence>
                {activeSpot !== null && (
                    <motion.div
                        className="fixed inset-0 z-[100] md:hidden bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActiveSpot(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="w-full max-w-sm bg-white/10 backdrop-blur-2xl border border-white/20 p-6 sm:p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-y-auto max-h-[85vh] relative text-left"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-start mb-6 pb-4 border-b border-white/20 relative">
                                <h4 className="font-serif italic text-white text-2xl pr-8 leading-tight">
                                    {hotspots.find((s) => s.id === activeSpot)?.label}
                                </h4>
                                <button
                                    onClick={() => setActiveSpot(null)}
                                    className="p-2 -mr-2 -mt-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0 absolute top-0 right-0"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <ul className="space-y-4">
                                {hotspots.find((s) => s.id === activeSpot)?.content.map((line, i) => (
                                    <li key={i} className="text-stone-200 text-sm font-light leading-relaxed flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 bg-white/60 rounded-full mt-1.5 shrink-0"></span>
                                        {line}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default HotspotSection;