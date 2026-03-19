import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Users, Zap, Star } from 'lucide-react';
import ScheduleModal from './ScheduleModal';

const whyGroup = [
    {
        icon: <Users className="w-6 h-6" />,
        title: "Community Energy",
        desc: "Practice alongside others who share your dedication. Group energy elevates everyone."
    },
    {
        icon: <Zap className="w-6 h-6" />,
        title: "Expert Guidance",
        desc: "Every class is led by a trained instructor who adjusts cues to all levels present."
    },
    {
        icon: <Star className="w-6 h-6" />,
        title: "Consistent Progress",
        desc: "Regular attendance builds rhythm. Class packs make it effortless to keep showing up."
    }
];

const GroupOfferingsPage: React.FC = () => {
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string>('');

    const handleBookNow = (planName: string) => {
        setSelectedPlan(planName);
        setIsScheduleModalOpen(true);
    };

    return (
        <div className="pt-32 pb-20 bg-black min-h-screen text-white">

            {/* Hero Section */}
            <section className="max-w-[1700px] mx-auto px-6 md:px-12 mb-24">
                <div className="relative rounded-[3rem] overflow-hidden h-[60vh] md:h-[80vh] w-full border border-white/10">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/group offerings page.jpg"
                            alt="Group Offerings Background"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover opacity-70"
                        />
                    </div>
                    <div className="absolute inset-0 bg-stone-900/30 z-10 pointer-events-none" />
                    <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4 pointer-events-none">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            className="text-6xl md:text-9xl font-light text-white tracking-tighter mb-6 mix-blend-overlay"
                        >
                            Group <span className="font-serif italic text-white/90">Offerings</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 1 }}
                            className="text-white/80 text-lg md:text-xl font-light max-w-xl leading-relaxed"
                        >
                            Practice together. Grow individually. Find your community on the mat.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* INTRO SECTION */}
            <section className="max-w-4xl mx-auto px-6 md:px-12 mb-32 text-center">
                <h2 className="text-4xl md:text-5xl font-light text-white mb-8 leading-tight">
                    Yoga That <br />
                    <span className="font-serif italic text-stone-400">Builds Community</span>
                </h2>
                <div className="text-stone-400 text-lg leading-relaxed font-light space-y-6">
                    <p>
                        Group classes bring the energy of shared intention. Whether you're a beginner finding your footing or advancing your practice, there is a class designed for your pace.
                    </p>
                    <p className="text-xl text-white font-poppins pl-4">
                        "Move together. Breathe together. Transform together."
                    </p>
                </div>
            </section>

            {/* WHY GROUP SECTION */}
            <section className="max-w-[1400px] mx-auto px-6 md:px-12 mb-32">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-light text-white mb-2">Why Practice in a Group</h2>
                    <div className="w-24 h-[1px] bg-white/20 mx-auto mt-6"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {whyGroup.map((item, idx) => (
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

            {/* REGULAR GROUP CLASSES */}
            <section className="max-w-[1400px] mx-auto px-6 md:px-12 mb-20">
                <div className="text-center mb-14">
                    <h2 className="text-4xl md:text-5xl font-light text-white mb-3">Regular Group Classes</h2>
                    <p className="text-stone-400 text-sm uppercase tracking-widest">Open to all levels</p>
                    <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                        <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeLinecap="round" d="M12 6v6l4 2" strokeWidth="2" /></svg>
                        <span className="text-indigo-300 text-xs font-semibold tracking-wide">60-minute sessions</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto items-start">

                    {/* Drop-In */}
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col backdrop-blur-md hover:border-white/20 transition-all duration-300 h-full">
                        <h3 className="text-xl font-poppins text-white mb-2">Drop-In Class</h3>
                        <p className="text-stone-500 text-sm mb-4">Single session</p>
                        <div className="text-5xl font-light mb-1 text-white">$10</div>
                        <p className="text-stone-500 text-xs mb-6">$10 / class</p>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> No commitment required</li>
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> All levels welcome</li>
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> Expert-led session</li>
                        </ul>
                        <button
                            onClick={() => handleBookNow('Group Drop-In (Group)')}
                            className="w-full py-3 border border-white/30 rounded-full hover:bg-white hover:text-black transition-all uppercase text-xs tracking-widest text-white"
                        >
                            Book Now
                        </button>
                    </div>

                    {/* 10 Class Pack */}
                    <div className="bg-white p-8 rounded-3xl text-black shadow-2xl flex flex-col border border-white/20 z-10 h-full">
                        <div className="flex justify-end mb-3">
                            <span className="px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Best Value</span>
                        </div>
                        <h3 className="text-xl font-poppins mb-2">10 Class Pack</h3>
                        <p className="text-stone-500 text-sm mb-4">10 sessions</p>
                        <div className="text-5xl font-light mb-1">$85</div>
                        <p className="text-stone-500 text-xs mb-6">$8.50 / class</p>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex gap-3 text-sm text-stone-700"><Check className="w-4 h-4 shrink-0" /> Save $15 vs drop-in</li>
                            <li className="flex gap-3 text-sm text-stone-700"><Check className="w-4 h-4 shrink-0" /> Flexible scheduling</li>
                            <li className="flex gap-3 text-sm text-stone-700"><Check className="w-4 h-4 shrink-0" /> Valid 1 month</li>
                        </ul>
                        <button
                            onClick={() => handleBookNow('10 Class Pack (Group)')}
                            className="w-full py-3 bg-black text-white rounded-full hover:bg-stone-800 transition-all uppercase text-xs tracking-widest font-bold"
                        >
                            Book Now
                        </button>
                    </div>

                    {/* 20 Class Pack */}
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col backdrop-blur-md hover:border-white/20 transition-all duration-300 h-full">
                        <h3 className="text-xl font-poppins text-white mb-2">20 Class Pack</h3>
                        <p className="text-stone-500 text-sm mb-4">20 sessions</p>
                        <div className="text-5xl font-light mb-1 text-white">$150</div>
                        <p className="text-stone-500 text-xs mb-6">$7.50 / class</p>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> Maximum savings</li>
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> Full month commitment</li>
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> Priority booking</li>
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> Consistency bonus</li>
                        </ul>
                        <button
                            onClick={() => handleBookNow('20 Class Pack (Group)')}
                            className="w-full py-3 border border-white/30 rounded-full hover:bg-white hover:text-black transition-all uppercase text-xs tracking-widest text-white"
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            </section>

            {/* DIVIDER */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-20">
                <div className="w-full h-[1px] bg-white/10" />
            </div>

            {/* PREMIUM SMALL GROUP */}
            <section className="max-w-[1400px] mx-auto px-6 md:px-12 mb-20">
                <div className="text-center mb-14">
                    <h2 className="text-4xl md:text-5xl font-light text-white mb-3">Premium Small Group</h2>
                    <p className="text-stone-400 text-sm uppercase tracking-widest">Maximum 5 Members · Intimate &amp; Focused</p>
                    <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
                        <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeLinecap="round" d="M12 6v6l4 2" strokeWidth="2" /></svg>
                        <span className="text-purple-300 text-xs font-semibold tracking-wide">90-minute sessions</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto items-start">

                    {/* Drop-In */}
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col backdrop-blur-md hover:border-white/20 transition-all duration-300 h-full">
                        <h3 className="text-xl font-poppins text-white mb-2">Drop-In</h3>
                        <p className="text-stone-500 text-sm mb-4">Single session</p>
                        <div className="text-5xl font-light mb-1 text-white">$18</div>
                        <p className="text-stone-500 text-xs mb-6">$18 / class</p>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> Max 5 members per class</li>
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> Semi-personalized attention</li>
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> Intimate setting</li>
                        </ul>
                        <button
                            onClick={() => handleBookNow('Premium Small Drop-In (Group)')}
                            className="w-full py-3 border border-white/30 rounded-full hover:bg-white hover:text-black transition-all uppercase text-xs tracking-widest text-white"
                        >
                            Book Now
                        </button>
                    </div>

                    {/* 8 Sessions */}
                    <div className="bg-white p-8 rounded-3xl text-black shadow-2xl flex flex-col border border-white/20 z-10 h-full">
                        <div className="flex justify-end mb-3">
                            <span className="px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Recommended</span>
                        </div>
                        <h3 className="text-xl font-poppins mb-2">8-Session Pack</h3>
                        <p className="text-stone-500 text-sm mb-4">8 sessions</p>
                        <div className="text-5xl font-light mb-1">$135</div>
                        <p className="text-stone-500 text-xs mb-6">$16.88 / session</p>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex gap-3 text-sm text-stone-700"><Check className="w-4 h-4 shrink-0" /> Dedicated spot reserved</li>
                            <li className="flex gap-3 text-sm text-stone-700"><Check className="w-4 h-4 shrink-0" /> Progress-focused structure</li>
                            <li className="flex gap-3 text-sm text-stone-700"><Check className="w-4 h-4 shrink-0" /> Close-knit group dynamic</li>
                        </ul>
                        <button
                            onClick={() => handleBookNow('Premium 8-Session Pack (Group)')}
                            className="w-full py-3 bg-black text-white rounded-full hover:bg-stone-800 transition-all uppercase text-xs tracking-widest font-bold"
                        >
                            Book Now
                        </button>
                    </div>

                    {/* 12 Sessions */}
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col backdrop-blur-md hover:border-white/20 transition-all duration-300 h-full">
                        <h3 className="text-xl font-poppins text-white mb-2">12-Session Pack</h3>
                        <p className="text-stone-500 text-sm mb-4">12 sessions</p>
                        <div className="text-5xl font-light mb-1 text-white">$180</div>
                        <p className="text-stone-500 text-xs mb-6">$15 / session</p>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> Maximum savings</li>
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> Extended premium access</li>
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> Deep group cohesion</li>
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> Priority spot booking</li>
                        </ul>
                        <button
                            onClick={() => handleBookNow('Premium 12-Session Pack (Group)')}
                            className="w-full py-3 border border-white/30 rounded-full hover:bg-white hover:text-black transition-all uppercase text-xs tracking-widest text-white"
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="max-w-4xl mx-auto px-6 text-center py-20 bg-gradient-to-t from-white/5 to-transparent rounded-t-[3rem] mt-20">
                <h3 className="text-3xl md:text-5xl font-poppins text-white mb-6">Ready to Join the Community?</h3>
                <p className="text-stone-400 mb-8 max-w-xl mx-auto text-lg">Find your class, reserve your spot, and show up for yourself — consistently.</p>
                <p className="text-stone-500 text-sm mb-12">For bookings and consultations, please contact Yoga Samskara directly.</p>
                <div className="flex flex-col md:flex-row justify-center gap-6">
                    <button
                        onClick={() => window.open('https://wa.me/919399441405?text=I\'d%20like%20to%20inquire%20about%20group%20classes', '_blank')}
                        className="px-8 py-4 border border-white/30 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all"
                    >
                        Contact Us
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

export default GroupOfferingsPage;
