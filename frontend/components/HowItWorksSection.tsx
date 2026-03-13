import React from 'react';
import { motion } from 'framer-motion';



const steps = [
  {
    title: "Body",
    image: "/assets/Cards Images/Mind (2).png"
  },
  {
    title: "Mind",
    image: "/assets/Cards Images/Mind (4).png"
  },
  {
    title: "Breath",
    image: "/assets/Cards Images/Mind (3).png"
  },
  {
    title: "Soul",
    image: "/assets/Cards Images/Mind (6).png"
  },
  {
    title: "Wisdom",
    image: "/assets/Cards Images/Mind (5).png"
  }
];

const HowItWorksSection: React.FC = () => {
  return (
    <section className="relative py-12 bg-black overflow-hidden perspective-distant">
      {/* Starfield CSS Background */}
      <div className="absolute inset-0 z-0" style={{
        background: 'radial-gradient(ellipse at center, #111 0%, #000 100%)'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 30% 60%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 55% 15%, rgba(255,255,255,0.7) 0%, transparent 100%),
            radial-gradient(1px 1px at 75% 45%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 90% 80%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 20% 85%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 65% 70%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 45% 35%, rgba(255,255,255,0.8) 0%, transparent 100%),
            radial-gradient(1px 1px at 85% 10%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 5% 50%, rgba(255,255,255,0.3) 0%, transparent 100%)
          `
        }} />
      </div>


      <div className="relative z-10 max-w-[1700px] mx-auto px-6 md:px-12">

        <div className="flex justify-center w-full mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-block px-8 py-3 bg-black rounded-full border border-white/10 text-sm md:text-base font-sans tracking-[0.2em] uppercase text-center text-white shadow-lg"
          >
            How It Works
          </motion.h2>
        </div>

        {/* Responsive Grid Layout - Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((step) => (
            <div
              key={step.title}
              className="relative w-full aspect-[9/16] group"
            >
              <div
                className="absolute inset-0 rounded-3xl overflow-hidden border border-white/20 shadow-lg"
              >
                <img
                  src={step.image}
                  alt={step.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;