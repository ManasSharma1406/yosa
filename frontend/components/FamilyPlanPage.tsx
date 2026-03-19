import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Calendar, Star, Check, Sparkles, Phone } from 'lucide-react';
import ScheduleModal from './ScheduleModal';

const whatsIncluded = [
    {
        title: "Shared Private Session Pool",
        desc: "Flexible session sharing between family members based on individual needs and schedules.",
        icon: <Users className="w-6 h-6" />
    },
    {
        title: "Group Classes for Everyone",
        desc: "Every member receives group class passes to maintain consistency in their practice.",
        icon: <Calendar className="w-6 h-6" />
    },
    {
        title: "One Dedicated Teacher",
        desc: "One teacher guiding the entire household — understanding your complete family dynamic.",
        icon: <Sparkles className="w-6 h-6" />
    },
    {
        title: "Personalized for Every Age",
        desc: "Individualized support for different ages & levels. Structured wellness, not scattered workouts.",
        icon: <Heart className="w-6 h-6" />
    }
];

const perfectFor = [
    "Families who wish to practice together yet receive personalized attention.",
    "Parents introducing yoga to kids or elders looking for safe therapeutic practices.",
    "Busy families seeking balance and shared time for health."
];

const whyLove = [
    { title: "Grow Together", desc: "One teacher for the whole family context." },
    { title: "Mutual Support", desc: "Support each other with shared awareness." },
    { title: "Flexible Life", desc: "Flexibility built around your busy schedules." },
    { title: "Inclusive Goals", desc: "Everyone's individual goals are supported." }
];

const FamilyPlanPage: React.FC = () => {
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
                            src="/trial2_final.png"
                            alt="Family Plan Background"
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vh] md:w-[195vh] h-[100vw] object-contain opacity-70 rotate-0"
                        />
                        {/* Texture Overlay */}
                        <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                        />
                    </div>

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-stone-900/30 z-10 pointer-events-none" />

                    <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <h1 className="text-5xl md:text-8xl font-light text-white tracking-tighter mb-4 mix-blend-overlay">
                                Grow <span className="font-serif italic text-white/90">Individually.</span>
                            </h1>
                            <h1 className="text-5xl md:text-8xl font-light text-white tracking-tighter mb-8 mix-blend-overlay">
                                Heal <span className="font-serif italic text-white/90">Together.</span>
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 1 }}
                            className="text-white/90 text-lg md:text-xl font-light max-w-2xl leading-relaxed"
                        >
                            Bring your loved ones together for a personalized yoga therapy experience designed for the entire family.
                            Blend the care of private sessions with the energy of group practices.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* What's Included */}
            <section className="max-w-[1400px] mx-auto px-6 md:px-12 mb-32">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-light text-white mb-4">What's Included</h2>
                    <div className="w-24 h-[1px] bg-white/20 mx-auto mt-6"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {whatsIncluded.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm"
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

            {/* Validity & Perfect For */}
            <section className="max-w-6xl mx-auto px-6 md:px-12 mb-32 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">

                {/* Validity Card */}
                <div className="bg-gradient-to-br from-stone-900 to-black p-10 rounded-[3rem] border border-white/10 text-center md:text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-[200px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <h3 className="text-2xl font-poppins text-white mb-2 relative z-10">Plan Validity</h3>
                    <div className="text-5xl font-light text-white mb-4 relative z-10">2 Months</div>
                    <p className="text-stone-400 relative z-10">With flexible top-up and renewal options to suit your family's pace.</p>
                </div>

                {/* Perfect For */}
                <div>
                    <h3 className="text-3xl font-light text-white mb-8">Perfect For...</h3>
                    <ul className="space-y-6">
                        {perfectFor.map((item, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="flex gap-4 items-start"
                            >
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-white shrink-0 mt-1">
                                    <Check className="w-3 h-3" />
                                </span>
                                <span className="text-stone-300 text-lg font-light leading-relaxed">{item}</span>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Teaser Comparison */}
            <section className="bg-stone-900/50 py-24 mb-32 border-y border-white/5">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    <h2 className="text-3xl md:text-5xl font-light text-center text-white mb-16">Why Choose Family?</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-4xl mx-auto">

                        {/* Individual */}
                        <div className="p-8 rounded-3xl border border-white/5 bg-transparent opacity-60">
                            <h3 className="text-xl text-stone-400 mb-6 uppercase tracking-widest text-center">Individual Plan</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-stone-500"><span className="w-1.5 h-1.5 rounded-full bg-stone-600 mt-2 shrink-0" /> Single-person progress</li>
                                <li className="flex gap-3 text-stone-500"><span className="w-1.5 h-1.5 rounded-full bg-stone-600 mt-2 shrink-0" /> Limited flexibility</li>
                                <li className="flex gap-3 text-stone-500"><span className="w-1.5 h-1.5 rounded-full bg-stone-600 mt-2 shrink-0" /> Separate cost per member</li>
                            </ul>
                        </div>

                        {/* Family */}
                        <div className="p-10 rounded-[2.5rem] border border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl relative">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold uppercase py-1 px-3 rounded-full">Recommended</div>
                            <h3 className="text-2xl font-poppins text-white mb-6 text-center">Family Plan</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-white"><Check className="w-5 h-5 text-white shrink-0" /> Shared sessions & resources</li>
                                <li className="flex gap-3 text-white"><Check className="w-5 h-5 text-white shrink-0" /> Shared learning experience</li>
                                <li className="flex gap-3 text-white"><Check className="w-5 h-5 text-white shrink-0" /> Better value for multiple members</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Families Love This */}
            <section className="max-w-5xl mx-auto px-6 md:px-12 mb-32">
                <h2 className="text-3xl md:text-5xl font-light text-center text-white mb-16">Why Families <span className="font-poppins text-stone-400">Love This</span></h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {whyLove.map((item, idx) => (
                        <div key={idx} className="text-center p-6 bg-white/5 rounded-2xl border border-white/5">
                            <div className="mb-4 inline-flex p-3 bg-white/10 rounded-full text-white">
                                <Star className="w-5 h-5 fill-white/20" />
                            </div>
                            <h4 className="text-lg font-poppins text-white mb-2">{item.title}</h4>
                            <p className="text-stone-400 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAMILY WELLNESS PACKAGES PRICING */}
            <section className="max-w-[1400px] mx-auto px-6 md:px-12 mb-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-light text-white mb-4">Family Wellness Packages</h2>
                    <p className="text-stone-400 max-w-xl mx-auto">One family. One teacher. Infinite growth.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">

                    {/* Family of 2 */}
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col backdrop-blur-md hover:border-white/20 transition-all duration-300 h-full">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white mb-4">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-poppins text-white mb-1">Family of 2</h3>
                        <p className="text-stone-500 text-sm mb-5">2 Members · 2-month validity</p>
                        <div className="text-4xl font-light mb-1 text-white">$650</div>
                        <p className="text-stone-500 text-xs mb-1">Separate value ≈ <span className="line-through">$760</span></p>
                        <p className="text-green-400 text-xs font-bold mb-6">You save ~$110</p>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> 24 Private Sessions (shared)</li>
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> 20 Group Classes per person</li>
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> One dedicated teacher</li>
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> 2-month validity</li>
                        </ul>
                        <button
                            onClick={() => handleBookNow('Family of 2 Wellness Package')}
                            className="w-full py-3 border border-white/30 rounded-full hover:bg-white hover:text-black transition-all uppercase text-xs tracking-widest text-white"
                        >
                            Book Now
                        </button>
                    </div>

                    {/* Family of 3 */}
                    <div className="bg-white p-8 rounded-3xl text-black shadow-2xl flex flex-col border border-white/20 z-10 h-full">
                        <div className="flex justify-end mb-3">
                            <span className="px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Most Popular</span>
                        </div>
                        <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center text-black mb-4">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-poppins mb-1">Family of 3</h3>
                        <p className="text-stone-500 text-sm mb-5">3 Members · 2-month validity</p>
                        <div className="text-4xl font-light mb-1">$850</div>
                        <p className="text-stone-500 text-xs mb-1">Separate value ≈ <span className="line-through">$1,020</span></p>
                        <p className="text-green-600 text-xs font-bold mb-6">You save ~$170</p>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex gap-3 text-sm text-stone-700"><Check className="w-4 h-4 shrink-0" /> 32 Private Sessions (shared)</li>
                            <li className="flex gap-3 text-sm text-stone-700"><Check className="w-4 h-4 shrink-0" /> 20 Group Classes per person</li>
                            <li className="flex gap-3 text-sm text-stone-700"><Check className="w-4 h-4 shrink-0" /> One dedicated teacher</li>
                            <li className="flex gap-3 text-sm text-stone-700"><Check className="w-4 h-4 shrink-0" /> 2-month validity</li>
                        </ul>
                        <button
                            onClick={() => handleBookNow('Family of 3 Wellness Package')}
                            className="w-full py-3 bg-black text-white rounded-full hover:bg-stone-800 transition-all uppercase text-xs tracking-widest font-bold"
                        >
                            Book Now
                        </button>
                    </div>

                    {/* Family of 4 */}
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col backdrop-blur-md hover:border-white/20 transition-all duration-300 h-full">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white mb-4">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-poppins text-white mb-1">Family of 4</h3>
                        <p className="text-stone-500 text-sm mb-5">4 Members · 2-month validity</p>
                        <div className="text-4xl font-light mb-1 text-white">$1,050</div>
                        <p className="text-stone-500 text-xs mb-1">Separate value ≈ <span className="line-through">$1,280</span></p>
                        <p className="text-green-400 text-xs font-bold mb-6">You save ~$230</p>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> 40 Private Sessions (shared)</li>
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> 20 Group Classes per person</li>
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> One dedicated teacher</li>
                            <li className="flex gap-3 text-sm text-stone-400"><Check className="w-4 h-4 shrink-0" /> 2-month validity</li>
                        </ul>
                        <button
                            onClick={() => handleBookNow('Family of 4 Wellness Package')}
                            className="w-full py-3 border border-white/30 rounded-full hover:bg-white hover:text-black transition-all uppercase text-xs tracking-widest text-white"
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            </section>



            {/* CTA */}
            <section className="max-w-4xl mx-auto px-6 text-center py-20 bg-gradient-to-t from-white/10 to-transparent rounded-t-[3rem] mt-20 relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-3xl md:text-5xl font-poppins text-white mb-6">Ready to Begin?</h3>
                    <p className="text-stone-300 mb-8 max-w-xl mx-auto text-lg">
                        Every family is unique, and so is your wellness plan. Book your family consultation call to get started.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button 
                            onClick={() => window.open('https://wa.me/919399441405?text=I\'d%20like%20to%20inquire%20about%20family%20wellness%20packages', '_blank')}
                            className="px-8 py-4 border border-white/30 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all"
                        >
                            Contact Us
                        </button>
                        <button
                            onClick={() => window.open('https://wa.me/919399441405?text=I\'d%20like%20to%20book%20a%20free%2030-min%20consultation', '_blank')}
                            className="px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs hover:bg-stone-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            Book Your Family Consultation
                        </button>
                    </div>
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

export default FamilyPlanPage;
