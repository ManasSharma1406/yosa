import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, CalendarDays, Video, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    number: '01',
    icon: ShoppingBag,
    title: 'Choose Your Plan',
    description: 'Browse our Personal, Group, or Family wellness plans and select the one that fits your goals and budget. Each plan comes with a set number of live session credits.',
    cta: 'View Plans',
    link: '/personal-yoga',
    color: 'from-violet-500/20 to-indigo-500/20',
    border: 'border-violet-500/30',
    iconColor: 'text-violet-300',
  },
  {
    number: '02',
    icon: CalendarDays,
    title: 'Book Your Sessions',
    description: 'Once your plan is active, log in to your dashboard and pick your preferred dates & times from the calendar. Book multiple sessions at once, schedule around your life.',
    cta: 'Go to Dashboard',
    link: '/dashboard',
    color: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/30',
    iconColor: 'text-emerald-300',
  },
  {
    number: '03',
    icon: Video,
    title: 'Join the Live Class',
    description: 'At your scheduled time, click the Google Meet link sent to your email. Practice live with your instructor, ask questions, and track your progress class by class.',
    cta: 'Learn More',
    link: '/instructor',
    color: 'from-rose-500/20 to-pink-500/20',
    border: 'border-rose-500/30',
    iconColor: 'text-rose-300',
  },
];

const galleryImages = [
  '/assets/Cards Images/Mind (2).png',
  '/assets/Cards Images/Mind (4).png',
  '/assets/Cards Images/Mind (3).png',
  '/assets/Cards Images/Mind (6).png',
  '/assets/Cards Images/Mind (5).png',
];

const HowItWorksSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12">

        {/* Heading */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.3em] text-stone-500 mb-4 font-bold"
          >
            How It Works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif italic text-white leading-tight"
          >
            Start your journey in <span className="text-stone-400">3 steps</span>
          </motion.h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className={`relative bg-gradient-to-br ${step.color} border ${step.border} rounded-[2rem] p-8 md:p-10 backdrop-blur-xl overflow-hidden transition-transform duration-300`}
              >
                {/* Step number watermark */}
                <div className="absolute top-6 right-8 text-[6rem] font-black text-white/5 leading-none select-none pointer-events-none">
                  {step.number}
                </div>

                <div className={`w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-8 ${step.iconColor}`}>
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="text-2xl font-poppins text-white mb-4">{step.title}</h3>
                <p className="text-stone-400 font-light leading-relaxed mb-8 text-sm md:text-base">
                  {step.description}
                </p>

                <button
                  onClick={() => navigate(step.link)}
                  className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-white/60 hover:text-white transition-colors group/btn"
                >
                  {step.cta}
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/5 mb-16" />

        {/* Gallery strip */}
        <div className="grid grid-cols-5 gap-3 md:gap-4">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative aspect-[9/16] rounded-[1.5rem] overflow-hidden border border-white/10 group"
            >
              <img
                src={img}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/10 transition-colors duration-500" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;