
import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Award, Heart, Sun } from 'lucide-react';

const InstructorPage: React.FC = () => {
  return (
    <div className="pt-32 pb-20 bg-black min-h-screen text-white">

      {/* Hero Profile Section */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 mb-24">
        <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-start">

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-full md:w-[35%] relative"
          >
            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src="/profile.JPG"
                alt="Bhumika"
                className="w-full h-full object-cover opacity-90"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 hidden md:flex w-40 h-40 bg-stone-900/90 backdrop-blur-xl border border-white/20 rounded-full items-center justify-center text-white shadow-xl z-10 p-4 text-center">
              <span className="font-serif italic text-lg leading-tight">15+ Years Experience</span>
            </div>
          </motion.div>

          <div className="w-full md:w-1/2 pt-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-6xl md:text-8xl font-sans font-light text-white mb-6 tracking-tight">
                Bhumika <br />
                <span className="font-serif italic text-stone-400">Hardiya</span>
              </h1>
              <p className="text-stone-400 text-sm font-bold uppercase tracking-[0.2em] mb-8">
                Founder, Yog Samskara & Yoga Therapist
              </p>

              <div className="space-y-6 text-stone-300 text-lg font-light leading-relaxed">
                <p>
                  Welcome to Yog Samskara, a space where yoga becomes a journey of healing, growth, and self-discovery. I’m Bhumika, and I’m here to guide you on this transformative path. Use text provided.
                </p>
                <p>
                  For over 15+ years, I’ve been immersed in yoga—not just as a practice, but as a way of life. With 6+ years of teaching experience and a Master’s degree in Yoga Therapy, I’ve helped countless individuals find balance, strength, and healing in their lives.
                </p>
                <p>
                  From those dealing with chronic pain and stress to those seeking clarity and connection, I’ve had the privilege of witnessing yoga transform lives in profound ways.
                </p>
              </div>

              <div className="mt-12 flex gap-8">
                <div className="flex flex-col gap-2">
                  <h3 className="text-4xl font-serif italic text-white">6+</h3>
                  <span className="text-xs uppercase tracking-widest text-stone-500">Years Teaching</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-4xl font-serif italic text-white">Master's</h3>
                  <span className="text-xs uppercase tracking-widest text-stone-500">in Yoga Therapy</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy / Quote */}
      <section className="bg-white/5 border-y border-white/10 py-24 mb-24 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Quote className="w-12 h-12 text-stone-600 mx-auto mb-8 rotate-180" />
          <h2 className="text-3xl md:text-5xl font-serif italic text-stone-200 leading-snug mb-8">
            "Yoga transformed my life, and I want to share that transformation with you."
          </h2>
          <div className="w-24 h-[1px] bg-white/20 mx-auto"></div>
        </div>
      </section>

      {/* My Approach / Details */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 p-10 rounded-3xl shadow-sm border border-white/10 backdrop-blur-md"
          >
            <Award className="w-10 h-10 text-stone-200 mb-6" />
            <h3 className="text-2xl font-serif italic mb-4 text-white">Heal</h3>
            <p className="text-stone-400 font-light leading-relaxed">
              Whether it’s physical pain, emotional stress, or life’s challenges, I use yoga therapy and sound healing to address the root cause and bring you relief.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 p-10 rounded-3xl shadow-sm border border-white/10 backdrop-blur-md"
          >
            <Heart className="w-10 h-10 text-stone-200 mb-6" />
            <h3 className="text-2xl font-serif italic mb-4 text-white">Grow</h3>
            <p className="text-stone-400 font-light leading-relaxed">
              Through personalized guidance and thoughtfully crafted practices, I help you discover your potential, build strength, and cultivate resilience.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 p-10 rounded-3xl shadow-sm border border-white/10 backdrop-blur-md"
          >
            <Sun className="w-10 h-10 text-stone-200 mb-6" />
            <h3 className="text-2xl font-serif italic mb-4 text-white">Connect</h3>
            <p className="text-stone-400 font-light leading-relaxed">
              Yoga is not just about the body; it’s about the mind and spirit too. My approach integrates the physical, mental, and spiritual aspects of yoga, helping you feel whole and centered.
            </p>
          </motion.div>

        </div>
      </section>

      {/* Education Timeline */}
      <section className="max-w-3xl mx-auto px-6 md:px-12">
        <h3 className="text-3xl font-sans font-light text-center mb-16 text-white">Journey & Experience</h3>

        <div className="space-y-12 border-l border-stone-800 pl-8 ml-4">
          <div className="relative">
            <div className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-stone-500 border-4 border-black"></div>
            <span className="text-stone-500 text-sm font-bold tracking-widest uppercase">Ongoing</span>
            <h4 className="text-xl font-serif italic text-white mt-2">Sound Healing & Wellness Retreats</h4>
            <p className="text-stone-400 font-light mt-2">Hosting workshops, sound healing circles, and retreats.</p>
          </div>

          <div className="relative">
            <div className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-stone-700 border-4 border-black"></div>
            <span className="text-stone-500 text-sm font-bold tracking-widest uppercase">Experience</span>
            <h4 className="text-xl font-serif italic text-white mt-2">Teaching & Leading</h4>
            <p className="text-stone-400 font-light mt-2">From high-altitude treks in Himachal Pradesh to therapeutic workshops across India.</p>
          </div>

          <div className="relative">
            <div className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-stone-700 border-4 border-black"></div>
            <span className="text-stone-500 text-sm font-bold tracking-widest uppercase">Education</span>
            <h4 className="text-xl font-serif italic text-white mt-2">Master's in Yoga Therapy</h4>
            <p className="text-stone-400 font-light mt-2">Specialized in therapeutic applications of yoga for holistic health.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default InstructorPage;
