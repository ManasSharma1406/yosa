import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Heart, MapPin, Target, Sparkles, Building2, Map, Users, Star, ArrowRight, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ScheduleModal from './ScheduleModal';

const RetreatsPage: React.FC = () => {
    const navigate = useNavigate();
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const handleBookNow = () => {
        // Here we can either open scheduling or redirect to contact logic based on what was requested
        // Using WhatsApp directly for Corporate Retreat booking makes sense, or modal
        window.open('https://wa.me/919399441405?text=I\'d%20like%20to%20inquire%20about%20Corporate%20Wellness%20Retreats', '_blank');
    };

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqs = [
        {
            q: "Do you customize retreats for companies?",
            a: "Yes, every retreat can be tailored based on your team size, goals, and location preference."
        },
        {
            q: "Can sessions be conducted at our office?",
            a: "Absolutely. We offer on-site 1-day wellness programs."
        },
        {
            q: "Do participants need prior yoga experience?",
            a: "No, all sessions are beginner-friendly."
        },
        {
            q: "What industries do you work with?",
            a: "We work with startups, corporates, leadership teams, and educational institutions."
        },
        {
            q: "Are retreats available outside India?",
            a: "Yes, we can organize international retreats upon request."
        }
    ];

    const pricingPackages = [
        {
            title: "1-Day Reset",
            duration: "6–8 Hours",
            groupSize: "10–25",
            pricing: "₹30,000 – ₹55,000"
        },
        {
            title: "Weekend Retreat",
            duration: "2 Nights, 3 Days",
            groupSize: "10–20",
            pricing: "₹95,000 – ₹1.8 Lakh"
        },
        {
            title: "Custom Retreat",
            duration: "3–5 Days",
            groupSize: "15+",
            pricing: "On Request"
        }
    ];

    const offerings = [
        {
            icon: <Heart className="w-8 h-8" />,
            title: "1-Day Reset (Corporate Wellness Session)",
            subtitle: "A quick yet impactful escape from daily stress.",
            points: ["Yoga for posture correction & stress relief", "Guided breathwork & sound therapy", "Mindfulness & communication circles", "Ideal for on-site corporate sessions"]
        },
        {
            icon: <Sparkles className="w-8 h-8" />,
            title: "2–3 Day Retreats (Weekend Transformation)",
            subtitle: "A deeper experience designed for team renewal.",
            points: ["Yogic movement & guided meditation", "Breathwork for emotional release", "Nature immersion / water therapy", "Evening sound healing & reflection circles", "Ayurvedic meals & self-awareness workshops"]
        },
        {
            icon: <Building2 className="w-8 h-8" />,
            title: "Custom Extended Retreats (3–5 Days)",
            subtitle: "For leadership teams & deep transformation.",
            points: ["Personalized retreat design", "Leadership alignment & emotional intelligence work", "Advanced meditation & energy practices", "Team bonding through curated experiences"]
        }
    ];

    return (
        <div className="pt-32 pb-20 bg-black min-h-screen text-white">

            {/* Hero Section */}
            <section className="max-w-[1700px] mx-auto px-6 md:px-12 mb-24">
                <div className="relative rounded-[3rem] overflow-hidden h-[70vh] md:h-[80vh] w-full border border-white/10">
                    <div className="absolute inset-0 z-0 bg-stone-900">
                        <img
                            src="/retreats-hero.png"
                            alt="Retreats Hero"
                            className="w-full h-full object-cover opacity-80"
                        />
                    </div>
                    <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
                    <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4 pointer-events-none p-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            className="text-4xl md:text-7xl lg:text-8xl font-light text-white tracking-tighter mb-6 mix-blend-overlay max-w-5xl leading-tight"
                        >
                            Retreats<br />
                            {/* <span className="font-serif italic text-white/90">Reignite Their Potential.</span> */}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 1 }}
                            className="text-white/80 text-lg md:text-xl font-light max-w-3xl leading-relaxed mb-10"
                        >
                            Transform workplace stress into clarity, energy, and purpose through immersive corporate wellness retreats, mindfulness programs, and nature-based experiences.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="flex flex-col sm:flex-row gap-4 pointer-events-auto"
                        >
                            <button
                                onClick={handleBookNow}
                                className="px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs hover:bg-stone-200 transition-all flex justify-center items-center gap-2"
                            >
                                Book a Corporate Retreat
                            </button>
                            <button
                                onClick={() => {
                                    const programsSection = document.getElementById('programs');
                                    programsSection?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-8 py-4 border border-white/30 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all text-center"
                            >
                                Explore Programs
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Why Corporate Wellness Matters */}
            <section className="max-w-5xl mx-auto px-6 md:px-12 mb-32 text-center">
                <h2 className="text-3xl md:text-5xl font-light text-white mb-10 leading-tight">
                    Why Corporate Wellness <span className="font-serif italic text-stone-400">Matters</span>
                </h2>

                <p className="text-stone-300 text-lg md:text-xl font-light mb-8 max-w-3xl mx-auto">
                    Modern workplaces are evolving—but so are the challenges.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden backdrop-blur-md">
                        <div className="text-4xl absolute -top-4 -right-4 opacity-10">!</div>
                        <h4 className="text-white font-poppins mb-2">Decreased Productivity</h4>
                        <p className="text-stone-400 text-sm">Due to mental and physical fatigue.</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden backdrop-blur-md">
                        <div className="text-4xl absolute -top-4 -right-4 opacity-10">!</div>
                        <h4 className="text-white font-poppins mb-2">Rising Burnout</h4>
                        <p className="text-stone-400 text-sm">Escalating chronic stress levels.</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden backdrop-blur-md">
                        <div className="text-4xl absolute -top-4 -right-4 opacity-10">!</div>
                        <h4 className="text-white font-poppins mb-2">Digital Exhaustion</h4>
                        <p className="text-stone-400 text-sm">Poor posture, back pain, screen fatigue.</p>
                    </div>
                </div>

                <div className="text-stone-400 text-lg leading-relaxed font-light mb-12">
                    <p className="mb-6">
                        Without intervention, these issues impact not just individuals—but entire teams and business outcomes.
                    </p>
                    <div className="bg-red-900/20 border border-red-500/20 p-8 rounded-3xl mx-auto max-w-4xl">
                        <h3 className="text-2xl text-red-50 mb-3 font-medium">Our Solution: We create powerful pauses.</h3>
                        <p className="text-stone-300 text-lg">
                            Experiences that help your team reset, reconnect, and return stronger.
                        </p>
                    </div>
                </div>

                {/* Quote */}
                <div className="border-l-4 border-stone-500 pl-6 py-2 max-w-2xl mx-auto text-left opacity-90 mt-12">
                    <p className="text-xl md:text-2xl font-serif italic text-white mb-4">
                        "Employees who engage in wellness programs show up with 41% lower stress and 23% higher productivity."
                    </p>
                    <p className="text-sm text-stone-400 font-poppins uppercase tracking-widest">
                        — Global Wellness Institute
                    </p>
                </div>
            </section>

            {/* OUR OFFERINGS */}
            <section id="programs" className="max-w-[1400px] mx-auto px-6 md:px-12 mb-32">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-light text-white mb-2">Our Offerings</h2>
                    <div className="w-24 h-[1px] bg-white/20 mx-auto mt-6"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {offerings.map((offer, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white/5 p-8 rounded-3xl shadow-sm border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors duration-300 flex flex-col h-full"
                        >
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white mb-6">
                                {offer.icon}
                            </div>
                            <h3 className="text-2xl font-poppins text-white mb-2">{offer.title}</h3>
                            <p className="text-stone-400 text-md italic mb-6">{offer.subtitle}</p>

                            <ul className="space-y-4 mb-8 flex-1 mt-auto">
                                {offer.points.map((point, ptIdx) => (
                                    <li key={ptIdx} className="flex gap-3 text-sm text-stone-300 items-start">
                                        <Check className="w-4 h-4 shrink-0 mt-0.5 text-stone-500" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Workplace Wellness Programs */}
            <section className="bg-stone-980 py-24 mb-32">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 items-center">
                    <div className="w-full lg:w-1/2">
                        <h2 className="text-3xl md:text-5xl font-light text-white mb-8 leading-tight">
                            Workplace Wellness <br />
                            <span className="font-serif italic text-stone-400">Programs</span>
                        </h2>

                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="hidden sm:flex mt-1 w-8 h-8 rounded-full bg-white/10 shrink-0 items-center justify-center text-white"><Check className="w-4 h-4" /></div>
                                <div>
                                    <h4 className="text-xl font-poppins text-white mb-1">Stress Management & Mindfulness Workshops</h4>
                                    <p className="text-stone-400 text-sm">Yoga + Breathwork + Meditation • Practical tools for daily stress</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="hidden sm:flex mt-1 w-8 h-8 rounded-full bg-white/10 shrink-0 items-center justify-center text-white"><Check className="w-4 h-4" /></div>
                                <div>
                                    <h4 className="text-xl font-poppins text-white mb-1">Team-Building Retreats</h4>
                                    <p className="text-stone-400 text-sm">Outdoor activities + Trek & Yoga • Strengthen collaboration and trust</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="hidden sm:flex mt-1 w-8 h-8 rounded-full bg-white/10 shrink-0 items-center justify-center text-white"><Check className="w-4 h-4" /></div>
                                <div>
                                    <h4 className="text-xl font-poppins text-white mb-1">Leadership Wellness Retreats</h4>
                                    <p className="text-stone-400 text-sm">Self-awareness & clarity building • Energy alignment & sound healing</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="hidden sm:flex mt-1 w-8 h-8 rounded-full bg-white/10 shrink-0 items-center justify-center text-white"><Check className="w-4 h-4" /></div>
                                <div>
                                    <h4 className="text-xl font-poppins text-white mb-1">12-Day Corporate Wellness Program</h4>
                                    <p className="text-stone-400 text-sm">Daily short sessions (online/offline) • Sustainable stress management techniques • Habit-building for long-term wellbeing</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2">
                        <div className="bg-black border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                            <h3 className="text-2xl font-poppins text-white mb-8 border-b border-white/10 pb-4">Benefits for Your Team</h3>
                            <ul className="space-y-5 relative z-10">
                                {["Reduced back pain & digital fatigue", "Improved focus, clarity & productivity", "Better emotional resilience", "Stronger team connection & communication", "Increased creativity & innovation", "Long-term self-care tools"].map((benefit, i) => (
                                    <li key={i} className="flex items-center gap-3 text-stone-200">
                                        <div className="w-2 h-2 rounded-full bg-green-500/80 shrink-0" />
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-10 p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
                                <p className="text-lg font-serif italic text-white text-center">
                                    "When the body feels safe and centered, the mind opens up to innovate."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Packages & Pricing + Locations */}
            <section className="max-w-[1400px] mx-auto px-6 md:px-12 mb-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Pricing */}
                    <div>
                        <h2 className="text-3xl font-light text-white mb-8">Corporate Packages & Pricing</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/20">
                                        <th className="py-4 font-poppins font-medium text-stone-300">Package</th>
                                        <th className="py-4 font-poppins font-medium text-stone-300 hidden sm:table-cell">Duration</th>
                                        <th className="py-4 font-poppins font-medium text-stone-300">Group Size</th>
                                        <th className="py-4 font-poppins font-medium text-stone-300 text-right">Pricing</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pricingPackages.map((pkg, idx) => (
                                        <tr key={idx} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                            <td className="py-5">
                                                <div className="font-medium text-white">{pkg.title}</div>
                                                <div className="text-xs text-stone-500 sm:hidden mt-1">{pkg.duration}</div>
                                            </td>
                                            <td className="py-5 text-stone-400 hidden sm:table-cell">{pkg.duration}</td>
                                            <td className="py-5 text-stone-400">{pkg.groupSize}</td>
                                            <td className="py-5 text-stone-200 text-right whitespace-nowrap">{pkg.pricing}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-stone-500 text-xs italic mt-6 bg-white/5 p-4 rounded-xl">
                            Note: Pricing includes facilitation, tools, and retreat experiences. Accommodation & meals can be customized based on location.
                        </p>
                    </div>

                    {/* Locations */}
                    <div>
                        <h2 className="text-3xl font-light text-white mb-8">Retreat Locations</h2>
                        <p className="text-stone-400 mb-8">We curate experiences across diverse environments:</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
                                <span className="text-4xl mb-3">🏔️</span>
                                <h4 className="font-poppins text-white mb-1">Mountains</h4>
                                <p className="text-stone-400 text-sm">Himalayas, Sahyadris</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
                                <span className="text-4xl mb-3">🏖️</span>
                                <h4 className="font-poppins text-white mb-1">Beaches</h4>
                                <p className="text-stone-400 text-sm">Goa, Gokarna</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
                                <span className="text-4xl mb-3">🏜️</span>
                                <h4 className="font-poppins text-white mb-1">Deserts</h4>
                                <p className="text-stone-400 text-sm">Rajasthan</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
                                <span className="text-4xl mb-3">🏢</span>
                                <h4 className="font-poppins text-white mb-1">On-site</h4>
                                <p className="text-stone-400 text-sm">Corporate campuses</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="bg-stone-980 py-24 mb-24 border-y border-white/5">
                <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-light text-white mb-16">Client Testimonials</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        <div className="bg-black p-8 rounded-3xl border border-white/10">
                            <Star className="w-6 h-6 text-yellow-600 mb-4" />
                            <p className="text-stone-300 text-lg italic mb-6 leading-relaxed">
                                "We never realized how disconnected we were — this retreat gave our team a whole new energy. The sound healing was transformative."
                            </p>
                            <div>
                                <p className="text-white font-poppins font-medium">N. Agarwal</p>
                                <p className="text-stone-500 text-sm">Founder, GrowthX</p>
                            </div>
                        </div>
                        <div className="bg-black p-8 rounded-3xl border border-white/10">
                            <Star className="w-6 h-6 text-yellow-600 mb-4" />
                            <p className="text-stone-300 text-lg italic mb-6 leading-relaxed">
                                "From senior leaders to interns, everyone walked away with tools they still use daily. The sessions felt deeply human."
                            </p>
                            <div>
                                <p className="text-white font-poppins font-medium">HR Head</p>
                                <p className="text-stone-500 text-sm">Conscious Tech India</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About the Founder / Samskara */}
            <section className="max-w-[1400px] mx-auto px-6 md:px-12 mb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-3xl md:text-5xl font-light text-white mb-6">What is <span className="font-serif italic text-stone-400">Yog Samskara?</span></h2>
                    <div className="text-stone-300 font-light space-y-4 leading-relaxed mb-8">
                        <p>Yog Samskara is a holistic wellness initiative focused on integrating ancient yogic wisdom into modern lifestyles.</p>
                        <p>We believe true transformation happens when the body, mind, and energy are aligned.</p>
                        <p className="mb-2">Our approach blends:</p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white/50" /> Traditional Yoga Practices</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white/50" /> Breathwork & Meditation</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white/50" /> Sound Healing</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white/50" /> Nature-based experiences</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                    <h3 className="text-2xl font-poppins text-white mb-2">About the Founder</h3>
                    <p className="text-stone-400 text-sm mb-6">Bhumika — Founder, Yog Samskara</p>
                    <p className="text-stone-300 font-light leading-relaxed mb-6">
                        A passionate wellness facilitator dedicated to helping individuals and teams reconnect with themselves. With expertise in Yoga & Breathwork, Sound Healing, Mindfulness & Emotional Wellness.
                    </p>
                    <p className="text-white italic">
                        "Bhumika’s sessions are known for being deeply experiential, intuitive, and transformative."
                    </p>
                </div>
            </section>

            {/* FAQs */}
            <section className="max-w-3xl mx-auto px-6 md:px-12 mb-32">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-light font-poppins non-italic text-white mb-2">FAQs</h2>
                    <div className="w-16 h-[1px] bg-white/20 mx-auto mt-6"></div>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm transition-all duration-300">
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none"
                            >
                                <span className="font-poppins text-white pr-4">{faq.q}</span>
                                <ChevronDown
                                    className={`w-5 h-5 text-stone-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                                />
                            </button>
                            <AnimatePresence>
                                {openFaq === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="px-6 text-stone-300 font-light overflow-hidden text-sm md:text-base leading-relaxed"
                                    >
                                        <div className="pb-5 pt-1">
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="max-w-4xl mx-auto px-6 text-center py-20 bg-gradient-to-t from-white/5 to-transparent rounded-t-[3rem]">
                <h3 className="text-3xl md:text-5xl font-poppins text-white mb-6 leading-tight">Ready to Transform Your Team?</h3>
                <p className="text-stone-400 mb-12 max-w-xl mx-auto text-lg leading-relaxed">
                    Give your employees the space to pause, recharge, and return stronger.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                        onClick={handleBookNow}
                        className="px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs hover:bg-stone-200 transition-all flex justify-center items-center gap-2"
                    >
                        Book a Consultation
                    </button>
                    <button
                        onClick={handleBookNow}
                        className="px-8 py-4 border border-white/30 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all"
                    >
                        Plan Your Retreat
                    </button>
                </div>
            </section>

        </div>
    );
};

export default RetreatsPage;
