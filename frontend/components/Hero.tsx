import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


interface HeroProps {
  isMuted: boolean;
}

const Hero: React.FC<HeroProps> = ({ isMuted }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  // Video logic moved to App.tsx for global persistence

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-end justify-center pb-12 md:pb-24">
      {/* Background Video - REMOVED, now handled globally in App.tsx */}
      {/* We keep the container for spacing/layout purposes if needed, or rely on the global background */}

      {/* Dark Overlay - Optional: Add if specific contrast is needed just for Hero, but global video might have its own overlay or styling */}
      <div className="absolute inset-0 bg-stone-900/20 z-10" />


      {/* Content */}
      <div className="relative z-20 w-full px-6 md:px-12 max-w-[1700px] mx-auto h-full flex flex-col justify-end">


        {/* Main Title */}
        <div className="w-full mb-8 md:mb-16">
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ delay: 0.5, duration: 1.0, ease: [0.25, 1, 0.5, 1] }}
              className="text-white text-[9.5vw] md:text-[5.2vw] leading-[1.1] md:leading-[1] font-sans font-normal tracking-tight text-center md:text-left flex flex-nowrap justify-between md:justify-between items-baseline gap-x-2 md:gap-x-4"
            >
              <span>BALANCE</span>
              <span className="font-serif italic font-light opacity-80 text-[1em] whitespace-nowrap">// Calm //</span>
              <span>RECONNECT</span>
            </motion.h1>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end text-white/90">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="max-w-md text-sm md:text-lg font-sans font-light leading-relaxed tracking-wide text-center md:text-left mx-auto md:mx-0"
          >
            Discover yoga routines, classes, and tools tailored for your journey, whether you're just starting or deepening your practice.
          </motion.p>

          {!user && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              onClick={() => navigate('/sign-up')}
              className="mt-8 md:mt-0 px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-stone-900 transition-all duration-500 flex items-center gap-3 group mx-auto md:mx-0"
            >
              Start Your Journey
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;